"use client";
import ChapterItemAILN, {
  ChapterItemSkeleton,
} from "@/components/items/ChapterItemAILN";
import LevelDividerAILN from "@/components/items/LevelDividerAILN";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import { setSessionToken, trpc } from "@/trpc/client";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Level {
  id: number;
  level_number: number;
  name: string;
  icon: string | null;
  min_xp: number;
}

interface Chapter {
  id: number;
  level_id: number;
  name: string;
  description: string | null;
  session_date: string;
  progress: "not_started" | "in_progress" | "completed";
}

export default function ModuleListStudentAILN({
  sessionToken,
}: {
  sessionToken: string;
}) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  useEffect(() => {
    setSessionToken(sessionToken);
  }, [sessionToken]);

  const memberQ = trpc.auth.checkAilMember.useQuery();
  const levelsQ = trpc.ailene.list.levels.useQuery();
  const chaptersQ = trpc.ailene.list.chapters.useQuery();
  const levelProgressQ = trpc.ailene.read.levelProgress.useQuery();

  if (
    memberQ.isLoading ||
    levelsQ.isLoading ||
    chaptersQ.isLoading ||
    levelProgressQ.isLoading
  ) {
    return (
      <PageContainerAILN>
        <div className="flex w-full flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-7 w-48 rounded bg-gray-200 dark:bg-dashboard-border animate-pulse" />
              <div className="h-3 w-72 rounded bg-gray-200 dark:bg-dashboard-border animate-pulse" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-14 w-44 rounded-md bg-gray-200 dark:bg-dashboard-border animate-pulse" />
              <div className="h-14 w-32 rounded-md bg-gray-200 dark:bg-dashboard-border animate-pulse" />
            </div>
          </div>
          <div className="relative">
            <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-red-200 dark:bg-red-500/40 dark:shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
            <div className="space-y-4">
              {[0, 1, 2, 3].map((i) => (
                <ChapterItemSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </PageContainerAILN>
    );
  }
  if (
    memberQ.error ||
    levelsQ.error ||
    chaptersQ.error ||
    levelProgressQ.error
  ) {
    return (
      <PageContainerAILN>
        <AppErrorComponents />
      </PageContainerAILN>
    );
  }

  const member = memberQ.data?.ail_member;
  const levels = levelsQ.data?.list ?? [];
  const chapters = chaptersQ.data?.list ?? [];
  const nextLevelUnlockable =
    levelProgressQ.data?.next_level_unlockable ?? false;
  if (!member)
    return (
      <PageContainerAILN>
        <AppErrorComponents />
      </PageContainerAILN>
    );

  const currentLevelNumber = member.current_level?.level_number ?? 0;
  const levelById = new Map<number, Level>(levels.map((l) => [l.id, l]));

  const toggle = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Interleave chapters with level-divider when level transitions.
  // unlocked/claimable derived here so the render block stays presentational.
  type Item =
    | {
        kind: "chapter";
        chapter: Chapter;
        index: number;
        unlocked: boolean;
      }
    | {
        kind: "level";
        level: Level;
        unlocked: boolean;
        claimable: boolean;
      };
  const items: Item[] = [];
  let lastLevelId: number | null = null;
  let weekIndex = 0;
  for (const ch of chapters) {
    if (ch.level_id !== lastLevelId && lastLevelId !== null) {
      const newLevel = levelById.get(ch.level_id);
      if (newLevel) {
        const levelUnlocked = newLevel.level_number <= currentLevelNumber;
        items.push({
          kind: "level",
          level: newLevel,
          unlocked: levelUnlocked,
          claimable:
            !levelUnlocked &&
            newLevel.level_number === currentLevelNumber + 1 &&
            nextLevelUnlockable,
        });
      }
    }
    weekIndex += 1;
    const lvl = levelById.get(ch.level_id);
    const levelOk = (lvl?.level_number ?? 0) <= currentLevelNumber;
    const sessionStarted = !dayjs(ch.session_date).isAfter(dayjs());
    items.push({
      kind: "chapter",
      chapter: ch,
      index: weekIndex,
      unlocked: levelOk && sessionStarted,
    });
    lastLevelId = ch.level_id;
  }

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              Modul Belajar AI
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tuntaskan semua tugas mingguan untuk maju ke level berikutnya.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md bg-white p-3 shadow-sm dark:border dark:border-red-500/30 dark:bg-red-500/5 dark:shadow-[0_0_16px_rgba(239,68,68,0.15)]">
              {member.current_level?.icon && (
                <Image
                  src={member.current_level.icon}
                  alt={member.current_level.name}
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              )}
              <div className="flex flex-col">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Level Sekarang
                </div>
                <div className="font-bold dark:text-white">
                  Level {member.current_level?.level_number ?? 0}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-white p-3 shadow-sm dark:border dark:border-red-500/30 dark:bg-red-500/5 dark:shadow-[0_0_16px_rgba(239,68,68,0.15)]">
              <FontAwesomeIcon
                icon={faStar}
                className="text-warning dark:text-amber-400 dark:drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]"
              />
              <div className="flex flex-col">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Reward
                </div>
                <div className="font-bold dark:text-white">
                  {member.total_xp.toLocaleString()} XP
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-red-200 dark:bg-red-500/40 dark:shadow-[0_0_6px_rgba(239,68,68,0.6)]" />
          <div className="space-y-4">
            {items.map((item, i) =>
              item.kind === "level" ? (
                <LevelDividerAILN
                  key={`lvl-${item.level.id}-${i}`}
                  level={item.level}
                  unlocked={item.unlocked}
                  claimable={item.claimable}
                />
              ) : (
                <ChapterItemAILN
                  key={item.chapter.id}
                  chapter={item.chapter}
                  chapterNumber={item.index}
                  unlocked={item.unlocked}
                  expanded={expanded.has(item.chapter.id)}
                  onToggle={() => toggle(item.chapter.id)}
                />
              )
            )}
          </div>
        </div>
      </div>
    </PageContainerAILN>
  );
}
