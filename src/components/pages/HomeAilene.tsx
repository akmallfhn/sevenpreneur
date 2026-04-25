"use client";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import { trpc } from "@/trpc/client";
import { BookCheck, Sparkles, Trophy } from "lucide-react";
import Link from "next/link";
import AppButton from "../buttons/AppButton";

const LEVEL_LABELS: Record<number, string> = {
  1: "Foundations",
  2: "Techniques",
  3: "Advanced",
  4: "Strategic",
};

interface HomeAileneProps {
  sessionUserName: string;
}

export default function HomeAilene(props: HomeAileneProps) {
  const { isCollapsed } = useSidebar();
  const { data: progressData } = trpc.ailene.myProgress.useQuery();
  const { data: lessonsData } = trpc.ailene.listLessonsWithProgress.useQuery();

  const totalXp = progressData?.total_xp ?? 0;
  const completedCount = progressData?.completed_count ?? 0;
  const totalPublished = lessonsData?.list.length ?? 0;

  return (
    <div
      className={`root hidden w-full min-h-screen bg-white py-8 overflow-y-auto lg:flex lg:flex-col ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      <div className="container max-w-[calc(100%-4rem)] mx-auto w-full flex flex-col gap-6">
        {/* Hero banner */}
        <div className="relative flex w-full rounded-xl overflow-hidden bg-gradient-to-br from-primary to-tertiary min-h-32 items-center px-8 py-6">
          <div className="flex flex-col gap-1 z-10">
            <p className="font-bodycopy text-sm text-white/70 font-medium">
              Selamat datang di
            </p>
            <h1 className="font-brand font-bold text-2xl text-white">
              Ailene — AI Learning Platform
            </h1>
            <p className="font-bodycopy text-white/80 text-sm mt-1">
              Halo, {props.sessionUserName}! Yuk lanjutkan perjalanan belajar AI kamu.
            </p>
          </div>
          <Sparkles className="absolute right-8 size-24 text-white/10" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-2 p-5 rounded-xl border border-sevenpreneur-ash bg-white">
            <div className="flex items-center gap-2 text-primary">
              <Trophy className="size-4" />
              <p className="font-bodycopy text-xs font-semibold text-emphasis uppercase tracking-widest">
                Total XP
              </p>
            </div>
            <p className="font-brand font-bold text-3xl text-sevenpreneur-coal">
              {totalXp}
            </p>
          </div>
          <div className="flex flex-col gap-2 p-5 rounded-xl border border-sevenpreneur-ash bg-white">
            <div className="flex items-center gap-2 text-success">
              <BookCheck className="size-4" />
              <p className="font-bodycopy text-xs font-semibold text-emphasis uppercase tracking-widest">
                Selesai
              </p>
            </div>
            <p className="font-brand font-bold text-3xl text-sevenpreneur-coal">
              {completedCount}
              <span className="text-emphasis font-bodycopy text-base font-normal ml-1">
                / {totalPublished}
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-2 p-5 rounded-xl border border-sevenpreneur-ash bg-white">
            <div className="flex items-center gap-2 text-secondary">
              <Sparkles className="size-4" />
              <p className="font-bodycopy text-xs font-semibold text-emphasis uppercase tracking-widest">
                Progress
              </p>
            </div>
            <p className="font-brand font-bold text-3xl text-sevenpreneur-coal">
              {totalPublished > 0
                ? Math.round((completedCount / totalPublished) * 100)
                : 0}
              <span className="text-emphasis font-bodycopy text-base font-normal ml-0.5">
                %
              </span>
            </p>
          </div>
        </div>

        {/* Lesson quick access by level */}
        {[1, 2, 3, 4].map((level) => {
          const levelLessons = lessonsData?.list.filter((l) => l.level === level) ?? [];
          if (levelLessons.length === 0) return null;
          return (
            <div key={level} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="font-bodycopy font-semibold text-base text-sevenpreneur-coal">
                  Level {level} — {LEVEL_LABELS[level]}
                </h2>
                <Link href="/lessons">
                  <AppButton variant="link" size="small">
                    Lihat semua
                  </AppButton>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {levelLessons.slice(0, 3).map((lesson) => {
                  const progress = lesson.user_progress[0];
                  const isCompleted = !!progress?.completed_at;
                  return (
                    <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                      <div
                        className={`flex flex-col gap-2 p-4 rounded-xl border transition hover:shadow-sm ${
                          isCompleted
                            ? "border-success bg-success-background/30"
                            : "border-sevenpreneur-ash bg-white hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bodycopy text-xs font-semibold text-primary bg-primary-muted px-2 py-0.5 rounded-full">
                            L{lesson.level}
                          </span>
                          {isCompleted && (
                            <BookCheck className="size-4 text-success" />
                          )}
                        </div>
                        <p className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal line-clamp-2">
                          {lesson.title}
                        </p>
                        <p className="font-bodycopy text-xs text-emphasis">
                          +{lesson.xp_reward} XP
                          {lesson._count.quiz_questions > 0 &&
                            ` · ${lesson._count.quiz_questions} soal`}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
