"use client";
import ChapterItemAILN from "@/components/items/ChapterItemAILN";
import LevelDividerAILN from "@/components/items/LevelDividerAILN";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { setSessionToken, trpc } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";

type RO = inferRouterOutputs<AppRouter>;
type Level = RO["ailene"]["list"]["levels"]["list"][number];
type Chapter = RO["ailene"]["list"]["chapters"]["list"][number];

export default function DashboardStudentAILN({
  sessionToken,
}: {
  sessionToken: string;
}) {
  useEffect(() => {
    setSessionToken(sessionToken);
  }, [sessionToken]);

  const memberQ = trpc.auth.checkAilMember.useQuery();
  const levelsQ = trpc.ailene.list.levels.useQuery();
  const chaptersQ = trpc.ailene.list.chapters.useQuery();
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  if (memberQ.isLoading || levelsQ.isLoading || chaptersQ.isLoading) {
    return (
      <PageContainerAILN>
        <AppLoadingComponents />
      </PageContainerAILN>
    );
  }
  if (memberQ.error || levelsQ.error || chaptersQ.error) {
    return (
      <PageContainerAILN>
        <AppErrorComponents />
      </PageContainerAILN>
    );
  }

  const member = memberQ.data?.ail_member;
  const levels = levelsQ.data?.list ?? [];
  const chapters = chaptersQ.data?.list ?? [];
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

  // Interleave chapters with level-divider when level transitions
  type Item =
    | { kind: "chapter"; chapter: Chapter; index: number }
    | { kind: "level"; level: Level };
  const items: Item[] = [];
  let lastLevelId: number | null = null;
  let weekIndex = 0;
  for (const ch of chapters) {
    if (ch.level_id !== lastLevelId && lastLevelId !== null) {
      const newLevel = levelById.get(ch.level_id);
      if (newLevel) items.push({ kind: "level", level: newLevel });
    }
    weekIndex += 1;
    items.push({ kind: "chapter", chapter: ch, index: weekIndex });
    lastLevelId = ch.level_id;
  }

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Your Progress</h1>
            <p className="text-sm text-gray-500">
              Complete each week to advance to the next level.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md border border-dashboard-border bg-white p-3 shadow-sm">
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
                <div className="text-xs text-gray-500">Current Level</div>
                <div className="text-lg font-bold">
                  Level {member.current_level?.level_number ?? 0}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-dashboard-border bg-white p-3 shadow-sm">
              <FontAwesomeIcon icon={faStar} className="text-warning" />
              <div className="flex flex-col">
                <div className="text-xs text-gray-500">Total XP</div>
                <div className="text-lg font-bold">
                  {member.total_xp.toLocaleString()} XP
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-red-200" />
          <div className="space-y-4">
            {items.map((item, i) => {
              if (item.kind === "level") {
                const unlocked = item.level.level_number <= currentLevelNumber;
                const claimable =
                  !unlocked && member.total_xp >= item.level.min_xp;
                return (
                  <LevelDividerAILN
                    key={`lvl-${item.level.id}-${i}`}
                    level={item.level}
                    unlocked={unlocked}
                    claimable={claimable}
                  />
                );
              }
              const lvl = levelById.get(item.chapter.level_id);
              const unlocked = (lvl?.level_number ?? 0) <= currentLevelNumber;
              return (
                <ChapterItemAILN
                  key={item.chapter.id}
                  chapter={item.chapter}
                  chapterNumber={item.index}
                  unlocked={unlocked}
                  expanded={expanded.has(item.chapter.id)}
                  onToggle={() => toggle(item.chapter.id)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </PageContainerAILN>
  );
}
