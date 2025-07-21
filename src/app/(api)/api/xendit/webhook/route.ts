import GetPrismaClient from "@/lib/prisma";
import { XenditInvoiceCallback } from "@/lib/xendit";
import { CategoryEnum, TStatusEnum } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const xenditCallbackToken = req.headers.get("x-callback-token");
  if (xenditCallbackToken !== process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN) {
    return new NextResponse("Forbidden", {
      status: 403,
    });
  }

  const reqBody: XenditInvoiceCallback = await req.json();
  const prisma = GetPrismaClient();

  const transactionStatus =
    reqBody.status == "PAID" ? TStatusEnum.PAID : TStatusEnum.FAILED;
  const updatedTransaction = await prisma.transaction.updateManyAndReturn({
    data: {
      status: transactionStatus,
      paid_at: reqBody.paid_at,
      payment_method: reqBody.payment_method,
      payment_channel: reqBody.payment_channel,
    },
    where: {
      id: reqBody.external_id,
    },
  });
  if (updatedTransaction.length < 1) {
    console.error("xendit.webhook: The selected transaction is not found.");
    return new NextResponse("The selected transaction is not found.", {
      status: 404,
    });
  } else if (updatedTransaction.length > 1) {
    console.error(
      "xendit.webhook: More-than-one transactions are updated at once."
    );
  }

  if (transactionStatus === TStatusEnum.PAID) {
    const theTransaction = await prisma.transaction.findFirst({
      where: { id: reqBody.external_id },
    });
    if (!theTransaction) {
      console.error("xendit.webhook: The selected transaction is not found.");
      return new NextResponse("The selected transaction is not found.", {
        status: 404,
      });
    }

    const theCohortPrice = await prisma.cohortPrice.findFirst({
      where: { id: theTransaction.item_id },
    });
    if (!theCohortPrice) {
      console.error("xendit.webhook: The selected cohort price is not found.");
      return new NextResponse("The selected cohort price is not found.", {
        status: 404,
      });
    }

    if (theTransaction.category === CategoryEnum.COHORT) {
      try {
        await prisma.userCohort.create({
          data: {
            user_id: theTransaction.user_id,
            cohort_id: theCohortPrice.cohort_id,
          },
        });
      } catch (e) {
        // The row might already exists.
      }
    }
  }

  return new NextResponse("OK", {
    status: 200,
  });
}
