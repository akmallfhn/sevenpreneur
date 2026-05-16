"use client";
import { trpc } from "@/trpc/client";
import Image from "next/image";

const DEFAULT_AVATAR =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";

interface DeptLeaderboardAILNProps {
  className?: string;
}

export default function DeptLeaderboardAILN(props: DeptLeaderboardAILNProps) {
  const q = trpc.ailene.read.groupLeaderboard.useQuery();

  if (q.isLoading) {
    return (
      <StatShell title="DEPARTEMEN LEADERBOARD" className={props.className}>
        <CardLoading />
      </StatShell>
    );
  }
  if (q.error || !q.data) {
    return (
      <StatShell title="DEPARTEMEN LEADERBOARD" className={props.className}>
        <CardError />
      </StatShell>
    );
  }

  if (!q.data.group || q.data.leaderboard.length === 0) {
    return (
      <StatShell title="DEPARTEMEN LEADERBOARD" className={props.className}>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Kamu belum tergabung dalam group manapun.
        </p>
      </StatShell>
    );
  }

  const { leaderboard, my_rank, total } = q.data;

  return (
    <StatShell title="DEPARTEMEN LEADERBOARD" className={props.className}>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold leading-none text-gray-900 dark:text-white">
          #{my_rank}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          dari {total}
        </span>
      </div>
      <div className="mt-2 flex flex-1 flex-col gap-1.5 overflow-y-auto">
        {leaderboard.map((entry) => (
          <div
            key={entry.member_id}
            className={`flex items-center gap-3 rounded-md px-2.5 py-2 ${
              entry.is_me
                ? "bg-red-50 font-semibold text-gray-900 dark:bg-red-500/15 dark:text-white dark:shadow-[inset_0_0_0_1px_rgba(239,68,68,0.4),0_0_12px_rgba(239,68,68,0.2)]"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            <span
              className={`shrink-0 text-sm font-semibold ${
                entry.is_me
                  ? "text-red-600 dark:text-red-400 dark:drop-shadow-[0_0_4px_rgba(239,68,68,0.7)]"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              #{entry.rank}
            </span>
            <Image
              src={entry.avatar || DEFAULT_AVATAR}
              alt=""
              width={32}
              height={32}
              className={`size-8 rounded-full object-cover ${entry.is_me ? "dark:ring-1 dark:ring-red-500/50" : ""}`}
            />
            <span className="flex-1 truncate text-sm">{entry.full_name}</span>
          </div>
        ))}
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
      className={`flex flex-col gap-2 rounded-xl border bg-white p-5 dark:border-dashboard-border dark:bg-card-bg dark:shadow-[0_0_18px_rgba(239,68,68,0.08)] ${className}`}
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
      <div className="mt-2 flex flex-col gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-md px-2.5 py-2"
          >
            <div className="size-3 rounded bg-gray-200 dark:bg-dashboard-border" />
            <div className="size-8 rounded-full bg-gray-200 dark:bg-dashboard-border" />
            <div className="h-3 flex-1 rounded bg-gray-200 dark:bg-dashboard-border" />
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
