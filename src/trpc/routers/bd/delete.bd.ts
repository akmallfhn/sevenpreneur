import { STATUS_NO_CONTENT } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { checkDeleteResult } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";

export const deleteBD = {
  revenue_mtd: loggedInProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedRevenueMTD =
        await opts.ctx.prisma.bDFinRevenueMTD.deleteMany({
          where: {
            id: opts.input.id,
            user_id: opts.ctx.user.id,
          },
        });
      checkDeleteResult(
        deletedRevenueMTD.count,
        "BD revenue MTD",
        "bd.revenue_mtd"
      );
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  cost_mtd: loggedInProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedCostMTD = await opts.ctx.prisma.bDFinCostMTD.deleteMany({
        where: {
          id: opts.input.id,
          user_id: opts.ctx.user.id,
        },
      });
      checkDeleteResult(deletedCostMTD.count, "BD cost MTD", "bd.cost_mtd");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  north_star_indicator: loggedInProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      await opts.ctx.prisma.$transaction(async (tx) => {
        await tx.bDNorthStarMTD.deleteMany({
          where: {
            indicator_id: opts.input.id,
          },
        });
        const deletedNorthStarIndicator =
          await tx.bDNorthStarIndicator.deleteMany({
            where: {
              id: opts.input.id,
              user_id: opts.ctx.user.id,
            },
          });
        checkDeleteResult(
          deletedNorthStarIndicator.count,
          "BD north star indicator",
          "bd.north_star_indicator"
        );
      });
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  north_star_mtd: loggedInProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedNorthStarMTD =
        await opts.ctx.prisma.bDNorthStarMTD.deleteMany({
          where: {
            id: opts.input.id,
            indicator: {
              user_id: opts.ctx.user.id,
            },
          },
        });
      checkDeleteResult(
        deletedNorthStarMTD.count,
        "BD north star MTD",
        "bd.north_star_mtd"
      );
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),
};
