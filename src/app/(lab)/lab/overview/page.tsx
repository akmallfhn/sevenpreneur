import OverviewLab from "@/components/pages/OverviewLab";
import { setSessionToken } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = { title: "Executive Overview" };

export default async function OverviewPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);
  return <OverviewLab sessionToken={sessionToken} />;
}
