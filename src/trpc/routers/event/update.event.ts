import { STATUS_OK } from "@/lib/status_code";
import { roleBasedProcedure } from "@/trpc/init";
import { checkUpdateResult } from "@/trpc/utils/errors";
import {
  numberIsID,
  stringIsTimestampTz,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { LearningMethodEnum, StatusEnum } from "@prisma/client";
import z from "zod";

export const updateEvent = {
  event: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
        name: stringNotBlank().optional(),
        description: stringNotBlank().optional(),
        image: stringNotBlank().optional(),
        status: z.enum(StatusEnum).optional(),
        slug_url: stringNotBlank().optional(),
        start_date: stringIsTimestampTz().optional(),
        end_date: stringIsTimestampTz().optional(),
        method: z.enum(LearningMethodEnum).optional(),
        meeting_url: stringNotBlank().nullable().optional(),
        location_name: stringNotBlank().nullable().optional(),
        location_url: stringNotBlank().nullable().optional(),
        published_at: stringIsTimestampTz().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedEvent = await opts.ctx.prisma.event.updateManyAndReturn({
        data: {
          name: opts.input.name,
          description: opts.input.description,
          image: opts.input.image,
          status: opts.input.status,
          slug_url: opts.input.slug_url,
          start_date: opts.input.start_date,
          end_date: opts.input.end_date,
          method: opts.input.method,
          meeting_url: opts.input.meeting_url,
          location_name: opts.input.location_name,
          location_url: opts.input.location_url,
          published_at: opts.input.published_at,
        },
        where: {
          id: opts.input.id,
          deleted_at: null,
        },
      });
      checkUpdateResult(updatedEvent.length, "event", "events");
      return {
        code: STATUS_OK,
        message: "Success",
        event: updatedEvent[0],
      };
    }),

  eventPrice: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(
      z.object({
        id: numberIsID(),
        event_id: numberIsID().optional(),
        name: stringNotBlank().optional(),
        amount: z.number().optional(),
        status: z.enum(StatusEnum).optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedEventPrice =
        await opts.ctx.prisma.eventPrice.updateManyAndReturn({
          data: {
            event_id: opts.input.event_id,
            name: opts.input.name,
            amount: opts.input.amount,
            status: opts.input.status,
          },
          where: {
            id: opts.input.id,
            // deleted_at: null,
          },
        });
      checkUpdateResult(
        updatedEventPrice.length,
        "event price",
        "event prices",
        "eventPrice"
      );
      return {
        code: STATUS_OK,
        message: "Success",
        event: updatedEventPrice[0],
      };
    }),
};
