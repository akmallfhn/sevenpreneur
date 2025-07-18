import HeaderNavbarSVP from "@/app/components/navigations/HeaderNavbarSVP";
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
  const transactionId = parseInt(transaction_id);
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  // --- Redirect if not login
  if (!sessionToken) {
    redirect(`/auth/login?redirectTo=/transactions/${transaction_id}`);
  }

  return <TransactionStatusSVP />;
}
