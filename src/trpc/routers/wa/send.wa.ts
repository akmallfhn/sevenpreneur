import GetPrismaClient from "@/lib/prisma";
import { STATUS_INTERNAL_SERVER_ERROR, STATUS_OK } from "@/lib/status_code";
import {
  whatsappAudioMessageRequest,
  whatsappDocumentMessageRequest,
  whatsappImageMessageRequest,
  WhatsappMessageResponse,
  whatsappStickerMessageRequest,
  whatsappTextMessageRequest,
  whatsappVideoMessageRequest,
  whatsappTemplateMessageRequest,
  whatsappListTemplatesRequest,
} from "@/lib/whatsapp";
import {
  WhatsappAttachmentAudio,
  WhatsappAttachmentDocument,
  WhatsappAttachmentImage,
  WhatsappAttachmentSticker,
  WhatsappAttachmentVideo,
} from "@/lib/whatsapp-types";
import { administratorProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { stringIsNanoid, stringNotBlank } from "@/trpc/utils/validation";
import { WACDirection, WACSenderType, WACType } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

async function sendWhatsappMessage(
  prisma: ReturnType<typeof GetPrismaClient>,
  conv_id: string,
  caller: (phone_number: string) => Promise<WhatsappMessageResponse>,
  type: WACType,
  message: string,
  payload?: object
) {
  const waConversation = await prisma.wAConversation.findFirst({
    select: { phone_number: true },
    where: { id: conv_id },
  });
  if (!waConversation) {
    throw readFailedNotFound("conversation");
  }

  let messageId = "";
  try {
    const response = await caller(waConversation.phone_number);
    if (!response.messages || response.messages.length < 1) {
      throw Error("No message ID");
    } else if (response.messages.length > 1) {
      console.error("send.whatsapp: More-than-one messages are returned.");
    }
    messageId = response.messages[0].id;
  } catch (e) {
    console.error(e);
    // Rethrow error using TRPCError
    throw new TRPCError({
      code: STATUS_INTERNAL_SERVER_ERROR,
      message: "Failed to create a new chat.",
    });
  }

  const createdChat = await prisma.wAChat.create({
    data: {
      conv_id: conv_id,
      wam_id: messageId,
      direction: WACDirection.OUTBOUND,
      sender_type: WACSenderType.ADMIN,
      type: type,
      message: message,
      attachment: payload,
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
}

export const sendWA = {
  chat: administratorProcedure
    .input(
      z.object({
        conv_id: stringIsNanoid(),
        message: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      const caller = (() => async (phone_number: string) => {
        return await whatsappTextMessageRequest(
          phone_number,
          opts.input.message
        );
      })();
      return sendWhatsappMessage(
        opts.ctx.prisma,
        opts.input.conv_id,
        caller,
        WACType.TEXT,
        opts.input.message,
        undefined
      );
    }),

  audio: administratorProcedure
    .input(
      z.object({
        conv_id: stringIsNanoid(),
        audio_url: stringNotBlank(),
        is_voice: z.boolean(),
      })
    )
    .mutation(async (opts) => {
      const caller = (() => async (phone_number: string) => {
        return await whatsappAudioMessageRequest(
          phone_number,
          opts.input.audio_url,
          opts.input.is_voice
        );
      })();
      return sendWhatsappMessage(
        opts.ctx.prisma,
        opts.input.conv_id,
        caller,
        WACType.AUDIO,
        "", // Has to be blank
        {
          mime_type: "",
          sha256: "",
          id: "",
          url: "",
          voice: opts.input.is_voice,
          storage_url: opts.input.audio_url,
        } as WhatsappAttachmentAudio // Most values are set to blank
      );
    }),

  document: administratorProcedure
    .input(
      z.object({
        conv_id: stringIsNanoid(),
        document_url: stringNotBlank(),
        caption: stringNotBlank(),
        file_name: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      const caller = (() => async (phone_number: string) => {
        return await whatsappDocumentMessageRequest(
          phone_number,
          opts.input.document_url,
          opts.input.caption,
          opts.input.file_name
        );
      })();
      return sendWhatsappMessage(
        opts.ctx.prisma,
        opts.input.conv_id,
        caller,
        WACType.DOCUMENT,
        "", // Has to be blank
        {
          caption: opts.input.caption,
          filename: opts.input.file_name,
          mime_type: "",
          sha256: "",
          id: "",
          url: "",
          storage_url: opts.input.document_url,
        } as WhatsappAttachmentDocument // Most values are set to blank
      );
    }),

  image: administratorProcedure
    .input(
      z.object({
        conv_id: stringIsNanoid(),
        image_url: stringNotBlank(),
        caption: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      const caller = (() => async (phone_number: string) => {
        return await whatsappImageMessageRequest(
          phone_number,
          opts.input.image_url,
          opts.input.caption
        );
      })();
      return sendWhatsappMessage(
        opts.ctx.prisma,
        opts.input.conv_id,
        caller,
        WACType.IMAGE,
        "", // Has to be blank
        {
          caption: opts.input.caption,
          mime_type: "",
          sha256: "",
          id: "",
          url: "",
          storage_url: opts.input.image_url,
        } as WhatsappAttachmentImage // Most values are set to blank
      );
    }),

  sticker: administratorProcedure
    .input(
      z.object({
        conv_id: stringIsNanoid(),
        sticker_url: stringNotBlank(),
        is_animated: z.boolean(),
      })
    )
    .mutation(async (opts) => {
      const caller = (() => async (phone_number: string) => {
        return await whatsappStickerMessageRequest(
          phone_number,
          opts.input.sticker_url
        );
      })();
      return sendWhatsappMessage(
        opts.ctx.prisma,
        opts.input.conv_id,
        caller,
        WACType.STICKER,
        "", // Has to be blank
        {
          mime_type: "",
          sha256: "",
          id: "",
          url: "",
          animated: opts.input.is_animated,
          storage_url: opts.input.sticker_url,
        } as WhatsappAttachmentSticker // Most values are set to blank
      );
    }),

  video: administratorProcedure
    .input(
      z.object({
        conv_id: stringIsNanoid(),
        video_url: stringNotBlank(),
        caption: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      const caller = (() => async (phone_number: string) => {
        return await whatsappVideoMessageRequest(
          phone_number,
          opts.input.video_url,
          opts.input.caption
        );
      })();
      return sendWhatsappMessage(
        opts.ctx.prisma,
        opts.input.conv_id,
        caller,
        WACType.VIDEO,
        "", // Has to be blank
        {
          caption: opts.input.caption,
          mime_type: "",
          sha256: "",
          id: "",
          url: "",
          storage_url: opts.input.video_url,
        } as WhatsappAttachmentVideo // Most values are set to blank
      );
    }),

  template: administratorProcedure
    .input(
      z.object({
        conv_id: stringIsNanoid(),
        template_name: stringNotBlank(),
        language_code: z.string().optional().default("id"),
      })
    )
    .mutation(async (opts) => {
      const { conv_id, template_name, language_code } = opts.input;
      const prisma = opts.ctx.prisma;

      const conversation = await prisma.wAConversation.findFirst({
        select: { phone_number: true },
        where: { id: conv_id },
      });
      if (!conversation) {
        throw readFailedNotFound("conversation");
      }

      const { phone_number } = conversation;
      let messageId: string | null = null;
      let status = "sent";
      let errorDetail: string | null = null;

      try {
        const response = await whatsappTemplateMessageRequest(
          phone_number,
          template_name,
          language_code
        );
        if (!response.messages || response.messages.length < 1) {
          throw new Error("No message ID returned from Meta");
        }
        messageId = response.messages[0].id;
      } catch (e) {
        console.error("[sendWA.template] Meta API error:", e);
        status = "failed";
        errorDetail = e instanceof Error ? e.message : String(e);
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to send template message via WhatsApp.",
        });
      }

      const log = await prisma.wATemplateMessageLog.create({
        data: {
          conv_id,
          phone_number,
          template_name,
          language_code,
          message_id: messageId,
          status,
          error_detail: errorDetail,
          sent_at: new Date(),
        },
      });

      return {
        code: STATUS_OK,
        message: "Template sent successfully",
        log,
      };
    }),

  listTemplates: administratorProcedure.query(async () => {
    try {
      const result = await whatsappListTemplatesRequest(100);
      return {
        code: STATUS_OK,
        message: "Success",
        templates: result.data ?? [],
      };
    } catch (e) {
      console.error("[sendWA.listTemplates] Error:", e);
      throw new TRPCError({
        code: STATUS_INTERNAL_SERVER_ERROR,
        message: "Failed to fetch WhatsApp templates.",
      });
    }
  }),

};