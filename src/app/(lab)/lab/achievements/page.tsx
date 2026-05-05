import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import AchievementsLab from "@/components/pages/AchievementsLab";

export const metadata: Metadata = { title: "Achievements" };

export default async function AchievementsPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);
  return <AchievementsLab sessionToken={sessionToken} />;
}
