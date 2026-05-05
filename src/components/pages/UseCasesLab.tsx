"use client";
import AppButton from "@/components/buttons/AppButton";
import { setSessionToken, trpc } from "@/trpc/client";
import { useSidebar } from "@/contexts/SidebarContext";
import { LabCompetencyArea, LabStakeholderEnum, LabUseCaseStatus } from "@prisma/client";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  Plus,
  Send,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import PageContainerCMS from "../pages/PageContainerCMS";
import AppSelect from "../fields/AppSelect";
import AppInput from "../fields/AppInput";
import AppTextArea from "../fields/AppTextArea";
import PageHeaderCMS from "../titles/PageHeaderCMS";

const AREA_OPTIONS = [
  { label: "Prompt Engineering", value: LabCompetencyArea.PROMPT_ENGINEERING },
  { label: "Workflow Automation", value: LabCompetencyArea.WORKFLOW_AUTOMATION },
  { label: "Data Analysis", value: LabCompetencyArea.DATA_ANALYSIS },
  { label: "Content Creation", value: LabCompetencyArea.CONTENT_CREATION },
  { label: "AI Strategy", value: LabCompetencyArea.AI_STRATEGY },
  { label: "Code Generation", value: LabCompetencyArea.CODE_GENERATION },
];

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

const IMPACT_LABELS: Record<number, string> = {
  1: "Low", 2: "Mild", 3: "Moderate", 4: "High", 5: "Very High",
};

interface UseCasesLabProps {
  sessionToken: string;
}

