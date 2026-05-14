import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AILNRootPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const ailMember = (await trpc.auth.checkAilMember()).ail_member;
  if (!ailMember) return <AppPageState variant="FORBIDDEN" />;

  if (ailMember.role === "CHAMPION") redirect("/champion");
  if (ailMember.role === "STUDENT") redirect("/student");
  if (ailMember.role === "SPONSOR") redirect("/sponsor");

  return <AppPageState variant="FORBIDDEN" />;
}
