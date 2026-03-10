import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";
import { RevenueByX } from "./util.bd";

export const readBD = {
  revenue_mtd: loggedInProcedure
    .input(objectHasOnlyID())
    .query(async (opts) => {
      const theRevenueMTD = await opts.ctx.prisma.bDFinRevenueMTD.findFirst({
        where: {
          id: opts.input.id,
          user_id: opts.ctx.user.id,
        },
      });

      if (!theRevenueMTD) {
        throw readFailedNotFound("revenue MTD");
      }

      return {
        code: STATUS_OK,
        message: "Success",
        revenue_mtd: {
          ...theRevenueMTD,
          by_product: theRevenueMTD.by_product as RevenueByX[],
          by_channel: theRevenueMTD.by_channel as RevenueByX[],
        },
      };
    }),

  cost_mtd: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
    const theCostMTD = await opts.ctx.prisma.bDFinCostMTD.findFirst({
      where: {
        id: opts.input.id,
        user_id: opts.ctx.user.id,
      },
    });

    if (!theCostMTD) {
      throw readFailedNotFound("cost MTD");
    }

    return {
      code: STATUS_OK,
      message: "Success",
      cost_mtd: theCostMTD,
    };
  }),

  north_star_indicator: loggedInProcedure
    .input(objectHasOnlyID())
    .query(async (opts) => {
      const theNorthStarIndicator =
        await opts.ctx.prisma.bDNorthStarIndicator.findFirst({
          where: {
            id: opts.input.id,
            user_id: opts.ctx.user.id,
          },
        });

      if (!theNorthStarIndicator) {
        throw readFailedNotFound("north star indicator");
      }

      return {
        code: STATUS_OK,
        message: "Success",
        north_star_indicator: theNorthStarIndicator,
      };
    }),

  north_star_mtd: loggedInProcedure
    .input(objectHasOnlyID())
    .query(async (opts) => {
      const theNorthStarMTD = await opts.ctx.prisma.bDNorthStarMTD.findFirst({
        where: {
          id: opts.input.id,
          indicator: {
            user_id: opts.ctx.user.id,
          },
        },
      });

      if (!theNorthStarMTD) {
        throw readFailedNotFound("north star MTD");
      }

      return {
        code: STATUS_OK,
        message: "Success",
        north_star_mtd: theNorthStarMTD,
      };
    }),
};
