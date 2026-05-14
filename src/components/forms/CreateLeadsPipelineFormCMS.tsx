"use client";
import { trpc } from "@/trpc/client";
import {
  B2BProductEnum,
  B2BSourceEnum,
  B2BStageEnum,
} from "@prisma/client";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import AppInput from "../fields/AppInput";
import AppSelect from "../fields/AppSelect";
import AppSheet from "../modals/AppSheet";

interface CreateLeadsPipelineFormCMSProps {
  sessionToken: string;
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

export default function CreateLeadsPipelineFormCMS(props: CreateLeadsPipelineFormCMSProps) {
  const utils = trpc.useUtils();
  const createPipeline = trpc.create.b2b.pipeline.useMutation();
  const { data: sessionData } = trpc.auth.checkSession.useQuery(undefined, {
    enabled: !!props.sessionToken,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    pic_name: "",
    pic_job_title: "",
    pic_wa: "",
    pic_email: "",
    product: "" as B2BProductEnum | "",
    source: "" as B2BSourceEnum | "",
    stage: B2BStageEnum.LEAD_IDENTIFIED as B2BStageEnum,
    probability: "50",
    project_value: "",
    project_start_month: "",
    project_end_month: "",
  });
  const ownerId = sessionData?.user.id;

  const handleInputChange = (fieldName: string) => (value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      toast.error("Company name is required.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.product) {
      toast.error("Pick a product type.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.source) {
      toast.error("Pick a lead source.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.stage) {
      toast.error("Pick a pipeline stage.");
      setIsSubmitting(false);
      return;
    }
    const probability = Number(formData.probability);
    if (!Number.isInteger(probability) || probability < 0 || probability > 100) {
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
    if (!ownerId) {
      toast.error("Session not ready, try again in a moment.");
      setIsSubmitting(false);
      return;
    }

    createPipeline.mutate(
      {
        name: formData.name.trim(),
        pic_name: formData.pic_name.trim() || null,
        pic_job_title: formData.pic_job_title.trim() || null,
        pic_wa: formData.pic_wa.trim() || null,
        pic_email: formData.pic_email.trim() || null,
        product: formData.product as B2BProductEnum,
        source: formData.source as B2BSourceEnum,
        stage: formData.stage,
        probability,
        project_value: projectValue,
        project_start_month: formData.project_start_month
          ? `${formData.project_start_month}-01`
          : null,
        project_end_month: formData.project_end_month
          ? `${formData.project_end_month}-01`
          : null,
        owner_id: ownerId,
      },
      {
        onSuccess: () => {
          toast.success("Lead created.");
          setIsSubmitting(false);
          utils.list.b2b.pipelines.invalidate();
          props.onClose();
        },
        onError: (err) => {
          setIsSubmitting(false);
          toast.error("Failed to create lead.", { description: err.message });
        },
      }
    );
  };

  return (
    <AppSheet
      sheetName="Add New Lead"
      sheetDescription="Capture a new B2B lead. You can manage activities after creating it."
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <form
        className="relative w-full h-full flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="form-container flex flex-col h-full px-6 pb-32 gap-5 overflow-y-auto">
          <div className="group-input flex flex-col gap-4">
            <AppInput
              variant="CMS"
              inputId="lead-name"
              inputName="Company Name"
              inputType="text"
              inputPlaceholder="e.g. PT Maju Bersama"
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
              inputPlaceholder="e.g. 50"
              value={formData.probability}
              onInputChange={handleInputChange("probability")}
              required
            />
            <AppInput
              variant="CMS"
              inputId="lead-project-value"
              inputName="Project Value (IDR)"
              inputType="number"
              inputPlaceholder="e.g. 50000000"
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
              Person in Charge (optional)
            </h4>
            <AppInput
              variant="CMS"
              inputId="lead-pic-name"
              inputName="PIC Name"
              inputType="text"
              inputPlaceholder="e.g. Budi Santoso"
              value={formData.pic_name}
              onInputChange={handleInputChange("pic_name")}
            />
            <AppInput
              variant="CMS"
              inputId="lead-pic-job-title"
              inputName="PIC Job Title"
              inputType="text"
              inputPlaceholder="e.g. Head of L&D"
              value={formData.pic_job_title}
              onInputChange={handleInputChange("pic_job_title")}
            />
            <AppInput
              variant="CMS"
              inputId="lead-pic-wa"
              inputName="PIC WhatsApp"
              inputType="text"
              inputPlaceholder="e.g. 6281234567890"
              value={formData.pic_wa}
              onInputChange={handleInputChange("pic_wa")}
            />
            <AppInput
              variant="CMS"
              inputId="lead-pic-email"
              inputName="PIC Email"
              inputType="email"
              inputPlaceholder="e.g. budi@majubersama.co.id"
              value={formData.pic_email}
              onInputChange={handleInputChange("pic_email")}
            />
          </div>
        </div>
        <div className="sticky bottom-0 w-full p-4 bg-sb-bg z-40">
          <AppButton
            className="w-full"
            variant="tertiary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin size-4" />}
            Create Lead
          </AppButton>
        </div>
      </form>
    </AppSheet>
  );
}
