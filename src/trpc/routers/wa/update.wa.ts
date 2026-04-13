import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { checkUpdateResult } from "@/trpc/utils/errors";
import {
  numberIsNonNegInt,
  stringIsNanoid,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { WALeadStatus } from "@prisma/client";
import z from "zod";

export const updateWA = {
  conversation: administratorProcedure
    .input(
      z.object({
        id: stringIsNanoid(),
        user_id: stringIsUUID().nullable().optional(),
        handler_id: stringIsUUID().nullable().optional(),
        lead_status: z.enum(WALeadStatus).optional(),
        winning_rate: numberIsNonNegInt().optional(),
        note: stringNotBlank().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedConversation =
        await opts.ctx.prisma.wAConversation.updateManyAndReturn({
          data: {
            user_id: opts.input.user_id,
            handler_id: opts.input.handler_id,
            lead_status: opts.input.lead_status,
            winning_rate: opts.input.winning_rate,
            note: opts.input.note,
          },
          where: {
            id: opts.input.id,
          },
        });
      checkUpdateResult(
        updatedConversation.length,
        "conversation",
        "conversations"
      );
      return {
        code: STATUS_OK,
        message: "Success",
        conversation: updatedConversation[0],
      };
    }),

  conversation_as_read: administratorProcedure
    .input(
      z.object({
        id: stringIsNanoid(),
      })
    )
    .mutation(async (opts) => {
      const latestChat = await opts.ctx.prisma.wAChat.findFirst({
        select: { id: true },
        where: { conv_id: opts.input.id },
        orderBy: [{ created_at: "desc" }],
      });

      const updatedConversation =
        await opts.ctx.prisma.wAConversation.updateManyAndReturn({
          data: {
            last_read_id: latestChat?.id || null,
          },
          where: {
            id: opts.input.id,
          },
        });
      checkUpdateResult(
        updatedConversation.length,
        "conversation",
        "conversations"
      );

      return {
        code: STATUS_OK,
        message: "Success",
        conversation: updatedConversation[0],
      };
    }),
};
