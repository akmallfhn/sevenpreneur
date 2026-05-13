import SidebarChampionAILN from "@/components/navigations/SidebarChampionAILN";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export default async function ChampionLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value ?? "";

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const ailMember = (await trpc.auth.checkAilMember()).ail_member;
  if (!ailMember || ailMember.role !== "CHAMPION") {
    return <AppPageState variant="FORBIDDEN" />;
  }

  return (
    <>
      <SidebarChampionAILN sessionToken={sessionToken} />
      {children}
    </>
  );
}
