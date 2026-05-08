import BARIAssessmentSVP from "@/components/pages/BARIAssessmentSVP";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Begin Assessment — BARI | Sevenpreneur",
  description:
    "Take the Business AI Readiness Index assessment. Six-pillar diagnostic that tells you where your business stands on AI readiness.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BARIAssessmentPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    redirect(`/auth/login?redirectTo=/business-ai-readiness-index/assesments`);
  }
  setSessionToken(sessionToken);

  const industriesRes = await trpc.list.industries();

  return (
    <BARIAssessmentSVP
      sessionToken={sessionToken}
      industries={industriesRes.list ?? []}
    />
  );
}
