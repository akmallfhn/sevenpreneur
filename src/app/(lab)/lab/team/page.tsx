import TeamLab from "@/components/pages/TeamLab";
import { setSessionToken } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = { title: "Team" };

export default async function TeamPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);
  return <TeamLab sessionToken={sessionToken} />;
}
