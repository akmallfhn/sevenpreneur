"use client";
import { setSessionToken, trpc } from "@/trpc/client";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  BarChart3,
  CheckCircle2,
  Clock,
  Loader2,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import AppScorecardDashboard from "../cards/AppScorecardDashboard";
import PageContainerCMS from "../pages/PageContainerCMS";
import PageHeaderCMS from "../titles/PageHeaderCMS";

const DEFAULT_AVATAR =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";

const AREA_LABELS: Record<string, string> = {
  prompt_engineering: "Prompt Engineering",
  workflow_automation: "Workflow Automation",
  data_analysis: "Data Analysis",
  content_creation: "Content Creation",
  ai_strategy: "AI Strategy",
  code_generation: "Code Generation",
};

interface OverviewLabProps {
  sessionToken: string;
}

export default function OverviewLab({ sessionToken }: OverviewLabProps) {
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const { data, isLoading } = trpc.lab.executiveOverview.useQuery();

  const stats = data?.stats;
  const teams = data?.teams ?? [];

  const totalAreaCount = stats?.byArea
    ? Object.values(stats.byArea).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <PageContainerCMS>
      <div className="container w-full flex flex-col gap-6">
        <PageHeaderCMS
          name="Executive Overview"
          desc="Company-wide AI adoption metrics and team performance"
          icon={BarChart3}
        />

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <>
            {/* KPI Scorecards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <AppScorecardDashboard
                title="Members"
                value={stats?.totalMembers ?? 0}
                icon={<Users className="size-4 text-white" />}
                iconClassName="bg-gradient-to-br from-primary/70 to-primary"
              />
              <AppScorecardDashboard
                title="Teams"
                value={stats?.totalTeams ?? 0}
                icon={<ShieldCheck className="size-4 text-white" />}
                iconClassName="bg-gradient-to-br from-primary/70 to-primary"
              />
              <AppScorecardDashboard
                title="Approved Cases"
                value={stats?.approvedUseCases ?? 0}
                icon={<CheckCircle2 className="size-4 text-white" />}
                iconClassName="bg-gradient-to-br from-success/70 to-success"
              />
              <AppScorecardDashboard
                title="Hours Saved/wk"
                value={stats?.totalHoursSaved ?? 0}
                icon={<Clock className="size-4 text-white" />}
                iconClassName="bg-gradient-to-br from-tertiary/70 to-tertiary"
              />
              <AppScorecardDashboard
                title="Open Obstacles"
                value={stats?.openObstacles ?? 0}
                icon={<Target className="size-4 text-white" />}
                iconClassName="bg-gradient-to-br from-destructive/70 to-destructive"
              />
              <AppScorecardDashboard
                title="Avg Competency"
                value={stats?.avgCompetencyScore != null ? `${stats.avgCompetencyScore}%` : "—"}
                icon={<TrendingUp className="size-4 text-white" />}
                iconClassName="bg-gradient-to-br from-warning/70 to-warning"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* AI Adoption by Area */}
              <div className="flex flex-col gap-4 p-4 rounded-xl border bg-card">
                <h2 className="font-bodycopy font-semibold text-sm text-foreground">AI Adoption by Area</h2>
                {!stats?.byArea || Object.keys(stats.byArea).length === 0 ? (
                  <p className="font-bodycopy text-sm text-muted-foreground py-4 text-center">No use cases approved yet</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {Object.entries(stats.byArea)
                      .sort(([, a], [, b]) => b - a)
                      .map(([area, count]) => {
                        const pct = totalAreaCount > 0 ? Math.round((count / totalAreaCount) * 100) : 0;
                        return (
                          <div key={area} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bodycopy text-xs text-muted-foreground">{AREA_LABELS[area] ?? area}</span>
                              <span className="font-bodycopy font-semibold text-xs text-foreground">{count} ({pct}%)</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                              <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Team Performance */}
              <div className="flex flex-col gap-4 p-4 rounded-xl border bg-card">
                <h2 className="font-bodycopy font-semibold text-sm text-foreground">Team Performance</h2>
                {teams.length === 0 ? (
                  <p className="font-bodycopy text-sm text-muted-foreground py-4 text-center">No teams yet</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {teams.map((team) => (
                      <div key={team.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 shrink-0">
                            <ShieldCheck className="size-4 text-primary" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <p className="font-bodycopy font-medium text-sm text-foreground truncate">{team.name}</p>
                            <div className="flex items-center gap-1">
                              <Image
                                src={team.champion.user.avatar || DEFAULT_AVATAR}
                                alt={team.champion.user.full_name}
                                width={14}
                                height={14}
                                className="rounded-full object-cover"
                              />
                              <p className="font-bodycopy text-xs text-muted-foreground truncate">{team.champion.user.full_name}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <Users className="size-3 text-muted-foreground" />
                          <span className="font-bodycopy text-xs text-muted-foreground">{team._count.members}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ROI Estimate */}
            {(stats?.totalHoursSaved ?? 0) > 0 && (
              <div className="flex flex-col gap-3 p-4 rounded-xl border bg-card">
                <h2 className="font-bodycopy font-semibold text-sm text-foreground">Estimated ROI Impact</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-card-inside-bg">
                    <p className="font-bodycopy text-xs text-muted-foreground">Hours Saved / Week</p>
                    <p className="font-bodycopy font-bold text-2xl text-foreground">{stats?.totalHoursSaved}</p>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-card-inside-bg">
                    <p className="font-bodycopy text-xs text-muted-foreground">Hours Saved / Month</p>
                    <p className="font-bodycopy font-bold text-2xl text-foreground">{(stats?.totalHoursSaved ?? 0) * 4}</p>
                  </div>
                  <div className="flex flex-col gap-1 p-3 rounded-lg bg-card-inside-bg">
                    <p className="font-bodycopy text-xs text-muted-foreground">Hours Saved / Year</p>
                    <p className="font-bodycopy font-bold text-2xl text-foreground">{(stats?.totalHoursSaved ?? 0) * 52}</p>
                  </div>
                </div>
                <p className="font-bodycopy text-xs text-muted-foreground">
                  Based on self-reported estimates from approved use cases across all teams
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </PageContainerCMS>
  );
}
