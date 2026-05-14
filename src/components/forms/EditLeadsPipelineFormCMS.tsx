"use client";
import { trpc } from "@/trpc/client";
import {
  B2BActivityTypeEnum,
  B2BProductEnum,
  B2BSourceEnum,
  B2BStageEnum,
} from "@prisma/client";
import dayjs from "dayjs";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AppInput from "../fields/AppInput";
import AppSelect from "../fields/AppSelect";
import AppTextArea from "../fields/AppTextArea";
import B2BActivityTypeLabelCMS from "../labels/B2BActivityTypeLabelCMS";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
import AppSheet from "../modals/AppSheet";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";

interface EditLeadsPipelineFormCMSProps {
  sessionToken: string;
  pipelineId: number;
  isOpen: boolean;
  onClose: () => void;
}

const PRODUCT_OPTIONS = [
  { label: "Sponsorship", value: B2BProductEnum.SPONSORSHIP },
  { label: "Corporate Training", value: B2BProductEnum.CORPORATE_TRAINING },
  {
    label: "Corporate AI Training",
    value: B2BProductEnum.CORPORATE_AI_TRAINING,
  },
];

const SOURCE_OPTIONS = [
  { label: "Social Media", value: B2BSourceEnum.SOCIAL_MEDIA },
  { label: "Founder Network", value: B2BSourceEnum.FOUNDER_NETWORK },
  { label: "Event / Conference", value: B2BSourceEnum.EVENT_CONFERENCE },
  { label: "Referral Partner", value: B2BSourceEnum.REFERRAL_PARTNER },
  { label: "Referral Client", value: B2BSourceEnum.REFERRAL_CLIENT },
  { label: "Website", value: B2BSourceEnum.WEBSITE },
];

const STAGE_OPTIONS = [
  { label: "Lead Identified", value: B2BStageEnum.LEAD_IDENTIFIED },
  { label: "Contacted", value: B2BStageEnum.CONTACTED },
  { label: "Negotiation", value: B2BStageEnum.NEGOTIATION },
  { label: "Verbal Commit", value: B2BStageEnum.VERBAL_COMMIT },
  { label: "Closed Won", value: B2BStageEnum.CLOSED_WON },
  { label: "Closed Lost", value: B2BStageEnum.CLOSED_LOST },
  { label: "On Hold", value: B2BStageEnum.ON_HOLD },
];

const ACTIVITY_TYPE_OPTIONS = [
  { label: "WhatsApp Chat", value: B2BActivityTypeEnum.CHAT_WHATSAPP },
  { label: "Cold Email", value: B2BActivityTypeEnum.COLD_EMAIL },
  { label: "Phone Call", value: B2BActivityTypeEnum.PHONE_CALL },
  { label: "Conference Call", value: B2BActivityTypeEnum.CONFERENCE_CALL },
  { label: "Offline Meeting", value: B2BActivityTypeEnum.OFFLINE_MEETING },
  { label: "In-Person Meeting", value: B2BActivityTypeEnum.IN_PERSON_MEETING },
  { label: "Sent Proposal", value: B2BActivityTypeEnum.SENT_PROPOSAL },
  { label: "Sent Contract", value: B2BActivityTypeEnum.SENT_CONTRACT },
  { label: "Follow Up", value: B2BActivityTypeEnum.FOLLOW_UP },
];

