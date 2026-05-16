"use client";
import { trpc } from "@/trpc/client";
import Image from "next/image";

interface LevelProgressCardAILNProps {
  className?: string;
}

export default function LevelProgressCardAILN(
  props: LevelProgressCardAILNProps
) {
  const q = trpc.ailene.read.levelProgress.useQuery();

  if (q.isLoading) {
    return (
      <StatShell title="LEVEL PROGRESS" className={props.className}>
        <CardLoading />
      </StatShell>
    );
  }
  if (q.error || !q.data) {
    return (
      <StatShell title="LEVEL PROGRESS" className={props.className}>
        <CardError />
      </StatShell>
    );
  }

  const { levels, current_level_number, tasks_required, tasks_done } = q.data;
  const target = Math.max(tasks_required, 1);
  const pct = Math.min(100, Math.round((tasks_done / target) * 100));

  return (
    <StatShell title="LEVEL PROGRESS" className={props.className}>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold leading-none text-gray-900 dark:text-white">
          {tasks_done}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          / {tasks_required} task selesai di level ini
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-dashboard-border">
        <div
          className="h-full rounded-full bg-red-500 dark:shadow-[0_0_8px_rgba(239,68,68,0.7)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <LevelStepper
        levels={levels}
        current_level_number={current_level_number}
      />
    </StatShell>
  );
}

function LevelStepper({
  levels,
  current_level_number,
}: {
  levels: {
    id: number;
    level_number: number;
    name: string;
    icon: string | null;
  }[];
  current_level_number: number;
}) {
  if (levels.length === 0) return null;
  return (
    <div className="mt-2 flex items-start">
      {levels.map((lvl, idx) => {
        const reached = lvl.level_number <= current_level_number;
        const isFirst = idx === 0;
        const isLast = idx === levels.length - 1;
        const leftReached = reached;
        const rightReached =
          !isLast && levels[idx + 1].level_number <= current_level_number;

        return (
          <div key={lvl.id} className="flex flex-1 flex-col items-center">
            <div className="relative flex w-full items-center justify-center">
              {!isFirst && (
                <div
                  className={`absolute left-0 top-1/2 h-0.5 w-1/2 -translate-y-1/2 ${
                    leftReached
                      ? "bg-red-500 dark:shadow-[0_0_4px_rgba(239,68,68,0.7)]"
                      : "bg-gray-200 dark:bg-dashboard-border"
                  }`}
                />
              )}
              {!isLast && (
                <div
                  className={`absolute right-0 top-1/2 h-0.5 w-1/2 -translate-y-1/2 ${
                    rightReached
                      ? "bg-red-500 dark:shadow-[0_0_4px_rgba(239,68,68,0.7)]"
                      : "bg-gray-200 dark:bg-dashboard-border"
                  }`}
                />
              )}
              <div className="relative z-10 flex size-9 items-center justify-center bg-white dark:bg-card-bg">
                {lvl.icon ? (
                  <Image
                    src={lvl.icon}
                    alt={lvl.name}
                    width={36}
                    height={36}
                    className={`size-9 object-contain ${reached ? "dark:drop-shadow-[0_0_6px_rgba(239,68,68,0.7)]" : "dark:opacity-50"}`}
                  />
                ) : (
                  <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                    L{lvl.level_number}
                  </span>
                )}
              </div>
            </div>
            <div
              className={`mt-1 w-full text-center text-[10px] font-semibold ${
                reached
                  ? "text-red-600 dark:text-red-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              L{lvl.level_number}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatShell({
  title,
  className = "",
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex h-full flex-col gap-1 rounded-xl border bg-white p-6 dark:border-dashboard-border dark:bg-card-bg dark:shadow-[0_0_18px_rgba(239,68,68,0.08)] ${className}`}
    >
      <div className="text-xs font-medium uppercase tracking-widest text-gray-500 dark:text-gray-400">
        {title}
      </div>
      {children}
    </div>
  );
}

function CardLoading() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="h-8 w-32 rounded bg-gray-200 dark:bg-dashboard-border" />
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-dashboard-border" />
      <div className="mt-2 flex items-center justify-between gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-1">
            <div className="size-9 rounded-full bg-gray-200 dark:bg-dashboard-border" />
            <div className="h-2 w-6 rounded bg-gray-200 dark:bg-dashboard-border" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CardError() {
  return (
    <div className="flex h-20 items-center justify-center">
      <span className="text-xs text-red-500 dark:text-red-400">
        Gagal memuat data.
      </span>
    </div>
  );
}
