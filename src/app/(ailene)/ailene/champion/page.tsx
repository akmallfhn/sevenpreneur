import DashboardChampionAILN from "@/components/pages/DashboardChampionAILN";
import { setSessionToken } from "@/trpc/server";
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

  return <DashboardChampionAILN sessionToken={sessionToken} />;
}
