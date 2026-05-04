import {
  WACDirection,
  WACSenderType,
  WACType,
} from "@/generated/prisma/client";
import GetPrismaClient from "@/lib/prisma";
import {
  whatsappAudioMessageRequest,
  whatsappDocumentMessageRequest,
  whatsappImageMessageRequest,
  WhatsappMessageResponse,
  whatsappStickerMessageRequest,
  whatsappTextMessageRequest,
  whatsappVideoMessageRequest,
} from "@/lib/whatsapp";
import {
  WhatsappAttachmentAudio,
  WhatsappAttachmentDocument,
  WhatsappAttachmentImage,
  WhatsappAttachmentSticker,
  WhatsappAttachmentVideo,
} from "@/lib/whatsapp-types";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const SendWASchema = z.discriminatedUnion("type", [
  z.strictObject({
    conv_id: z.string().min(1),
    type: z.literal("text"),
    message: z.string().min(1),
  }),
  z.strictObject({
    conv_id: z.string().min(1),
    type: z.literal("audio"),
    audio_url: z.string().min(1),
    is_voice: z.boolean(),
  }),
  z.strictObject({
    conv_id: z.string().min(1),
    type: z.literal("document"),
    document_url: z.string().min(1),
    caption: z.string().min(1),
    file_name: z.string().min(1),
  }),
  z.strictObject({
    conv_id: z.string().min(1),
    type: z.literal("image"),
    image_url: z.string().min(1),
    caption: z.string().min(1),
  }),
  z.strictObject({
    conv_id: z.string().min(1),
    type: z.literal("sticker"),
    sticker_url: z.string().min(1),
    is_animated: z.boolean(),
  }),
  z.strictObject({
    conv_id: z.string().min(1),
    type: z.literal("video"),
    video_url: z.string().min(1),
    caption: z.string().min(1),
  }),
]);

export type SendWABody = z.infer<typeof SendWASchema>;

type SendArgs = {
  conv_id: string;
  caller: (phone_number: string) => Promise<WhatsappMessageResponse>;
  wac_type: WACType;
  message: string;
  attachment?: object;
};

async function sendMessage(args: SendArgs): Promise<NextResponse> {
  const prisma = GetPrismaClient();

  const conversation = await prisma.wAConversation.findFirst({
    select: { phone_number: true },
    where: { id: args.conv_id },
  });
  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  let messageId: string;
  try {
    const response = await args.caller(conversation.phone_number);
    if (!response.messages || response.messages.length < 1) {
      throw new Error("No message ID returned");
    }
    messageId = response.messages[0].id;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to send WhatsApp message" },
      { status: 502 }
    );
  }

  const chat = await prisma.wAChat.create({
    data: {
      conv_id: args.conv_id,
      wam_id: messageId,
      direction: WACDirection.OUTBOUND,
      sender_type: WACSenderType.ADMIN,
      type: args.wac_type,
      message: args.message,
      attachment: args.attachment,
    },
  });

  return NextResponse.json({ data: chat });
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const expectedKey = process.env.SECRET_KEY_PUBLIC_API;
  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = SendWASchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request body",
        details: z.flattenError(parsed.error).fieldErrors,
      },
      { status: 400 }
    );
  }

  const body = parsed.data;

  switch (body.type) {
    case "text":
      return sendMessage({
        conv_id: body.conv_id,
        caller: (phone) => whatsappTextMessageRequest(phone, body.message),
        wac_type: WACType.TEXT,
        message: body.message,
      });

    case "audio":
      return sendMessage({
        conv_id: body.conv_id,
        caller: (phone) =>
          whatsappAudioMessageRequest(phone, body.audio_url, body.is_voice),
        wac_type: WACType.AUDIO,
        message: "",
        attachment: {
          mime_type: "",
          sha256: "",
          id: "",
          url: "",
          voice: body.is_voice,
          storage_url: body.audio_url,
        } satisfies WhatsappAttachmentAudio,
      });

    case "document":
      return sendMessage({
        conv_id: body.conv_id,
        caller: (phone) =>
          whatsappDocumentMessageRequest(
            phone,
            body.document_url,
            body.caption,
            body.file_name
          ),
        wac_type: WACType.DOCUMENT,
        message: "",
        attachment: {
          caption: body.caption,
          filename: body.file_name,
          mime_type: "",
          sha256: "",
          id: "",
          url: "",
          storage_url: body.document_url,
        } satisfies WhatsappAttachmentDocument,
      });

    case "image":
      return sendMessage({
        conv_id: body.conv_id,
        caller: (phone) =>
          whatsappImageMessageRequest(phone, body.image_url, body.caption),
        wac_type: WACType.IMAGE,
        message: "",
        attachment: {
          caption: body.caption,
          mime_type: "",
          sha256: "",
          id: "",
          url: "",
          storage_url: body.image_url,
        } satisfies WhatsappAttachmentImage,
      });

    case "sticker":
      return sendMessage({
        conv_id: body.conv_id,
        caller: (phone) =>
          whatsappStickerMessageRequest(phone, body.sticker_url),
        wac_type: WACType.STICKER,
        message: "",
        attachment: {
          mime_type: "",
          sha256: "",
          id: "",
          url: "",
          animated: body.is_animated,
          storage_url: body.sticker_url,
        } satisfies WhatsappAttachmentSticker,
      });

    case "video":
      return sendMessage({
        conv_id: body.conv_id,
        caller: (phone) =>
          whatsappVideoMessageRequest(phone, body.video_url, body.caption),
        wac_type: WACType.VIDEO,
        message: "",
        attachment: {
          caption: body.caption,
          mime_type: "",
          sha256: "",
          id: "",
          url: "",
          storage_url: body.video_url,
        } satisfies WhatsappAttachmentVideo,
      });
  }
}
