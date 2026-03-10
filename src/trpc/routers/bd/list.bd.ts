import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { numberIsID } from "@/trpc/utils/validation";
import z from "zod";

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

  north_star_indicators: loggedInProcedure.query(async (opts) => {
    const northStarIndicatorList =
      await opts.ctx.prisma.bDNorthStarIndicator.findMany({
        select: {
          id: true,
          name: true,
          annual_target: true,
          unit: true,
          status: true,
        },
        where: { user_id: opts.ctx.user.id },
        orderBy: [{ created_at: "desc" }],
      });

    return {
      code: STATUS_OK,
      message: "Success",
      list: northStarIndicatorList,
    };
  }),

  north_star_mtds: loggedInProcedure
    .input(
      z.object({
        indicator_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const northStarMTDList = await opts.ctx.prisma.bDNorthStarMTD.findMany({
        select: {
          id: true,
          year: true,
          month: true,
          actual_value: true,
          note: true,
        },
        where: {
          indicator_id: opts.input.indicator_id,
          indicator: {
            user_id: opts.ctx.user.id,
          },
        },
        orderBy: [{ created_at: "desc" }],
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: northStarMTDList,
      };
    }),
};
