import {
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import {
  stringIsNanoid,
  stringIsTimestampTz,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { WAAssetType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const createWA = {
  asset: administratorProcedure
    .input(
      z.object({
        url: stringNotBlank(),
        type: z.enum(WAAssetType),
      })
    )
    .mutation(async (opts) => {
      const createdAsset = await opts.ctx.prisma.wAAsset.create({
        data: {
          url: opts.input.url,
          type: opts.input.type,
        },
      });
      const theAsset = await opts.ctx.prisma.wAAsset.findFirst({
        where: { id: createdAsset.id },
      });
      if (!theAsset) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new asset.",
        });
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        asset: theAsset,
      };
    }),

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
