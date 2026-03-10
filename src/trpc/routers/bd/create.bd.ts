import {
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import {
  arrayRevenueBy,
  numberIsID,
  numberIsNonNegInt,
  numberIsPosInt,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { CostCategoryEnum, NSStatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { ParseRevenueCSV } from "./util.bd";

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

  revenue_mtd_csv: loggedInProcedure
    .input(
      z.object({
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
      const createdRevenueMTD = await opts.ctx.prisma.bDFinRevenueMTD.create({
        data: {
          user_id: opts.ctx.user.id,
          year: opts.input.year,
          month: opts.input.month,
          amount: records.total_amount,
          currency: opts.input.currency,
          by_product: records.by_product,
          by_channel: records.by_channel,
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

  north_star_indicator: loggedInProcedure
    .input(
      z.object({
        name: stringNotBlank(),
        description: stringNotBlank(),
        annual_target: z.number(),
        unit: stringNotBlank(),
        status: z.enum(NSStatusEnum),
      })
    )
    .mutation(async (opts) => {
      const createdNorthStarIndicator =
        await opts.ctx.prisma.bDNorthStarIndicator.create({
          data: {
            user_id: opts.ctx.user.id,
            name: opts.input.name,
            description: opts.input.description,
            annual_target: opts.input.annual_target,
            unit: opts.input.unit,
            status: opts.input.status,
          },
        });

      const theNorthStarIndicator =
        await opts.ctx.prisma.bDNorthStarIndicator.findFirst({
          where: { id: createdNorthStarIndicator.id },
        });
      if (!theNorthStarIndicator) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new BD north star indicator.",
        });
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        north_star_indicator: theNorthStarIndicator,
      };
    }),

  north_star_mtd: loggedInProcedure
    .input(
      z.object({
        indicator_id: numberIsID(),
        year: numberIsPosInt(),
        month: numberIsNonNegInt(),
        actual_value: z.number(),
        note: stringNotBlank().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const theNorthStarIndicator =
        await opts.ctx.prisma.bDNorthStarIndicator.findFirst({
          select: { user_id: true },
          where: {
            id: opts.input.indicator_id,
            user_id: opts.ctx.user.id,
          },
        });
      if (
        !theNorthStarIndicator ||
        theNorthStarIndicator.user_id != opts.ctx.user.id
      ) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "The given north star indicator is not found.",
        });
      }

      const createdNorthStarMTD = await opts.ctx.prisma.bDNorthStarMTD.create({
        data: {
          indicator_id: opts.input.indicator_id,
          year: opts.input.year,
          month: opts.input.month,
          actual_value: opts.input.actual_value,
          note: opts.input.note,
        },
      });

      const theNorthStarMTD = await opts.ctx.prisma.bDNorthStarMTD.findFirst({
        where: { id: createdNorthStarMTD.id },
      });
      if (!theNorthStarMTD) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new BD north star MTD.",
        });
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        north_star_mtd: theNorthStarMTD,
      };
    }),
};
