import DashboardChampionAILN from "@/components/pages/DashboardChampionAILN";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Champion",
};

export default async function ChampionPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const ailMember = (await trpc.auth.checkAilMember()).ail_member;
  if (!ailMember || ailMember.role !== "CHAMPION") {
    return <AppPageState variant="FORBIDDEN" />;
  }

  return <DashboardChampionAILN sessionToken={sessionToken} />;
}