export default function EditLeadsPipelineFormCMS(
  props: EditLeadsPipelineFormCMSProps
) {
  const utils = trpc.useUtils();
  const updatePipeline = trpc.update.b2b.pipeline.useMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch tRPC data
  const {
    data: pipelineData,
    isLoading,
    isError,
  } = trpc.read.b2b.pipeline.useQuery(
    { id: props.pipelineId },
    { enabled: !!props.sessionToken }
  );
  const initialData = pipelineData?.pipeline;

  // Beginning State
  const [formData, setFormData] = useState<{
    name: string;
    pic_name: string;
    pic_job_title: string;
    pic_wa: string;
    pic_email: string;
    product: B2BProductEnum | "";
    source: B2BSourceEnum | "";
    stage: B2BStageEnum | "";
    probability: string;
    project_value: string;
    project_start_month: string;
    project_end_month: string;
  }>({
    name: initialData?.name || "",
    pic_name: initialData?.pic_name || "",
    pic_job_title: initialData?.pic_job_title || "",
    pic_wa: initialData?.pic_wa || "",
    pic_email: initialData?.pic_email || "",
    product: initialData?.product || "",
    source: initialData?.source || "",
    stage: initialData?.stage || "",
    probability: initialData ? String(initialData.probability) : "",
    project_value: initialData ? String(initialData.project_value) : "",
    project_start_month: initialData?.project_start_month
      ? dayjs(initialData.project_start_month).format("YYYY-MM")
      : "",
    project_end_month: initialData?.project_end_month
      ? dayjs(initialData.project_end_month).format("YYYY-MM")
      : "",
  });

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: initialData.name || "",
        pic_name: initialData.pic_name || "",
        pic_job_title: initialData.pic_job_title || "",
        pic_wa: initialData.pic_wa || "",
        pic_email: initialData.pic_email || "",
        product: initialData.product,
        source: initialData.source,
        stage: initialData.stage,
        probability: String(initialData.probability),
        project_value: String(initialData.project_value),
        project_start_month: initialData.project_start_month
          ? dayjs(initialData.project_start_month).format("YYYY-MM")
          : "",
        project_end_month: initialData.project_end_month
          ? dayjs(initialData.project_end_month).format("YYYY-MM")
          : "",
      });
    }
  }, [initialData]);

  // Handle data changes
  const handleInputChange = (fieldName: string) => (value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const probability = Number(formData.probability);
    if (
      !Number.isInteger(probability) ||
      probability < 0 ||
      probability > 100
    ) {
      toast.error("Probability must be an integer between 0 and 100.");
      setIsSubmitting(false);
      return;
    }
    const projectValue = Number(formData.project_value);
    if (!Number.isFinite(projectValue) || projectValue < 0) {
      toast.error("Project value must be a non-negative number.");
      setIsSubmitting(false);
      return;
    }
    if (
      formData.project_start_month &&
      formData.project_end_month &&
      formData.project_end_month < formData.project_start_month
    ) {
      toast.error("Project end month must be on or after start month.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.product || !formData.source || !formData.stage) {
      toast.error("Product, source, and stage are required.");
      setIsSubmitting(false);
      return;
    }

    updatePipeline.mutate(
      {
        id: props.pipelineId,
        name: formData.name.trim(),
        pic_name: formData.pic_name.trim() || null,
        pic_job_title: formData.pic_job_title.trim() || null,
        pic_wa: formData.pic_wa.trim() || null,
        pic_email: formData.pic_email.trim() || null,
        product: formData.product as B2BProductEnum,
        source: formData.source as B2BSourceEnum,
        stage: formData.stage as B2BStageEnum,
        probability,
        project_value: projectValue,
        project_start_month: formData.project_start_month
          ? `${formData.project_start_month}-01`
          : null,
        project_end_month: formData.project_end_month
          ? `${formData.project_end_month}-01`
          : null,
      },
      {
        onSuccess: () => {
          toast.success("Lead updated.");
          setIsSubmitting(false);
          utils.list.b2b.pipelines.invalidate();
          utils.read.b2b.pipeline.invalidate({ id: props.pipelineId });
          props.onClose();
        },
        onError: (err) => {
          setIsSubmitting(false);
          toast.error("Failed to update lead.", { description: err.message });
        },
      }
    );
  };

  return (
    <AppSheet
      sheetName="Edit Lead"
      sheetDescription="Update lead details and manage activities."
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      {isLoading && <AppLoadingComponents />}
      {isError && <AppErrorComponents />}

      {initialData && !isLoading && !isError && (
        <form
          className="relative w-full h-full flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="form-container flex flex-col h-full px-6 pb-32 gap-6 overflow-y-auto">
            <div className="group-input flex flex-col gap-4">
              <AppInput
                variant="CMS"
                inputId="lead-name"
                inputName="Company Name"
                inputType="text"
                value={formData.name}
                onInputChange={handleInputChange("name")}
                required
              />
              <AppSelect
                variant="CMS"
                selectId="lead-product"
                selectName="Product"
                selectPlaceholder="Pick a product type"
                value={formData.product}
                onChange={handleInputChange("product")}
                options={PRODUCT_OPTIONS}
                required
              />
              <AppSelect
                variant="CMS"
                selectId="lead-source"
                selectName="Source"
                selectPlaceholder="How did this lead come in?"
                value={formData.source}
                onChange={handleInputChange("source")}
                options={SOURCE_OPTIONS}
                required
              />
              <AppSelect
                variant="CMS"
                selectId="lead-stage"
                selectName="Stage"
                selectPlaceholder="Current pipeline stage"
                value={formData.stage}
                onChange={handleInputChange("stage")}
                options={STAGE_OPTIONS}
                required
              />
              <AppInput
                variant="CMS"
                inputId="lead-probability"
                inputName="Probability (1–100)"
                inputType="number"
                value={formData.probability}
                onInputChange={handleInputChange("probability")}
                required
              />
              <AppInput
                variant="CMS"
                inputId="lead-project-value"
                inputName="Project Value (IDR)"
                inputType="number"
                value={formData.project_value}
                onInputChange={handleInputChange("project_value")}
                required
              />
              <div className="flex gap-3">
                <div className="flex-1">
                  <AppInput
                    variant="CMS"
                    inputId="lead-project-start-month"
                    inputName="Project Start"
                    inputType="month"
                    value={formData.project_start_month}
                    onInputChange={handleInputChange("project_start_month")}
                  />
                </div>
                <div className="flex-1">
                  <AppInput
                    variant="CMS"
                    inputId="lead-project-end-month"
                    inputName="Project End"
                    inputType="month"
                    value={formData.project_end_month}
                    onInputChange={handleInputChange("project_end_month")}
                  />
                </div>
              </div>
            </div>

            <div className="group-input flex flex-col gap-4 pt-2 border-t border-dashboard-border">
              <h4 className="text-sm font-bodycopy font-bold pt-3">
                Person in Charge
              </h4>
              <AppInput
                variant="CMS"
                inputId="lead-pic-name"
                inputName="PIC Name"
                inputType="text"
                value={formData.pic_name}
                onInputChange={handleInputChange("pic_name")}
              />
              <AppInput
                variant="CMS"
                inputId="lead-pic-job-title"
                inputName="PIC Job Title"
                inputType="text"
                value={formData.pic_job_title}
                onInputChange={handleInputChange("pic_job_title")}
              />
              <AppInput
                variant="CMS"
                inputId="lead-pic-wa"
                inputName="PIC WhatsApp"
                inputType="text"
                value={formData.pic_wa}
                onInputChange={handleInputChange("pic_wa")}
              />
              <AppInput
                variant="CMS"
                inputId="lead-pic-email"
                inputName="PIC Email"
                inputType="email"
                value={formData.pic_email}
                onInputChange={handleInputChange("pic_email")}
              />
            </div>

            <ActionsSection pipelineId={props.pipelineId} />
          </div>

          <div className="sticky bottom-0 w-full p-4 bg-sb-bg z-40">
            <AppButton
              className="w-full"
              variant="tertiary"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="animate-spin size-4" />}
              Save Changes
            </AppButton>
          </div>
        </form>
      )}
    </AppSheet>
  );
}

