import TransactionCardItemSVP from "@/app/components/items/TransactionCardItemSVP";
import { setSessionToken, trpc } from "@/trpc/server";
import dayjs from "dayjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  }));

  return (
    <div className="flex flex-col w-full bg-white pb-36 p-5 gap-5 lg:mx-auto lg:w-full lg:max-w-[960px] xl:max-w-[1208px]">
      <h1 className="font-bold font-ui text-xl text-black">
        Transaction History
      </h1>
      <div className="flex flex-col gap-4">
        {transactionData
          .sort(
            (a, b) => dayjs(b.paid_at).valueOf() - dayjs(a.paid_at).valueOf()
          )
          .map((post, index) => (
            <TransactionCardItemSVP
              key={index}
              transactionId={post.id}
              transactionDate={post.paid_at} // TO DO: Created At
              transactionStatus={post.status}
              totalTransactionAmount={post.amount}
            />
          ))}
      </div>
    </div>
  );
}
