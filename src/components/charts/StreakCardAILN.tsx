"use client";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import "dayjs/locale/id";

dayjs.locale("id");

interface StreakCardAILNProps {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  className?: string;
}

function tierClass(count: number): string {
  if (count === 0) return "bg-gray-200 dark:bg-dashboard-border";
  if (count <= 2) return "bg-red-200 dark:bg-red-500/30";
  if (count <= 4)
    return "bg-red-400 dark:bg-red-500/60 dark:shadow-[0_0_4px_rgba(239,68,68,0.5)]";
  return "bg-red-600 dark:bg-red-500 dark:shadow-[0_0_6px_rgba(239,68,68,0.8)]";
}

export default function StreakCardAILN(props: StreakCardAILNProps) {
  const q = trpc.ailene.read.streak.useQuery({
    from: props.startDate,
    to: props.endDate,
  });

  if (q.isLoading) {
    return (
      <StatShell title="STREAK 3 BULAN TERAKHIR" className={props.className}>
        <CardLoading />
      </StatShell>
    );
  }
  if (q.error || !q.data) {
    return (
      <StatShell title="STREAK 3 BULAN TERAKHIR" className={props.className}>
        <CardError />
      </StatShell>
    );
  }

  const { days, current_streak } = q.data;
  const todayKey = dayjs().format("YYYY-MM-DD");

  // Group days into Mon-Sun columns (GitHub-style heatmap).
  const start = dayjs(props.startDate);
  const end = dayjs(props.endDate);

  // Snap to Monday on/before start, Sunday on/after end.
  const startDow = start.day(); // 0=Sun..6=Sat
  const daysFromMonday = (startDow + 6) % 7;
  const gridStart = start.subtract(daysFromMonday, "day");

  const endDow = end.day();
  const daysToSunday = (7 - endDow) % 7;
  const gridEnd = end.add(daysToSunday, "day");

  const dayMap = new Map(days.map((d) => [d.date, d.count]));

  type Cell = { date: string; count: number; inRange: boolean };
  const weeks: Cell[][] = [];
  let cursor = gridStart;
  while (cursor.isBefore(gridEnd) || cursor.isSame(gridEnd, "day")) {
    const week: Cell[] = [];
    for (let i = 0; i < 7; i++) {
      const day = cursor.add(i, "day");
      const key = day.format("YYYY-MM-DD");
      const inRange =
        (day.isAfter(start) || day.isSame(start, "day")) &&
        (day.isBefore(end) || day.isSame(end, "day"));
      week.push({
        date: key,
        count: dayMap.get(key) ?? 0,
        inRange,
      });
    }
    weeks.push(week);
    cursor = cursor.add(7, "day");
  }

  // Month labels — show month name above first column of each new month.
  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const firstInRange = week.find((c) => c.inRange);
    const ref = firstInRange ?? week[0];
    const m = dayjs(ref.date).month();
    if (m !== lastMonth) {
      monthLabels.push({ weekIndex: wi, label: dayjs(ref.date).format("MMM") });
      lastMonth = m;
    }
  });

  return (
    <StatShell title="STREAK 3 BULAN TERAKHIR" className={props.className}>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold leading-none text-gray-900 dark:text-white">
          {current_streak}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          hari berturut
        </span>
      </div>

      <div className="mt-4 flex flex-col gap-1.5">
        {/* Month labels row */}
        <div className="relative h-3 w-full">
          {monthLabels.map((ml) => (
            <span
              key={`${ml.weekIndex}-${ml.label}`}
              className="absolute text-[10px] font-medium text-gray-500 dark:text-gray-400"
              style={{
                left: `${(ml.weekIndex / weeks.length) * 100}%`,
              }}
            >
              {ml.label}
            </span>
          ))}
        </div>

        {/* Heatmap grid — stretches edge to edge */}
        <div className="flex w-full gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-1 flex-col gap-1">
              {week.map((cell) => {
                const isToday = cell.date === todayKey;
                return (
                  <div
                    key={cell.date}
                    className={`group/cell relative aspect-square rounded-[2px] ${tierClass(cell.count)} ${
                      cell.inRange ? "" : "opacity-30"
                    } ${isToday ? "ring-1 ring-red-600 dark:ring-red-400" : ""}`}
                  >
                    <div className="pointer-events-none invisible absolute bottom-full left-1/2 z-20 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-md transition group-hover/cell:visible group-hover/cell:opacity-100 dark:bg-black dark:ring-1 dark:ring-red-500/40">
                      {dayjs(cell.date).format("D MMM YYYY")} · {cell.count}{" "}
                      task
                      <div className="absolute left-1/2 top-full size-0 -translate-x-1/2 border-[4px] border-transparent border-t-gray-900 dark:border-t-black" />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </StatShell>
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
      <div className="h-8 w-24 rounded bg-gray-200 dark:bg-dashboard-border" />
      <div className="mt-2 flex w-full gap-1">
        {Array.from({ length: 13 }).map((_, i) => (
          <div key={i} className="flex flex-1 flex-col gap-1">
            {Array.from({ length: 7 }).map((__, j) => (
              <div
                key={j}
                className="aspect-square rounded-[2px] bg-gray-200 dark:bg-dashboard-border"
              />
            ))}
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
