import SubmitUseCasePracticeStudentAILN from "@/components/pages/SubmitUseCasePracticeStudentAILN";
import { setSessionToken } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Kerjakan Use Case",
};

export default async function StudentUseCasePracticePage({
  params,
}: {
  params: Promise<{ use_case_id: string }>;
}) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  const { use_case_id } = await params;
  const useCaseIdNum = Number(use_case_id);

  return (
    <SubmitUseCasePracticeStudentAILN
      sessionToken={sessionToken}
      useCaseId={useCaseIdNum}
    />
  );
}
