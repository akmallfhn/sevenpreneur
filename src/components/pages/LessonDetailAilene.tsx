"use client";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import { trpc } from "@/trpc/client";
import {
  BookCheck,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { marked } from "marked";
import Link from "next/link";
import { useMemo } from "react";
import AppButton from "../buttons/AppButton";

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations",
  2: "Techniques",
  3: "Advanced",
  4: "Strategic",
};

interface LessonDetailAileneProps {
  lessonId: number;
}

export default function LessonDetailAilene(props: LessonDetailAileneProps) {
  const { isCollapsed } = useSidebar();

  const { data, isLoading } = trpc.ailene.readLessonForUser.useQuery({
    id: props.lessonId,
  });

  const { data: allLessonsData } =
    trpc.ailene.listLessonsWithProgress.useQuery();

  const lesson = data?.lesson;
  const progress = lesson?.user_progress[0];
  const isCompleted = !!progress?.completed_at;
  const hasQuiz = (lesson?._count.quiz_questions ?? 0) > 0;

  const { prevLesson, nextLesson } = useMemo(() => {
    const list = allLessonsData?.list ?? [];
    const idx = list.findIndex((l) => l.id === props.lessonId);
    return {
      prevLesson: idx > 0 ? list[idx - 1] : null,
      nextLesson: idx !== -1 && idx < list.length - 1 ? list[idx + 1] : null,
    };
  }, [allLessonsData, props.lessonId]);

  const renderedContent = useMemo(() => {
    if (!lesson?.content) return "";
    return marked.parse(lesson.content) as string;
  }, [lesson?.content]);

  return (
    <div
      className={`page-root hidden w-full min-h-screen bg-white overflow-y-auto lg:flex lg:justify-center ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      <div className="w-full max-w-[calc(100%-4rem)] py-10 flex flex-col items-center">
        <div className="w-full flex flex-col gap-10">
          {/* Back */}
          <Link href="/lessons">
            <AppButton variant="light" size="small">
              <ChevronLeft className="size-3.5" />
              Semua Materi
            </AppButton>
          </Link>

          {isLoading && (
            <div className="flex items-center justify-center py-20 text-emphasis">
              <Loader2 className="animate-spin size-6" />
            </div>
          )}

          {!isLoading && lesson && (
            <>
              {/* Header */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bodycopy text-xs font-semibold text-primary bg-primary-muted px-2.5 py-1 rounded-full flex items-center gap-1">
                    <BookOpen className="size-3" />
                    Level {lesson.level} — {LEVEL_LABELS[lesson.level]}
                  </span>
                  <span className="font-bodycopy text-xs font-semibold text-tertiary bg-tertiary-muted px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="size-3" />+{lesson.xp_reward} XP
                  </span>
                  {isCompleted && (
                    <span className="font-bodycopy text-xs font-semibold text-success bg-success-background px-2.5 py-1 rounded-full flex items-center gap-1">
                      <BookCheck className="size-3" />
                      Selesai · {progress?.score}%
                    </span>
                  )}
                </div>
                <h1 className="font-brand font-bold text-4xl text-sevenpreneur-coal leading-tight">
                  {lesson.title}
                </h1>
                {lesson.description && (
                  <p className="font-bodycopy text-emphasis text-lg leading-relaxed">
                    {lesson.description}
                  </p>
                )}
              </div>

              <div className="h-px w-full bg-sevenpreneur-ash" />

              {/* Markdown content */}
              <div
                className="prose prose-base max-w-none font-bodycopy
                  prose-headings:font-brand prose-headings:text-sevenpreneur-coal prose-headings:font-bold
                  prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-4
                  prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-3
                  prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-2
                  prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-1
                  prose-p:text-sevenpreneur-coal prose-p:leading-[1.85] prose-p:text-base
                  prose-li:text-sevenpreneur-coal prose-li:leading-[1.85]
                  prose-strong:font-semibold prose-strong:text-sevenpreneur-coal
                  prose-code:bg-section-background prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary-muted/30 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
              />

              <div className="h-px w-full bg-sevenpreneur-ash" />

              {/* Quiz CTA */}
              {hasQuiz ? (
                <div className="flex flex-col gap-4 p-6 rounded-xl border border-sevenpreneur-ash bg-section-background">
                  <div className="flex flex-col gap-1.5">
                    <p className="font-bodycopy font-semibold text-base text-sevenpreneur-coal">
                      {isCompleted
                        ? "Kamu sudah menyelesaikan quiz ini."
                        : "Siap uji pemahaman kamu?"}
                    </p>
                    <p className="font-bodycopy text-sm text-emphasis">
                      Kerjakan {lesson._count.quiz_questions} soal quiz · Nilai
                      minimum 70% untuk lulus · Dapatkan +{lesson.xp_reward} XP
                    </p>
                  </div>
                  <Link href={`/lessons/${lesson.id}/quiz`}>
                    <AppButton
                      variant={isCompleted ? "primarySoft" : "primary"}
                      size="medium"
                    >
                      {isCompleted ? "Coba Lagi" : "Mulai Quiz"}
                    </AppButton>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2 p-6 rounded-xl border border-sevenpreneur-ash bg-section-background">
                  <p className="font-bodycopy text-sm text-emphasis">
                    Materi ini belum memiliki quiz.
                  </p>
                </div>
              )}

              {/* Prev / Next Navigation */}
              {(prevLesson || nextLesson) && (
                <>
                  <div className="h-px w-full bg-sevenpreneur-ash" />
                  <div className="flex items-stretch gap-4 pb-4">
                    {prevLesson ? (
                      <Link
                        href={`/lessons/${prevLesson.id}`}
                        className="flex-1"
                      >
                        <div className="flex flex-col gap-1.5 p-5 rounded-xl border border-sevenpreneur-ash bg-section-background hover:border-primary/40 hover:bg-primary-muted/20 transition-colors h-full">
                          <span className="font-bodycopy text-xs text-emphasis flex items-center gap-1">
                            <ChevronLeft className="size-3.5" />
                            Sebelumnya
                          </span>
                          <p className="font-brand font-semibold text-sm text-sevenpreneur-coal leading-snug">
                            {prevLesson.title}
                          </p>
                          <span className="font-bodycopy text-xs text-emphasis">
                            Level {prevLesson.level} —{" "}
                            {LEVEL_LABELS[prevLesson.level]}
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex-1" />
                    )}
                    {nextLesson ? (
                      <Link
                        href={`/lessons/${nextLesson.id}`}
                        className="flex-1"
                      >
                        <div className="flex flex-col gap-1.5 p-5 rounded-xl border border-sevenpreneur-ash bg-section-background hover:border-primary/40 hover:bg-primary-muted/20 transition-colors h-full items-end text-right">
                          <span className="font-bodycopy text-xs text-emphasis flex items-center gap-1">
                            Selanjutnya
                            <ChevronRight className="size-3.5" />
                          </span>
                          <p className="font-brand font-semibold text-sm text-sevenpreneur-coal leading-snug">
                            {nextLesson.title}
                          </p>
                          <span className="font-bodycopy text-xs text-emphasis">
                            Level {nextLesson.level} —{" "}
                            {LEVEL_LABELS[nextLesson.level]}
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <div className="flex-1" />
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
