import {
  STATUS_BAD_REQUEST,
  STATUS_FORBIDDEN,
  STATUS_OK,
} from "@/lib/status_code";
import { administratorProcedure, loggedInProcedure } from "@/trpc/init";
import { calculatePage } from "@/trpc/utils/paging";
import { stringToDate } from "@/trpc/utils/string_date";
import {
  numberIsID,
  numberIsPositive,
  stringIsUUID,
} from "@/trpc/utils/validation";
import {
  CategoryEnum,
  Prisma,
  PrismaClient,
  TStatusEnum,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";
import {
  CohortBadge,
  CohortBadgeWithPrice,
  EventBadgeWithPrice,
  PlaylistBadge,
} from "./type.transaction";

async function fetchItems(
  prisma: PrismaClient,
  list: { category: CategoryEnum; item_id: number }[],
  useCohortPrice: boolean,
  useEventPrice: boolean
) {
  const cohortIdList: Set<number> = new Set();
  const eventIdList: Set<number> = new Set();
  const playlistIdList: Set<number> = new Set();
  list.forEach((entry) => {
    if (entry.category === CategoryEnum.COHORT) {
      cohortIdList.add(entry.item_id);
    } else if (entry.category === CategoryEnum.EVENT) {
      eventIdList.add(entry.item_id);
    } else if (entry.category === CategoryEnum.PLAYLIST) {
      playlistIdList.add(entry.item_id);
    }
  });

  type Cohort = Prisma.CohortGetPayload<{}>;
  let cohortMap: Map<number, Cohort> | undefined;
  if (!useCohortPrice) {
    const cohortList = await prisma.cohort.findMany({
      where: { id: { in: Array.from(cohortIdList) } },
    });
    cohortMap = new Map(cohortList.map((entry) => [entry.id, entry]));
  }

  type CohortPrice = Prisma.CohortPriceGetPayload<{
    include: { cohort: true };
  }>;
  let cohortPriceMap: Map<number, CohortPrice> | undefined;
  if (useCohortPrice) {
    const cohortPriceList = await prisma.cohortPrice.findMany({
      include: { cohort: true },
      where: { id: { in: Array.from(cohortIdList) } },
    });
    cohortPriceMap = new Map(cohortPriceList.map((entry) => [entry.id, entry]));
  }

  type Event = Prisma.EventGetPayload<{}>;
  let eventMap: Map<number, Event> | undefined;
  if (!useEventPrice) {
    const eventList = await prisma.event.findMany({
      where: { id: { in: Array.from(eventIdList) } },
    });
    eventMap = new Map(eventList.map((entry) => [entry.id, entry]));
  }

  type EventPrice = Prisma.EventPriceGetPayload<{ include: { event: true } }>;
  let eventPriceMap: Map<number, EventPrice> | undefined;
  if (useEventPrice) {
    const eventPriceList = await prisma.eventPrice.findMany({
      include: { event: true },
      where: { id: { in: Array.from(eventIdList) } },
    });
    eventPriceMap = new Map(eventPriceList.map((entry) => [entry.id, entry]));
  }

  const playlistList = await prisma.playlist.findMany({
    where: { id: { in: Array.from(playlistIdList) } },
  });
  const videosCountList = await prisma.video.groupBy({
    by: ["playlist_id"],
    _count: true,
    where: {
      playlist_id: { in: Array.from(playlistIdList) },
    },
  });
  const videosCountMap = new Map(
    videosCountList.map((entry) => [entry.playlist_id, entry._count])
  );
  const playlistMap = new Map(
    playlistList.map((entry) => {
      const videosCount = videosCountMap.get(entry.id) || 0;
      return [entry.id, { entry, videosCount }];
    })
  );

  return { cohortMap, cohortPriceMap, eventMap, eventPriceMap, playlistMap };
}

export const listTransaction = {
  discounts: administratorProcedure
    .input(
      z.object({
        page: numberIsPositive().optional(),
        page_size: numberIsPositive().optional(),
      })
    )
    .query(async (opts) => {
      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.discount.aggregate({ _count: true })
      );

      const discountList = await opts.ctx.prisma.discount.findMany({
        orderBy: [{ created_at: "desc" }],
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });

      const { cohortMap, playlistMap, eventMap } = await fetchItems(
        opts.ctx.prisma,
        discountList,
        false, // uses cohort ID
        false
      );

      const returnedList = discountList.map((entry) => {
        let cohortBadge: CohortBadge | undefined;
        if (entry.category === CategoryEnum.COHORT) {
          const selectedCohortPrice = cohortMap!.get(entry.item_id);
          if (selectedCohortPrice) {
            cohortBadge = {
              id: selectedCohortPrice.id,
              name: selectedCohortPrice.name,
              image: selectedCohortPrice.image,
              slugUrl: selectedCohortPrice.slug_url,
            };
          }
        }

        let playlistBadge: PlaylistBadge | undefined;
        if (entry.category === CategoryEnum.PLAYLIST) {
          const selectedPlaylist = playlistMap.get(entry.item_id);
          if (selectedPlaylist) {
            playlistBadge = {
              id: selectedPlaylist.entry.id,
              name: selectedPlaylist.entry.name,
              image: selectedPlaylist.entry.image_url,
              slugUrl: selectedPlaylist.entry.slug_url,
              totalVideo: selectedPlaylist.videosCount,
            };
          }
        }

        return {
          id: entry.id,
          name: entry.name,
          code: entry.code,
          category: entry.category,
          item_id: entry.item_id,
          calc_percent: entry.calc_percent,
          status: entry.status,
          start_date: entry.start_date,
          end_date: entry.end_date,
          cohort_id: cohortBadge?.id,
          cohort_name: cohortBadge?.name,
          cohort_image: cohortBadge?.image,
          cohort_slug: cohortBadge?.slugUrl,
          playlist_id: playlistBadge?.id,
          playlist_name: playlistBadge?.name,
          playlist_image: playlistBadge?.image,
          playlist_slug_url: playlistBadge?.slugUrl,
          playlist_total_video: playlistBadge?.totalVideo,
        };
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: paging.metapaging,
      };
    }),

  transactions: loggedInProcedure
    .input(
      z.object({
        user_id: stringIsUUID().optional(),
        cohort_id: numberIsID().optional(),
        playlist_id: numberIsID().optional(),
        event_id: numberIsID().optional(),
        start_date: z.iso.date().optional(),
        end_date: z.iso.date().optional(),
        page: numberIsPositive().optional(),
        page_size: numberIsPositive().optional(),
      })
    )
    .query(async (opts) => {
      let selectedUserId = opts.input.user_id;
      if (opts.ctx.user.role.name !== "Administrator") {
        if (!selectedUserId) {
          selectedUserId = opts.ctx.user.id;
        }
        if (opts.ctx.user.id !== selectedUserId) {
          throw new TRPCError({
            code: STATUS_FORBIDDEN,
            message:
              "You're not allowed to read another user's transactions list.",
          });
        }
      }

      const whereClause = {
        user_id: selectedUserId,
        created_at: {},
      };

      const providedFilters = [
        opts.input.cohort_id,
        opts.input.playlist_id,
        opts.input.event_id,
      ].filter(Boolean);

      if (providedFilters.length > 1) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "Provide only one of cohort_id, playlist_id, or event_id.",
        });
      }

      if (opts.input.cohort_id) {
        Object.assign(whereClause, {
          category: CategoryEnum.COHORT,
          item_id: opts.input.cohort_id,
        });
      }
      if (opts.input.event_id) {
        Object.assign(whereClause, {
          category: CategoryEnum.EVENT,
          item_id: opts.input.event_id,
        });
      }
      if (opts.input.playlist_id) {
        Object.assign(whereClause, {
          category: CategoryEnum.PLAYLIST,
          item_id: opts.input.playlist_id,
        });
      }

      if (opts.input.start_date) {
        Object.assign(whereClause.created_at, {
          gte: stringToDate(opts.input.start_date),
        });
      }
      if (opts.input.end_date) {
        const endDate = stringToDate(opts.input.end_date);
        if (endDate) {
          endDate.setDate(endDate.getDate() + 1);
          Object.assign(whereClause.created_at, {
            lt: endDate, // exclusive less than
          });
        }
      }

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.transaction.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const transactionsList = await opts.ctx.prisma.transaction.findMany({
        where: whereClause,
        orderBy: [{ created_at: "desc" }],
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });

      const { cohortPriceMap, playlistMap, eventPriceMap } = await fetchItems(
        opts.ctx.prisma,
        transactionsList,
        true, // uses cohort price ID
        true
      );

      let checkoutPrefix = "https://checkout.xendit.co/web/";
      if (process.env.XENDIT_MODE === "test") {
        checkoutPrefix = "https://checkout-staging.xendit.co/v2/";
      }

      const returnedList = transactionsList.map((entry) => {
        let invoiceUrl: string | undefined;
        if (entry.status === TStatusEnum.PENDING) {
          invoiceUrl = `${checkoutPrefix}${entry.invoice_number}`;
        }

        let cohortBadge: CohortBadgeWithPrice | undefined;
        if (entry.category === CategoryEnum.COHORT) {
          const selectedCohortPrice = cohortPriceMap!.get(entry.item_id);
          if (selectedCohortPrice) {
            cohortBadge = {
              id: selectedCohortPrice.cohort.id,
              name: selectedCohortPrice.cohort.name,
              image: selectedCohortPrice.cohort.image,
              slugUrl: selectedCohortPrice.cohort.slug_url,
              priceName: selectedCohortPrice.name,
            };
          }
        }

        let eventBadge: EventBadgeWithPrice | undefined;
        if (entry.category === CategoryEnum.EVENT) {
          const selectedEventPrice = eventPriceMap!.get(entry.item_id);
          if (selectedEventPrice) {
            eventBadge = {
              id: selectedEventPrice.event.id,
              name: selectedEventPrice.event.name,
              image: selectedEventPrice.event.image,
              slugUrl: selectedEventPrice.event.slug_url,
              priceName: selectedEventPrice.name,
            };
          }
        }

        let playlistBadge: PlaylistBadge | undefined;
        if (entry.category === CategoryEnum.PLAYLIST) {
          const selectedPlaylist = playlistMap.get(entry.item_id);
          if (selectedPlaylist) {
            playlistBadge = {
              id: selectedPlaylist.entry.id,
              name: selectedPlaylist.entry.name,
              image: selectedPlaylist.entry.image_url,
              slugUrl: selectedPlaylist.entry.slug_url,
              totalVideo: selectedPlaylist.videosCount,
            };
          }
        }

        return {
          id: entry.id,
          category: entry.category,
          item_id: entry.item_id,
          total_amount: entry.amount
            .sub(entry.discount_amount)
            .plus(entry.admin_fee)
            .plus(entry.vat),
          net_amount: entry.amount.sub(entry.discount_amount),
          currency: entry.currency,
          status: entry.status,
          paid_at: entry.paid_at,
          created_at: entry.created_at,
          invoice_url: invoiceUrl,
          cohort_id: cohortBadge?.id,
          cohort_name: cohortBadge?.name,
          cohort_image: cohortBadge?.image,
          cohort_slug: cohortBadge?.slugUrl,
          cohort_price_name: cohortBadge?.priceName,
          event_id: eventBadge?.id,
          event_name: eventBadge?.name,
          event_image: eventBadge?.image,
          event_slug: eventBadge?.slugUrl,
          event_price_name: eventBadge?.priceName,
          playlist_id: playlistBadge?.id,
          playlist_name: playlistBadge?.name,
          playlist_image: playlistBadge?.image,
          playlist_slug_url: playlistBadge?.slugUrl,
          playlist_total_video: playlistBadge?.totalVideo,
        };
      });

      const wherePaid = Object.assign(
        { status: TStatusEnum.PAID },
        whereClause
      );
      const wherePending = Object.assign(
        { status: TStatusEnum.PENDING },
        whereClause
      );
      const whereFailed = Object.assign(
        { status: TStatusEnum.FAILED },
        whereClause
      );

      const totalAmounts = await opts.ctx.prisma.transaction.aggregate({
        _sum: { amount: true, discount_amount: true },
        where: wherePaid, // only sum paid transactions
      });
      const ZERO = new Prisma.Decimal(0);
      const totalAmount = totalAmounts._sum.amount || ZERO;
      const totalDiscountAmount = totalAmounts._sum.discount_amount || ZERO;

      const totalPaid = await opts.ctx.prisma.transaction.aggregate({
        _count: true,
        where: wherePaid,
      });
      const totalPending = await opts.ctx.prisma.transaction.aggregate({
        _count: true,
        where: wherePending,
      });
      const totalFailed = await opts.ctx.prisma.transaction.aggregate({
        _count: true,
        where: whereFailed,
      });

      const returnedMetapaging = Object.assign({}, paging.metapaging, {
        total_revenue: totalAmount.sub(totalDiscountAmount),
        total_paid: totalPaid._count,
        total_pending: totalPending._count,
        total_failed: totalFailed._count,
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
      };
    }),
};
