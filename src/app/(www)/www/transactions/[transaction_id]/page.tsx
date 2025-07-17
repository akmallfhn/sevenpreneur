import HeaderNavbarSVP from "@/app/components/navigations/HeaderNavbarSVP";
import TransactionStatusSVP from "@/app/components/templates/TransactionStatusSVP";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";

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

  let userData:
    | Awaited<ReturnType<typeof trpc.auth.checkSession>>["user"]
    | null = null;

  // --- Check User Session
  if (sessionToken) {
    setSessionToken(sessionToken);
    const checkUser = await trpc.auth.checkSession();
    userData = checkUser.user;
  }

  return (
    <div className="flex flex-col">
      <HeaderNavbarSVP
        userAvatar={userData?.avatar ?? null}
        isLoggedIn={!!userData}
      />
      <TransactionStatusSVP />
    </div>
  );
}
