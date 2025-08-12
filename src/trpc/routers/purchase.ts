import { calculateFinalPrice } from "@/lib/price-calc";
import {
  XenditInvoiceResponse,
  xenditRequestCreateInvoice,
  xenditRequestExpireInvoice,
} from "@/lib/xendit";
import { createTRPCRouter, loggedInProcedure } from "@/trpc/init";
import {
  numberIsID,
  stringIsNanoid,
  stringNotBlank,
} from "@/trpc/utils/validation";
import {
  CategoryEnum,
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
  paymentChannelId: number
): Promise<{ transactionId: string; invoiceUrl: string }> {
  const selectedPayment = await prisma.paymentChannel.findFirst({
    where: { id: paymentChannelId },
  });
  if (!selectedPayment) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "The payment channel with the given ID is not found.",
    });
  }
  const calculatedPrice = calculateFinalPrice(item.amount, selectedPayment);
  const createdTransaction = await prisma.transaction.create({
    data: {
      user_id: userId,
      category: category,
      item_id: item.id,
      amount: item.amount,
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
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create a new transaction.",
    });
  }

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
  } catch (e) {
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
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create a new invoice.",
    });
  }

  const updatedTransaction = await prisma.transaction.updateManyAndReturn({
    data: {
      invoice_number: xenditResponse.id,
    },
    where: { id: theTransaction.id },
  });
  if (updatedTransaction.length < 1) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "The selected transaction is not found.",
    });
  } else if (updatedTransaction.length > 1) {
    console.error("purchase: More-than-one transactions are updated at once.");
  }

  return {
    transactionId: theTransaction.id,
    invoiceUrl: xenditResponse.invoice_url,
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
      code: "NOT_FOUND",
      message: "The selected user is not found.",
    });
  } else if (updatedUser.length > 1) {
    console.error("purchase: More-than-one users are updated at once.");
  }
}

export const purchaseRouter = createTRPCRouter({
  checkDiscount: loggedInProcedure
    .input(
      z.object({
        code: stringNotBlank(),
        cohort_id: numberIsID().optional(),
        playlist_id: numberIsID().optional(),
      })
    )
    .query(async (opts) => {
      if (
        (opts.input.cohort_id && opts.input.playlist_id) || // both
        (!opts.input.cohort_id && !opts.input.playlist_id) // none
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Provide either cohort_id only or playlist_id only.",
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
      const theDiscount = await opts.ctx.prisma.discount.findFirst({
        omit: { id: true, created_at: true, updated_at: true },
        where: {
          code: opts.input.code,
          category: selectedCategory!,
          item_id: selectedItemId!,
          status: StatusEnum.ACTIVE,
        },
      });

      if (!theDiscount) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The discount with the given code and item ID is not found.",
        });
      }

      return {
        status: 200,
        message: "Success",
        discount: theDiscount,
      };
    }),

  cohort: loggedInProcedure
    .input(
      z.object({
        phone_country_id: numberIsID().nullable().optional(),
        phone_number: stringNotBlank().nullable().optional(),
        cohort_price_id: numberIsID(),
        payment_channel_id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      const selectedCohortPrice = await opts.ctx.prisma.cohortPrice.findFirst({
        include: {
          cohort: true,
        },
        where: { id: opts.input.cohort_price_id },
      });
      if (!selectedCohortPrice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The cohort price with the given ID is not found.",
        });
      }

      const { transactionId, invoiceUrl } = await createTransaction(
        opts.ctx.prisma,
        opts.ctx.user.id,
        CategoryEnum.COHORT,
        {
          id: selectedCohortPrice.id,
          name: `${selectedCohortPrice.cohort.name} (${selectedCohortPrice.name})`,
          amount: selectedCohortPrice.amount,
        },
        opts.input.payment_channel_id
      );

      if (opts.input.phone_country_id && opts.input.phone_number) {
        await changePhoneNumber(
          opts.ctx.prisma,
          opts.ctx.user.id,
          opts.input.phone_country_id,
          opts.input.phone_number
        );
      }

      return {
        status: 200,
        message: "Success",
        transaction_id: transactionId,
        invoice_url: invoiceUrl,
      };
    }),

  playlist: loggedInProcedure
    .input(
      z.object({
        phone_country_id: numberIsID().nullable().optional(),
        phone_number: stringNotBlank().nullable().optional(),
        playlist_id: numberIsID(),
        payment_channel_id: numberIsID(),
      })
    )
    .mutation(async (opts) => {
      const selectedPlaylist = await opts.ctx.prisma.playlist.findFirst({
        where: { id: opts.input.playlist_id },
      });
      if (!selectedPlaylist) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The playlist with the given ID is not found.",
        });
      }

      const { transactionId, invoiceUrl } = await createTransaction(
        opts.ctx.prisma,
        opts.ctx.user.id,
        CategoryEnum.PLAYLIST,
        {
          id: selectedPlaylist.id,
          name: selectedPlaylist.name,
          amount: selectedPlaylist.price,
        },
        opts.input.payment_channel_id
      );

      if (opts.input.phone_country_id && opts.input.phone_number) {
        await changePhoneNumber(
          opts.ctx.prisma,
          opts.ctx.user.id,
          opts.input.phone_country_id,
          opts.input.phone_number
        );
      }

      return {
        status: 200,
        message: "Success",
        transaction_id: transactionId,
        invoice_url: invoiceUrl,
      };
    }),

  cancel: loggedInProcedure
    .input(
      z.object({
        id: stringIsNanoid(),
      })
    )
    .mutation(async (opts) => {
      let whereClause = { id: opts.input.id };
      if (opts.ctx.user.role.name !== "Administrator") {
        whereClause = Object.assign(whereClause, { user_id: opts.ctx.user.id });
      }
      const theTransaction = await opts.ctx.prisma.transaction.findFirst({
        where: whereClause,
      });
      if (!theTransaction) {
        return {
          status: 200,
          message: "Success",
        };
      }

      let xenditResponse: XenditInvoiceResponse;
      try {
        xenditResponse = await xenditRequestExpireInvoice({
          invoice_id: theTransaction.invoice_number,
        });
      } catch (e) {
        // Rethrow error using TRPCError
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
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
          code: "NOT_FOUND",
          message: "The selected transaction is not found.",
        });
      } else if (updatedTransaction.length > 1) {
        console.error(
          "purchase.cohort: More-than-one transactions are updated at once."
        );
      }

      return {
        status: 200,
        message: "Success",
      };
    }),
});