export default function UseCasesLab({ sessionToken }: UseCasesLabProps) {
  const { isCollapsed } = useSidebar();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const [showForm, setShowForm] = useState(false);
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    competency_area: "" as LabCompetencyArea | "",
    tools_used: "",
    time_saved_hours: "",
    impact_rating: "",
  });

  const { data: profileData } = trpc.lab.myProfile.useQuery();
  const { data, isLoading } = trpc.lab.listUseCases.useQuery(undefined, { enabled: !!profileData });
  const createUseCase = trpc.lab.createUseCase.useMutation();
  const reviewUseCase = trpc.lab.reviewUseCase.useMutation();
  const deleteUseCase = trpc.lab.deleteUseCase.useMutation();

  const member = profileData?.member;
  const isStudent = member?.stakeholder_type === LabStakeholderEnum.STUDENT;
  const isChampion = member?.stakeholder_type === LabStakeholderEnum.CHAMPION;

  const useCases = data?.list ?? [];

  const handleSubmit = async (e: FormEvent, status: LabUseCaseStatus) => {
    e.preventDefault();
    if (!form.title) return toast.error("Title is required");
    if (!form.competency_area) return toast.error("AI area is required");
    setIsSubmitting(true);
    createUseCase.mutate(
      {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        competency_area: form.competency_area as LabCompetencyArea,
        tools_used: form.tools_used.trim() || undefined,
        time_saved_hours: form.time_saved_hours ? Number(form.time_saved_hours) : undefined,
        impact_rating: form.impact_rating ? Number(form.impact_rating) : undefined,
        status,
      },
      {
        onSuccess: () => {
          toast.success(status === LabUseCaseStatus.SUBMITTED ? "Use case submitted!" : "Draft saved");
          setForm({ title: "", description: "", competency_area: "", tools_used: "", time_saved_hours: "", impact_rating: "" });
          setShowForm(false);
          utils.lab.listUseCases.invalidate();
        },
        onError: (err) => toast.error("Failed", { description: err.message }),
        onSettled: () => setIsSubmitting(false),
      }
    );
  };

  const handleReview = async (id: number, status: LabUseCaseStatus.REVIEWED | LabUseCaseStatus.APPROVED) => {
    setIsReviewing(true);
    reviewUseCase.mutate(
      { id, status, champion_note: reviewNote.trim() || undefined },
      {
        onSuccess: () => {
          toast.success(status === LabUseCaseStatus.APPROVED ? "Use case approved!" : "Use case reviewed");
          setReviewingId(null);
          setReviewNote("");
          utils.lab.listUseCases.invalidate();
        },
        onError: (err) => toast.error("Failed", { description: err.message }),
        onSettled: () => setIsReviewing(false),
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteUseCase.mutate(
      { id },
      {
        onSuccess: () => { toast.success("Deleted"); utils.lab.listUseCases.invalidate(); },
        onError: (err) => toast.error("Failed", { description: err.message }),
      }
    );
  };

  return (
    <PageContainerCMS>
      <div className="container w-full flex flex-col gap-4">
        <PageHeaderCMS
          name={isChampion ? "Review Queue" : "My Use Cases"}
          desc={isChampion ? "Review and approve AI use cases submitted by your team" : "Document AI use cases you've implemented at work"}
          icon={BookOpen}
        >
          {isStudent && (
            <AppButton variant="tertiary" size="medium" type="button" onClick={() => setShowForm((v) => !v)}>
              {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
              {showForm ? "Cancel" : "Log Use Case"}
            </AppButton>
          )}
        </PageHeaderCMS>

        {/* Create Form */}
        {showForm && isStudent && (
          <form className="flex flex-col gap-4 p-4 rounded-xl border bg-card">
            <h3 className="font-bodycopy font-semibold text-sm text-foreground">New Use Case</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <AppInput
                variant="CMS"
                inputId="title"
                inputName="Title"
                inputType="text"
                inputPlaceholder="e.g. Automated weekly report with GPT-4"
                value={form.title}
                onInputChange={(v) => setForm((p) => ({ ...p, title: String(v) }))}
                required
              />
              <AppSelect
                variant="CMS"
                selectId="area"
                selectName="AI Area"
                selectPlaceholder="Select competency area"
                value={form.competency_area}
                onChange={(v) => setForm((p) => ({ ...p, competency_area: v as LabCompetencyArea }))}
                options={AREA_OPTIONS}
                required
              />
            </div>
            <AppTextArea
              variant="CMS"
              textAreaId="description"
              textAreaName="Description"
              textAreaPlaceholder="Describe what you did, the tools you used, and the outcome"
              textAreaHeight="h-28"
              value={form.description}
              onTextAreaChange={(v) => setForm((p) => ({ ...p, description: String(v) }))}
            />
            <div className="grid md:grid-cols-3 gap-4">
              <AppInput
                variant="CMS"
                inputId="tools"
                inputName="Tools Used"
                inputType="text"
                inputPlaceholder="e.g. ChatGPT, Zapier"
                value={form.tools_used}
                onInputChange={(v) => setForm((p) => ({ ...p, tools_used: String(v) }))}
              />
              <AppInput
                variant="CMS"
                inputId="time-saved"
                inputName="Hours Saved / Week"
                inputType="number"
                inputPlaceholder="e.g. 3"
                value={form.time_saved_hours}
                onInputChange={(v) => setForm((p) => ({ ...p, time_saved_hours: String(v) }))}
              />
              <AppSelect
                variant="CMS"
                selectId="impact"
                selectName="Impact Rating"
                selectPlaceholder="Self-assess impact"
                value={form.impact_rating}
                onChange={(v) => setForm((p) => ({ ...p, impact_rating: String(v) }))}
                options={[1, 2, 3, 4, 5].map((n) => ({ label: `${n} — ${IMPACT_LABELS[n]}`, value: n }))}
              />
            </div>
            <div className="flex items-center gap-3">
              <AppButton variant="light" size="medium" type="button" disabled={isSubmitting} onClick={(e) => handleSubmit(e, LabUseCaseStatus.DRAFT)}>
                {isSubmitting && <Loader2 className="size-4 animate-spin" />} Save Draft
              </AppButton>
              <AppButton variant="tertiary" size="medium" type="button" disabled={isSubmitting} onClick={(e) => handleSubmit(e, LabUseCaseStatus.SUBMITTED)}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />} Submit for Review
              </AppButton>
            </div>
          </form>
        )}

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : useCases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <BookOpen className="size-8 text-muted-foreground" />
            <p className="font-bodycopy text-sm text-muted-foreground">
              {isStudent ? "No use cases yet. Start by logging your first one!" : "No use cases submitted by your team yet"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {useCases.map((uc) => (
              <div key={uc.id} className="flex flex-col gap-3 p-4 rounded-xl border bg-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bodycopy font-semibold text-sm text-foreground">{uc.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bodycopy font-medium ${STATUS_COLORS[uc.status]}`}>
                        {uc.status}
                      </span>
                    </div>
                    {isChampion && (
                      <p className="font-bodycopy text-xs text-muted-foreground">{uc.member.user.full_name} · {uc.member.department}</p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap mt-1">
                      <span className="font-bodycopy text-xs text-primary">{AREA_LABELS[uc.competency_area]}</span>
                      {uc.tools_used && <span className="font-bodycopy text-xs text-muted-foreground">Tools: {uc.tools_used}</span>}
                      {uc.time_saved_hours != null && (
                        <span className="flex items-center gap-1 font-bodycopy text-xs text-muted-foreground">
                          <Clock className="size-3" /> {uc.time_saved_hours}h/week saved
                        </span>
                      )}
                      {uc.impact_rating != null && (
                        <span className="flex items-center gap-1 font-bodycopy text-xs text-muted-foreground">
                          <Star className="size-3" /> Impact: {uc.impact_rating}/5
                        </span>
                      )}
                    </div>
                    {uc.description && (
                      <p className="font-bodycopy text-xs text-muted-foreground mt-1 line-clamp-2">{uc.description}</p>
                    )}
                    {uc.champion_note && (
                      <div className="mt-2 p-2 rounded-md bg-muted text-xs font-bodycopy text-foreground">
                        <span className="font-semibold">Champion note: </span>{uc.champion_note}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isStudent && uc.status === LabUseCaseStatus.DRAFT && (
                      <AppButton size="smallIcon" variant="destructive" type="button" onClick={() => handleDelete(uc.id)}>
                        <Trash2 className="size-3.5" />
                      </AppButton>
                    )}
                  </div>
                </div>

                {/* Champion review panel */}
                {isChampion && uc.status === LabUseCaseStatus.SUBMITTED && (
                  <div className="border-t pt-3">
                    {reviewingId === uc.id ? (
                      <div className="flex flex-col gap-2">
                        <AppTextArea
                          variant="CMS"
                          textAreaId={`note-${uc.id}`}
                          textAreaName="Review Note (optional)"
                          textAreaPlaceholder="Add feedback or suggestions for the student..."
                          textAreaHeight="h-20"
                          value={reviewNote}
                          onTextAreaChange={(v) => setReviewNote(String(v))}
                        />
                        <div className="flex items-center gap-2">
                          <AppButton variant="light" size="small" type="button" onClick={() => { setReviewingId(null); setReviewNote(""); }}>Cancel</AppButton>
                          <AppButton variant="light" size="small" type="button" disabled={isReviewing} onClick={() => handleReview(uc.id, LabUseCaseStatus.REVIEWED)}>
                            {isReviewing && <Loader2 className="size-3 animate-spin" />} Mark Reviewed
                          </AppButton>
                          <AppButton variant="tertiary" size="small" type="button" disabled={isReviewing} onClick={() => handleReview(uc.id, LabUseCaseStatus.APPROVED)}>
                            {isReviewing ? <Loader2 className="size-3 animate-spin" /> : <CheckCircle2 className="size-3" />} Approve
                          </AppButton>
                        </div>
                      </div>
                    ) : (
                      <AppButton variant="light" size="small" type="button" onClick={() => setReviewingId(uc.id)}>
                        <ChevronDown className="size-3.5" /> Review This
                      </AppButton>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainerCMS>
  );
}
