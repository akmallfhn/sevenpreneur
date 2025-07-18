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

  // --- Check User Session
  let userData:
    | Awaited<ReturnType<typeof trpc.auth.checkSession>>["user"]
    | null = null;
  if (sessionToken) {
    setSessionToken(sessionToken);
    const checkUser = await trpc.auth.checkSession();
    userData = checkUser.user;
  }

  return (
    <div className="flex flex-col">
      <HeaderNavbarSVP
        userAvatar={userData?.avatar ?? null}
        userRole={userData?.role_id}
        isLoggedIn={!!userData}
      />
      <TransactionStatusSVP />
    </div>
  );
}
