import DashboardSponsorAILN from "@/components/pages/DashboardSponsorAILN";
import { setSessionToken } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Sponsor",
};

export default async function SponsorPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  return <DashboardSponsorAILN sessionToken={sessionToken} />;
}
