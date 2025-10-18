import {
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { roleBasedProcedure } from "@/trpc/init";
import { createSlugFromTitle } from "@/trpc/utils/slug";
import {
  numberIsID,
  stringIsTimestampTz,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { LearningMethodEnum, StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const createEvent = {
  event: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        name: stringNotBlank(),
        description: stringNotBlank(),
        image: stringNotBlank(),
        status: z.enum(StatusEnum),
        slug_url: stringNotBlank().optional(),
        start_date: stringIsTimestampTz(),
        end_date: stringIsTimestampTz(),
        method: z.enum(LearningMethodEnum),
        meeting_url: stringNotBlank().nullable().optional(),
        location_name: stringNotBlank().nullable().optional(),
        location_url: stringNotBlank().nullable().optional(),
        published_at: stringIsTimestampTz().optional(),
        event_prices: z
          .array(
            z.object({
              name: stringNotBlank(),
              amount: z.number(),
              status: z.enum(StatusEnum),
            })
          )
          .min(1),
      })
    )
    .mutation(async (opts) => {
      const slugUrl =
        typeof opts.input.slug_url !== "undefined"
          ? opts.input.slug_url
          : createSlugFromTitle(opts.input.name);
      const createdEvent = await opts.ctx.prisma.event.create({
        data: {
          name: opts.input.name,
          description: opts.input.description,
          image: opts.input.image,
          status: opts.input.status,
          slug_url: slugUrl,
          start_date: opts.input.start_date,
          end_date: opts.input.end_date,
          method: opts.input.method,
          meeting_url: opts.input.meeting_url,
          location_name: opts.input.location_name,
          location_url: opts.input.location_url,
          published_at: opts.input.published_at,
          event_prices: {
            create: opts.input.event_prices,
          },
        },
      });
      const theEvent = await opts.ctx.prisma.event.findFirst({
        include: {
          event_prices: true,
        },
        where: {
          id: createdEvent.id,
          deleted_at: null,
        },
      });
      if (!theEvent) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new cohort.",
        });
      }
      return {
        code: STATUS_CREATED,
        message: "Success",
        event: theEvent,
      };
    }),

  eventPrice: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        event_id: numberIsID(),
        name: stringNotBlank(),
        amount: z.number(),
        status: z.enum(StatusEnum),
      })
    )
    .mutation(async (opts) => {
      const createdEventPrice = await opts.ctx.prisma.eventPrice.create({
        data: {
          event_id: opts.input.event_id,
          name: opts.input.name,
          amount: opts.input.amount,
          status: opts.input.status,
        },
      });
      const theEventPrice = await opts.ctx.prisma.eventPrice.findFirst({
        where: {
          id: createdEventPrice.id,
          // deleted_at: null,
        },
      });
      if (!theEventPrice) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new cohort price.",
        });
      }
      return {
        code: STATUS_CREATED,
        message: "Success",
        eventPrice: theEventPrice,
      };
    }),
};
