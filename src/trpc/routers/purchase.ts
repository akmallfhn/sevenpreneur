import { afterPaidTrigger } from "@/lib/after-payment";
import { Optional } from "@/lib/optional-type";
import { calculateFinalPrice } from "@/lib/price-calc";
import {
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_NO_CONTENT,
  STATUS_NOT_FOUND,
  STATUS_OK,
  errorStatusCodeToName,
} from "@/lib/status_code";
import {
  XenditInvoiceResponse,
  xenditRequestCreateInvoice,
  xenditRequestExpireInvoice,
} from "@/lib/xendit";
import { createTRPCRouter, loggedInProcedure } from "@/trpc/init";
import {
  numberIsID,
  stringIsNanoid,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import {
  CategoryEnum,
  Prisma,
  PrismaClient,
  StatusEnum,
  TStatusEnum,
} from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

async function createTransaction(
  prisma: PrismaClient,
  userId: string,
  category: CategoryEnum,
  item: {
    id: number;
    name: string;
    amount: Decimal;
  },
  paymentChannelId: number | null,
  discountCode: Optional<string>
): Promise<{ transactionId: string; invoiceUrl: string }> {
  const selectedPayment = {
    code: "-",
    method: "-",
    calc_percent: new Prisma.Decimal(0),
    calc_flat: new Prisma.Decimal(0),
    calc_vat: false,
  };
  if (paymentChannelId) {
    const thePayment = await prisma.paymentChannel.findFirst({
      where: { id: paymentChannelId },
    });
    if (!thePayment) {
      throw new TRPCError({
        code: STATUS_NOT_FOUND,
        message: "The payment channel with the given ID is not found.",
      });
    }
    Object.assign(selectedPayment, thePayment);
  }

  let discountId: number | null = null;
  let discountPercent = new Prisma.Decimal(0);
  if (discountCode) {
    const now = new Date();
    const selectedDiscount = await prisma.discount.findFirst({
      where: {
        code: discountCode,
        start_date: { lte: now },
        end_date: { gte: now },
      },
    });
    if (!selectedDiscount) {
      throw new TRPCError({
        code: STATUS_NOT_FOUND,
        message: "The discount with the given code is not found.",
      });
    }
    if (
      selectedDiscount.category !== category ||
      selectedDiscount.item_id !== item.id
    ) {
      throw new TRPCError({
        code: STATUS_BAD_REQUEST,
        message:
          "The discount with the given code does not apply to this item.",
      });
    }
    discountId = selectedDiscount.id;
    discountPercent = selectedDiscount.calc_percent.dividedBy(100);
  }

  const discountAmount = item.amount.mul(discountPercent);
  const discountedPrice = item.amount.sub(discountAmount);
  const calculatedPrice = calculateFinalPrice(discountedPrice, selectedPayment);
  const createdTransaction = await prisma.transaction.create({
    data: {
      user_id: userId,
      category: category,
      item_id: item.id,
      amount: item.amount,
      discount_id: discountId,
      discount_amount: discountAmount,
      admin_fee: calculatedPrice.adminFee,
      vat: calculatedPrice.vat,
      currency: "IDR",
      invoice_number: "?", // updated after requesting Xendit
      status: TStatusEnum.PENDING,
      payment_method: selectedPayment.method,
      payment_channel: selectedPayment.code,
    },
  });
  const theTransaction = await prisma.transaction.findFirst({
    where: { id: createdTransaction.id },
  });
  if (!theTransaction) {
    throw new TRPCError({
      code: STATUS_INTERNAL_SERVER_ERROR,
      message: "Failed to create a new transaction.",
    });
  }

  const needToPay = !calculatedPrice.finalPrice.isZero();
  let invoiceUrl = "-";
  if (needToPay) {
    let domain = "sevenpreneur.com";
    if (process.env.DOMAIN_MODE === "local") {
      domain = "example.com:3000";
    }
    let xenditResponse: XenditInvoiceResponse;
    try {
      xenditResponse = await xenditRequestCreateInvoice({
        external_id: theTransaction.id,
        amount: calculatedPrice.finalPrice.toNumber(),
        description: item.name,
        invoice_duration: 12 * 60 * 60, // 12 hours
        success_redirect_url: `https://www.${domain}/transactions/${theTransaction.id}`,
        failure_redirect_url: `https://www.${domain}/transactions/${theTransaction.id}`,
        payment_methods: [selectedPayment.code],
        currency: theTransaction.currency,
        items: [
          {
            name: item.name,
            quantity: 1,
            price: calculatedPrice.finalPrice.toNumber(),
          },
        ],
      });
      invoiceUrl = xenditResponse.invoice_url;
    } catch (e) {
      console.error(e);
      // Undo transaction creation
      const deletedTransaction = await prisma.transaction.deleteMany({
        where: { id: theTransaction.id },
      });
      if (deletedTransaction.count > 1) {
        console.error(
          "purchase: More-than-one transactions are deleted at once."
        );
      }
      // Rethrow error using TRPCError
      throw new TRPCError({
        code: STATUS_INTERNAL_SERVER_ERROR,
        message: "Failed to create a new invoice.",
      });
    }

    const updatedTransaction = await prisma.transaction.updateManyAndReturn({
      data: {
        invoice_number: xenditResponse.id,
        status: TStatusEnum.PENDING,
      },
      where: { id: theTransaction.id },
    });
    if (updatedTransaction.length < 1) {
      throw new TRPCError({
        code: STATUS_NOT_FOUND,
        message: "The selected transaction is not found.",
      });
    } else if (updatedTransaction.length > 1) {
      console.error(
        "purchase: More-than-one transactions are updated at once."
      );
    }

    try {
      const hookUrl = process.env.N8N_PAYMENT_REMINDER_HOOK_URL;
      const hookToken = process.env.N8N_WEBHOOK_VERIFICATION_TOKEN;
      if (!hookUrl) {
        console.warn("Payment reminder hook URL is not set!");
      } else if (!hookToken) {
        console.warn("Payment reminder hook token is not set!");
      } else {
        const paymentReminderResponse = await fetch(hookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-webhook-token": hookToken,
          },
          body: JSON.stringify({
            tid: theTransaction.id,
          }),
        });
        const paymentReminderBody = await paymentReminderResponse.json();
        console.log("Payment reminder response:", paymentReminderBody);
      }
    } catch (err) {
      console.error("Failed to call payment reminder hook:", err);
    }
  } else {
    const updatedTransaction = await prisma.transaction.updateManyAndReturn({
      data: {
        invoice_number: "-",
        status: TStatusEnum.PAID,
        payment_method: "-",
        payment_channel: "-",
        paid_at: new Date(),
      },
      where: {
        id: theTransaction.id,
      },
    });
    if (updatedTransaction.length < 1) {
      throw new TRPCError({
        code: STATUS_NOT_FOUND,
        message: "The selected transaction is not found.",
      });
    } else if (updatedTransaction.length > 1) {
      console.error(
        "purchase: More-than-one transactions are updated at once."
      );
    }

    const triggerResult = await afterPaidTrigger(prisma, theTransaction.id);
    if (triggerResult !== true) {
      throw new TRPCError({
        code: errorStatusCodeToName(triggerResult.status),
        message: triggerResult.message,
      });
    }
  }

  return {
    transactionId: theTransaction.id,
    invoiceUrl: invoiceUrl,
  };
}

