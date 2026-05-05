import CoachingLab from "@/components/pages/CoachingLab";
import { setSessionToken } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = { title: "Coaching" };

export default async function CoachingPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);
  return <CoachingLab sessionToken={sessionToken} />;
}
