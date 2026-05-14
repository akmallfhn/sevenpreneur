"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import "dayjs/locale/id";
import {
  ArrowRight,
  BookOpen,
  PlayCircle,
  SquareCheck,
  Star,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

dayjs.locale("id");

const DEFAULT_AVATAR =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";

export default function DashboardStudentAILN({
  sessionToken,
}: {
  sessionToken: string;
}) {
  useEffect(() => {
    setSessionToken(sessionToken);
  }, [sessionToken]);

  const userQ = trpc.auth.checkSession.useQuery();
  const memberQ = trpc.auth.checkAilMember.useQuery();

  if (userQ.isLoading || memberQ.isLoading) {
    return (
      <PageContainerAILN>
        <AppLoadingComponents />
      </PageContainerAILN>
    );
  }
  if (
    userQ.error ||
    memberQ.error ||
    !userQ.data?.user ||
    !memberQ.data?.ail_member
  ) {
    return (
      <PageContainerAILN>
        <AppErrorComponents />
      </PageContainerAILN>
    );
  }

  const user = userQ.data.user;
  const member = memberQ.data.ail_member;
  const firstName = user.full_name.split(" ")[0] ?? user.full_name;
  const dateLabel = dayjs().format("dddd, D MMMM YYYY").toUpperCase();

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-4">
        {/* Greeting + Current Level + Total XP */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-medium tracking-widest text-gray-500">
              {dateLabel}
            </div>
            <h1 className="mt-1 text-2xl font-bold leading-tight">
              Halo, {firstName}.
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-md bg-white p-3 shadow-sm">
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
                <div className="font-bold">
                  Level {member.current_level?.level_number ?? 0}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-md bg-white p-3 shadow-sm">
              <Star className="size-5 text-amber-500" fill="currentColor" />
              <div className="flex flex-col">
                <div className="text-xs text-gray-500">Total XP</div>
                <div className="font-bold">
                  {member.total_xp.toLocaleString()} XP
                </div>
              </div>
            </div>
          </div>
        </div>

        <TickerBar />

        {/* Two-column body: left = focus + streak + level progress, right = rank */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <TodayFocusCard />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <StreakCard />
              <LevelProgressCard />
            </div>
          </div>
          <div className="lg:col-span-1">
            <DeptRankCard className="h-full" />
          </div>
        </div>
      </div>
    </PageContainerAILN>
  );
}

// ===== Ticker =====

function TickerBar() {
  const [closed, setClosed] = useState(false);
  const tickerQ = trpc.read.ad.ticker.useQuery({ id: 1 });

  if (closed) return null;
  if (tickerQ.isLoading || !tickerQ.data?.ticker) return null;

  const ticker = tickerQ.data.ticker;
  const now = dayjs();
  const active =
    ticker.status === "ACTIVE" &&
    now.isAfter(dayjs(ticker.start_date)) &&
    now.isBefore(dayjs(ticker.end_date));
  if (!active) return null;

  return (
    <Link
      href={ticker.target_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-md bg-black px-4 py-2.5 text-sm text-white hover:opacity-90"
    >
      {ticker.callout && (
        <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
          {ticker.callout}
        </span>
      )}
      <span className="flex-1 truncate">{ticker.title}</span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setClosed(true);
        }}
        className="text-xs text-gray-400 hover:text-white"
      >
        tutup
      </button>
    </Link>
  );
}

// ===== Today's Focus =====

function labelForKind(kind: "Quiz" | "Video" | "Material") {
  if (kind === "Quiz") return "Quiz";
  if (kind === "Video") return "Recording";
  return "Materi";
}

function TodayFocusCard() {
  const q = trpc.ailene.read.todayFocus.useQuery();

  if (q.isLoading) {
    return (
      <CardShell title="● FOKUS HARI INI">
        <CardLoading />
      </CardShell>
    );
  }
  if (q.error || !q.data) {
    return (
      <CardShell title="● FOKUS HARI INI">
        <CardError />
      </CardShell>
    );
  }

  const focus = q.data.focus;
  if (!focus) {
    return (
      <CardShell title="● FOKUS HARI INI">
        <h2 className="text-xl font-bold leading-snug text-gray-900">
          Semua task terbaru sudah kamu selesaikan 🎉
        </h2>
        <p className="text-sm text-gray-500">
          Tunggu chapter berikutnya terbuka, atau lihat ulang materi yang sudah
          dikerjakan.
        </p>
        <div className="mt-2">
          <Link href="/student/modules">
            <ButtonAILN variant="light" size="small">
              Lihat modul belajar
              <ArrowRight className="size-3.5" />
            </ButtonAILN>
          </Link>
        </div>
      </CardShell>
    );
  }

  const Icon =
    focus.kind === "Quiz"
      ? SquareCheck
      : focus.kind === "Video"
        ? PlayCircle
        : BookOpen;
  const isExternal = focus.href.startsWith("http");

  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border bg-white p-6">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-gray-500">
        <span className="size-2 rounded-full bg-red-500" />
        FOKUS HARI INI
        <span className="text-gray-400">·</span>
        <span className="inline-flex items-center gap-1 normal-case text-gray-500">
          <Icon className="size-3.5" />
          {labelForKind(focus.kind)}
        </span>
      </div>
      <h2 className="text-xl font-bold leading-snug text-gray-900">
        Selesaikan {labelForKind(focus.kind).toLowerCase()}{" "}
        <span className="rounded bg-red-50 px-1 text-red-600">
          {focus.task_title}
        </span>{" "}
        di chapter {focus.chapter_name}.
      </h2>
      <p className="text-sm text-gray-500">
        Pilih task ini sebagai langkah berikutnya supaya progres chapter kamu
        terus maju.
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        {isExternal ? (
          <a
            href={focus.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <ButtonAILN>
              Mulai sekarang
              <ArrowRight className="size-3.5" />
            </ButtonAILN>
          </a>
        ) : (
          <Link href={focus.href}>
            <ButtonAILN>
              Mulai sekarang
              <ArrowRight className="size-3.5" />
            </ButtonAILN>
          </Link>
        )}
        <Link href="/student/modules">
          <ButtonAILN variant="light">Lihat detail</ButtonAILN>
        </Link>
      </div>
    </div>
  );
}

// ===== Level Progress =====

function LevelProgressCard() {
  const q = trpc.ailene.read.levelProgress.useQuery();

  if (q.isLoading) {
    return (
      <StatShell title="LEVEL PROGRESS">
        <CardLoading />
      </StatShell>
    );
  }
  if (q.error || !q.data) {
    return (
      <StatShell title="LEVEL PROGRESS">
        <CardError />
      </StatShell>
    );
  }

  const { total_xp, max_min_xp, levels, current_level_number } = q.data;
  const target = Math.max(max_min_xp, 1);
  const pct = Math.min(100, Math.round((total_xp / target) * 100));

  return (
    <StatShell title="LEVEL PROGRESS">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold leading-none text-gray-900">
          {total_xp.toLocaleString()}
        </span>
        <span className="text-xs text-gray-500">
          / {target.toLocaleString()} XP
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-red-500"
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
        // Left half of cell idx = the segment "arriving at" this level.
        // Right half of cell idx = the segment "leaving toward" the next level.
        // Each half is red when the corresponding endpoint is reached.
        const leftReached = reached;
        const rightReached =
          !isLast && levels[idx + 1].level_number <= current_level_number;

        return (
          <div key={lvl.id} className="flex flex-1 flex-col items-center">
            <div className="relative flex w-full items-center justify-center">
              {/* Connector — left half */}
              {!isFirst && (
                <div
                  className={`absolute left-0 top-1/2 h-0.5 w-1/2 -translate-y-1/2 ${
                    leftReached ? "bg-red-500" : "bg-gray-200"
                  }`}
                />
              )}
              {/* Connector — right half */}
              {!isLast && (
                <div
                  className={`absolute right-0 top-1/2 h-0.5 w-1/2 -translate-y-1/2 ${
                    rightReached ? "bg-red-500" : "bg-gray-200"
                  }`}
                />
              )}
              {/* Icon (sits on top of the connector via z-index + bg) */}
              <div className="relative z-10 flex size-9 items-center justify-center bg-white">
                {lvl.icon ? (
                  <Image
                    src={lvl.icon}
                    alt={lvl.name}
                    width={36}
                    height={36}
                    className="size-9 object-contain"
                  />
                ) : (
                  <span className="text-sm font-bold text-gray-500">
                    L{lvl.level_number}
                  </span>
                )}
              </div>
            </div>
            <div
              className={`mt-1 w-full text-center text-[10px] font-semibold ${
                reached ? "text-red-600" : "text-gray-400"
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

// ===== Streak =====

function StreakCard() {
  const q = trpc.ailene.read.streak.useQuery();

  if (q.isLoading) {
    return (
      <StatShell title="STREAK MINGGU INI">
        <CardLoading />
      </StatShell>
    );
  }
  if (q.error || !q.data) {
    return (
      <StatShell title="STREAK MINGGU INI">
        <CardError />
      </StatShell>
    );
  }

  const { days, current_streak } = q.data;
  const todayKey = dayjs().format("YYYY-MM-DD");

  // Tier 0 → gray, 1-2 → red-200, 3-4 → red-400, 5+ → red-600
  const tierClass = (count: number) => {
    if (count === 0) return "bg-gray-200";
    if (count <= 2) return "bg-red-200";
    if (count <= 4) return "bg-red-400";
    return "bg-red-600";
  };

  return (
    <StatShell title="STREAK MINGGU INI">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold leading-none text-gray-900">
          {current_streak}
        </span>
        <span className="text-xs text-gray-500">hari berturut</span>
      </div>
      <div className="mt-2 flex items-end gap-1.5">
        {days.map((d) => {
          const isToday = d.date === todayKey;
          return (
            <div
              key={d.date}
              className="flex flex-1 flex-col items-center gap-1"
            >
              <div
                title={`${dayjs(d.date).format("dddd, D MMM")} · ${d.count} task`}
                className={`h-10 w-full rounded-sm ${tierClass(d.count)}`}
              />
              <span
                className={`text-[10px] font-semibold ${
                  isToday ? "text-red-600" : "text-gray-500"
                }`}
              >
                {dayjs(d.date).format("dd")}
              </span>
            </div>
          );
        })}
      </div>
    </StatShell>
  );
}

// ===== Department Rank =====

function DeptRankCard({ className = "" }: { className?: string }) {
  const q = trpc.ailene.read.groupLeaderboard.useQuery();

  if (q.isLoading) {
    return (
      <StatShell title="DEPARTEMEN LEADERBOARD" className={className}>
        <CardLoading />
      </StatShell>
    );
  }
  if (q.error || !q.data) {
    return (
      <StatShell title="DEPARTEMEN LEADERBOARD" className={className}>
        <CardError />
      </StatShell>
    );
  }

  if (!q.data.group || q.data.leaderboard.length === 0) {
    return (
      <StatShell title="DEPARTEMEN LEADERBOARD" className={className}>
        <p className="mt-1 text-sm text-gray-500">
          Kamu belum tergabung dalam group manapun.
        </p>
      </StatShell>
    );
  }

  const { leaderboard, my_rank, total } = q.data;

  return (
    <StatShell title="DEPARTEMEN LEADERBOARD" className={className}>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold leading-none text-gray-900">
          #{my_rank}
        </span>
        <span className="text-xs text-gray-500">dari {total}</span>
      </div>
      <div className="mt-2 flex flex-1 flex-col gap-1.5 overflow-y-auto">
        {leaderboard.map((entry) => (
          <div
            key={entry.member_id}
            className={`flex items-center gap-3 rounded-md px-2.5 py-2 ${
              entry.is_me
                ? "bg-red-50 font-semibold text-gray-900"
                : "text-gray-700"
            }`}
          >
            <span
              className={`shrink-0 text-sm font-semibold ${
                entry.is_me ? "text-red-600" : "text-gray-500"
              }`}
            >
              #{entry.rank}
            </span>
            <Image
              src={entry.avatar || DEFAULT_AVATAR}
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-full object-cover"
            />
            <span className="flex-1 truncate text-sm">{entry.full_name}</span>
          </div>
        ))}
      </div>
    </StatShell>
  );
}

// ===== Shared shells =====

function CardShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border bg-white p-6">
      <div className="text-xs font-medium uppercase tracking-widest text-gray-500">
        {title}
      </div>
      {children}
    </div>
  );
}

function StatShell({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-2 rounded-xl border bg-white p-5 ${className}`}
    >
      <div className="text-xs font-medium uppercase tracking-widest text-gray-500">
        {title}
      </div>
      {children}
    </div>
  );
}

function CardLoading() {
  return (
    <div className="flex h-20 items-center justify-center">
      <span className="text-xs text-gray-400">Memuat…</span>
    </div>
  );
}

function CardError() {
  return (
    <div className="flex h-20 items-center justify-center">
      <span className="text-xs text-red-500">Gagal memuat data.</span>
    </div>
  );
}
