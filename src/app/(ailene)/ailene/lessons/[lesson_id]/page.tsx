import LessonDetailAilene from "@/components/pages/LessonDetailAilene";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Materi" };

interface Props {
  params: Promise<{ lesson_id: string }>;
}

export default async function LessonPage({ params }: Props) {
  const { lesson_id } = await params;
  return <LessonDetailAilene lessonId={Number(lesson_id)} />;
}
