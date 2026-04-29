"use client";
import { useSidebar } from "@/contexts/SidebarContext";
import { trpc } from "@/trpc/client";
import {
  BookCheck,
  BookOpen,
  CalendarDays,
  ChevronDown,
  Circle,
  CircleCheck,
  ExternalLink,
  Flame,
  LockKeyhole,
  MapPin,
  Play,
  TrendingUp,
  Trophy,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import AppButton from "../buttons/AppButton";
import AppScorecardDashboard from "../cards/AppScorecardDashboard";
import { Progress } from "../ui/progress";

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations",
  2: "Techniques",
  3: "Advanced",
  4: "Strategic",
};

const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
  MARKETING: { label: "Marketing", cls: "bg-primary/10 text-primary" },
  OPERATIONAL: {
    label: "Operational",
    cls: "bg-success-background text-success-foreground",
  },
  CEO: { label: "CEO", cls: "bg-warning-background text-warning-foreground" },
  FINANCE: { label: "Finance", cls: "bg-tertiary/10 text-tertiary" },
  HR: {
    label: "HR",
    cls: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  },
};

const LEVEL_BADGE: Record<number, { cls: string }> = {
  1: { cls: "bg-primary/10 text-primary" },
  2: { cls: "bg-success-background text-success-foreground" },
  3: { cls: "bg-warning-background text-warning-foreground" },
  4: { cls: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" },
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
  const { data: journeysData } = trpc.ailene.listJourneysForUser.useQuery();
  const { data: sessionsData } = trpc.ailene.listSessions.useQuery();

  // null = not yet interacted (defaults to first journey), "none" = user explicitly closed all, number = user opened this journey
  const [expandedJourneyId, setExpandedJourneyId] = useState<
    number | "none" | null
  >(null);
  const activeExpandedId: number | null =
    expandedJourneyId === "none"
      ? null
      : (expandedJourneyId ?? journeysData?.list[0]?.id ?? null);

  const allLessons = useMemo(
    () => journeysData?.list.flatMap((j) => j.lessons) ?? [],
    [journeysData]
  );

  const totalXp = progressData?.total_xp ?? 0;
  const completedCount = useMemo(
    () => allLessons.filter((l) => !!l.progress[0]?.completed_at).length,
    [allLessons]
  );
  const totalPublished = allLessons.length;
  const progressPct =
    totalPublished > 0
      ? Math.round((completedCount / totalPublished) * 100)
      : 0;
  const currentStreak = 0;

  const continueLesson = useMemo(() => {
    const ordered = [1, 2, 3, 4].flatMap((level) =>
      allLessons.filter((l) => l.level === level)
    );
    return ordered.find((l) => !l.progress[0]?.completed_at) ?? null;
  }, [allLessons]);

  return (
    <div
      className={`root hidden w-full min-h-screen py-8 overflow-y-auto lg:flex lg:flex-col ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      <div className="container max-w-[calc(100%-4rem)] mx-auto w-full flex flex-col gap-6">
        {/* Greeting */}
        <div className="flex flex-col gap-1">
          <h1 className="font-bodycopy font-bold text-2xl text-sevenpreneur-coal dark:text-white">
            Welcome back, {props.sessionUserName.split(" ")[0]}! 👋
          </h1>
          <p className="font-bodycopy text-sm text-emphasis">
            Continue your AI learning journey and level up your skills.
          </p>
        </div>

        {/* Scorecards */}
        <div className="grid grid-cols-4 gap-4">
          <AppScorecardDashboard
            title="Total XP"
            icon={<Trophy className="size-4 text-white" />}
            iconClassName="bg-gradient-to-br from-tertiary/70 to-tertiary"
            value={
              <>
                {totalXp.toLocaleString()}{" "}
                <span className="font-normal text-emphasis">XP</span>
              </>
            }
          />
          <AppScorecardDashboard
            title="Lessons Completed"
            icon={<BookCheck className="size-4 text-white" />}
            iconClassName="bg-gradient-to-br from-primary/70 to-primary"
            value={
              <>
                {completedCount}{" "}
                <span className="font-normal text-emphasis">
                  / {totalPublished}
                </span>
              </>
            }
          >
            <Progress value={progressPct} className="h-1.5" />
          </AppScorecardDashboard>
          <AppScorecardDashboard
            title="Overall Progress"
            icon={<TrendingUp className="size-4 text-white" />}
            iconClassName="bg-gradient-to-br from-success/70 to-success"
            value={
              <>
                {progressPct}
                <span className="font-normal text-emphasis">%</span>
              </>
            }
          >
            <Progress
              value={progressPct}
              className="[&>[data-slot=progress-indicator]]:bg-success"
            />
          </AppScorecardDashboard>
          <AppScorecardDashboard
            title="Current Streak"
            icon={<Flame className="size-4 text-white" />}
            iconClassName="bg-gradient-to-br from-warning/70 to-warning"
            value={
              <>
                {currentStreak}{" "}
                <span className="font-normal text-emphasis">days</span>
              </>
            }
          />
        </div>

        {/* Continue Learning */}
        {continueLesson && (
          <Link href={`/lessons/${continueLesson.id}`}>
            <div className="flex items-center gap-4 px-4 py-3 rounded-lg border border-dashboard-border bg-sb-item-hover hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-center size-10 rounded-lg bg-gradient-to-br from-primary/70 to-primary shrink-0">
                <BookOpen className="size-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bodycopy font-bold text-sm text-sevenpreneur-coal dark:text-white">
                  Continue Learning
                </p>
                <p className="font-bodycopy text-xs text-emphasis truncate">
                  You left off at &ldquo;{continueLesson.title}&rdquo;
                </p>
              </div>
              <AppButton variant="tertiary" size="small">
                <Play className="size-3.5 fill-white" />
                Continue Lesson
              </AppButton>
            </div>
          </Link>
        )}

        {/* Sessions */}
        {sessionsData &&
          sessionsData.list.length > 0 &&
          (() => {
            const now = new Date();
            const upcoming = sessionsData.list.filter(
              (s) => new Date(s.meeting_date) >= now && s.status === "ACTIVE"
            );
            const past = sessionsData.list.filter(
              (s) => new Date(s.meeting_date) < now && s.status === "ACTIVE"
            );
            const shown =
              upcoming.length > 0
                ? upcoming.slice(0, 3)
                : past.slice(-3).reverse();
            const label =
              upcoming.length > 0 ? "Upcoming Sessions" : "Past Sessions";
            return (
              <div className="flex flex-col gap-3">
                <h2 className="font-brand font-bold text-lg text-sevenpreneur-coal dark:text-white">
                  {label}
                </h2>
                <div className="flex flex-col gap-2">
                  {shown.map((session) => {
                    const isUpcoming = new Date(session.meeting_date) >= now;
                    return (
                      <div
                        key={session.id}
                        className="flex items-start gap-4 px-5 py-4 rounded-lg border border-dashboard-border bg-card-bg"
                      >
                        <div
                          className={`flex items-center justify-center size-10 rounded-lg shrink-0 mt-0.5 ${isUpcoming ? "bg-gradient-to-br from-tertiary/70 to-tertiary" : "bg-sevenpreneur-ash dark:bg-sevenpreneur-smoke"}`}
                        >
                          <CalendarDays
                            className={`size-5 ${isUpcoming ? "text-white" : "text-emphasis"}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bodycopy font-bold text-sm text-sevenpreneur-coal dark:text-white truncate">
                              {session.name}
                            </span>
                            <span
                              className={`shrink-0 text-[10px] font-semibold font-bodycopy px-2 py-0.5 rounded-full capitalize ${session.method === "ONLINE" ? "bg-primary/10 text-primary" : session.method === "ONSITE" ? "bg-success-background text-success-foreground" : "bg-warning-background text-warning-foreground"}`}
                            >
                              {session.method.toLowerCase()}
                            </span>
                          </div>
                          <p className="font-bodycopy text-xs text-emphasis">
                            {new Intl.DateTimeFormat("id-ID", {
                              dateStyle: "full",
                              timeStyle: "short",
                            }).format(new Date(session.meeting_date))}
                          </p>
                          {session.speaker && (
                            <p className="font-bodycopy text-xs text-emphasis">
                              🎤 {session.speaker.full_name}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {session.meeting_url && isUpcoming && (
                            <a
                              href={session.meeting_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <AppButton variant="tertiary" size="small">
                                <Video className="size-3.5" />
                                Join
                              </AppButton>
                            </a>
                          )}
                          {session.location_name && !session.meeting_url && (
                            <div className="flex items-center gap-1 text-xs text-emphasis font-bodycopy">
                              <MapPin className="size-3.5" />
                              {session.location_name}
                            </div>
                          )}
                          {session.recording_url && !isUpcoming && (
                            <a
                              href={session.recording_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <AppButton variant="light" size="small">
                                <ExternalLink className="size-3.5" />
                                Recording
                              </AppButton>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

        {/* Your Journeys */}
        {journeysData && journeysData.list.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="font-brand font-bold text-lg text-sevenpreneur-coal dark:text-white">
              Your journeys
            </h2>

            <div className="flex flex-col gap-3">
              {journeysData.list.map((journey) => {
                const isExpanded = activeExpandedId === journey.id;
                const completed = journey.lessons.filter(
                  (l) => !!l.progress[0]?.completed_at
                ).length;
                const total = journey.lessons.length;
                const pct =
                  total > 0 ? Math.round((completed / total) * 100) : 0;
                const isAllDone = total > 0 && completed === total;
                const roleBadge = journey.role
                  ? ROLE_BADGE[journey.role]
                  : null;

                const scores = journey.lessons
                  .map((l) => l.progress[0]?.score)
                  .filter((s): s is number => s != null);
                const avgScore =
                  scores.length > 0
                    ? Math.round(
                        scores.reduce((a, b) => a + b, 0) / scores.length
                      )
                    : null;

                // First lesson in this journey that has a quiz but hasn't been completed
                const firstUnlockedQuizLessonId =
                  journey.lessons.find(
                    (l) =>
                      l._count.quiz_questions > 0 &&
                      !l.progress[0]?.completed_at
                  )?.id ?? null;

                return (
                  <div
                    key={journey.id}
                    className={`rounded-lg border overflow-hidden bg-card-bg shadow-[0_0_12px_rgba(0,0,0,0.04)] ${
                      isAllDone
                        ? "border-success/40"
                        : "border-dashboard-border"
                    }`}
                  >
                    {/* Journey header */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedJourneyId(isExpanded ? "none" : journey.id)
                      }
                      className="w-full flex items-center gap-4 px-6 py-4 text-left"
                    >
                      <div
                        className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                          isAllDone
                            ? "bg-gradient-to-br from-success/70 to-success"
                            : "bg-gradient-to-br from-primary/70 to-primary"
                        }`}
                      >
                        <BookOpen className="size-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="font-bodycopy font-bold text-sm text-sevenpreneur-coal dark:text-white truncate">
                            {journey.name}
                          </span>
                          {roleBadge && (
                            <span
                              className={`shrink-0 text-[10px] font-semibold font-bodycopy px-2 py-0.5 rounded-full ${roleBadge.cls}`}
                            >
                              {roleBadge.label}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={pct} className="h-1 flex-1" />
                          <span className="font-bodycopy text-xs text-emphasis shrink-0">
                            {completed}/{total}
                            {avgScore !== null && (
                              <span className="text-secondary font-medium">
                                {" "}
                                · {avgScore}% avg
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <ChevronDown
                        className={`size-4 shrink-0 text-emphasis transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Lesson list */}
                    {isExpanded && journey.lessons.length > 0 && (
                      <div className="border-t border-dashboard-border">
                        {journey.lessons.map((lesson, idx) => {
                          const progress = lesson.progress[0];
                          const isLessonDone = !!progress?.completed_at;
                          const score = progress?.score ?? null;
                          const isWeak =
                            isLessonDone &&
                            score !== null &&
                            score < WEAK_THRESHOLD;
                          const levelBadge = LEVEL_BADGE[lesson.level];
                          const levelLabel =
                            LEVEL_LABELS[lesson.level] ??
                            `Level ${lesson.level}`;

                          const hasQuiz = lesson._count.quiz_questions > 0;
                          const isThisTheUnlocked =
                            lesson.id === firstUnlockedQuizLessonId;
                          const quizLocked =
                            hasQuiz && !isLessonDone && !isThisTheUnlocked;

                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-4 px-6 py-4 bg-card-bg border-b border-dashboard-border last:border-b-0"
                            >
                              <div className="shrink-0">
                                {isLessonDone ? (
                                  <CircleCheck className="size-5 text-success" />
                                ) : (
                                  <Circle className="size-5 text-emphasis" />
                                )}
                              </div>

                              <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal dark:text-white truncate">
                                    {idx + 1}. {lesson.title}
                                  </span>
                                  {levelBadge && (
                                    <span
                                      className={`shrink-0 font-bodycopy text-[10px] font-semibold px-1.5 py-0.5 rounded ${levelBadge.cls}`}
                                    >
                                      {levelLabel}
                                    </span>
                                  )}
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

                              <div className="flex items-center gap-2 shrink-0">
                                <Link href={`/lessons/${lesson.id}`}>
                                  <AppButton variant="light" size="small">
                                    Re-read
                                  </AppButton>
                                </Link>
                                {hasQuiz &&
                                  (isLessonDone ? (
                                    <Link href={`/lessons/${lesson.id}/quiz`}>
                                      <AppButton variant="light" size="small">
                                        See result
                                      </AppButton>
                                    </Link>
                                  ) : quizLocked ? (
                                    <AppButton
                                      variant="primary"
                                      size="small"
                                      disabled
                                    >
                                      <LockKeyhole className="size-4" />
                                      Locked
                                    </AppButton>
                                  ) : (
                                    <Link href={`/lessons/${lesson.id}/quiz`}>
                                      <AppButton variant="primary" size="small">
                                        Start quiz
                                      </AppButton>
                                    </Link>
                                  ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
