import {
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import {
  arrayRevenueBy,
  numberIsNonNegInt,
  numberIsPosInt,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { CostCategoryEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const createBD = {
  revenue_mtd: loggedInProcedure
    .input(
      z.object({
        year: numberIsPosInt(),
        month: numberIsNonNegInt(),
        amount: z.number(),
        currency: stringNotBlank(),
        by_product: arrayRevenueBy(),
        by_channel: arrayRevenueBy(),
        note: stringNotBlank().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const createdRevenueMTD = await opts.ctx.prisma.bDFinRevenueMTD.create({
        data: {
          user_id: opts.ctx.user.id,
          year: opts.input.year,
          month: opts.input.month,
          amount: opts.input.amount,
          currency: opts.input.currency,
          by_product: opts.input.by_product,
          by_channel: opts.input.by_channel,
          note: opts.input.note,
        },
      });

      const theRevenueMTD = await opts.ctx.prisma.bDFinRevenueMTD.findFirst({
        where: { id: createdRevenueMTD.id },
      });
      if (!theRevenueMTD) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new BD revenue MTD.",
        });
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        revenue_mtd: theRevenueMTD,
      };
    }),

  cost_mtd: loggedInProcedure
    .input(
      z.object({
        year: numberIsPosInt(),
        month: numberIsNonNegInt(),
        amount: z.number(),
        currency: stringNotBlank(),
        category: z.enum(CostCategoryEnum),
        note: stringNotBlank().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const createdCostMTD = await opts.ctx.prisma.bDFinCostMTD.create({
        data: {
          user_id: opts.ctx.user.id,
          year: opts.input.year,
          month: opts.input.month,
          amount: opts.input.amount,
          currency: opts.input.currency,
          category: opts.input.category,
          note: opts.input.note,
        },
      });

      const theCostMTD = await opts.ctx.prisma.bDFinCostMTD.findFirst({
        where: { id: createdCostMTD.id },
      });
      if (!theCostMTD) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new BD cost MTD.",
        });
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        cost_mtd: theCostMTD,
      };
    }),
};
