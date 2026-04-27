"use client";
import { trpc } from "@/trpc/client";
import { BookCheck, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import AppLoadingComponents from "../states/AppLoadingComponents";
import { marked } from "marked";
import Link from "next/link";
import { useMemo } from "react";
import AppButton from "../buttons/AppButton";
import PageContainerCMS from "./PageContainerCMS";
import styles from "./ailene-prose.module.css";

marked.setOptions({ gfm: true, breaks: false });

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations",
  2: "Techniques",
  3: "Advanced",
  4: "Strategic",
};

interface LessonDetailAileneProps {
  lessonId: number;
}

function getVideoEmbed(
  url: string
): { type: "iframe" | "video"; src: string } | null {
  if (!url) return null;
  try {
    // Already an embed URL — use directly
    if (
      url.includes("youtube.com/embed/") ||
      url.includes("player.vimeo.com/video/") ||
      url.includes("loom.com/embed/")
    ) {
      return { type: "iframe", src: url };
    }
    // YouTube watch or short
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch)
      return {
        type: "iframe",
        src: `https://www.youtube.com/embed/${ytMatch[1]}`,
      };
    // Vimeo watch
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch)
      return {
        type: "iframe",
        src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      };
    // Loom share
    const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
    if (loomMatch)
      return {
        type: "iframe",
        src: `https://www.loom.com/embed/${loomMatch[1]}`,
      };
    // Direct video file
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url))
      return { type: "video", src: url };
    return null;
  } catch {
    return null;
  }
}

