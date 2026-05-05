import { WAAStatus } from "@/generated/prisma/client";
import { Optional } from "@/lib/optional-type";
import GetPrismaClient from "@/lib/prisma";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

type MailtrapEventType =
  | "delivery"
  | "open"
  | "click"
  | "unsubscribe"
  | "spam"
  | "soft bounce"
  | "bounce"
  | "suspension"
  | "reject";

type MailtrapEvent = {
  event: MailtrapEventType;
  message_id: string;
  sending_stream: "transactional" | "bulk";
  email: string;
  sending_domain_name: string;
  category?: string;
  custom_variables?: Record<string, string | number | boolean>;
  timestamp: number;
  event_id: string;
};

type MailtrapWebhookPayload = {
  events: MailtrapEvent[];
};

type MailtrapEventResult = {
  message_id: string;
  status: string;
  updated: boolean;
};

async function MailtrapCheckSignature(req: NextRequest) {
  const raw = await req.text();

  const signingSecret = process.env.MAILTRAP_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", signingSecret);
  hmac.update(raw, "utf-8");
  const computed = hmac.digest("hex");

  const signHeader = req.headers.get("Mailtrap-Signature");
  if (!signHeader) {
    return false;
  }

  const receivedBuf = Buffer.from(signHeader, "hex");
  const computedBuf = Buffer.from(computed, "hex");
  let valid = false;
  try {
    if (receivedBuf.length === computedBuf.length) {
      valid = crypto.timingSafeEqual(receivedBuf, computedBuf);
    }
  } catch {
    valid = false;
  }

  if (valid) {
    return JSON.parse(raw) as MailtrapWebhookPayload;
  }

  return false;
}

export async function POST(req: NextRequest) {
  const checkResult = await MailtrapCheckSignature(req);
  if (checkResult === false) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: [["Content-Type", "application/json"]],
    });
  }

  const payload: MailtrapWebhookPayload = checkResult;
  const prisma = GetPrismaClient();

  const results: MailtrapEventResult[] = [];

  for (const event of payload.events) {
    let newStatus: Optional<WAAStatus> = undefined;

    if (event.event === "delivery") {
      newStatus = WAAStatus.DELIVERED;
    } else if (event.event === "bounce" || event.event === "soft bounce") {
      newStatus = WAAStatus.BOUNCED;
    }

    if (!newStatus) {
      results.push({
        message_id: event.message_id,
        status: event.event,
        updated: false,
      });
      continue;
    }

    const updated = await prisma.wAAlert.updateMany({
      data: { status: newStatus },
      where: { email_message_id: event.message_id },
    });

    results.push({
      message_id: event.message_id,
      status: newStatus,
      updated: updated.count > 0,
    });
  }

  return new NextResponse(
    JSON.stringify({
      code: 200,
      status: "Success",
      results,
    }),
    {
      status: 200,
      headers: [["Content-Type", "application/json"]],
    }
  );
}
