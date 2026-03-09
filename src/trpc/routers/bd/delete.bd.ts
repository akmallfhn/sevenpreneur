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
};
