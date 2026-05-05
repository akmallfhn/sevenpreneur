import { WAAStatus } from "@/generated/prisma/client";
import GetPrismaClient from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type MailtrapSendResult = {
  success: boolean;
  message_ids: string[];
};

type n8nWAAlertReminderUpdate = {
  alert_id: number;
  mailtrap_result: MailtrapSendResult;
};

export async function POST(req: NextRequest) {
  const n8nWebhookToken = req.headers.get("x-webhook-token");
  if (n8nWebhookToken !== process.env.N8N_WEBHOOK_VERIFICATION_TOKEN) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: [["Content-Type", "application/json"]],
    });
  }

  const body: n8nWAAlertReminderUpdate = await req.json();
  const { alert_id, mailtrap_result } = body;

  if (
    !alert_id ||
    !mailtrap_result?.success ||
    !mailtrap_result.message_ids?.length
  ) {
    return new NextResponse(JSON.stringify({ error: "Invalid payload" }), {
      status: 400,
      headers: [["Content-Type", "application/json"]],
    });
  }

  const email_message_id = mailtrap_result.message_ids[0];

  const prisma = GetPrismaClient();

  const updated = await prisma.wAAlert.update({
    data: {
      email_message_id,
      status: WAAStatus.SENT,
    },
    where: { id: alert_id },
    select: { id: true, email_message_id: true, status: true },
  });

  return new NextResponse(
    JSON.stringify({
      code: 200,
      status: "Success",
      data: updated,
    }),
    {
      status: 200,
      headers: [["Content-Type", "application/json"]],
    }
  );
}
