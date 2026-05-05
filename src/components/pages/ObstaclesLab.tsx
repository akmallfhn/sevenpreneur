"use client";
import AppButton from "@/components/buttons/AppButton";
import { setSessionToken, trpc } from "@/trpc/client";
import { useSidebar } from "@/contexts/SidebarContext";
import { LabStakeholderEnum } from "@prisma/client";
import { CheckCircle2, Loader2, Plus, Target, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageContainerCMS from "../pages/PageContainerCMS";
import PageHeaderCMS from "../titles/PageHeaderCMS";
import AppInput from "../fields/AppInput";
import AppTextArea from "../fields/AppTextArea";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

interface ObstaclesLabProps {
  sessionToken: string;
}

export default function ObstaclesLab({ sessionToken }: ObstaclesLabProps) {
  const { isCollapsed } = useSidebar();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: profileData } = trpc.lab.myProfile.useQuery();
  const member = profileData?.member;
  const isStudent = member?.stakeholder_type === LabStakeholderEnum.STUDENT;
  const isChampion = member?.stakeholder_type === LabStakeholderEnum.CHAMPION;

  const { data, isLoading } = trpc.lab.listObstacles.useQuery(undefined, { enabled: !!profileData });
  const createObstacle = trpc.lab.createObstacle.useMutation();
  const resolveObstacle = trpc.lab.resolveObstacle.useMutation();
  const deleteObstacle = trpc.lab.deleteObstacle.useMutation();

  const obstacles = data?.list ?? [];
  const open = obstacles.filter((o) => !o.resolved);
  const resolved = obstacles.filter((o) => o.resolved);

  const handleCreate = () => {
    if (!form.title.trim()) return toast.error("Title is required");
    setIsSubmitting(true);
    createObstacle.mutate(
      { title: form.title.trim(), description: form.description.trim() || undefined },
      {
        onSuccess: () => {
          toast.success("Obstacle reported");
          setForm({ title: "", description: "" });
          setShowForm(false);
          utils.lab.listObstacles.invalidate();
        },
        onError: (err) => toast.error("Failed", { description: err.message }),
        onSettled: () => setIsSubmitting(false),
      }
    );
  };

  const handleResolve = (id: number) => {
    resolveObstacle.mutate(
      { id },
      {
        onSuccess: () => { toast.success("Resolved!"); utils.lab.listObstacles.invalidate(); },
        onError: (err) => toast.error("Failed", { description: err.message }),
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteObstacle.mutate(
      { id },
      {
        onSuccess: () => { toast.success("Deleted"); utils.lab.listObstacles.invalidate(); },
        onError: (err) => toast.error("Failed", { description: err.message }),
      }
    );
  };

  return (
    <PageContainerCMS>
      <div className="container w-full flex flex-col gap-4">
        <PageHeaderCMS
          name="Obstacles"
          desc={isChampion ? "Help your team resolve AI adoption blockers" : "Report and track blockers you face when adopting AI"}
          icon={Target}
        >
          {isStudent && (
            <AppButton variant="tertiary" size="medium" type="button" onClick={() => setShowForm((v) => !v)}>
              {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
              {showForm ? "Cancel" : "Report Obstacle"}
            </AppButton>
          )}
        </PageHeaderCMS>

        {/* Create form */}
        {showForm && isStudent && (
          <div className="flex flex-col gap-4 p-4 rounded-xl border bg-card">
            <h3 className="font-bodycopy font-semibold text-sm text-foreground">Report an Obstacle</h3>
            <AppInput
              variant="CMS"
              inputId="title"
              inputName="Title"
              inputType="text"
              inputPlaceholder="e.g. Can't access ChatGPT at work"
              value={form.title}
              onInputChange={(v) => setForm((p) => ({ ...p, title: String(v) }))}
              required
            />
            <AppTextArea
              variant="CMS"
              textAreaId="description"
              textAreaName="Description (optional)"
              textAreaPlaceholder="Describe the obstacle in more detail..."
              textAreaHeight="h-24"
              value={form.description}
              onTextAreaChange={(v) => setForm((p) => ({ ...p, description: String(v) }))}
            />
            <AppButton variant="tertiary" size="medium" type="button" disabled={isSubmitting} onClick={handleCreate}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              Report
            </AppButton>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
        ) : obstacles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <Target className="size-8 text-muted-foreground" />
            <p className="font-bodycopy text-sm text-muted-foreground">
              {isStudent ? "No obstacles reported. Great progress!" : "No obstacles from your team yet"}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Open obstacles */}
            {open.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="font-bodycopy font-semibold text-xs text-muted-foreground uppercase tracking-wider">Open ({open.length})</h3>
                {open.map((o) => (
                  <div key={o.id} className="flex flex-col gap-2 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1 min-w-0">
                        <p className="font-bodycopy font-semibold text-sm text-foreground">{o.title}</p>
                        {isChampion && (
                          <p className="font-bodycopy text-xs text-muted-foreground">{o.reporter.user.full_name}</p>
                        )}
                        <p className="font-bodycopy text-xs text-muted-foreground">{formatDate(String(o.created_at))}</p>
                        {o.description && (
                          <p className="font-bodycopy text-sm text-muted-foreground mt-1">{o.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isChampion && (
                          <AppButton variant="tertiary" size="small" type="button" onClick={() => handleResolve(o.id)}>
                            <CheckCircle2 className="size-3.5" /> Resolve
                          </AppButton>
                        )}
                        {isStudent && (
                          <AppButton size="smallIcon" variant="destructive" type="button" onClick={() => handleDelete(o.id)}>
                            <Trash2 className="size-3.5" />
                          </AppButton>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Resolved obstacles */}
            {resolved.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="font-bodycopy font-semibold text-xs text-muted-foreground uppercase tracking-wider">Resolved ({resolved.length})</h3>
                {resolved.map((o) => (
                  <div key={o.id} className="flex flex-col gap-2 p-4 rounded-xl border bg-card opacity-70">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-success-foreground shrink-0" />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <p className="font-bodycopy font-medium text-sm text-foreground line-through">{o.title}</p>
                        {o.resolver && (
                          <p className="font-bodycopy text-xs text-muted-foreground">Resolved by {o.resolver.user.full_name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </PageContainerCMS>
  );
}
