import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";

export const listBD = {
  revenue_mtds: loggedInProcedure.query(async (opts) => {
    const revenueMTDList = await opts.ctx.prisma.bDFinRevenueMTD.findMany({
      select: {
        id: true,
        year: true,
        month: true,
        amount: true,
        currency: true,
        note: true,
      },
      where: { user_id: opts.ctx.user.id },
      orderBy: [{ year: "asc" }, { month: "asc" }],
    });

    return {
      code: STATUS_OK,
      message: "Success",
      list: revenueMTDList,
    };
  }),

  cost_mtds: loggedInProcedure.query(async (opts) => {
    const costMTDList = await opts.ctx.prisma.bDFinCostMTD.findMany({
      select: {
        id: true,
        year: true,
        month: true,
        amount: true,
        currency: true,
        category: true,
        note: true,
      },
      where: { user_id: opts.ctx.user.id },
      orderBy: [{ year: "asc" }, { month: "asc" }],
    });

    return {
      code: STATUS_OK,
      message: "Success",
      list: costMTDList,
    };
  }),
};
