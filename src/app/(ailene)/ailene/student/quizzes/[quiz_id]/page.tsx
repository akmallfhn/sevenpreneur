import QuizDetailsAILN from "@/components/pages/QuizDetailsAILN";
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
  const { quiz_id: quizId } = await params;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (!sessionToken) return null;
  setSessionToken(sessionToken);

  if (!quizId) {
    return <AppPageState variant="NOT_FOUND" />;
  }

  const ailMember = (await trpc.auth.checkAilMember()).ail_member;
  if (
    !ailMember ||
    (ailMember.role !== "STUDENT" && ailMember.role !== "CHAMPION")
  ) {
    return <AppPageState variant="FORBIDDEN" />;
  }

  return <QuizDetailsAILN sessionToken={sessionToken} quizId={quizId} />;
}
