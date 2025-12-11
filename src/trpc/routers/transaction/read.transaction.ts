import { Optional } from "@/lib/optional-type";
import { STATUS_NOT_FOUND, STATUS_OK } from "@/lib/status_code";
import { administratorProcedure, loggedInProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { objectHasOnlyID, stringIsNanoid } from "@/trpc/utils/validation";
import { CategoryEnum, TStatusEnum } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import z from "zod";
import {
  CohortBadge,
  CohortBadgeWithPrice,
  EventBadgeWithPrice,
  PlaylistBadge,
} from "./type.transaction";

export const readTransaction = {
  discount: administratorProcedure
    .input(objectHasOnlyID())
    .query(async (opts) => {
      const theDiscount = await opts.ctx.prisma.discount.findFirst({
        where: {
          id: opts.input.id,
          // deleted_at: null,
        },
      });
      if (!theDiscount) {
        throw readFailedNotFound("discount");
      }

      let cohortBadge: Optional<CohortBadge>;
      if (theDiscount.category === CategoryEnum.COHORT) {
        const theCohortPrice = await opts.ctx.prisma.cohort.findFirst({
          where: { id: theDiscount.item_id },
        });
        if (theCohortPrice) {
          cohortBadge = {
            id: theCohortPrice.id,
            name: theCohortPrice.name,
            image: theCohortPrice.image,
            slugUrl: theCohortPrice.slug_url,
          };
        }
      }

      let playlistBadge: Optional<PlaylistBadge>;
      if (theDiscount.category === CategoryEnum.PLAYLIST) {
        const thePlaylist = await opts.ctx.prisma.playlist.findFirst({
          where: { id: theDiscount.item_id },
        });
        if (thePlaylist) {
          playlistBadge = {
            id: thePlaylist.id,
            name: thePlaylist.name,
            image: thePlaylist.image_url,
            slugUrl: thePlaylist.slug_url,
            totalVideo: await opts.ctx.prisma.video.count({
              where: {
                playlist_id: thePlaylist.id,
              },
            }),
          };
        }
      }

      return {
        code: STATUS_OK,
        message: "Success",
        discount: {
          id: theDiscount.id,
          name: theDiscount.name,
          code: theDiscount.code,
          category: theDiscount.category,
          item_id: theDiscount.item_id,
          calc_percent: theDiscount.calc_percent,
          status: theDiscount.status,
          start_date: theDiscount.start_date,
          end_date: theDiscount.end_date,
          cohort_id: cohortBadge?.id,
          cohort_name: cohortBadge?.name,
          cohort_image: cohortBadge?.image,
          cohort_slug: cohortBadge?.slugUrl,
          playlist_id: playlistBadge?.id,
          playlist_name: playlistBadge?.name,
          playlist_image: playlistBadge?.image,
          playlist_slug_url: playlistBadge?.slugUrl,
          playlist_total_video: playlistBadge?.totalVideo,
          created_at: theDiscount.created_at,
          updated_at: theDiscount.updated_at,
        },
      };
    }),

  transaction: loggedInProcedure
    .input(z.object({ id: stringIsNanoid() }))
    .query(async (opts) => {
      let selectedUserId: Optional<string> = opts.ctx.user.id;
      if (opts.ctx.user.role.name === "Administrator") {
        selectedUserId = undefined;
      }

      const theTransaction = await opts.ctx.prisma.transaction.findFirst({
        include: {
          user: {
            include: { phone_country: true },
          },
        },
        where: {
          id: opts.input.id,
          user_id: selectedUserId,
          // deleted_at: null,
        },
      });
      if (!theTransaction) {
        throw new TRPCError({
          code: STATUS_NOT_FOUND,
          message: "The transaction with the given ID is not found.",
        });
      }

      let checkoutPrefix = "https://checkout.xendit.co/web/";
      if (process.env.XENDIT_MODE === "test") {
        checkoutPrefix = "https://checkout-staging.xendit.co/v2/";
      }

      let invoiceUrl: Optional<string>;
      if (theTransaction.status === TStatusEnum.PENDING) {
        invoiceUrl = `${checkoutPrefix}${theTransaction.invoice_number}`;
      }

      let discountCode: Optional<string>;
      let discountPercent: Optional<Decimal>;
      if (theTransaction.discount_id) {
        const theDiscount = await opts.ctx.prisma.discount.findFirst({
          where: { id: theTransaction.discount_id },
        });
        if (theDiscount) {
          discountCode = theDiscount.code;
          discountPercent = theDiscount.calc_percent;
        }
      }

      let paymentChannelName: Optional<string>;
      let paymentChannelImage: Optional<string>;
      const thePaymentChannel = await opts.ctx.prisma.paymentChannel.findFirst({
        where: { code: theTransaction.payment_channel },
      });
      if (thePaymentChannel) {
        paymentChannelName = thePaymentChannel.label;
        paymentChannelImage = thePaymentChannel.image;
      }

      let cohortBadge: Optional<CohortBadgeWithPrice>;
      if (theTransaction.category === CategoryEnum.COHORT) {
        const theCohortPrice = await opts.ctx.prisma.cohortPrice.findFirst({
          include: { cohort: true },
          where: { id: theTransaction.item_id },
        });
        if (theCohortPrice) {
          cohortBadge = {
            id: theCohortPrice.cohort.id,
            name: theCohortPrice.cohort.name,
            image: theCohortPrice.cohort.image,
            slugUrl: theCohortPrice.cohort.slug_url,
            priceName: theCohortPrice.name,
          };
        }
      }

      let eventBadge: Optional<EventBadgeWithPrice>;
      if (theTransaction.category === CategoryEnum.EVENT) {
        const theEventPrice = await opts.ctx.prisma.eventPrice.findFirst({
          include: { event: true },
          where: { id: theTransaction.item_id },
        });
        if (theEventPrice) {
          eventBadge = {
            id: theEventPrice.event.id,
            name: theEventPrice.event.name,
            image: theEventPrice.event.image,
            slugUrl: theEventPrice.event.slug_url,
            priceName: theEventPrice.name,
          };
        }
      }

      let playlistBadge: Optional<PlaylistBadge>;
      if (theTransaction.category === CategoryEnum.PLAYLIST) {
        const thePlaylist = await opts.ctx.prisma.playlist.findFirst({
          where: { id: theTransaction.item_id },
        });
        if (thePlaylist) {
          playlistBadge = {
            id: thePlaylist.id,
            name: thePlaylist.name,
            image: thePlaylist.image_url,
            slugUrl: thePlaylist.slug_url,
            totalVideo: await opts.ctx.prisma.video.count({
              where: {
                playlist_id: thePlaylist.id,
              },
            }),
          };
        }
      }

      return {
        code: STATUS_OK,
        message: "Success",
        transaction: {
          id: theTransaction.id,
          category: theTransaction.category,
          status: theTransaction.status,
          invoice_number: theTransaction.invoice_number,
          invoice_url: invoiceUrl,
          product_price: theTransaction.amount,
          product_discount: theTransaction.discount_amount,
          product_admin_fee: theTransaction.admin_fee,
          product_vat: theTransaction.vat,
          product_total_amount: theTransaction.amount
            .sub(theTransaction.discount_amount)
            .plus(theTransaction.admin_fee)
            .plus(theTransaction.vat),
          discount_code: discountCode,
          discount_percent: discountPercent,
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
          payment_channel_name: paymentChannelName,
          payment_channel_image: paymentChannelImage,
          user_full_name: theTransaction.user.full_name,
          user_email: theTransaction.user.email,
          user_phone_country: theTransaction.user.phone_country,
          user_phone_number: theTransaction.user.phone_number,
          user_avatar: theTransaction.user.avatar,
          created_at: theTransaction.created_at,
          paid_at: theTransaction.paid_at,
        },
      };
    }),
};
