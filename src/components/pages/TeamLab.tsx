"use client";
import { setSessionToken, trpc } from "@/trpc/client";
import { useSidebar } from "@/contexts/SidebarContext";
import { LabStakeholderEnum, LabUseCaseStatus } from "@prisma/client";
import {
  BarChart3,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Loader2,
  Target,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import PageContainerCMS from "../pages/PageContainerCMS";
import PageHeaderCMS from "../titles/PageHeaderCMS";

const DEFAULT_AVATAR =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";

const AREA_SHORT: Record<string, string> = {
  prompt_engineering: "Prompt",
  workflow_automation: "Workflow",
  data_analysis: "Data",
  content_creation: "Content",
  ai_strategy: "Strategy",
  code_generation: "Code",
};

interface TeamLabProps {
  sessionToken: string;
}

export default function TeamLab({ sessionToken }: TeamLabProps) {
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const { data: profileData } = trpc.lab.myProfile.useQuery();
  const member = profileData?.member;
  const isChampion = member?.stakeholder_type === LabStakeholderEnum.CHAMPION;
  const isSponsor = member?.stakeholder_type === LabStakeholderEnum.SPONSOR;

  const { data: teamData, isLoading: isLoadingTeam } = trpc.lab.listTeamMembers.useQuery(undefined, {
    enabled: isChampion,
  });
  const { data: overviewData, isLoading: isLoadingOverview } = trpc.lab.executiveOverview.useQuery(undefined, {
    enabled: isSponsor,
  });

  const isLoading = isLoadingTeam || isLoadingOverview;

  return (
    <PageContainerCMS>
      <div className="container w-full flex flex-col gap-4">
        <PageHeaderCMS
          name={isSponsor ? "Departments" : "My Team"}
          desc={isSponsor ? "Overview of all departments and teams in your company" : "Track your team members' AI adoption progress"}
          icon={isChampion ? Users : Building2}
        />

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <>
            {/* Champion: team member cards */}
            {isChampion && (
              <>
                {!teamData?.team ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-2">
                    <Users className="size-8 text-muted-foreground" />
                    <p className="font-bodycopy text-sm text-muted-foreground">No team assigned yet</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 p-4 rounded-xl border bg-card">
                      <Users className="size-5 text-primary" />
                      <div>
                        <p className="font-bodycopy font-semibold text-sm text-foreground">{teamData.team.name}</p>
                        <p className="font-bodycopy text-xs text-muted-foreground">{teamData.team.department} · {teamData.team.members.length} members</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teamData.team.members.map((tm) => {
                        const m = tm.member;
                        const approved = m.use_cases.filter((u) => u.status === LabUseCaseStatus.APPROVED).length;
                        const submitted = m.use_cases.filter((u) => u.status === LabUseCaseStatus.SUBMITTED).length;
                        const avgScore = m.competency_scores.length > 0
                          ? Math.round(m.competency_scores.reduce((s, c) => s + c.score, 0) / m.competency_scores.length)
                          : null;
                        const openBlocks = m.obstacles.length;

                        return (
                          <div key={m.id} className="flex flex-col gap-4 p-4 rounded-xl border bg-card">
                            {/* Avatar + name */}
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-full overflow-hidden shrink-0">
                                <Image
                                  src={m.user.avatar || DEFAULT_AVATAR}
                                  alt={m.user.full_name}
                                  width={40}
                                  height={40}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <p className="font-bodycopy font-semibold text-sm text-foreground truncate">{m.user.full_name}</p>
                                <p className="font-bodycopy text-xs text-muted-foreground">{m.user.email}</p>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-card-inside-bg">
                                <div className="flex items-center gap-1.5">
                                  <CheckCircle2 className="size-3.5 text-success-foreground" />
                                  <span className="font-bodycopy text-xs text-muted-foreground">Approved</span>
                                </div>
                                <span className="font-bodycopy font-bold text-lg text-foreground">{approved}</span>
                              </div>
                              <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-card-inside-bg">
                                <div className="flex items-center gap-1.5">
                                  <BarChart3 className="size-3.5 text-primary" />
                                  <span className="font-bodycopy text-xs text-muted-foreground">Pending</span>
                                </div>
                                <span className="font-bodycopy font-bold text-lg text-foreground">{submitted}</span>
                              </div>
                              <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-card-inside-bg">
                                <div className="flex items-center gap-1.5">
                                  <BrainCircuit className="size-3.5 text-tertiary" />
                                  <span className="font-bodycopy text-xs text-muted-foreground">Avg Score</span>
                                </div>
                                <span className="font-bodycopy font-bold text-lg text-foreground">
                                  {avgScore != null ? `${avgScore}%` : "—"}
                                </span>
                              </div>
                              <div className="flex flex-col gap-0.5 p-2 rounded-lg bg-card-inside-bg">
                                <div className="flex items-center gap-1.5">
                                  <Target className="size-3.5 text-destructive" />
                                  <span className="font-bodycopy text-xs text-muted-foreground">Blockers</span>
                                </div>
                                <span className={`font-bodycopy font-bold text-lg ${openBlocks > 0 ? "text-destructive" : "text-foreground"}`}>
                                  {openBlocks}
                                </span>
                              </div>
                            </div>

                            {/* Competency bar */}
                            {m.competency_scores.length > 0 && (
                              <div className="flex flex-col gap-1.5">
                                {m.competency_scores.slice(0, 3).map((cs) => (
                                  <div key={cs.competency_area} className="flex items-center gap-2">
                                    <span className="font-bodycopy text-xs text-muted-foreground w-16 shrink-0">{AREA_SHORT[cs.competency_area]}</span>
                                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                                      <div className="h-full rounded-full bg-primary" style={{ width: `${cs.score}%` }} />
                                    </div>
                                    <span className="font-bodycopy text-xs text-muted-foreground w-8 text-right">{cs.score}%</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Sponsor: all teams */}
            {isSponsor && (
              <>
                {!overviewData || overviewData.teams.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-2">
                    <Building2 className="size-8 text-muted-foreground" />
                    <p className="font-bodycopy text-sm text-muted-foreground">No teams created yet</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {overviewData.teams.map((team) => (
                      <div key={team.id} className="flex flex-col gap-3 p-4 rounded-xl border bg-card">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 shrink-0">
                            <Building2 className="size-5 text-primary" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <p className="font-bodycopy font-semibold text-sm text-foreground truncate">{team.name}</p>
                            {team.department && <p className="font-bodycopy text-xs text-muted-foreground">{team.department}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-card-inside-bg">
                          <Image
                            src={team.champion.user.avatar || DEFAULT_AVATAR}
                            alt={team.champion.user.full_name}
                            width={24}
                            height={24}
                            className="rounded-full object-cover"
                          />
                          <div className="flex flex-col min-w-0">
                            <p className="font-bodycopy text-xs text-muted-foreground">Champion</p>
                            <p className="font-bodycopy font-medium text-xs text-foreground truncate">{team.champion.user.full_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="size-3.5 text-muted-foreground" />
                          <span className="font-bodycopy text-xs text-muted-foreground">{team._count.members} members</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </PageContainerCMS>
  );
}
