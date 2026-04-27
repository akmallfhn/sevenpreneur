import AdminSessionsAilene from "@/components/pages/AdminSessionsAilene";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = { title: "Kelola Sessions" };

export default async function AdminSessionsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const checkUser = (await trpc.auth.checkSession()).user;
  if (checkUser.role_id !== 0) return <AppPageState variant="FORBIDDEN" />;

  return <AdminSessionsAilene sessionToken={sessionToken} />;
}
