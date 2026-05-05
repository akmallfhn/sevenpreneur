"use client";
import AppButton from "@/components/buttons/AppButton";
import { setSessionToken, trpc } from "@/trpc/client";
import { useSidebar } from "@/contexts/SidebarContext";
import { LabCompetencyArea, LabStakeholderEnum } from "@prisma/client";
import { BrainCircuit, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageContainerCMS from "../pages/PageContainerCMS";
import AppSelect from "../fields/AppSelect";
import AppInput from "../fields/AppInput";
import AppTextArea from "../fields/AppTextArea";
import PageHeaderCMS from "../titles/PageHeaderCMS";

const AREAS: { key: LabCompetencyArea; label: string; desc: string }[] = [
  { key: LabCompetencyArea.PROMPT_ENGINEERING, label: "Prompt Engineering", desc: "Ability to craft effective prompts" },
  { key: LabCompetencyArea.WORKFLOW_AUTOMATION, label: "Workflow Automation", desc: "Integrating AI into business processes" },
  { key: LabCompetencyArea.DATA_ANALYSIS, label: "Data Analysis", desc: "Using AI to analyze and interpret data" },
  { key: LabCompetencyArea.CONTENT_CREATION, label: "Content Creation", desc: "Generating high-quality content with AI" },
  { key: LabCompetencyArea.AI_STRATEGY, label: "AI Strategy", desc: "Planning AI adoption within the organization" },
  { key: LabCompetencyArea.CODE_GENERATION, label: "Code Generation", desc: "Using AI coding assistants effectively" },
];

const SCORE_COLOR = (score: number) => {
  if (score >= 80) return "bg-success-background text-success-foreground";
  if (score >= 50) return "bg-warning-background text-warning-foreground";
  return "bg-destructive/10 text-destructive";
};

interface CompetencyLabProps {
  sessionToken: string;
}

export default function CompetencyLab({ sessionToken }: CompetencyLabProps) {
  const { isCollapsed } = useSidebar();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [scoreForm, setScoreForm] = useState<{ area: LabCompetencyArea | ""; score: string; note: string }>({
    area: "", score: "", note: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const { data: profileData } = trpc.lab.myProfile.useQuery();
  const member = profileData?.member;
  const isStudent = member?.stakeholder_type === LabStakeholderEnum.STUDENT;
  const isChampion = member?.stakeholder_type === LabStakeholderEnum.CHAMPION;

  const targetMemberId = isStudent ? member?.id : (selectedMemberId ?? undefined);

  const { data: scoresData, isLoading } = trpc.lab.listCompetencyScores.useQuery(
    { member_id: targetMemberId },
    { enabled: !!profileData && (isStudent || selectedMemberId != null) }
  );

  const { data: teamData } = trpc.lab.listTeamMembers.useQuery(undefined, {
    enabled: isChampion,
  });

  const upsertScore = trpc.lab.upsertCompetencyScore.useMutation();

  const scores = scoresData?.list ?? [];
  const scoreMap = Object.fromEntries(scores.map((s) => [s.competency_area, s]));

  const teamMemberOptions =
    teamData?.team?.members.map((tm) => ({
      label: tm.member.user.full_name,
      value: tm.member.id,
    })) ?? [];

  const handleSave = () => {
    if (!scoreForm.area || !scoreForm.score || selectedMemberId == null) {
      toast.error("Select a member, area, and score");
      return;
    }
    setIsSaving(true);
    upsertScore.mutate(
      {
        member_id: selectedMemberId,
        competency_area: scoreForm.area as LabCompetencyArea,
        score: Number(scoreForm.score),
        note: scoreForm.note.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Score saved");
          setScoreForm({ area: "", score: "", note: "" });
          utils.lab.listCompetencyScores.invalidate();
        },
        onError: (err) => toast.error("Failed", { description: err.message }),
        onSettled: () => setIsSaving(false),
      }
    );
  };

  return (
    <PageContainerCMS>
      <div className="container w-full flex flex-col gap-4">
        <PageHeaderCMS
          name="Competency Profile"
          desc={isStudent ? "Your AI competency assessment across 6 areas" : "Assess and track your team's AI competency"}
          icon={BrainCircuit}
        />

        {/* Champion: member selector + score form */}
        {isChampion && (
          <div className="flex flex-col gap-4 p-4 rounded-xl border bg-card">
            <h3 className="font-bodycopy font-semibold text-sm text-foreground">Assess a Team Member</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <AppSelect
                variant="CMS"
                selectId="member"
                selectName="Team Member"
                selectPlaceholder="Select member"
                value={selectedMemberId ?? ""}
                onChange={(v) => setSelectedMemberId(Number(v))}
                options={teamMemberOptions}
              />
              <AppSelect
                variant="CMS"
                selectId="area"
                selectName="Competency Area"
                selectPlaceholder="Select area"
                value={scoreForm.area}
                onChange={(v) => setScoreForm((p) => ({ ...p, area: v as LabCompetencyArea }))}
                options={AREAS.map((a) => ({ label: a.label, value: a.key }))}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <AppInput
                variant="CMS"
                inputId="score"
                inputName="Score (0–100)"
                inputType="number"
                inputPlaceholder="e.g. 75"
                value={scoreForm.score}
                onInputChange={(v) => setScoreForm((p) => ({ ...p, score: String(v) }))}
              />
              <AppTextArea
                variant="CMS"
                textAreaId="note"
                textAreaName="Note (optional)"
                textAreaPlaceholder="Observations or feedback..."
                textAreaHeight="h-16"
                value={scoreForm.note}
                onTextAreaChange={(v) => setScoreForm((p) => ({ ...p, note: String(v) }))}
              />
            </div>
            <div>
              <AppButton variant="tertiary" size="medium" type="button" disabled={isSaving} onClick={handleSave}>
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save Score
              </AppButton>
            </div>
          </div>
        )}

        {/* Scores */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {AREAS.map((area) => {
              const score = scoreMap[area.key];
              return (
                <div key={area.key} className="flex flex-col gap-3 p-4 rounded-xl border bg-card">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bodycopy font-semibold text-sm text-foreground">{area.label}</h3>
                    {score ? (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bodycopy font-semibold ${SCORE_COLOR(score.score)}`}>
                        {score.score}%
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bodycopy font-medium bg-muted text-muted-foreground">
                        Not assessed
                      </span>
                    )}
                  </div>
                  <p className="font-bodycopy text-xs text-muted-foreground">{area.desc}</p>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: score ? `${score.score}%` : "0%" }}
                    />
                  </div>
                  {score?.note && (
                    <p className="font-bodycopy text-xs text-muted-foreground italic">&ldquo;{score.note}&rdquo;</p>
                  )}
                  {score && (
                    <p className="font-bodycopy text-xs text-muted-foreground">
                      Assessed by {score.assessor.user.full_name}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && scores.length === 0 && isStudent && (
          <p className="font-bodycopy text-sm text-muted-foreground text-center py-4">
            Your champion hasn&apos;t assessed your competencies yet. Focus on logging use cases!
          </p>
        )}
      </div>
    </PageContainerCMS>
  );
}
