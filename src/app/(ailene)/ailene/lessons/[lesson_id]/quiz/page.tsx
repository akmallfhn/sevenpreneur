import QuizAilene from "@/components/pages/QuizAilene";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Quiz" };

interface Props {
  params: Promise<{ lesson_id: string }>;
}

export default async function QuizPage({ params }: Props) {
  const { lesson_id } = await params;
  return <QuizAilene lessonId={Number(lesson_id)} />;
}
