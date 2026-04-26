"use client";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import { trpc } from "@/trpc/client";
import {
  BookCheck,
  BookOpen,
  ChevronDown,
  Circle,
  CircleAlert,
  CircleCheck,
  Flame,
  Lock,
  Play,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations",
  2: "Techniques",
  3: "Advanced",
  4: "Strategic",
};

const WEAK_THRESHOLD = 80;

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h lalu`;
  return `${Math.floor(hours / 24)}h lalu`;
}

interface HomeAileneProps {
  sessionUserName: string;
}

export default function HomeAilene(props: HomeAileneProps) {
  const { isCollapsed } = useSidebar();
  const { data: progressData } = trpc.ailene.myProgress.useQuery();
  const { data: lessonsData } = trpc.ailene.listLessonsWithProgress.useQuery();

  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  const totalXp = progressData?.total_xp ?? 0;
  const completedCount = progressData?.completed_count ?? 0;
  const totalPublished = lessonsData?.list.length ?? 0;
  const progressPct =
    totalPublished > 0 ? Math.round((completedCount / totalPublished) * 100) : 0;
  const currentStreak = 0;

  const continueLesson = useMemo(() => {
    if (!lessonsData) return null;
    const ordered = [1, 2, 3, 4].flatMap((level) =>
      lessonsData.list.filter((l) => l.level === level)
    );
    return ordered.find((l) => !l.user_progress[0]?.completed_at) ?? null;
  }, [lessonsData]);

  const getLevelData = (level: number) => {
    const lessons = lessonsData?.list.filter((l) => l.level === level) ?? [];
    const completedLessons = lessons.filter(
      (l) => !!l.user_progress[0]?.completed_at
    );
    const completed = completedLessons.length;
    const isCompleted = lessons.length > 0 && completed === lessons.length;

    const scores = completedLessons
      .map((l) => l.user_progress[0]?.score)
      .filter((s): s is number => s != null);
    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : null;

    const prevLessons =
      level === 1
        ? []
        : (lessonsData?.list.filter((l) => l.level === level - 1) ?? []);
    const isUnlocked =
      level === 1 ||
      (prevLessons.length > 0 &&
        prevLessons.every((l) => !!l.user_progress[0]?.completed_at));

    return { lessons, completed, isCompleted, isUnlocked, avgScore };
  };

  return (
    <div
      className={`root hidden w-full min-h-screen py-8 overflow-y-auto lg:flex lg:flex-col ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      <div className="container max-w-[calc(100%-4rem)] mx-auto w-full flex flex-col gap-6">
        {/* Greeting */}
        <div className="flex flex-col gap-1">
          <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
            Welcome back, {props.sessionUserName}! 👋
          </h1>
          <p className="font-bodycopy text-sm text-emphasis">
            Continue your AI learning journey and level up your skills.
          </p>
        </div>

        {/* Scorecards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center gap-4 p-5 rounded-xl border border-sevenpreneur-ash dark:border-sevenpreneur-smoke bg-white dark:bg-sevenpreneur-charcoal">
            <div className="flex items-center justify-center size-11 rounded-xl bg-tertiary shrink-0">
              <Trophy className="size-5 text-white" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="font-bodycopy text-xs font-semibold text-emphasis uppercase tracking-widest">
                Total XP
              </p>
              <p className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
                {totalXp.toLocaleString()}{" "}
                <span className="text-base font-normal text-emphasis">XP</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-xl border border-sevenpreneur-ash dark:border-sevenpreneur-smoke bg-white dark:bg-sevenpreneur-charcoal">
            <div className="flex items-center justify-center size-11 rounded-xl bg-primary shrink-0">
              <BookCheck className="size-5 text-white" />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <p className="font-bodycopy text-xs font-semibold text-emphasis uppercase tracking-widest">
                Lessons Completed
              </p>
              <p className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
                {completedCount}{" "}
                <span className="text-base font-normal text-emphasis">
                  / {totalPublished}
                </span>
              </p>
              <div className="w-full h-1.5 rounded-full bg-sevenpreneur-ash dark:bg-sevenpreneur-smoke overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-xl border border-sevenpreneur-ash dark:border-sevenpreneur-smoke bg-white dark:bg-sevenpreneur-charcoal">
            <div className="flex items-center justify-center size-11 rounded-xl bg-success shrink-0">
              <TrendingUp className="size-5 text-white" />
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <p className="font-bodycopy text-xs font-semibold text-emphasis uppercase tracking-widest">
                Overall Progress
              </p>
              <p className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
                {progressPct}
                <span className="text-base font-normal text-emphasis">%</span>
              </p>
              <div className="w-full h-1.5 rounded-full bg-sevenpreneur-ash dark:bg-sevenpreneur-smoke overflow-hidden">
                <div
                  className="h-full rounded-full bg-success transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-xl border border-sevenpreneur-ash dark:border-sevenpreneur-smoke bg-white dark:bg-sevenpreneur-charcoal">
            <div className="flex items-center justify-center size-11 rounded-xl bg-warning shrink-0">
              <Flame className="size-5 text-white" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="font-bodycopy text-xs font-semibold text-emphasis uppercase tracking-widest">
                Current Streak
              </p>
              <p className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
                {currentStreak}{" "}
                <span className="text-base font-normal text-emphasis">days</span>
              </p>
              <p className="font-bodycopy text-xs text-warning font-medium">
                Keep it up! 🔥
              </p>
            </div>
          </div>
        </div>

        {/* Continue Learning */}
        {continueLesson && (
          <Link href={`/lessons/${continueLesson.id}`}>
            <div className="flex items-center gap-4 px-5 py-4 rounded-xl border border-sevenpreneur-ash dark:border-sevenpreneur-smoke bg-white dark:bg-sevenpreneur-charcoal hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-center size-10 rounded-xl bg-primary-muted dark:bg-sevenpreneur-blue-midnight shrink-0">
                <BookOpen className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bodycopy font-bold text-sm text-sevenpreneur-coal dark:text-white">
                  Continue Learning
                </p>
                <p className="font-bodycopy text-xs text-emphasis truncate">
                  You left off at &ldquo;{continueLesson.title}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 bg-primary text-white font-bodycopy font-semibold text-sm px-4 py-2 rounded-lg">
                <Play className="size-3.5 fill-white" />
                Continue Lesson
              </div>
            </div>
          </Link>
        )}

        {/* Your Journey */}
        <div className="flex flex-col gap-3">
          <h2 className="font-brand font-bold text-lg text-sevenpreneur-coal dark:text-white">
            Your journey
          </h2>

          <div className="relative flex flex-col">
            {/* vertical timeline line */}
            <div className="absolute left-5 top-5 bottom-5 w-px bg-sevenpreneur-ash dark:bg-sevenpreneur-smoke" />

            {[1, 2, 3, 4].map((level) => {
              const { lessons, completed, isCompleted, isUnlocked, avgScore } =
                getLevelData(level);
              if (lessons.length === 0) return null;

              const isExpanded = expandedLevel === level;

              const levelIcon = isCompleted ? (
                <CircleCheck className="size-5 text-success" />
              ) : isUnlocked ? (
                <CircleAlert className="size-5 text-secondary" />
              ) : (
                <Lock className="size-4 text-emphasis" />
              );

              return (
                <div
                  key={level}
                  className="flex items-start gap-4 py-2 relative"
                >
                  {/* timeline icon */}
                  <div
                    className={`size-10 rounded-full border-2 flex items-center justify-center z-10 shrink-0 mt-3 ${
                      isCompleted
                        ? "border-success bg-success-background/30 dark:bg-success-background/10"
                        : isUnlocked
                          ? "border-secondary bg-white dark:bg-sevenpreneur-charcoal"
                          : "border-sevenpreneur-ash dark:border-sevenpreneur-smoke bg-dashboard-bg"
                    }`}
                  >
                    {levelIcon}
                  </div>

                  {/* expandable card */}
                  <div
                    className={`flex-1 rounded-xl border overflow-hidden ${
                      isCompleted
                        ? "border-success/40"
                        : isUnlocked
                          ? "border-sevenpreneur-ash dark:border-sevenpreneur-smoke"
                          : "border-sevenpreneur-ash dark:border-sevenpreneur-smoke opacity-60"
                    } bg-white dark:bg-sevenpreneur-charcoal`}
                  >
                    {/* header */}
                    <button
                      type="button"
                      disabled={!isUnlocked}
                      onClick={() =>
                        setExpandedLevel(isExpanded ? null : level)
                      }
                      className="w-full flex items-center justify-between px-6 py-4 text-left disabled:cursor-default"
                    >
                      <div className="flex flex-col gap-0.5">
                        <p
                          className={`font-bodycopy text-xs font-semibold uppercase tracking-widest ${isUnlocked ? "text-secondary" : "text-emphasis"}`}
                        >
                          Level {level}
                        </p>
                        <p
                          className={`font-bodycopy font-bold text-base ${isUnlocked ? "text-sevenpreneur-coal dark:text-white" : "text-emphasis"}`}
                        >
                          {LEVEL_LABELS[level]}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emphasis">
                        <span>
                          {completed}/{lessons.length}
                        </span>
                        {avgScore !== null && (
                          <span className="text-secondary font-medium">
                            · {avgScore}% avg
                          </span>
                        )}
                        {isUnlocked && (
                          <ChevronDown
                            className={`size-4 shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          />
                        )}
                      </div>
                    </button>

                    {/* expanded lesson list */}
                    {isExpanded && (
                      <div className="border-t border-sevenpreneur-ash dark:border-sevenpreneur-smoke">
                        {lessons.map((lesson, idx) => {
                          const progress = lesson.user_progress[0];
                          const isLessonDone = !!progress?.completed_at;
                          const score = progress?.score ?? null;
                          const isWeak =
                            isLessonDone &&
                            score !== null &&
                            score < WEAK_THRESHOLD;

                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-4 px-6 py-4 border-b border-sevenpreneur-ash dark:border-sevenpreneur-smoke last:border-b-0"
                            >
                              {/* completion icon */}
                              <div className="shrink-0">
                                {isLessonDone ? (
                                  <CircleCheck className="size-5 text-success" />
                                ) : (
                                  <Circle className="size-5 text-emphasis" />
                                )}
                              </div>

                              {/* lesson info */}
                              <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal dark:text-white truncate">
                                    {idx + 1}. {lesson.title}
                                  </span>
                                  {isWeak && (
                                    <span className="shrink-0 font-bodycopy text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary-muted text-secondary">
                                      WEAK
                                    </span>
                                  )}
                                </div>
                                <p className="font-bodycopy text-xs text-emphasis">
                                  {isLessonDone && progress?.completed_at ? (
                                    <>
                                      {score !== null && `Score ${score}% · `}
                                      {`${lesson.xp_reward} XP earned · `}
                                      {relativeTime(progress.completed_at)}
                                    </>
                                  ) : (
                                    "Belum dikerjain"
                                  )}
                                </p>
                              </div>

                              {/* actions */}
                              <div className="flex items-center gap-2 shrink-0">
                                <Link
                                  href={`/lessons/${lesson.id}`}
                                  className="font-bodycopy text-sm font-medium px-3 py-1.5 rounded-lg border border-sevenpreneur-ash dark:border-sevenpreneur-smoke text-sevenpreneur-coal dark:text-white hover:bg-sevenpreneur-ash/30 dark:hover:bg-sevenpreneur-smoke/30 transition-colors"
                                >
                                  Re-read
                                </Link>
                                {lesson._count.quiz_questions > 0 && (
                                  <Link
                                    href={`/lessons/${lesson.id}/quiz`}
                                    className={`font-bodycopy text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                                      isWeak
                                        ? "bg-secondary text-white hover:bg-secondary-hover"
                                        : isLessonDone
                                          ? "border border-sevenpreneur-ash dark:border-sevenpreneur-smoke text-sevenpreneur-coal dark:text-white hover:bg-sevenpreneur-ash/30 dark:hover:bg-sevenpreneur-smoke/30"
                                          : "bg-primary text-white hover:bg-primary-hover"
                                    }`}
                                  >
                                    {isLessonDone ? "Retake quiz" : "Start quiz"}
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
