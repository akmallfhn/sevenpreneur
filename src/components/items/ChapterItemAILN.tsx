"use client";
import ChapterTaskItemAILN from "@/components/items/ChapterTaskItemAILN";
import { trpc } from "@/trpc/client";
import type { ChapterProgress } from "@/trpc/routers/ailene/utils.ailene";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDown } from "lucide-react";
import AppErrorComponents from "../states/AppErrorComponents";

interface Chapter {
  id: number;
  name: string;
  description: string | null;
  progress: ChapterProgress;
}

const progressMeta: Record<ChapterProgress, { label: string; cls: string }> = {
  not_started: {
    label: "Not Started",
    cls: "bg-gray-100 text-gray-600 dark:bg-gray-500/10 dark:text-gray-300 dark:border dark:border-gray-500/30",
  },
  in_progress: {
    label: "In Progress",
    cls: "bg-blue-100 text-blue-500 dark:bg-blue-500/10 dark:text-blue-300 dark:border dark:border-blue-500/40",
  },
  completed: {
    label: "Completed",
    cls: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300 dark:border dark:border-green-500/40",
  },
};

interface ChapterItemAILNProps {
  chapter: Chapter;
  chapterNumber: number;
  unlocked: boolean;
  expanded: boolean;
  onToggle: () => void;
}

export default function ChapterItemAILN(props: ChapterItemAILNProps) {
  const tasksQ = trpc.ailene.list.tasks.useQuery(
    { chapter_id: props.chapter.id },
    { enabled: props.expanded }
  );

  return (
    <div className="relative pl-12">
      <div
        className={`absolute top-4 left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
          props.unlocked
            ? "border-red-500 bg-white text-red-500 dark:bg-black dark:shadow-[0_0_12px_rgba(239,68,68,0.7)]"
            : "border-gray-300 bg-gray-100 text-gray-400 dark:border-red-500/30 dark:bg-black dark:text-red-500/40"
        }`}
      >
        {props.unlocked ? (
          <span className="h-2 w-2 rounded-full bg-red-500 dark:shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
        ) : (
          <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
        )}
      </div>

      <div
        className={`rounded-md bg-white shadow-sm dark:border dark:border-dashboard-border dark:bg-[#0E111A]/50 dark:shadow-[0_0_18px_rgba(239,68,68,0.08)] ${
          !props.unlocked ? "opacity-60 dark:opacity-50" : ""
        }`}
      >
        <button
          type="button"
          onClick={props.onToggle}
          className="flex w-full items-center justify-between gap-4 p-4 text-left"
        >
          <div className="flex-1">
            <div className="text-xs tracking-widest uppercase text-emphasis dark:text-gray-400">
              Chapter {props.chapterNumber}
            </div>
            <div className="text-lg font-bold dark:text-white">
              {props.chapter.name}
            </div>
            {props.chapter.description && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {props.chapter.description}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {props.unlocked ? (
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${progressMeta[props.chapter.progress].cls}`}
              >
                {progressMeta[props.chapter.progress].label}
              </span>
            ) : (
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:bg-red-500/10 dark:text-red-300/70">
                Locked
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-300 dark:text-red-300/70 ${
                props.expanded ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>
        <div
          className={`grid transition-all duration-300 ease-in-out ${
            props.expanded
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            {tasksQ.isLoading && (
              <div className="space-y-2 border-t border-dashboard-border px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <TaskItemSkeleton key={i} />
                ))}
              </div>
            )}
            {(tasksQ.error || (!tasksQ.isLoading && !tasksQ.data)) && (
              <AppErrorComponents />
            )}
            {tasksQ.data &&
              (() => {
                const allMaterialsRead = tasksQ.data.materials.every(
                  (m) => m.completed
                );
                const quizUnlocked = props.unlocked && allMaterialsRead;
                return (
                  <div className="space-y-2 border-t border-dashboard-border px-4 py-3">
                    {tasksQ.data.materials.map((m) => (
                      <ChapterTaskItemAILN
                        key={`m-${m.id}`}
                        variant="Material"
                        material={m}
                        unlocked={props.unlocked}
                      />
                    ))}
                    {tasksQ.data.quizzes.map((q) => (
                      <ChapterTaskItemAILN
                        key={`q-${q.id}`}
                        variant="Quiz"
                        quiz={q}
                        unlocked={quizUnlocked}
                        lockedMessage={
                          props.unlocked && !allMaterialsRead
                            ? "Baca semua materi, sebelum memulai quiz"
                            : undefined
                        }
                      />
                    ))}
                    {tasksQ.data.videos.map((v) => (
                      <ChapterTaskItemAILN
                        key={`v-${v.id}`}
                        variant="Video"
                        video={v}
                        unlocked={props.unlocked}
                      />
                    ))}
                  </div>
                );
              })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChapterItemSkeleton() {
  return (
    <div className="relative pl-12 animate-pulse">
      <div className="absolute top-4 left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-100 dark:border-dashboard-border dark:bg-card-bg" />
      <div className="rounded-md bg-gray-50 shadow-sm dark:border dark:border-dashboard-border dark:bg-[#0E111A]/50">
        <div className="flex w-full items-center justify-between gap-4 p-4">
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-24 rounded bg-gray-200 dark:bg-dashboard-border" />
            <div className="h-4 w-64 rounded bg-gray-200 dark:bg-dashboard-border" />
            <div className="h-3 w-80 rounded bg-gray-200 dark:bg-dashboard-border" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-20 rounded bg-gray-200 dark:bg-dashboard-border" />
            <div className="h-4 w-4 rounded bg-gray-200 dark:bg-dashboard-border" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskItemSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashboard-border bg-white p-3 animate-pulse dark:bg-card-bg">
      <div className="h-10 w-10 shrink-0 rounded-md bg-gray-200 dark:bg-dashboard-border" />
      <div className="flex-1 space-y-2">
        <div className="h-2.5 w-16 rounded bg-gray-200 dark:bg-dashboard-border" />
        <div className="h-3.5 w-48 rounded bg-gray-200 dark:bg-dashboard-border" />
        <div className="flex items-center gap-2 pt-0.5">
          <div className="h-4 w-14 rounded-full bg-gray-200 dark:bg-dashboard-border" />
          <div className="h-3 w-20 rounded bg-gray-200 dark:bg-dashboard-border" />
        </div>
      </div>
      <div className="h-8 w-32 shrink-0 rounded-md bg-gray-200 dark:bg-dashboard-border" />
      <div className="h-4 w-4 shrink-0 rounded-full bg-gray-200 dark:bg-dashboard-border" />
    </div>
  );
}
