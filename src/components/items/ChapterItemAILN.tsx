"use client";
import ChapterTaskItemAILN from "@/components/items/ChapterTaskItemAILN";
import { trpc } from "@/trpc/client";
import {
  faChevronDown,
  faChevronUp,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AppLoadingComponents from "../states/AppLoadingComponents";
import AppErrorComponents from "../states/AppErrorComponents";

interface Chapter {
  id: number;
  name: string;
  description: string | null;
}

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
        className={`rounded-xl bg-white shadow-sm ${
          !props.unlocked ? "opacity-60" : ""
        }`}
      >
        <button
          type="button"
          onClick={props.onToggle}
          className="flex w-full items-start justify-between gap-4 p-4 text-left"
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
            {!props.unlocked && (
              <span className="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-600">
                Locked
              </span>
            )}
            {props.expanded ? (
              <FontAwesomeIcon
                icon={faChevronUp}
                className="h-4 w-4 text-gray-400"
              />
            ) : (
              <FontAwesomeIcon
                icon={faChevronDown}
                className="h-4 w-4 text-gray-400"
              />
            )}
          </div>
        </button>

        {props.expanded && (
          <>
            {tasksQ.isLoading && <AppLoadingComponents />}
            {(tasksQ.error || (!tasksQ.isLoading && !tasksQ.data)) && (
              <AppErrorComponents />
            )}
            {tasksQ.data && (
              <div className="space-y-2 border-t border-dashboard-border px-4 py-3">
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
          </>
        )}
      </div>
    </div>
  );
}
