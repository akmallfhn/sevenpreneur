import {
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { stringIsNanoid, stringIsTimestampTz } from "@/trpc/utils/validation";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const createWA = {
  alert: administratorProcedure
    .input(
      z.object({
        conv_id: stringIsNanoid(),
        scheduled_at: stringIsTimestampTz(),
      })
    )
    .mutation(async (opts) => {
      const waConversation = await opts.ctx.prisma.wAConversation.findFirst({
        select: { id: true },
        where: { id: opts.input.conv_id },
      });
      if (!waConversation) {
        throw readFailedNotFound("conversation");
      }

      const createdAlert = await opts.ctx.prisma.wAAlert.create({
        data: {
          conv_id: opts.input.conv_id,
          scheduled_at: opts.input.scheduled_at,
        },
      });
      const theAlert = await opts.ctx.prisma.wAAlert.findFirst({
        where: { id: createdAlert.id },
      });
      if (!theAlert) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new alert.",
        });
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        alert: theAlert,
      };
    }),
};
