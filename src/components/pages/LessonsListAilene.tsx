"use client";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import { trpc } from "@/trpc/client";
import { BookCheck, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";

const LEVEL_LABELS: Record<number, { name: string; color: string; bg: string }> = {
  1: { name: "Foundations", color: "text-primary", bg: "bg-primary-muted" },
  2: { name: "Techniques", color: "text-secondary", bg: "bg-secondary-muted" },
  3: { name: "Advanced", color: "text-tertiary", bg: "bg-tertiary-muted" },
  4: { name: "Strategic", color: "text-success", bg: "bg-success-background" },
};

export default function LessonsListAilene() {
  const { isCollapsed } = useSidebar();
  const { data, isLoading } = trpc.ailene.listLessonsWithProgress.useQuery();

  const grouped = [1, 2, 3, 4].map((level) => ({
    level,
    meta: LEVEL_LABELS[level],
    lessons: data?.list.filter((l) => l.level === level) ?? [],
  }));

  return (
    <div
      className={`root hidden w-full min-h-screen bg-white py-8 overflow-y-auto lg:flex lg:flex-col ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      <div className="container max-w-[calc(100%-4rem)] mx-auto w-full flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal">
            Materi Pembelajaran AI
          </h1>
          <p className="font-bodycopy text-sm text-emphasis">
            Pelajari AI dari dasar hingga level strategis. Kerjakan quiz untuk mendapatkan XP.
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20 text-emphasis">
            <Loader2 className="animate-spin size-6" />
          </div>
        )}

        {!isLoading &&
          grouped.map(({ level, meta, lessons }) => {
            if (lessons.length === 0) return null;
            return (
              <div key={level} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bodycopy text-xs font-bold px-3 py-1 rounded-full ${meta.bg} ${meta.color}`}
                  >
                    Level {level}
                  </span>
                  <h2 className="font-bodycopy font-semibold text-base text-sevenpreneur-coal">
                    {meta.name}
                  </h2>
                  <div className="h-px flex-1 bg-sevenpreneur-ash" />
                  <p className="font-bodycopy text-xs text-emphasis">
                    {lessons.filter((l) => !!l.user_progress[0]?.completed_at).length}/
                    {lessons.length} selesai
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {lessons.map((lesson) => {
                    const progress = lesson.user_progress[0];
                    const isCompleted = !!progress?.completed_at;
                    return (
                      <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                        <div
                          className={`group flex flex-col gap-3 p-5 rounded-xl border h-full transition hover:shadow-md ${
                            isCompleted
                              ? "border-success/40 bg-success-background/20"
                              : "border-sevenpreneur-ash bg-white hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div
                              className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full font-bodycopy ${meta.bg} ${meta.color}`}
                            >
                              <BookOpen className="size-3" />
                              L{level}
                            </div>
                            {isCompleted ? (
                              <BookCheck className="size-4 text-success shrink-0" />
                            ) : (
                              <div className="size-4 rounded-full border-2 border-sevenpreneur-ash shrink-0 mt-0.5" />
                            )}
                          </div>
                          <p className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal line-clamp-3 flex-1 group-hover:text-primary transition-colors">
                            {lesson.title}
                          </p>
                          {lesson.description && (
                            <p className="font-bodycopy text-xs text-emphasis line-clamp-2">
                              {lesson.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-auto">
                            <span className="font-bodycopy text-xs font-semibold text-primary">
                              +{lesson.xp_reward} XP
                            </span>
                            {lesson._count.quiz_questions > 0 && (
                              <span className="font-bodycopy text-xs text-emphasis">
                                {lesson._count.quiz_questions} soal quiz
                              </span>
                            )}
                            {progress?.score != null && (
                              <span className="font-bodycopy text-xs text-emphasis ml-auto">
                                Skor: {progress.score}%
                              </span>
                            )}
                          </div>
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
