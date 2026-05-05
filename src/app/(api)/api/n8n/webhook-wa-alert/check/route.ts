import { WAAStatus } from "@/generated/prisma/client";
import GetPrismaClient from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const n8nWebhookToken = req.headers.get("x-webhook-token");
  if (n8nWebhookToken !== process.env.N8N_WEBHOOK_VERIFICATION_TOKEN) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: [["Content-Type", "application/json"]],
    });
  }

  const prisma = GetPrismaClient();
  const now = new Date();

  const alerts = await prisma.wAAlert.findMany({
    select: {
      id: true,
      conv_id: true,
      email_message_id: true,
      status: true,
      conv: {
        select: {
          full_name: true,
          phone_number: true,
          handler: {
            select: {
              full_name: true,
              email: true,
            },
          },
        },
      },
    },
    where: {
      status: WAAStatus.SCHEDULED,
      scheduled_at: {
        gte: new Date(now.getTime() - 61 * 60 * 1000), // Last 1 hour
        lte: now,
      },
    },
  });

  const theAlerts = alerts.map((alert) => ({
    id: alert.id,
    conv_id: alert.conv_id,
    email_message_id: alert.email_message_id,
    status: alert.status,
    full_name: alert.conv.full_name,
    phone_number: alert.conv.phone_number,
    handler_full_name: alert.conv.handler?.full_name ?? null,
    handler_email: alert.conv.handler?.email ?? null,
  }));

  return new NextResponse(
    JSON.stringify({
      code: 200,
      status: "Success",
      alert_count: theAlerts.length,
      data: theAlerts,
    }),
    {
      status: 200,
      headers: [["Content-Type", "application/json"]],
    }
  );
}
