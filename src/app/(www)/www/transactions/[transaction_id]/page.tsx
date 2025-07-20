import TransactionStatusSVP from "@/app/components/templates/TransactionStatusSVP";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface TransactionDetailsPageProps {
  params: Promise<{ transaction_id: string }>;
}

export default async function TransactionDetailsPage({
  params,
}: TransactionDetailsPageProps) {
  const { transaction_id } = await params;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // --- Redirect if not login
  if (!sessionToken) {
    redirect(`/auth/login?redirectTo=/transactions/${transaction_id}`);
  }

  // --- Get User Data from Session Token
  setSessionToken(sessionToken);
  const userSession = (await trpc.auth.checkSession()).user;

  return (
    <TransactionStatusSVP
      transactionId={transaction_id}
      transactionStatus="PENDING"
      userName={userSession.full_name}
      createTransactionAt="2025-07-19 17:11:13.218+00"
      paidTransactionAt="2025-07-22 20:11:13.218+00"
      productPrice={100000}
    />
  );
}
