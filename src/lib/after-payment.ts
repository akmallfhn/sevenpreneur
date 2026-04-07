import {
  CategoryEnum,
  Cohort,
  Event,
  Playlist,
  PrismaClient,
  Transaction,
  User,
} from "@/generated/prisma/client";
import { encodeSHA256 } from "./encode";
import { sendEmail } from "./mailtrap";

type TransactionWithUser = Transaction & {
  user: User;
};

export async function afterPaidTrigger(
  prisma: PrismaClient,
  transactionId: string
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
        "afterPaidTrigger: The selected cohort price is not found."
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
      "Business Education Program"
    );

    try {
      await sendEmail({
        mailRecipients: [theTransaction.user.email],
        mailSubject: welcomeMail.cohort.subject,
        mailBody: welcomeMail.cohort.body(theTransaction, theCohort),
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
      await sendEmail({
        mailRecipients: [theTransaction.user.email],
        mailSubject: welcomeMail.playlist.subject(thePlaylist),
        mailBody: welcomeMail.playlist.body(theTransaction, thePlaylist),
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
      await sendEmail({
        mailRecipients: [theTransaction.user.email],
        mailSubject: welcomeMail.event.subject(theEvent),
        mailBody: welcomeMail.event.body(theTransaction, theEvent),
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
      theTransaction.category
    );
  }

  return true;
}

async function notifyMetaEvent(
  transaction: TransactionWithUser,
  eventName: string,
  contentType: string,
  contentCategory: string
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
      }
    );
    const metaResult = await metaResponse.json();
    console.log("Meta Result:", metaResult);
  } catch (error) {
    console.error("afterPaidTrigger: Failed to notify Meta API", error);
  }
}

const welcomeMail = {
  cohort: {
    subject: "You’re In! Here’s What’s Next for Business Blueprint Program 🎉",
    body: (transaction: TransactionWithUser, cohort: Cohort) =>
      `Hi ${transaction.user.full_name},\n\n` +
      "Welcome aboard! 🎉\n" +
      `Terima kasih sudah melakukan checkout dan resmi bergabung di ${cohort.name}.\n\n` +
      "Di program ini, kamu akan mendapatkan:\n" +
      "✅ Sesi blueprint membahas Seven Framework dipandu oleh Professional Business Coach\n" +
      "✅ Akses ke komunitas entrepreneur inspiratif\n" +
      "✅ Insight & strategi langsung dari para praktisi\n" +
      "✅ Pembelajaran bisnis dengan integrasi penggunaan AI\n\n" +
      "✨ Jika kamu terdaftar dalam paket VIP, kamu akan mendapatkan kesempatan untuk:\n" +
      "🌟 Sesi offline di Jakarta\n" +
      "🌟 Sesi eksklusif bersama para top speaker and business leader\n" +
      "🌟 Intimate Dinner & Networking\n" +
      "🌟 Mentoring privat 1-on-1 dengan business coach\n\n" +
      "📌 What’s Next?\n" +
      "Klik link berikut untuk masuk ke LMS dan mulai akses materi:\n" +
      "https://agora.sevenpreneur.com/cohorts\n" +
      "Gunakan email ini untuk login ke LMS.\n\n" +
      "Di LMS kamu bisa menemukan:\n" +
      "• Jadwal lengkap program\n" +
      "• Materi & kurikulum terstruktur\n" +
      "• Info sesi live & recording\n" +
      "• Akses ke Q&A bersama mentor\n" +
      "…dan banyak lagi!\n\n" +
      "Sekali lagi, selamat datang di perjalanan bisnis bareng Sevenpreneur 🚀\n" +
      "This is the beginning of something big!\n\n" +
      "Cheers,\n" +
      "Sevenpreneur Team",
  },
  playlist: {
    subject: (playlist: Playlist) =>
      `You’re In! Access Your Learning Series: ${playlist.name} 🎉`,
    body: (transaction: TransactionWithUser, playlist: Playlist) =>
      `Hi ${transaction.user.full_name},\n\n` +
      "Congrats and welcome aboard! 🎉\n\n" +
      `Kamu baru saja berhasil membeli Learning Series: "${playlist.name}".\n` +
      "Sekarang kamu bisa langsung mulai belajar dan menikmati video-on-demand (VOD) di platform LMS Sevenpreneur.\n\n" +
      "Dalam Learning Series ini kamu akan mendapatkan:\n" +
      "✅ Materi pembelajaran bisnis yang praktis & actionable\n" +
      "✅ Insight dari para praktisi berpengalaman\n" +
      "✅ Akses kapan pun tanpa batas waktu (on-demand)\n\n" +
      "📌 What’s Next?\n" +
      "Klik link berikut untuk mulai belajar di LMS:\n" +
      "https://agora.sevenpreneur.com/playlists\n\n" +
      "Gunakan email ini untuk login ke LMS Sevenpreneur\n\n" +
      "Selamat belajar dan semoga materi ini membantu kamu bertumbuh sebagai entrepreneur yang lebih kuat 💪\n\n" +
      "Cheers,\n" +
      "Sevenpreneur Team",
  },
  event: {
    subject: (event: Event) =>
      `You’re In! Your Spot for ${event.name} is Confirmed 🎟️`,
    body: (transaction: TransactionWithUser, event: Event) =>
      `Hi ${transaction.user.full_name},\n\n` +
      `Kamu telah berhasil membeli tiket untuk event ${event.name} yang diselenggarakan oleh Sevenpreneur.\n` +
      "Kami sangat senang kamu bergabung dalam perjalanan ini!\n\n" +
      "Berikut informasi mengenai event:\n" +
      `• Event: ${event.name}\n` +
      (event.start_date ? `• Tanggal: ${event.start_date}\n` : "") +
      (event.location_name ? `• Lokasi: ${event.location_name}\n` : "") +
      "\n" +
      "📌 What’s Next?\n" +
      "Untuk pertanyaan seputar acara atau bantuan teknis, kamu dapat mengirim email ke event@sevenpreneur.com. 🙌\n\n" +
      "Terima kasih sudah jadi bagian dari komunitas Sevenpreneur. See you at the event! 🚀\n\n" +
      "Cheers,\n" +
      "Sevenpreneur Team",
  },
};
