import { encodeSHA256 } from "@/lib/encode";
import { sendEmail } from "@/lib/mailtrap";
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
    reqBody.status === "PAID" ? TStatusEnum.PAID : TStatusEnum.FAILED;
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
      include: { user: true },
    });
    if (!theTransaction) {
      console.error("xendit.webhook: The selected transaction is not found.");
      return new NextResponse("The selected transaction is not found.", {
        status: 404,
      });
    }

    if (theTransaction.category === CategoryEnum.COHORT) {
      const theCohortPrice = await prisma.cohortPrice.findFirst({
        where: { id: theTransaction.item_id },
      });
      if (!theCohortPrice) {
        console.error(
          "xendit.webhook: The selected cohort price is not found."
        );
        return new NextResponse("The selected cohort price is not found.", {
          status: 404,
        });
      }

      try {
        const metaResponse = await fetch(
          `https://graph.facebook.com/v18.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_PIXEL_ACCESS_TOKEN}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: [
                {
                  event_name: "Purchase",
                  event_time: Math.floor(Date.now() / 1000),
                  event_id: theTransaction.user_id,
                  user_data: {
                    external_id: encodeSHA256(theTransaction.user_id),
                    fn: encodeSHA256(theTransaction.user.full_name),
                    em: encodeSHA256(theTransaction.user.email),
                    ph: encodeSHA256(`62${theTransaction.user.phone_number}`),
                  },
                  custom_data: {
                    currency: "IDR",
                    value: theTransaction.amount,
                    content_ids: [theTransaction.item_id],
                    content_type: "service",
                    content_category: "Business Education Program",
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
        console.error("Failed to response Meta API:", error);
      }

      try {
        await sendEmail({
          mailRecipients: [theTransaction.user.email],
          mailSubject:
            "You’re In! Here’s What’s Next for Business Blueprint Program 🎉",
          mailBody:
            `Hi ${theTransaction.user.full_name},\n\n` +
            "Welcome aboard! 🎉\n" +
            "Terima kasih sudah melakukan checkout dan resmi bergabung di Sevenpreneur Business Blueprint Program Batch 7.\n\n" +
            "Di program ini, kamu akan mendapatkan:\n" +
            "✅ 7 sesi blueprint membahas Seven Framework, dipandu oleh Professional Business Coach\n" +
            "✅ Akses ke komunitas entrepreneur inspiratif\n" +
            "✅ Insight & strategi langsung dari para praktisi\n" +
            "✅ Pembelajaran bisnis dengan integrasi penggunaan AI\n\n" +
            "✨ Jika kamu terdaftar dalam paket VIP, kamu akan mendapatkan kesempatan untuk:\n" +
            "🌟 Sesi offline di Jakarta\n" +
            "🌟 Sesi eksklusif bersama Ahok, Tom Lembong, dan Wafa Taftazani\n" +
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
        });
      } catch (error) {
        console.error("Failed to response email", error);
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
    } else if (theTransaction.category === CategoryEnum.EVENT) {
      const theEventPrice = await prisma.eventPrice.findFirst({
        where: { id: theTransaction.item_id },
      });
      const theEvent = await prisma.event.findFirst({
        where: { id: theEventPrice?.event_id },
      });
      if (!theEventPrice) {
        console.error("xendit.webhook: The selected event price is not found.");
        return new NextResponse("The selected event price is not found.", {
          status: 404,
        });
      }

      try {
        const metaResponse = await fetch(
          `https://graph.facebook.com/v18.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_PIXEL_ACCESS_TOKEN}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: [
                {
                  event_name: "PurchaseEvent",
                  event_time: Math.floor(Date.now() / 1000),
                  event_id: theTransaction.user_id,
                  user_data: {
                    external_id: encodeSHA256(theTransaction.user_id),
                    fn: encodeSHA256(theTransaction.user.full_name),
                    em: encodeSHA256(theTransaction.user.email),
                    ph: encodeSHA256(`62${theTransaction.user.phone_number}`),
                  },
                  custom_data: {
                    currency: "IDR",
                    value: theTransaction.amount,
                    content_ids: [theTransaction.item_id],
                    content_type: "event",
                    content_category: "Business Event",
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
        console.error("Failed to response Meta API:", error);
      }

      try {
        await sendEmail({
          mailRecipients: [theTransaction.user.email],
          mailSubject: `You’re In! Your Spot for ${theEvent?.name} is Confirmed 🎟️`,
          mailBody:
            `Hi ${theTransaction.user.full_name},\n\n` +
            `Kamu telah berhasil membeli tiket untuk event ${theEvent?.name} yang diselenggarakan oleh Sevenpreneur.\n` +
            "Kami sangat senang kamu bergabung dalam perjalanan ini!\n\n" +
            "Berikut informasi mengenai event:\n" +
            `• Event: ${theEvent?.name}\n` +
            (theEvent?.start_date
              ? `• Tanggal: ${theEvent.start_date}\n`
              : "") +
            (theEvent?.location_name
              ? `• Lokasi: ${theEvent.location_name}\n`
              : "") +
            "\n" +
            "📌 What’s Next?\n" +
            "Untuk pertanyaan seputar acara atau bantuan teknis, kamu dapat mengirim email ke event@sevenpreneur.com. 🙌\n\n" +
            "Terima kasih sudah jadi bagian dari komunitas Sevenpreneur. See you at the event! 🚀\n\n" +
            "Cheers,\n" +
            "Sevenpreneur Team",
        });
      } catch (error) {
        console.error("Failed to send email", error);
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
    } else if (theTransaction.category === CategoryEnum.PLAYLIST) {
      const thePlaylist = await prisma.playlist.findFirst({
        where: { id: theTransaction.item_id },
      });
      if (!thePlaylist) {
        console.error("xendit.webhook: The selected playlist is not found.");
        return new NextResponse("The selected playlist is not found.", {
          status: 404,
        });
      }

      try {
        await sendEmail({
          mailRecipients: [theTransaction.user.email],
          mailSubject: `You’re In! Access Your Learning Series: ${thePlaylist.name} 🎉`,
          mailBody:
            `Hi ${theTransaction.user.full_name},\n\n` +
            "Congrats and welcome aboard! 🎉\n\n" +
            `Kamu baru saja berhasil membeli Learning Series: "${thePlaylist.name}".\n` +
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
        });
      } catch (error) {
        console.error("Failed to response email", error);
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
  }

  return new NextResponse("OK", {
    status: 200,
  });
}
