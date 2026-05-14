import SidebarSponsorAILN from "@/components/navigations/SidebarSponsorAILN";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export default async function SponsorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const ailMember = (await trpc.auth.checkAilMember()).ail_member;
  if (!ailMember || ailMember.role !== "SPONSOR") {
    return <AppPageState variant="FORBIDDEN" />;
  }

  return (
    <>
      <SidebarSponsorAILN sessionToken={sessionToken} />
      {children}
    </>
  );
}