// ---------------- B2B Actions inline CRUD ----------------

interface ActionsSectionProps {
  pipelineId: number;
}

function ActionsSection({ pipelineId }: ActionsSectionProps) {
  const utils = trpc.useUtils();
  const { data, isLoading, isError } = trpc.list.b2b.actions.useQuery({
    company_id: pipelineId,
  });

  const createAction = trpc.create.b2b.action.useMutation();
  const updateAction = trpc.update.b2b.action.useMutation();
  const deleteAction = trpc.delete.b2b.action.useMutation();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [newDraft, setNewDraft] = useState({
    activity_type: "" as B2BActivityTypeEnum | "",
    summary: "",
  });
  const [editDraft, setEditDraft] = useState({
    activity_type: "" as B2BActivityTypeEnum | "",
    summary: "",
  });

  const invalidate = () =>
    utils.list.b2b.actions.invalidate({ company_id: pipelineId });

  const handleCreate = () => {
    if (!newDraft.activity_type) {
      toast.error("Pick an activity type.");
      return;
    }
    if (!newDraft.summary.trim()) {
      toast.error("Summary is required.");
      return;
    }
    createAction.mutate(
      {
        company_id: pipelineId,
        activity_type: newDraft.activity_type as B2BActivityTypeEnum,
        summary: newDraft.summary.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Activity added.");
          setNewDraft({ activity_type: "", summary: "" });
          invalidate();
        },
        onError: (err) =>
          toast.error("Failed to add activity.", { description: err.message }),
      }
    );
  };

  const handleStartEdit = (
    id: number,
    activityType: B2BActivityTypeEnum,
    summary: string
  ) => {
    setEditingId(id);
    setEditDraft({ activity_type: activityType, summary });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    if (!editDraft.activity_type) {
      toast.error("Pick an activity type.");
      return;
    }
    if (!editDraft.summary.trim()) {
      toast.error("Summary is required.");
      return;
    }
    updateAction.mutate(
      {
        id: editingId,
        activity_type: editDraft.activity_type as B2BActivityTypeEnum,
        summary: editDraft.summary.trim(),
      },
      {
        onSuccess: () => {
          toast.success("Activity updated.");
          setEditingId(null);
          invalidate();
        },
        onError: (err) =>
          toast.error("Failed to update activity.", {
            description: err.message,
          }),
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteAction.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Activity deleted.");
          invalidate();
        },
        onError: (err) =>
          toast.error("Failed to delete activity.", {
            description: err.message,
          }),
      }
    );
  };

  return (
    <div className="group-input flex flex-col gap-4 pt-2 border-t border-dashboard-border">
      <h4 className="text-sm font-bodycopy font-bold pt-3">Activities</h4>

      {/* Add new activity */}
      <div className="p-4 bg-card-inside-bg border border-dashboard-border rounded-md flex flex-col gap-3">
        <AppSelect
          variant="CMS"
          selectId="new-action-type"
          selectName="Activity Type"
          selectPlaceholder="Pick activity type"
          value={newDraft.activity_type}
          onChange={(value) =>
            setNewDraft((prev) => ({
              ...prev,
              activity_type: value as B2BActivityTypeEnum,
            }))
          }
          options={ACTIVITY_TYPE_OPTIONS}
        />
        <AppTextArea
          variant="CMS"
          textAreaId="new-action-summary"
          textAreaName="Summary"
          textAreaPlaceholder="What happened in this activity?"
          textAreaHeight="h-24"
          characterLength={2000}
          value={newDraft.summary}
          onTextAreaChange={(value) =>
            setNewDraft((prev) => ({ ...prev, summary: value }))
          }
        />
        <AppButton
          variant="light"
          size="small"
          onClick={handleCreate}
          disabled={createAction.isPending}
          type="button"
        >
          {createAction.isPending ? (
            <Loader2 className="animate-spin size-4" />
          ) : (
            <Plus className="size-4" />
          )}
          Add Activity
        </AppButton>
      </div>

      {/* List existing activities */}
      {isLoading && <AppLoadingComponents />}
      {isError && <AppErrorComponents />}

      {data && !isLoading && !isError && (
        <div className="flex flex-col gap-2">
          {data.list.length === 0 && (
            <p className="text-sm text-center text-emphasis font-bodycopy py-2">
              No activities yet
            </p>
          )}

          {data.list.map((action) => {
            const isEditing = editingId === action.id;
            return (
              <div
                key={action.id}
                className="p-3 bg-white dark:bg-card-inside-bg border border-dashboard-border rounded-md flex flex-col gap-2"
              >
                {isEditing ? (
                  <>
                    <AppSelect
                      variant="CMS"
                      selectId={`edit-action-type-${action.id}`}
                      selectName="Activity Type"
                      selectPlaceholder="Pick activity type"
                      value={editDraft.activity_type}
                      onChange={(value) =>
                        setEditDraft((prev) => ({
                          ...prev,
                          activity_type: value as B2BActivityTypeEnum,
                        }))
                      }
                      options={ACTIVITY_TYPE_OPTIONS}
                    />
                    <AppTextArea
                      variant="CMS"
                      textAreaId={`edit-action-summary-${action.id}`}
                      textAreaName="Summary"
                      textAreaHeight="h-24"
                      characterLength={2000}
                      value={editDraft.summary}
                      onTextAreaChange={(value) =>
                        setEditDraft((prev) => ({ ...prev, summary: value }))
                      }
                    />
                    <div className="flex gap-2 justify-end">
                      <AppButton
                        variant="ghost"
                        size="small"
                        type="button"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="size-4" />
                        Cancel
                      </AppButton>
                      <AppButton
                        variant="tertiary"
                        size="small"
                        type="button"
                        onClick={handleSaveEdit}
                        disabled={updateAction.isPending}
                      >
                        {updateAction.isPending ? (
                          <Loader2 className="animate-spin size-4" />
                        ) : (
                          <Check className="size-4" />
                        )}
                        Save
                      </AppButton>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <B2BActivityTypeLabelCMS
                        variants={action.activity_type}
                      />
                      <div className="flex gap-1">
                        <AppButton
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() =>
                            handleStartEdit(
                              action.id,
                              action.activity_type,
                              action.summary
                            )
                          }
                        >
                          <Pencil className="size-4" />
                        </AppButton>
                        <AppButton
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={() => setDeleteTargetId(action.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </AppButton>
                      </div>
                    </div>
                    <p className="font-bodycopy text-sm text-foreground whitespace-pre-wrap">
                      {action.summary}
                    </p>
                    <p className="text-xs text-emphasis font-bodycopy">
                      {dayjs(action.created_at).format("D MMM YYYY HH:mm")}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {deleteTargetId !== null && (
        <AppAlertConfirmDialog
          alertDialogHeader="Delete this activity?"
          alertDialogMessage="This activity will be removed permanently."
          alertCancelLabel="Cancel"
          alertConfirmLabel="Delete"
          isOpen={deleteTargetId !== null}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={() => {
            handleDelete(deleteTargetId);
            setDeleteTargetId(null);
          }}
        />
      )}
    </div>
  );
}
