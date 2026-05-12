import QuizAILN from "@/components/pages/QuizAILN";
import AppPageState from "@/components/states/AppPageState";
import { setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Quiz",
};

export default async function QuizPage({
  params,
}: {
  params: Promise<{ quiz_id: string }>;
}) {
  const { quiz_id } = await params;
  const quizId = parseInt(quiz_id, 10);

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  if (Number.isNaN(quizId)) {
    return <AppPageState variant="NOT_FOUND" />;
  }

  const ailMember = (await trpc.auth.checkAilMember()).ail_member;
  if (
    !ailMember ||
    (ailMember.role !== "STUDENT" && ailMember.role !== "CHAMPION")
  ) {
    return <AppPageState variant="FORBIDDEN" />;
  }

  return <QuizAILN sessionToken={sessionToken} quizId={quizId} />;
}
