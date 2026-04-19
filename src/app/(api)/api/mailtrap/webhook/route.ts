import GetPrismaClient from "@/lib/prisma";
import { WAAStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type MailtrapEvent = {
  event: string;
  message_id: string;
  email: string;
  event_id: string;
  timestamp: number;
  category?: string;
  custom_variables?: Record<string, unknown>;
  sending_domain_name?: string | null;
  sending_stream?: string | null;
};

type MailtrapWebhookPayload = {
  events: MailtrapEvent[];
};

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.MAILTRAP_WEBHOOK_SECRET) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: [["Content-Type", "application/json"]],
    });
  }

  const payload: MailtrapWebhookPayload = await req.json();
  const prisma = GetPrismaClient();

  type MailtrapEventResult = {
    message_id: string;
    status: string;
    updated: boolean;
  };
  const results: MailtrapEventResult[] = [];

  for (const event of payload.events) {
    let newStatus: Optional<WAAStatus> = undefined;

    if (event.event === "delivery") {
      newStatus = WAAStatus.DELIVERED;
    } else if (event.event === "bounce" || event.event === "soft_bounce") {
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
      status: "success",
      results,
    }),
    {
      status: 200,
      headers: [["Content-Type", "application/json"]],
    }
  );
}
