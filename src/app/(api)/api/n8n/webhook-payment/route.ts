import GetPrismaClient from "@/lib/prisma";
import { TStatusEnum } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type n8nPaymentReminderCheck = {
  tid: string;
};

export async function POST(req: NextRequest) {
  const n8nWebhookToken = req.headers.get("x-webhook-token");
  if (n8nWebhookToken !== process.env.N8N_WEBHOOK_VERIFICATION_TOKEN) {
    return new NextResponse(
      JSON.stringify({
        error: "Forbidden",
      }),
      {
        status: 403,
        headers: [["Content-Type", "application/json"]],
      }
    );
  }

  const reqBody: n8nPaymentReminderCheck = await req.json();
  const prisma = GetPrismaClient();

  const theTransaction = await prisma.transaction.findFirst({
    select: {
      status: true,
      user: { select: { full_name: true, email: true } },
    },
    where: {
      id: reqBody.tid,
    },
  });
  if (!theTransaction) {
    return new NextResponse(
      JSON.stringify({
        error: "The transaction with the given ID is not found.",
      }),
      {
        status: 404,
        headers: [["Content-Type", "application/json"]],
      }
    );
  }

  return new NextResponse(
    JSON.stringify({
      is_pending: theTransaction.status === TStatusEnum.PENDING,
      status: theTransaction.status,
      full_name: theTransaction.user.full_name,
      email: theTransaction.user.email,
    }),
    {
      status: 200,
      headers: [["Content-Type", "application/json"]],
    }
  );
}
