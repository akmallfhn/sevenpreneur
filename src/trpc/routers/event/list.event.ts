import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure, publicProcedure } from "@/trpc/init";
import { calculatePage } from "@/trpc/utils/paging";
import {
  numberIsID,
  numberIsPositive,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import z from "zod";

export const listEvent = {
  events: publicProcedure
    .input(
      z.object({
        page: numberIsPositive().optional(),
        page_size: numberIsPositive().optional(),
        keyword: stringNotBlank().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause = { deleted_at: null };

      if (!opts.ctx.user || opts.ctx.user.role.name !== "Administrator") {
        Object.assign(whereClause, {
          status: StatusEnum.ACTIVE,
          event_prices: {
            status: StatusEnum.ACTIVE,
          },
        });
      }

      if (opts.input.keyword !== undefined) {
        Object.assign(whereClause, {
          name: {
            contains: opts.input.keyword,
            mode: "insensitive",
          },
        });
      }

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.event.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const eventList = await opts.ctx.prisma.event.findMany({
        select: {
          id: true,
          name: true,
          image: true,
          status: true,
          slug_url: true,
          start_date: true,
          end_date: true,
          method: true,
          location_name: true,
          event_prices: {
            select: {
              id: true,
              name: true,
              amount: true,
            },
          },
        },
        orderBy: [
          { end_date: "desc" },
          { start_date: "desc" },
          { published_at: "desc" },
        ],
        where: whereClause,
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });
      const returnedList = eventList.map((entry) => {
        return {
          id: entry.id,
          name: entry.name,
          image: entry.image,
          status: entry.status,
          slug_url: entry.slug_url,
          start_date: entry.start_date,
          end_date: entry.end_date,
          prices: entry.event_prices,
        };
      });

      const returnedMetapaging = Object.assign({}, paging.metapaging, {
        keyword: opts.input.keyword,
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
      };
    }),

  eventPrices: loggedInProcedure
    .input(
      z.object({
        event_id: numberIsID(),
      })
    )
    .query(async (opts) => {
      const eventPricesList = await opts.ctx.prisma.eventPrice.findMany({
        where: { event_id: opts.input.event_id },
        orderBy: [{ amount: "asc" }, { created_at: "asc" }],
      });
      const returnedList = eventPricesList.map((entry) => {
        return {
          id: entry.id,
          name: entry.name,
          amount: entry.amount,
          status: entry.status,
        };
      });
      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),
};
