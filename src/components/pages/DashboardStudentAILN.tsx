"use client";
import TodayFocusCardAILN from "@/components/cards/TodayFocusCardAILN";
import LevelProgressCardAILN from "@/components/charts/LevelProgressCardAILN";
import StreakCardAILN from "@/components/charts/StreakCardAILN";
import DeptLeaderboardAILN from "@/components/indexes/DeptLeaderboardAILN";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import AppErrorComponents from "@/components/states/AppErrorComponents";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

dayjs.locale("id");

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

  // Cohort window: starts on the most recent Tuesday on or before today,
  // runs forward 3 months.
  const daysFromTuesday = (dayjs().day() - 2 + 7) % 7;
  const cohortStart = dayjs()
    .subtract(daysFromTuesday, "day")
    .format("YYYY-MM-DD");
  const cohortEnd = dayjs()
    .subtract(daysFromTuesday, "day")
    .add(3, "month")
    .format("YYYY-MM-DD");

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
            <TodayFocusCardAILN />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <StreakCardAILN startDate={cohortStart} endDate={cohortEnd} />
              <LevelProgressCardAILN />
            </div>
          </div>
          <div className="lg:col-span-1">
            <DeptLeaderboardAILN className="h-full" />
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