export default function LessonDetailAilene(props: LessonDetailAileneProps) {
  const { data, isLoading } = trpc.ailene.readLessonForUser.useQuery({
    id: props.lessonId,
  });

  const { data: allLessonsData } =
    trpc.ailene.listLessonsWithProgress.useQuery();

  const lesson = data?.lesson;
  const progress = lesson?.progress[0];
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
  }, [lesson]);

  const videoEmbed = useMemo(() => {
    if (!lesson?.youtube_url) return null;
    return getVideoEmbed(lesson.youtube_url);
  }, [lesson]);

  const completionScore = progress?.score ?? 0;

  return (
    <PageContainerCMS className="overflow-y-auto">
      <div className="w-full max-w-[880px] mx-auto py-4 flex flex-col">
        {isLoading && <AppLoadingComponents />}

        {!isLoading && lesson && (
          <>
            {/* Meta pills */}
            <div className="flex items-center gap-2 flex-wrap mb-5">
              {/* Level chip */}
              <div className="inline-flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md px-2 py-1">
                <span className="flex items-center justify-center size-5 rounded-sm bg-primary text-white font-bodycopy font-bold text-[10px]">
                  L{lesson.level}
                </span>
                <span className="font-bodycopy text-[10px] font-medium text-emphasis uppercase tracking-widest">
                  Level
                </span>
                <span className="font-bodycopy text-[11px] font-bold text-sevenpreneur-coal dark:text-white">
                  {LEVEL_LABELS[lesson.level]}
                </span>
              </div>

              {/* XP chip */}
              <div className="inline-flex items-center gap-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-md px-2 py-1">
                <span className="flex items-center justify-center size-5 rounded-sm bg-primary text-white">
                  <Sparkles className="size-3" />
                </span>
                <span className="font-bodycopy text-[10px] font-medium text-emphasis uppercase tracking-widest">
                  XP
                </span>
                <span className="font-bodycopy text-[11px] font-bold text-sevenpreneur-coal dark:text-white">
                  +{lesson.xp_reward}
                </span>
              </div>

              {/* Completed chip */}
              {isCompleted && (
                <div className="inline-flex items-center gap-2 bg-success-background border border-success/20 rounded-lg px-2 py-1">
                  <span className="flex items-center justify-center size-5 rounded-md bg-success text-white">
                    <BookCheck className="size-3" />
                  </span>
                  <span className="font-bodycopy text-[10px] font-medium text-success uppercase tracking-widest">
                    Skor
                  </span>
                  <span className="font-bodycopy text-[11px] font-bold text-success">
                    {completionScore}%
                  </span>
                </div>
              )}
            </div>

            {/* Title — Fraunces */}
            <h1
              className="font-fraunces text-5xl font-medium leading-tight text-sevenpreneur-coal dark:text-white mb-4"
              style={{ letterSpacing: "-0.025em" }}
            >
              {lesson.title}
            </h1>

            {/* Deck */}
            {lesson.description && (
              <p className="font-fraunces text-xl text-emphasis leading-relaxed mb-8">
                {lesson.description}
              </p>
            )}

            {/* Stats strip */}
            <div className="grid grid-cols-3 border-t border-b border-[var(--card-border)] py-5 mb-8 gap-2">
              {/* XP */}
              <div className="flex flex-col gap-2 pr-4">
                <span className="inline-flex items-center gap-1 self-start font-bodycopy text-[10px] font-semibold uppercase tracking-widest text-primary bg-primary-muted px-2 py-0.5 rounded-full">
                  <Sparkles className="size-2.5" />
                  XP Reward
                </span>
                <span
                  className="font-fraunces text-3xl font-medium text-primary"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  +{lesson.xp_reward}
                  <span className="text-lg ml-1">XP</span>
                </span>
                <span className="font-bodycopy text-xs text-emphasis">
                  diperoleh saat lulus
                </span>
              </div>

              {/* Passing */}
              <div className="flex flex-col gap-2 border-l border-[var(--card-border)] px-4">
                <span className="inline-flex items-center gap-1 self-start font-bodycopy text-[10px] font-semibold uppercase tracking-widest text-emphasis bg-[var(--card-bg)] border border-[var(--card-border)] px-2 py-0.5 rounded-full">
                  Nilai Lulus
                </span>
                <span
                  className="font-fraunces text-3xl font-medium text-sevenpreneur-coal dark:text-white"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  70
                  <span className="text-lg ml-0.5">%</span>
                </span>
                <span className="font-bodycopy text-xs text-emphasis">
                  skor minimum
                </span>
              </div>

              {/* Progress */}
              <div className="flex flex-col gap-2 border-l border-[var(--card-border)] pl-4">
                <span
                  className={`inline-flex items-center gap-1 self-start font-bodycopy text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ${isCompleted ? "text-success bg-success-background border-success/20" : "text-emphasis bg-[var(--card-bg)] border-[var(--card-border)]"}`}
                >
                  {isCompleted ? (
                    <>
                      <BookCheck className="size-2.5" />
                      Selesai
                    </>
                  ) : (
                    "Progress"
                  )}
                </span>
                <span
                  className={`font-fraunces text-3xl font-medium ${isCompleted ? "text-success" : "text-sevenpreneur-ash dark:text-sevenpreneur-smoke"}`}
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {isCompleted ? (
                    <>
                      {completionScore}
                      <span className="text-lg ml-0.5">%</span>
                    </>
                  ) : (
                    "—"
                  )}
                </span>
                {isCompleted ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[var(--card-border)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success rounded-full transition-all"
                        style={{ width: `${completionScore}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <span className="font-bodycopy text-xs text-emphasis">
                    belum dikerjakan
                  </span>
                )}
              </div>
            </div>

            {/* Video player */}
            {videoEmbed && (
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-[#0a0e1a] mb-8 shadow-lg">
                {videoEmbed.type === "iframe" ? (
                  <iframe
                    src={videoEmbed.src}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={videoEmbed.src}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            )}

            {/* Separator */}
            <div className="h-px w-full bg-sevenpreneur-ash dark:bg-sevenpreneur-smoke mb-8" />

            {/* Markdown content */}
            <div
              className={styles.prose}
              dangerouslySetInnerHTML={{ __html: renderedContent }}
            />

            <div className="h-px w-full bg-sevenpreneur-ash dark:bg-sevenpreneur-smoke mt-10 mb-8" />

            {/* Quiz CTA */}
            {hasQuiz ? (
              <div className="flex flex-col gap-4 p-6 rounded-xl border border-[var(--card-border)] bg-gradient-to-br from-[var(--card-bg)] to-[var(--sb-item-hover)] mb-8">
                <div className="flex flex-col gap-1.5">
                  <p className="font-bodycopy font-semibold text-base text-sevenpreneur-coal dark:text-white">
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
              <div className="flex flex-col gap-2 p-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] mb-8">
                <p className="font-bodycopy text-sm text-emphasis">
                  Materi ini belum memiliki quiz.
                </p>
              </div>
            )}

            {/* Prev / Next Navigation */}
            {(prevLesson || nextLesson) && (
              <div className="flex items-stretch gap-4 pb-6">
                {prevLesson ? (
                  <Link href={`/lessons/${prevLesson.id}`} className="flex-1">
                    <div className="flex flex-col gap-1.5 p-5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:border-primary/40 hover:bg-primary-muted/20 dark:hover:bg-primary-muted/10 transition-colors h-full">
                      <span className="font-bodycopy text-xs text-emphasis flex items-center gap-1">
                        <ChevronLeft className="size-3.5" />
                        Sebelumnya
                      </span>
                      <p className="font-brand font-semibold text-sm text-sevenpreneur-coal dark:text-white leading-snug">
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
                  <Link href={`/lessons/${nextLesson.id}`} className="flex-1">
                    <div className="flex flex-col gap-1.5 p-5 rounded-xl border border-primary bg-gradient-to-br from-primary-muted/30 to-[var(--sb-item-hover)] dark:from-primary-muted/10 dark:to-[var(--card-bg)] hover:from-primary-muted/50 dark:hover:from-primary-muted/20 transition-colors h-full items-end text-right">
                      <span className="font-bodycopy text-xs text-primary flex items-center gap-1">
                        Selanjutnya
                        <ChevronRight className="size-3.5" />
                      </span>
                      <p className="font-brand font-semibold text-sm text-sevenpreneur-coal dark:text-white leading-snug">
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
            )}
          </>
        )}
      </div>
    </PageContainerCMS>
  );
}
