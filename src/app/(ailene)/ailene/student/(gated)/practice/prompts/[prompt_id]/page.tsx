import SubmitPromptPracticeStudentAILN from "@/components/pages/SubmitPromptPracticeStudentAILN";
import { setSessionToken } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Kerjakan Prompt",
};

export default async function StudentPromptPracticePage({
  params,
}: {
  params: Promise<{ prompt_id: string }>;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const { prompt_id } = await params;
  const promptIdNum = Number(prompt_id);

  return (
    <SubmitPromptPracticeStudentAILN
      sessionToken={sessionToken}
      promptId={promptIdNum}
    />
  );
}
