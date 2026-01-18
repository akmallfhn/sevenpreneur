import { Optional } from "@/lib/optional-type";
import GetPrismaClient from "@/lib/prisma";
import { CategoryEnum, TStatusEnum } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getProductName } from "./util.n8n.payment";

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
      category: true,
      item_id: true,
      amount: true,
      discount_amount: true,
      admin_fee: true,
      vat: true,
      invoice_number: true,
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

  let productCategory = "unknown"; // generic product category
  switch (theTransaction.category) {
    case CategoryEnum.COHORT:
      productCategory = "cohort";
      break;
    case CategoryEnum.PLAYLIST:
      productCategory = "playlist";
      break;
    case CategoryEnum.EVENT:
      productCategory = "event";
      break;
    case CategoryEnum.AI:
      productCategory = "AI";
      break;
    default:
      break;
  }

  const productName =
    (await getProductName(
      prisma,
      theTransaction.category,
      theTransaction.item_id
    )) ?? "Product"; // generic product name

  let checkoutPrefix = "https://checkout.xendit.co/web/";
  if (process.env.XENDIT_MODE === "test") {
    checkoutPrefix = "https://checkout-staging.xendit.co/v2/";
  }

  let invoiceUrl: Optional<string>;
  if (theTransaction.status === TStatusEnum.PENDING) {
    invoiceUrl = `${checkoutPrefix}${theTransaction.invoice_number}`;
  }

  return new NextResponse(
    JSON.stringify({
      is_pending: theTransaction.status === TStatusEnum.PENDING,
      status: theTransaction.status,
      full_name: theTransaction.user.full_name,
      email: theTransaction.user.email,
      product_category: productCategory,
      product_name: productName,
      product_price: theTransaction.amount
        .sub(theTransaction.discount_amount)
        .plus(theTransaction.admin_fee)
        .plus(theTransaction.vat),
      invoice_url: invoiceUrl,
    }),
    {
      status: 200,
      headers: [["Content-Type", "application/json"]],
    }
  );
}
