"use client";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import QuizAttemptAILN, {
  type QuizDetailsData,
} from "@/components/pages/QuizAttemptAILN";
import QuizResultAILN from "@/components/pages/QuizResultAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { setSessionToken, trpc } from "@/trpc/client";
import { useEffect } from "react";

interface QuizDetailsAILNProps {
  sessionToken: string;
  quizId: string;
}

export default function QuizDetailsAILN({
  sessionToken,
  quizId,
}: QuizDetailsAILNProps) {
  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const { data, isLoading, isError } = trpc.ailene.list.quizQuestions.useQuery({
    quiz_id: quizId,
  });

  const d = data as unknown as QuizDetailsData | undefined;

  if (isLoading) {
    return (
      <PageContainerAILN>
        <AppLoadingComponents />
      </PageContainerAILN>
    );
  }
  if (isError || !d?.quiz) {
    return (
      <PageContainerAILN>
        <AppErrorComponents />
      </PageContainerAILN>
    );
  }

  if (d.progress) {
    return <QuizResultAILN quizId={quizId} />;
  }
  return <QuizAttemptAILN quizId={quizId} data={d} />;
}
