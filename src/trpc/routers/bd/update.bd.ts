import { STATUS_CREATED } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { checkUpdateResult } from "@/trpc/utils/errors";
import {
  arrayRevenueBy,
  numberIsID,
  numberIsNonNegInt,
  numberIsPosInt,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { CostCategoryEnum } from "@prisma/client";
import z from "zod";
import { ParseRevenueCSV } from "./util.bd";

export const updateBD = {
  revenue_mtd: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
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
      const updatedRevenueMTD =
        await opts.ctx.prisma.bDFinRevenueMTD.updateManyAndReturn({
          data: {
            year: opts.input.year,
            month: opts.input.month,
            amount: opts.input.amount,
            currency: opts.input.currency,
            by_product: opts.input.by_product,
            by_channel: opts.input.by_channel,
            note: opts.input.note,
          },
          where: {
            id: opts.input.id,
          },
        });

      checkUpdateResult(
        updatedRevenueMTD.length,
        "BD revenue MTD",
        "BD revenue MTDs"
      );

      return {
        code: STATUS_CREATED,
        message: "Success",
        revenue_mtd: updatedRevenueMTD[0],
      };
    }),

  revenue_mtd_csv: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
        year: numberIsPosInt(),
        month: numberIsNonNegInt(),
        currency: stringNotBlank(),
        csv_text: stringNotBlank(),
        product_column: stringNotBlank(),
        channel_column: stringNotBlank(),
        amount_column: stringNotBlank(),
        note: stringNotBlank().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const records = ParseRevenueCSV(
        opts.input.csv_text,
        opts.input.product_column,
        opts.input.channel_column,
        opts.input.amount_column
      );
      const updatedRevenueMTD =
        await opts.ctx.prisma.bDFinRevenueMTD.updateManyAndReturn({
          data: {
            year: opts.input.year,
            month: opts.input.month,
            amount: records.total_amount,
            currency: opts.input.currency,
            by_product: records.by_product,
            by_channel: records.by_channel,
            note: opts.input.note,
          },
          where: {
            id: opts.input.id,
          },
        });

      checkUpdateResult(
        updatedRevenueMTD.length,
        "BD revenue MTD",
        "BD revenue MTDs"
      );

      return {
        code: STATUS_CREATED,
        message: "Success",
        revenue_mtd: updatedRevenueMTD[0],
      };
    }),

  cost_mtd: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
        year: numberIsPosInt(),
        month: numberIsNonNegInt(),
        amount: z.number(),
        currency: stringNotBlank(),
        category: z.enum(CostCategoryEnum),
        note: stringNotBlank().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedCostMTD =
        await opts.ctx.prisma.bDFinCostMTD.updateManyAndReturn({
          data: {
            year: opts.input.year,
            month: opts.input.month,
            amount: opts.input.amount,
            currency: opts.input.currency,
            category: opts.input.category,
            note: opts.input.note,
          },
          where: {
            id: opts.input.id,
          },
        });

      checkUpdateResult(updatedCostMTD.length, "BD cost MTD", "BD cost MTDs");

      return {
        code: STATUS_CREATED,
        message: "Success",
        cost_mtd: updatedCostMTD[0],
      };
    }),
};
