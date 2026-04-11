import { STATUS_INTERNAL_SERVER_ERROR, STATUS_OK } from "@/lib/status_code";
import { whatsappMessageRequest } from "@/lib/whatsapp";
import { administratorProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { stringIsNanoid, stringNotBlank } from "@/trpc/utils/validation";
import { WACDirection, WACSenderType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const sendWA = {
  chat: administratorProcedure
    .input(
      z.object({
        conv_id: stringIsNanoid(),
        message: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      const waConversation = await opts.ctx.prisma.wAConversation.findFirst({
        select: { phone_number: true },
        where: { id: opts.input.conv_id },
      });
      if (!waConversation) {
        throw readFailedNotFound("conversation");
      }

      let messageId = "";
      try {
        const whatsappResponse = await whatsappMessageRequest(
          waConversation.phone_number,
          opts.input.message
        );
        if (whatsappResponse.messages.length < 0) {
          throw Error("No message ID");
        } else if (whatsappResponse.messages.length > 1) {
          console.error("send.whatsapp: More-than-one messages are returned.");
        }
        messageId = whatsappResponse.messages[0].id;
      } catch (e) {
        console.error(e);
        // Rethrow error using TRPCError
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new chat.",
        });
      }

      const createdChat = await opts.ctx.prisma.wAChat.create({
        data: {
          conv_id: opts.input.conv_id,
          wam_id: messageId,
          direction: WACDirection.OUTBOUND,
          sender_type: WACSenderType.ADMIN,
          message: opts.input.message,
        },
      });
      if (!createdChat) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new chat.",
        });
      }

      return {
        code: STATUS_OK,
        message: "Success",
        chat: createdChat,
      };
    }),
};
