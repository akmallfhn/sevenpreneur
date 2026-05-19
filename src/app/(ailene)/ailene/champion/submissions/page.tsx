import SubmissionsChampionAILN from "@/components/pages/SubmissionsChampionAILN";
import { setSessionToken } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Submissions",
};

export default async function ChampionSubmissionsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  return <SubmissionsChampionAILN sessionToken={sessionToken} />;
}