async function changePhoneNumber(
  prisma: PrismaClient,
  userId: string,
  phoneCountryId: number,
  phoneNumber: string
) {
  const updatedUser = await prisma.user.updateManyAndReturn({
    data: {
      phone_country_id: phoneCountryId,
      phone_number: phoneNumber,
    },
    where: { id: userId },
  });
  if (updatedUser.length < 1) {
    throw new TRPCError({
      code: STATUS_NOT_FOUND,
      message: "The selected user is not found.",
    });
  } else if (updatedUser.length > 1) {
    console.error("purchase: More-than-one users are updated at once.");
  }
}

export const purchaseRouter = createTRPCRouter({
  // Discounts //

  checkDiscount: loggedInProcedure
    .input(
      z.object({
        code: stringNotBlank(),
        cohort_id: numberIsID().optional(),
        playlist_id: numberIsID().optional(),
        event_id: numberIsID().optional(),
      })
    )
    .query(async (opts) => {
      const inputs = [
        opts.input.cohort_id,
        opts.input.playlist_id,
        opts.input.event_id,
      ];
      const filledCount = inputs.filter(Boolean).length;
      if (filledCount !== 1) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message:
            "Provide exactly one of cohort_id, playlist_id, or event_id.",
        });
      }

      let selectedCategory: CategoryEnum;
      let selectedItemId: number;
      if (opts.input.cohort_id) {
        selectedCategory = CategoryEnum.COHORT;
        selectedItemId = opts.input.cohort_id;
      }
      if (opts.input.playlist_id) {
        selectedCategory = CategoryEnum.PLAYLIST;
        selectedItemId = opts.input.playlist_id;
      }
      if (opts.input.event_id) {
        selectedCategory = CategoryEnum.EVENT;
        selectedItemId = opts.input.event_id;
      }
      const now = new Date();
      const theDiscount = await opts.ctx.prisma.discount.findFirst({
        omit: { id: true, created_at: true, updated_at: true },
        where: {
          code: opts.input.code,
          category: selectedCategory!,
          item_id: selectedItemId!,
          status: StatusEnum.ACTIVE,
          start_date: { lte: now },
          end_date: { gte: now },
        },
      });

      if (!theDiscount) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "The discount with the given code and item ID is not found.",
        });
      }

      return {
        code: STATUS_OK,
        message: "Success",
        discount: theDiscount,
      };
    }),

  // Products //

  cohort: loggedInProcedure
    .input(
      z.object({
        user_id: stringIsUUID().optional(),
        phone_country_id: numberIsID().nullable().optional(),
        phone_number: stringNotBlank().nullable().optional(),
        cohort_price_id: numberIsID(),
        payment_channel_id: numberIsID().nullable(),
        discount_code: stringNotBlank().optional(),
      })
    )
    .mutation(async (opts) => {
      const currentRole = opts.ctx.user.role.name;
      let selectedUserId = opts.ctx.user.id;
      if (["Administrator", "Class Manager"].includes(currentRole)) {
        if (opts.input.user_id) {
          selectedUserId = opts.input.user_id;
        }
      }

      const selectedCohortPrice = await opts.ctx.prisma.cohortPrice.findFirst({
        include: {
          cohort: true,
        },
        where: { id: opts.input.cohort_price_id },
      });
      if (!selectedCohortPrice) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "The cohort price with the given ID is not found.",
        });
      }

      const { transactionId, invoiceUrl } = await createTransaction(
        opts.ctx.prisma,
        selectedUserId,
        CategoryEnum.COHORT,
        {
          id: selectedCohortPrice.id,
          name: `${selectedCohortPrice.cohort.name} (${selectedCohortPrice.name})`,
          amount: selectedCohortPrice.amount,
        },
        opts.input.payment_channel_id,
        opts.input.discount_code
      );

      if (opts.input.phone_country_id && opts.input.phone_number) {
        await changePhoneNumber(
          opts.ctx.prisma,
          selectedUserId,
          opts.input.phone_country_id,
          opts.input.phone_number
        );
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        transaction_id: transactionId,
        invoice_url: invoiceUrl,
      };
    }),

  playlist: loggedInProcedure
    .input(
      z.object({
        user_id: stringIsUUID().optional(),
        phone_country_id: numberIsID().nullable().optional(),
        phone_number: stringNotBlank().nullable().optional(),
        playlist_id: numberIsID(),
        payment_channel_id: numberIsID().nullable(),
        discount_code: stringNotBlank().optional(),
      })
    )
    .mutation(async (opts) => {
      const currentRole = opts.ctx.user.role.name;
      let selectedUserId = opts.ctx.user.id;
      if (["Administrator", "Class Manager"].includes(currentRole)) {
        if (opts.input.user_id) {
          selectedUserId = opts.input.user_id;
        }
      }

      const selectedPlaylist = await opts.ctx.prisma.playlist.findFirst({
        where: { id: opts.input.playlist_id },
      });
      if (!selectedPlaylist) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "The playlist with the given ID is not found.",
        });
      }

      const { transactionId, invoiceUrl } = await createTransaction(
        opts.ctx.prisma,
        selectedUserId,
        CategoryEnum.PLAYLIST,
        {
          id: selectedPlaylist.id,
          name: selectedPlaylist.name,
          amount: selectedPlaylist.price,
        },
        opts.input.payment_channel_id,
        opts.input.discount_code
      );

      if (opts.input.phone_country_id && opts.input.phone_number) {
        await changePhoneNumber(
          opts.ctx.prisma,
          selectedUserId,
          opts.input.phone_country_id,
          opts.input.phone_number
        );
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        transaction_id: transactionId,
        invoice_url: invoiceUrl,
      };
    }),

  event: loggedInProcedure
    .input(
      z.object({
        user_id: stringIsUUID().optional(),
        phone_country_id: numberIsID().nullable().optional(),
        phone_number: stringNotBlank().nullable().optional(),
        event_price_id: numberIsID(),
        payment_channel_id: numberIsID().nullable(),
        discount_code: stringNotBlank().optional(),
      })
    )
    .mutation(async (opts) => {
      const currentRole = opts.ctx.user.role.name;
      let selectedUserId = opts.ctx.user.id;
      if (["Administrator", "Class Manager"].includes(currentRole)) {
        if (opts.input.user_id) {
          selectedUserId = opts.input.user_id;
        }
      }

      const selectedEventPrice = await opts.ctx.prisma.eventPrice.findFirst({
        include: {
          event: true,
        },
        where: { id: opts.input.event_price_id },
      });
      if (!selectedEventPrice) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "The event price with the given ID is not found.",
        });
      }

      const { transactionId, invoiceUrl } = await createTransaction(
        opts.ctx.prisma,
        selectedUserId,
        CategoryEnum.EVENT,
        {
          id: selectedEventPrice.id,
          name: `${selectedEventPrice.event.name} (${selectedEventPrice.name})`,
          amount: selectedEventPrice.amount,
        },
        opts.input.payment_channel_id,
        opts.input.discount_code
      );

      if (opts.input.phone_country_id && opts.input.phone_number) {
        await changePhoneNumber(
          opts.ctx.prisma,
          selectedUserId,
          opts.input.phone_country_id,
          opts.input.phone_number
        );
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        transaction_id: transactionId,
        invoice_url: invoiceUrl,
      };
    }),

  // Cancellation //

  cancel: loggedInProcedure
    .input(
      z.object({
        id: stringIsNanoid(),
      })
    )
    .mutation(async (opts) => {
      let whereClause = {
        id: opts.input.id,
        user_id: undefined as undefined | string,
      };
      if (opts.ctx.user.role.name !== "Administrator") {
        whereClause = {
          ...whereClause,
          user_id: opts.ctx.user.id,
        };
      }
      const theTransaction = await opts.ctx.prisma.transaction.findFirst({
        where: whereClause,
      });
      if (!theTransaction) {
        return {
          code: STATUS_NO_CONTENT,
          message: "Success",
        };
      }

      try {
        await xenditRequestExpireInvoice({
          invoice_id: theTransaction.invoice_number,
        });
      } catch (e) {
        console.error(e);
        // Rethrow error using TRPCError
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to cancel an invoice.",
        });
      }

      const updatedTransaction =
        await opts.ctx.prisma.transaction.updateManyAndReturn({
          data: {
            status: TStatusEnum.FAILED,
          },
          where: { id: theTransaction.id },
        });
      if (updatedTransaction.length < 1) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "The selected transaction is not found.",
        });
      } else if (updatedTransaction.length > 1) {
        console.error(
          "purchase.cohort: More-than-one transactions are updated at once."
        );
      }

      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),
});
