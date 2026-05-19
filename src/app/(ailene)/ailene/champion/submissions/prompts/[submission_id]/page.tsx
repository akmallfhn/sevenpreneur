import ReviewPromptSubmissionChampionAILN from "@/components/pages/ReviewPromptSubmissionChampionAILN";
import { setSessionToken } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Review Prompt",
};

export default async function ChampionPromptSubmissionPage({
  params,
}: {
  params: Promise<{ submission_id: string }>;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const { submission_id } = await params;
  const submissionId = Number(submission_id);

  return (
    <ReviewPromptSubmissionChampionAILN
      sessionToken={sessionToken}
      submissionId={submissionId}
    />
  );
}
