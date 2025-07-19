import { calculateFinalPrice } from "@/lib/price-calc";
import {
  XenditCreateInvoiceResponse,
  xenditRequestCreateInvoice,
} from "@/lib/xendit";
import { createTRPCRouter, loggedInProcedure } from "@/trpc/init";
import { numberIsID, stringNotBlank } from "@/trpc/utils/validation";
import { CategoryEnum, TStatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const buyRouter = createTRPCRouter({
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
      const selectedPayment = await opts.ctx.prisma.paymentChannel.findFirst({
        where: { id: opts.input.payment_channel_id },
      });
      if (!selectedPayment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The payment channel with the given ID is not found.",
        });
      }
      const transactionFinalPrice = calculateFinalPrice(
        selectedCohortPrice.amount,
        selectedPayment
      ).finalPrice;
      const createdTransaction = await opts.ctx.prisma.transaction.create({
        data: {
          user_id: opts.ctx.user.id,
          category: CategoryEnum.COHORT,
          item_id: selectedCohortPrice.cohort_id,
          amount: selectedCohortPrice.amount,
          admin_fee: transactionFinalPrice.minus(selectedCohortPrice.amount),
          currency: "IDR",
          invoice_number: "?", // updated after requesting Xendit
          status: TStatusEnum.PENDING,
        },
      });
      const theTransaction = await opts.ctx.prisma.transaction.findFirst({
        where: { id: createdTransaction.id },
      });
      if (!theTransaction) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new transaction.",
        });
      }

      let xenditResponse: XenditCreateInvoiceResponse;
      try {
        xenditResponse = await xenditRequestCreateInvoice({
          external_id: theTransaction.id,
          amount: transactionFinalPrice.toNumber(),
          description: selectedCohortPrice.cohort.name,
          invoice_duration: 300,
          success_redirect_url: "https://www.sevenpreneur.com/",
          failure_redirect_url: "https://www.sevenpreneur.com/",
          payment_methods: [selectedPayment.code],
          currency: theTransaction.currency,
          items: [
            {
              name: selectedCohortPrice.cohort.name,
              quantity: 1,
              price: transactionFinalPrice.toNumber(),
            },
          ],
        });
      } catch (e) {
        // Undo transaction creation
        const deletedTransaction = await opts.ctx.prisma.transaction.deleteMany(
          {
            where: { id: theTransaction.id },
          }
        );
        if (deletedTransaction.count > 1) {
          console.error(
            "buy.cohort: More-than-one transactions are deleted at once."
          );
        }
        // Rethrow error using TRPCError
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create a new invoice.",
        });
      }

      const updatedTransaction =
        await opts.ctx.prisma.transaction.updateManyAndReturn({
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
        console.error(
          "buy.cohort: More-than-one transactions are updated at once."
        );
      }

      if (opts.input.phone_country_id && opts.input.phone_number) {
        const updatedUser = await opts.ctx.prisma.user.updateManyAndReturn({
          data: {
            phone_country_id: opts.input.phone_country_id,
            phone_number: opts.input.phone_number,
          },
          where: { id: opts.ctx.user.id },
        });
        if (updatedUser.length < 1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "The selected user is not found.",
          });
        } else if (updatedUser.length > 1) {
          console.error("buy.cohort: More-than-one users are updated at once.");
        }
      }

      return {
        status: 200,
        message: "Success",
        transaction_id: theTransaction.id,
        invoice_url: xenditResponse.invoice_url,
      };
    }),
});
