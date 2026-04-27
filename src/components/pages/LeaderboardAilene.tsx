"use client";
import { trpc } from "@/trpc/client";
import {
  BookCheck,
  Medal,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import Image from "next/image";
import AppScorecardDashboard from "../cards/AppScorecardDashboard";
import AppLoadingComponents from "../states/AppLoadingComponents";
import PageContainerCMS from "./PageContainerCMS";

export default function LeaderboardAilene() {
  const { data, isLoading } = trpc.ailene.leaderboard.useQuery();

  return (
    <PageContainerCMS className="overflow-y-auto">
      <div className="w-full flex flex-col gap-6 pb-8">
        <div className="flex flex-col gap-1">
          <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
            Leaderboard
          </h1>
          <p className="font-bodycopy text-sm text-emphasis">
            Ranking anggota berdasarkan total XP yang diperoleh.
          </p>
        </div>

        {isLoading && <AppLoadingComponents />}

        {!isLoading && data && (
          <>
            {/* Team Insights */}
            <div className="grid grid-cols-4 gap-4">
              <AppScorecardDashboard
                title="Total Members"
                icon={<Users className="size-4 text-white" />}
                iconClassName="bg-gradient-to-br from-primary/70 to-primary"
                value={<>{data.teamInsights.memberCount}</>}
              />
              <AppScorecardDashboard
                title="Team Total XP"
                icon={<Trophy className="size-4 text-white" />}
                iconClassName="bg-gradient-to-br from-tertiary/70 to-tertiary"
                value={
                  <>
                    {data.teamInsights.totalXp.toLocaleString()}{" "}
                    <span className="font-normal text-emphasis">XP</span>
                  </>
                }
              />
              <AppScorecardDashboard
                title="Lessons Completed"
                icon={<BookCheck className="size-4 text-white" />}
                iconClassName="bg-gradient-to-br from-success/70 to-success"
                value={<>{data.teamInsights.totalCompleted}</>}
              />
              <AppScorecardDashboard
                title="Team Avg Score"
                icon={<TrendingUp className="size-4 text-white" />}
                iconClassName="bg-gradient-to-br from-warning/70 to-warning"
                value={
                  data.teamInsights.avgScore != null ? (
                    <>
                      {data.teamInsights.avgScore}
                      <span className="font-normal text-emphasis">%</span>
                    </>
                  ) : (
                    <span className="font-normal text-emphasis">—</span>
                  )
                }
              />
            </div>

            {/* Ranked list */}
            {data.list.length > 0 ? (
              <div className="flex flex-col rounded-xl border border-dashboard-border bg-card-bg overflow-hidden">
                {data.list.map((member, idx) => {
                  const isTop3 = idx < 3;
                  const medalColor = ["text-warning", "text-sevenpreneur-ash", "text-tertiary"];
                  return (
                    <div
                      key={member.id}
                      className={`flex items-center gap-4 px-5 py-4 border-b border-dashboard-border last:border-b-0 ${idx === 0 ? "bg-gradient-to-r from-warning/5 to-transparent" : ""}`}
                    >
                      {/* Rank */}
                      <div className="w-7 shrink-0 flex items-center justify-center">
                        {isTop3 ? (
                          <Medal className={`size-5 ${medalColor[idx]}`} />
                        ) : (
                          <span className="font-bodycopy font-bold text-sm text-emphasis">
                            {idx + 1}
                          </span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div className="flex size-9 rounded-full overflow-hidden shrink-0 border border-dashboard-border">
                        {member.avatar ? (
                          <Image
                            src={member.avatar}
                            alt={member.full_name}
                            width={36}
                            height={36}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-primary-muted text-primary font-bold text-xs">
                            {member.full_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Name + stats */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal dark:text-white truncate">
                          {member.full_name}
                        </p>
                        <p className="font-bodycopy text-xs text-emphasis">
                          {member.completedCount} lessons selesai
                          {member.avgScore != null && ` · avg ${member.avgScore}%`}
                        </p>
                      </div>

                      {/* XP */}
                      <div className="shrink-0 text-right">
                        <p className="font-bodycopy font-bold text-sm text-sevenpreneur-coal dark:text-white">
                          {member.totalXp.toLocaleString()}
                        </p>
                        <p className="font-bodycopy text-xs text-emphasis">XP</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="font-bodycopy text-sm text-emphasis text-center py-16 border border-dashed border-dashboard-border rounded-xl">
                Belum ada data leaderboard.
              </p>
            )}
          </>
        )}
      </div>
    </PageContainerCMS>
  );
}
