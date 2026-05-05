"use client";
import { setSessionToken, trpc } from "@/trpc/client";
import { LabStakeholderEnum, LabUseCaseStatus } from "@prisma/client";
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  Clock,
  Loader2,
  MessageSquare,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import AppScorecardDashboard from "../cards/AppScorecardDashboard";
import PageContainerCMS from "./PageContainerCMS";

const AREA_LABELS: Record<string, string> = {
  prompt_engineering: "Prompt Engineering",
  workflow_automation: "Workflow Automation",
  data_analysis: "Data Analysis",
  content_creation: "Content Creation",
  ai_strategy: "AI Strategy",
  code_generation: "Code Generation",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  submitted: "bg-primary/10 text-primary",
  reviewed: "bg-warning-background text-warning-foreground",
  approved: "bg-success-background text-success-foreground",
};

interface HomeLabProps {
  sessionToken: string;
}

export default function HomeLab({ sessionToken }: HomeLabProps) {
  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const { data: profileData, isLoading: isLoadingProfile } = trpc.lab.myProfile.useQuery();
  const { data: useCasesData, isLoading: isLoadingCases } = trpc.lab.listUseCases.useQuery(undefined, {
    enabled: !!profileData,
  });
  const { data: scoresData, isLoading: isLoadingScores } = trpc.lab.listCompetencyScores.useQuery(undefined, {
    enabled: !!profileData,
  });
  const { data: notesData } = trpc.lab.listCoachingNotes.useQuery(undefined, {
    enabled: !!profileData,
  });
  const { data: obstaclesData } = trpc.lab.listObstacles.useQuery(undefined, {
    enabled: !!profileData,
  });
  const { data: overviewData } = trpc.lab.executiveOverview.useQuery(undefined, {
    enabled: profileData?.member.stakeholder_type === LabStakeholderEnum.SPONSOR,
  });
  const { data: teamData } = trpc.lab.listTeamMembers.useQuery(undefined, {
    enabled: profileData?.member.stakeholder_type === LabStakeholderEnum.CHAMPION,
  });

  const isLoading = isLoadingProfile;
  const member = profileData?.member;
  const isStudent = member?.stakeholder_type === LabStakeholderEnum.STUDENT;
  const isChampion = member?.stakeholder_type === LabStakeholderEnum.CHAMPION;
  const isSponsor = member?.stakeholder_type === LabStakeholderEnum.SPONSOR;

  const useCases = useCasesData?.list ?? [];
  const scores = scoresData?.list ?? [];
  const unreadNotes = notesData?.list.filter((n) => !n.is_read).length ?? 0;
  const openObstacles = obstaclesData?.list.filter((o) => !o.resolved).length ?? 0;

  const avgScore =
    scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
      : 0;

  const approvedCases = useCases.filter((u) => u.status === LabUseCaseStatus.APPROVED).length;
  const pendingReview = useCases.filter((u) => u.status === LabUseCaseStatus.SUBMITTED).length;

  return (
    <PageContainerCMS>
      <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col gap-1">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            <span className="font-bodycopy text-sm">Loading...</span>
          </div>
        ) : (
          <>
            <h1 className="font-bodycopy font-bold text-2xl text-foreground">
              {isStudent && "My Dashboard"}
              {isChampion && "Champion Dashboard"}
              {isSponsor && "Executive Dashboard"}
            </h1>
            <p className="font-bodycopy text-sm text-muted-foreground">
              {member?.company?.name ?? ""} · {member?.department ?? ""}
              {member?.job_title ? ` · ${member.job_title}` : ""}
            </p>
          </>
        )}
      </div>

      {/* Student View */}
      {isStudent && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AppScorecardDashboard
              title="Use Cases"
              value={useCases.length}
              icon={<BookOpen className="size-4 text-white" />}
              iconClassName="bg-gradient-to-br from-primary/70 to-primary"
            />
            <AppScorecardDashboard
              title="Approved"
              value={approvedCases}
              icon={<CheckCircle2 className="size-4 text-white" />}
              iconClassName="bg-gradient-to-br from-success/70 to-success"
            />
            <AppScorecardDashboard
              title="Avg Competency"
              value={`${avgScore}%`}
              icon={<BrainCircuit className="size-4 text-white" />}
              iconClassName="bg-gradient-to-br from-tertiary/70 to-tertiary"
            />
            <AppScorecardDashboard
              title="Open Obstacles"
              value={openObstacles}
              icon={<Target className="size-4 text-white" />}
              iconClassName="bg-gradient-to-br from-warning/70 to-warning"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Use Cases */}
            <div className="flex flex-col gap-3 p-4 rounded-xl border bg-card">
              <div className="flex items-center justify-between">
                <h2 className="font-bodycopy font-semibold text-sm text-foreground">Recent Use Cases</h2>
                <Link href="/use-cases" className="font-bodycopy text-xs text-primary hover:underline">
                  View all
                </Link>
              </div>
              {isLoadingCases ? (
                <div className="flex justify-center py-4"><Loader2 className="size-4 animate-spin text-muted-foreground" /></div>
              ) : useCases.length === 0 ? (
                <p className="font-bodycopy text-sm text-muted-foreground py-4 text-center">
                  No use cases yet. <Link href="/use-cases" className="text-primary hover:underline">Log your first one</Link>
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {useCases.slice(0, 4).map((uc) => (
                    <div key={uc.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="font-bodycopy font-medium text-sm text-foreground truncate">{uc.title}</p>
                        <p className="font-bodycopy text-xs text-muted-foreground">{AREA_LABELS[uc.competency_area]}</p>
                      </div>
                      <span className={`shrink-0 ml-2 px-2 py-0.5 rounded-full text-xs font-bodycopy font-medium ${STATUS_COLORS[uc.status]}`}>
                        {uc.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Competency Scores */}
            <div className="flex flex-col gap-3 p-4 rounded-xl border bg-card">
              <div className="flex items-center justify-between">
                <h2 className="font-bodycopy font-semibold text-sm text-foreground">Competency Profile</h2>
                <Link href="/competency" className="font-bodycopy text-xs text-primary hover:underline">
                  View all
                </Link>
              </div>
              {isLoadingScores ? (
                <div className="flex justify-center py-4"><Loader2 className="size-4 animate-spin text-muted-foreground" /></div>
              ) : scores.length === 0 ? (
                <p className="font-bodycopy text-sm text-muted-foreground py-4 text-center">No scores assessed yet</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {scores.map((s) => (
                    <div key={s.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bodycopy text-xs text-muted-foreground">{AREA_LABELS[s.competency_area]}</span>
                        <span className="font-bodycopy font-semibold text-xs text-foreground">{s.score}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${s.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coaching Notes Banner */}
          {unreadNotes > 0 && (
            <Link href="/coaching">
              <div className="flex items-center gap-3 p-4 rounded-xl border bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors cursor-pointer">
                <MessageSquare className="size-5 text-primary shrink-0" />
                <p className="font-bodycopy font-medium text-sm text-foreground">
                  You have <span className="text-primary font-semibold">{unreadNotes} unread coaching note{unreadNotes > 1 ? "s" : ""}</span> from your champion
                </p>
              </div>
            </Link>
          )}
        </>
      )}

      {/* Champion View */}
      {isChampion && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AppScorecardDashboard
              title="Team Members"
              value={teamData?.team?.members.length ?? "—"}
              icon={<Users className="size-4 text-white" />}
              iconClassName="bg-gradient-to-br from-primary/70 to-primary"
            />
            <AppScorecardDashboard
              title="Pending Review"
              value={pendingReview}
              icon={<Clock className="size-4 text-white" />}
              iconClassName="bg-gradient-to-br from-warning/70 to-warning"
            />
            <AppScorecardDashboard
              title="Approved Cases"
              value={approvedCases}
              icon={<CheckCircle2 className="size-4 text-white" />}
              iconClassName="bg-gradient-to-br from-success/70 to-success"
            />
            <AppScorecardDashboard
              title="Open Obstacles"
              value={openObstacles}
              icon={<Target className="size-4 text-white" />}
              iconClassName="bg-gradient-to-br from-destructive/70 to-destructive"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Team members */}
            <div className="flex flex-col gap-3 p-4 rounded-xl border bg-card">
              <div className="flex items-center justify-between">
                <h2 className="font-bodycopy font-semibold text-sm text-foreground">Team Members</h2>
                <Link href="/team" className="font-bodycopy text-xs text-primary hover:underline">View all</Link>
              </div>
              {!teamData ? (
                <div className="flex justify-center py-4"><Loader2 className="size-4 animate-spin text-muted-foreground" /></div>
              ) : !teamData.team || teamData.team.members.length === 0 ? (
                <p className="font-bodycopy text-sm text-muted-foreground py-4 text-center">No team members yet</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {teamData.team.members.slice(0, 5).map((tm) => {
                    const m = tm.member;
                    const approved = m.use_cases.filter((u) => u.status === LabUseCaseStatus.APPROVED).length;
                    const openBlocks = m.obstacles.length;
                    return (
                      <div key={m.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex flex-col gap-0.5">
                          <p className="font-bodycopy font-medium text-sm text-foreground">{m.user.full_name}</p>
                          <p className="font-bodycopy text-xs text-muted-foreground">{m.use_cases.length} cases · {approved} approved</p>
                        </div>
                        {openBlocks > 0 && (
                          <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-bodycopy font-medium bg-destructive/10 text-destructive">
                            {openBlocks} obstacle{openBlocks > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pending Reviews */}
            <div className="flex flex-col gap-3 p-4 rounded-xl border bg-card">
              <div className="flex items-center justify-between">
                <h2 className="font-bodycopy font-semibold text-sm text-foreground">Awaiting Review</h2>
                <Link href="/use-cases" className="font-bodycopy text-xs text-primary hover:underline">Review all</Link>
              </div>
              {isLoadingCases ? (
                <div className="flex justify-center py-4"><Loader2 className="size-4 animate-spin text-muted-foreground" /></div>
              ) : pendingReview === 0 ? (
                <p className="font-bodycopy text-sm text-muted-foreground py-4 text-center">All caught up!</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {useCases.filter((u) => u.status === LabUseCaseStatus.SUBMITTED).slice(0, 4).map((uc) => (
                    <div key={uc.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="font-bodycopy font-medium text-sm text-foreground truncate">{uc.title}</p>
                        <p className="font-bodycopy text-xs text-muted-foreground">{uc.member.user.full_name} · {AREA_LABELS[uc.competency_area]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Sponsor View */}
      {isSponsor && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AppScorecardDashboard
              title="Total Members"
              value={overviewData?.stats.totalMembers ?? "—"}
              icon={<Users className="size-4 text-white" />}
              iconClassName="bg-gradient-to-br from-primary/70 to-primary"
            />
            <AppScorecardDashboard
              title="Approved Cases"
              value={overviewData?.stats.approvedUseCases ?? "—"}
              icon={<CheckCircle2 className="size-4 text-white" />}
              iconClassName="bg-gradient-to-br from-success/70 to-success"
            />
            <AppScorecardDashboard
              title="Hours Saved/wk"
              value={overviewData?.stats.totalHoursSaved ?? "—"}
              icon={<TrendingUp className="size-4 text-white" />}
              iconClassName="bg-gradient-to-br from-tertiary/70 to-tertiary"
            />
            <AppScorecardDashboard
              title="Avg Competency"
              value={overviewData?.stats.avgCompetencyScore != null ? `${overviewData.stats.avgCompetencyScore}%` : "—"}
              icon={<BarChart3 className="size-4 text-white" />}
              iconClassName="bg-gradient-to-br from-warning/70 to-warning"
            />
          </div>

          {/* Teams */}
          <div className="flex flex-col gap-3 p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between">
              <h2 className="font-bodycopy font-semibold text-sm text-foreground">Teams</h2>
              <Link href="/team" className="font-bodycopy text-xs text-primary hover:underline">View all</Link>
            </div>
            {!overviewData ? (
              <div className="flex justify-center py-4"><Loader2 className="size-4 animate-spin text-muted-foreground" /></div>
            ) : overviewData.teams.length === 0 ? (
              <p className="font-bodycopy text-sm text-muted-foreground py-4 text-center">No teams yet</p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {overviewData.teams.map((team) => (
                  <div key={team.id} className="flex flex-col gap-1 p-3 rounded-lg border bg-card-inside-bg">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="size-4 text-primary shrink-0" />
                      <p className="font-bodycopy font-semibold text-sm text-foreground truncate">{team.name}</p>
                    </div>
                    <p className="font-bodycopy text-xs text-muted-foreground">{team.champion.user.full_name} · {team._count.members} members</p>
                    {team.department && <p className="font-bodycopy text-xs text-muted-foreground">{team.department}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Use cases by area */}
          {overviewData?.stats.byArea && Object.keys(overviewData.stats.byArea).length > 0 && (
            <div className="flex flex-col gap-3 p-4 rounded-xl border bg-card">
              <h2 className="font-bodycopy font-semibold text-sm text-foreground">Use Cases by AI Area</h2>
              <div className="flex flex-col gap-3">
                {Object.entries(overviewData.stats.byArea).map(([area, count]) => {
                  const total = Object.values(overviewData.stats.byArea).reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={area} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bodycopy text-xs text-muted-foreground">{AREA_LABELS[area] ?? area}</span>
                        <span className="font-bodycopy font-semibold text-xs text-foreground">{count} cases ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
      </div>
    </PageContainerCMS>
  );
}
