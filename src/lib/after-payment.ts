import {
  CategoryEnum,
  Cohort,
  Event,
  Playlist,
  PrismaClient,
  Transaction,
  User,
} from "@prisma/client";
import { render } from "@react-email/components";
import { InvoiceEmail } from "@/components/emails/InvoiceEmail";
import { encodeSHA256 } from "./encode";
import { sendEmail } from "./mailtrap";

type TransactionWithUser = Transaction & {
  user: User;
};

export async function afterPaidTrigger(
  prisma: PrismaClient,
  transactionId: string,
) {
  const theTransaction = await prisma.transaction.findFirst({
    where: { id: transactionId },
    include: { user: true },
  });
  if (!theTransaction) {
    console.error("afterPaidTrigger: The selected transaction is not found.");
    return { status: 404, message: "The selected transaction is not found." };
  }

  // Cohort //
  if (theTransaction.category === CategoryEnum.COHORT) {
    const theCohortPrice = await prisma.cohortPrice.findFirst({
      where: { id: theTransaction.item_id },
    });
    if (!theCohortPrice) {
      console.error(
        "afterPaidTrigger: The selected cohort price is not found.",
      );
      return {
        status: 404,
        message: "The selected cohort price is not found.",
      };
    }

    const theCohort = await prisma.cohort.findFirst({
      where: { id: theCohortPrice.cohort_id },
    });
    if (!theCohort) {
      console.error("afterPaidTrigger: The selected cohort is not found.");
      return { status: 404, message: "The selected cohort is not found." };
    }

    notifyMetaEvent(
      theTransaction,
      "Purchase",
      "service",
      "Business Education Program",
    );

    try {
      const invoiceHtml = await render(
        InvoiceEmail({
          firstName: theTransaction.user.full_name,
          userEmail: theTransaction.user.email,
          itemName: theCohort.name,
          itemType: "cohort",
          invoiceNumber: theTransaction.invoice_number,
          paidAt: theTransaction.paid_at?.toISOString() ?? new Date().toISOString(),
          paymentMethod: theTransaction.payment_method,
          paymentChannel: theTransaction.payment_channel,
          amount: Number(theTransaction.amount),
        }),
      );
      await sendEmail({
        mailRecipients: [theTransaction.user.email],
        mailSubject: `Invoice Pembelian #${theTransaction.invoice_number} — ${theCohort.name}`,
        mailHtml: invoiceHtml,
      });
    } catch (error) {
      console.error("afterPaidTrigger: Failed to send email", error);
    }

    try {
      await prisma.userCohort.create({
        data: {
          user_id: theTransaction.user_id,
          cohort_id: theCohortPrice.cohort_id,
          cohort_price_id: theCohortPrice.id,
        },
      });
    } catch {
      // The row might already exists.
    }
  }

  // Playlist //
  else if (theTransaction.category === CategoryEnum.PLAYLIST) {
    const thePlaylist = await prisma.playlist.findFirst({
      where: { id: theTransaction.item_id },
    });
    if (!thePlaylist) {
      console.error("afterPaidTrigger: The selected playlist is not found.");
      return {
        status: 404,
        message: "The selected playlist is not found.",
      };
    }

    try {
      const invoiceHtml = await render(
        InvoiceEmail({
          firstName: theTransaction.user.full_name,
          userEmail: theTransaction.user.email,
          itemName: thePlaylist.name,
          itemType: "playlist",
          invoiceNumber: theTransaction.invoice_number,
          paidAt: theTransaction.paid_at?.toISOString() ?? new Date().toISOString(),
          paymentMethod: theTransaction.payment_method,
          paymentChannel: theTransaction.payment_channel,
          amount: Number(theTransaction.amount),
        }),
      );
      await sendEmail({
        mailRecipients: [theTransaction.user.email],
        mailSubject: `Invoice Pembelian #${theTransaction.invoice_number} — ${thePlaylist.name}`,
        mailHtml: invoiceHtml,
      });
    } catch (error) {
      console.error("afterPaidTrigger: Failed to send email", error);
    }

    try {
      await prisma.userPlaylist.create({
        data: {
          user_id: theTransaction.user_id,
          playlist_id: thePlaylist.id,
        },
      });
    } catch {
      // The row might already exists.
    }
  }

  // Event //
  else if (theTransaction.category === CategoryEnum.EVENT) {
    const theEventPrice = await prisma.eventPrice.findFirst({
      where: { id: theTransaction.item_id },
    });
    if (!theEventPrice) {
      console.error("afterPaidTrigger: The selected event price is not found.");
      return { status: 404, message: "The selected event price is not found." };
    }

    const theEvent = await prisma.event.findFirst({
      where: { id: theEventPrice.event_id },
    });
    if (!theEvent) {
      console.error("afterPaidTrigger: The selected event is not found.");
      return { status: 404, message: "The selected event is not found." };
    }

    notifyMetaEvent(theTransaction, "PurchaseEvent", "event", "Business Event");

    try {
      const invoiceHtml = await render(
        InvoiceEmail({
          firstName: theTransaction.user.full_name,
          userEmail: theTransaction.user.email,
          itemName: theEvent.name,
          itemType: "event",
          invoiceNumber: theTransaction.invoice_number,
          paidAt: theTransaction.paid_at?.toISOString() ?? new Date().toISOString(),
          paymentMethod: theTransaction.payment_method,
          paymentChannel: theTransaction.payment_channel,
          amount: Number(theTransaction.amount),
        }),
      );
      await sendEmail({
        mailRecipients: [theTransaction.user.email],
        mailSubject: `Invoice Pembelian #${theTransaction.invoice_number} — ${theEvent.name}`,
        mailHtml: invoiceHtml,
      });
    } catch (error) {
      console.error("afterPaidTrigger: Failed to send email", error);
    }

    try {
      await prisma.userEvent.create({
        data: {
          user_id: theTransaction.user_id,
          event_id: theEventPrice.event_id,
        },
      });
    } catch {
      // The row might already exists.
    }
  }

  // Unsupported Category //
  else {
    console.warn(
      "afterPaidTrigger: Unsupported category",
      theTransaction.category,
    );
  }

  return true;
}

async function notifyMetaEvent(
  transaction: TransactionWithUser,
  eventName: string,
  contentType: string,
  contentCategory: string,
) {
  try {
    const metaResponse = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_PIXEL_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: eventName,
              event_time: Math.floor(Date.now() / 1000),
              event_id: transaction.user_id,
              user_data: {
                external_id: encodeSHA256(transaction.user_id),
                fn: encodeSHA256(transaction.user.full_name),
                em: encodeSHA256(transaction.user.email),
                ph: encodeSHA256(`62${transaction.user.phone_number}`),
              },
              custom_data: {
                currency: "IDR",
                value: transaction.amount,
                content_ids: [transaction.item_id],
                content_type: contentType,
                content_category: contentCategory,
                num_items: 1,
              },
            },
          ],
        }),
      },
    );
    const metaResult = await metaResponse.json();
    console.log("Meta Result:", metaResult);
  } catch (error) {
    console.error("afterPaidTrigger: Failed to notify Meta API", error);
  }
}
