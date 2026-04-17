import GetPrismaClient from "@/lib/prisma";
import { WhatsappAttachmentAllTypes } from "@/lib/whatsapp-types";
import { WACType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { processImageMessage } from "./process.wa.webhook";
import { WhatsAppWebhookBody } from "./type.wa.webhook";
import { appendChatFromUser, updateStatusByMessageID } from "./util.wa.webhook";

export async function GET(req: NextRequest) {
  const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFICATION_TOKEN;

  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new NextResponse(challenge);
  }

  return new NextResponse("Forbidden", {
    status: 403,
  });
}

export async function POST(req: NextRequest) {
  const reqBody: WhatsAppWebhookBody = await req.json();

  // Only accept from WhatsApp business account webhook
  if (reqBody.object !== "whatsapp_business_account") {
    return new NextResponse(undefined, { status: 200 });
  }

  const prisma = GetPrismaClient();

  for (const entry of reqBody.entry) {
    for (const change of entry.changes) {
      // Only accept from messages webhook
      if (change.field !== "messages") {
        continue;
      }

      // Only accept messages to our number
      if (
        change.value.metadata.phone_number_id !==
        process.env.WHATSAPP_PHONE_NUMBER_ID
      ) {
        continue;
      }

      // Inbound messages
      if (change.value.messages) {
        let userProfileName = "";
        if (change.value.contacts && change.value.contacts.length > 0) {
          userProfileName = change.value.contacts[0].profile.name;
        }
        for (const msg of change.value.messages) {
          let messageType = WACType.UNSUPPORTED as WACType;
          let message = "";
          let attachment = undefined as WhatsappAttachmentAllTypes;

          if (msg.type == "audio") {
            messageType = WACType.AUDIO;
            attachment = msg.audio;
          } else if (msg.type == "contacts") {
            messageType = WACType.CONTACTS;
            attachment = msg.contacts;
          } else if (msg.type == "document") {
            messageType = WACType.DOCUMENT;
            attachment = msg.document;
          } else if (msg.type == "image") {
            messageType = WACType.IMAGE;
            attachment = msg.image;
          } else if (msg.type == "sticker") {
            messageType = WACType.STICKER;
            attachment = msg.sticker;
          } else if (msg.type == "text") {
            messageType = WACType.TEXT;
            message = msg.text.body;
          } else if (msg.type == "video") {
            messageType = WACType.VIDEO;
            attachment = msg.video;
          } else {
            continue; // Skip other message types for now
          }

          const isSuccess = await appendChatFromUser(
            prisma,
            userProfileName,
            msg.from,
            msg.id,
            messageType,
            message,
            attachment,
            msg.timestamp
          );
          if (!isSuccess) {
            // WhatsApp akan retry webhook jika dapat response non-200.
            // Artinya jika satu message gagal diproses, WhatsApp akan kirim ulang seluruh payload
            // dan message yang sudah berhasil di loop sebelumnya akan diproses duplikat.
            console.error(`[WA Webhook] Failed to process message ${msg.id}`);
            continue;
          }

          // Fire background process to upload image binary to Supabase storage
          if (msg.type === "image") {
            processImageMessage(msg.id, msg.image.id, msg.image).catch((err) =>
              console.error("[WA Image] Background process error:", err)
            );
          }
        }
      }

      // Outbound messages
      if (change.value.statuses) {
        for (const status of change.value.statuses) {
          const isSuccess = await updateStatusByMessageID(
            prisma,
            status.recipient_id,
            status.id,
            status.status,
            status.timestamp
          );
          if (!isSuccess) {
            return new NextResponse(undefined, { status: 500 });
          }
        }
      }
    }
  }

  return new NextResponse(undefined, { status: 200 });
}
