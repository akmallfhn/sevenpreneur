"use client";
import ChapterTaskItemAILN, {
  PreAssessmentItemAILN,
} from "@/components/items/ChapterTaskItemAILN";
import { trpc } from "@/trpc/client";
import type { ChapterProgress } from "@/trpc/routers/ailene/utils.ailene";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDown } from "lucide-react";
import AppLoadingComponents from "../states/AppLoadingComponents";
import AppErrorComponents from "../states/AppErrorComponents";

interface Chapter {
  id: number;
  name: string;
  description: string | null;
  progress: ChapterProgress;
}

const progressMeta: Record<ChapterProgress, { label: string; cls: string }> = {
  not_started: { label: "Not Started", cls: "bg-gray-100 text-gray-600" },
  in_progress: { label: "In Progress", cls: "bg-blue-100 text-blue-500" },
  completed: { label: "Completed", cls: "bg-green-100 text-green-700" },
};

interface ChapterItemAILNProps {
  chapter: Chapter;
  chapterNumber: number;
  unlocked: boolean;
  expanded: boolean;
  isFirst: boolean;
  onToggle: () => void;
}

export default function ChapterItemAILN(props: ChapterItemAILNProps) {
  const tasksQ = trpc.ailene.list.tasks.useQuery(
    { chapter_id: props.chapter.id },
    { enabled: props.expanded }
  );
  const preAssessmentQ = trpc.ailene.read.myPreAssessment.useQuery(undefined, {
    enabled: props.expanded && props.isFirst,
  });

  return (
    <div className="relative pl-12">
      <div
        className={`absolute top-4 left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
          props.unlocked
            ? "border-red-500 bg-white text-red-500"
            : "border-gray-300 bg-gray-100 text-gray-400"
        }`}
      >
        {props.unlocked ? (
          <span className="h-2 w-2 rounded-full bg-red-500" />
        ) : (
          <FontAwesomeIcon icon={faLock} className="h-4 w-4" />
        )}
      </div>

      <div
        className={`rounded-md bg-white shadow-sm ${
          !props.unlocked ? "opacity-60" : ""
        }`}
      >
        <button
          type="button"
          onClick={props.onToggle}
          className="flex w-full items-center justify-between gap-4 p-4 text-left"
        >
          <div className="flex-1">
            <div className="text-xs tracking-widest uppercase text-emphasis">
              Chapter {props.chapterNumber}
            </div>
            <div className="text-lg font-bold">{props.chapter.name}</div>
            {props.chapter.description && (
              <div className="text-sm text-gray-500">
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
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                Locked
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${
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
            {tasksQ.isLoading && <AppLoadingComponents />}
            {(tasksQ.error || (!tasksQ.isLoading && !tasksQ.data)) && (
              <AppErrorComponents />
            )}
            {tasksQ.data && (
              <div className="space-y-2 border-t border-dashboard-border px-4 py-3">
                {props.isFirst && (
                  <PreAssessmentItemAILN
                    unlocked={props.unlocked}
                    completed={!!preAssessmentQ.data?.pre_assessment}
                  />
                )}
                {tasksQ.data.quizzes.map((q) => (
                  <ChapterTaskItemAILN
                    key={`q-${q.id}`}
                    variant="Quiz"
                    quiz={q}
                    unlocked={props.unlocked}
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
                {tasksQ.data.materials.map((m) => (
                  <ChapterTaskItemAILN
                    key={`m-${m.id}`}
                    variant="Material"
                    material={m}
                    unlocked={props.unlocked}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

