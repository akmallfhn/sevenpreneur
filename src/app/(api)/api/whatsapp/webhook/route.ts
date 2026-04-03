import GetPrismaClient from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
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

      // Inbound messages
      if (change.value.messages) {
        let userProfileName = "";
        if (change.value.contacts && change.value.contacts.length > 0) {
          userProfileName = change.value.contacts[0].profile.name;
        }
        for (const msg of change.value.messages) {
          // Only accept text messages for now
          if (msg.type !== "text") {
            continue;
          }

          if (msg.type == "text") {
            const isSuccess = await appendChatFromUser(
              prisma,
              userProfileName,
              msg.from,
              msg.id,
              msg.text.body,
              msg.timestamp
            );
            if (!isSuccess) {
              return new NextResponse(undefined, { status: 500 });
            }
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
