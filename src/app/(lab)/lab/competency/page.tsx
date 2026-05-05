import CompetencyLab from "@/components/pages/CompetencyLab";
import { setSessionToken } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = { title: "Competency" };

export default async function CompetencyPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);
  return <CompetencyLab sessionToken={sessionToken} />;
}
