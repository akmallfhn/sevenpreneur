import TransactionCardItemSVP from "@/app/components/items/TransactionCardItemSVP";
import ForbiddenComponent from "@/app/components/state/403Forbidden";
import EmptyTransactions from "@/app/components/state/EmptyTransactions";
import { setSessionToken, trpc } from "@/trpc/server";
import dayjs from "dayjs";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Transactions | Sevenpreneur",
  description:
    "Cek status pesanan dan riwayat pembayaran di halaman transaksi. Mudah, aman, dan transparan untuk semua pembelian",
  authors: [{ name: "Sevenpreneur Team" }],
  publisher: "Sevenpreneur",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "/transactions",
  },
  openGraph: {
    title: "Transactions | Sevenpreneur",
    description:
      "Cek status pesanan dan riwayat pembayaran di halaman transaksi. Mudah, aman, dan transparan untuk semua pembelian",
    url: "/transactions",
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
      "Cek status pesanan dan riwayat pembayaran di halaman transaksi. Mudah, aman, dan transparan untuk semua pembelian",
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

export default async function TransactionsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // --- Redirect if not login
  if (!sessionToken) {
    redirect(`/auth/login?redirectTo=/transactions/`);
  }

  // --- Get User from Session Token
  setSessionToken(sessionToken);
  const userSession = (await trpc.auth.checkSession()).user;

  // --- Get Data Transactions
  const transactionDataRaw = await trpc.list.transactions({
    user_id: userSession.id,
  });
  const transactionData = transactionDataRaw.list.map((post) => ({
    ...post,
    amount:
      typeof post.total_amount === "object" && "toNumber" in post.total_amount
        ? post.total_amount.toNumber()
        : post.total_amount,
    paid_at: post.paid_at ? post.paid_at.toISOString() : null,
    created_at: post.created_at ? post.created_at.toISOString() : null,
  }));

  console.log("transactions:", transactionData);

  return (
    <div className="flex flex-col w-full bg-white px-5 py-5 pb-20 gap-5 lg:px-0 lg:mx-auto lg:w-full lg:max-w-[960px] xl:max-w-[1208px]">
      <h1 className="font-bold font-ui text-xl text-black">
        Transaction History
      </h1>
      {transactionData.length === 0 && <EmptyTransactions />}
      <div className="flex flex-col gap-4">
        {transactionData
          .sort(
            (a, b) => dayjs(b.paid_at).valueOf() - dayjs(a.paid_at).valueOf()
          )
          .map((post, index) => (
            <TransactionCardItemSVP
              key={index}
              transactionId={post.id}
              transactionDate={post.created_at}
              transactionStatus={post.status}
              productCategory={post.category}
              playlistId={post.playlist_id}
              playlistImage={post.playlist_image}
              playlistName={post.playlist_name}
              playlistSlug={post.playlist_slug_url}
              playlistTotalVideo={post.playlist_total_video}
              cohortId={post.cohort_id}
              cohortImage={post.cohort_image}
              cohortName={post.cohort_name}
              cohortSlug={post.cohort_slug}
              cohortPriceName={post.cohort_price_name}
              totalTransactionAmount={post.amount}
              invoiceURL={post.invoice_url}
            />
          ))}
      </div>
    </div>
  );
}
