import TransactionStatusDetailsSVP from "@/app/components/pages/TransactionStatusDetailsSVP";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

interface TransactionDetailsPageProps {
  params: Promise<{ transaction_id: string }>;
}

export async function generateMetadata({
  params,
}: TransactionDetailsPageProps): Promise<Metadata> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  const { transaction_id } = await params;

  // --- Get Data
  setSessionToken(sessionToken!);
  const transactionDetailsData = (
    await trpc.read.transaction({
      id: transaction_id,
    })
  ).transaction;

  return {
    title: "Transaction Detail | Sevenpreneur",
    description:
      "Detail transaksi tersedia di sini. Cek status, nominal, dan informasi produk dengan mudah.",
    authors: [{ name: "Sevenpreneur Team" }],
    publisher: "Sevenpreneur",
    referrer: "origin-when-cross-origin",
    alternates: {
      canonical: `/transactions/${transactionDetailsData.id}`,
    },
    openGraph: {
      title: "Transactions | Sevenpreneur",
      description:
        "Detail transaksi tersedia di sini. Cek status, nominal, dan informasi produk dengan mudah.",
      url: `/transactions/${transactionDetailsData.id}`,
      siteName: "Sevenpreneur",
      images: [
        {
          url: "https://static.wixstatic.com/media/02a5b1_d0f0ef7195ce4fa0ada080a1bd432f17~mv2.webp",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Transactions | Sevenpreneur",
      description:
        "Detail transaksi tersedia di sini. Cek status, nominal, dan informasi produk dengan mudah.",
      images:
        "https://static.wixstatic.com/media/02a5b1_d0f0ef7195ce4fa0ada080a1bd432f17~mv2.webp",
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function TransactionDetailsPage({
  params,
}: TransactionDetailsPageProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  const { transaction_id } = await params;

  // --- Redirect if not login
  if (!sessionToken) {
    redirect(`/auth/login?redirectTo=/transactions/${transaction_id}`);
  }

  // Redirect 404 if invalid transaction_id
  if (!transaction_id || transaction_id.length < 21) {
    return notFound();
  }

  // --- Get Data
  setSessionToken(sessionToken);
  let transactionDetailsData;
  try {
    transactionDetailsData = (
      await trpc.read.transaction({
        id: transaction_id,
      })
    ).transaction;
  } catch (err) {
    return notFound();
  }

  return (
    <TransactionStatusDetailsSVP
      transactionId={transaction_id}
      transactionStatus={transactionDetailsData.status}
      invoiceNumber={transactionDetailsData.invoice_number}
      invoiceURL={transactionDetailsData.invoice_url}
      productCategory={transactionDetailsData.category}
      productPrice={transactionDetailsData.product_price.toNumber()}
      productAdminFee={transactionDetailsData.product_admin_fee.toNumber()}
      productVAT={transactionDetailsData.product_vat.toNumber()}
      productTotalAmount={transactionDetailsData.product_total_amount.toNumber()}
      playlistId={transactionDetailsData.playlist_id}
      playlistName={transactionDetailsData.playlist_name}
      playlistImage={transactionDetailsData.playlist_image}
      playlistSlug={transactionDetailsData.playlist_slug_url}
      playlistTotalVideo={transactionDetailsData.playlist_total_video}
      cohortId={transactionDetailsData.cohort_id}
      cohortName={transactionDetailsData.cohort_name}
      cohortImage={transactionDetailsData.cohort_image}
      cohortSlug={transactionDetailsData.cohort_slug}
      cohortPriceName={transactionDetailsData.cohort_price_name}
      paymentChannelName={transactionDetailsData.payment_channel_name}
      paymentChannelImage={transactionDetailsData.payment_channel_image}
      userName={transactionDetailsData.user_full_name}
      createTransactionAt={transactionDetailsData.created_at.toISOString()}
      paidTransactionAt={transactionDetailsData.paid_at?.toISOString()}
    />
  );
}
