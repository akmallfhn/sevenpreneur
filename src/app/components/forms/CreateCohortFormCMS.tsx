"use client";
import { Switch } from "@/components/ui/switch";
import { StatusType } from "@/lib/app-types";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import InputCMS from "../fields/InputCMS";
import TextAreaCMS from "../fields/TextAreaCMS";
import UploadImageCMS from "../fields/UploadImageCMS";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import AppSheet from "../modals/AppSheet";
import PriceTierStepperCMS, {
  PriceTier,
} from "../steppers/PriceTierStepperCMS";

interface CreateCohortFormCMSProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCohortFormCMS(props: CreateCohortFormCMSProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createCohort = trpc.create.cohort.useMutation();
  const utils = trpc.useUtils();

  // Beginning State
  const [formData, setFormData] = useState<{
    cohortName: string;
    cohortImage: string;
    cohortDescription: string;
    cohortStartDate: string;
    cohortEndDate: string;
    cohortStatus: StatusType;
    cohortPriceTiers: PriceTier[];
  }>({
    cohortName: "",
    cohortImage: "",
    cohortDescription: "",
    cohortStartDate: "",
    cohortEndDate: "",
    cohortStatus: "ACTIVE",
    cohortPriceTiers: [
      {
        name: "",
        amount: "",
        status: "ACTIVE",
      },
    ],
  });

  // Add event listener to prevent page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Handle data changes
  const handleInputChange = (fieldName: string) => (value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };
  const handleImageForm = (url: string | null) => {
    setFormData((prev) => ({
      ...prev,
      cohortImage: url ?? "",
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Required field checking
    if (!formData.cohortName) {
      toast.error("Don't leave your cohort nameless");
      setIsSubmitting(false);
      return;
    }
    if (!formData.cohortDescription) {
      toast.error("Tell us what this cohort is all about");
      setIsSubmitting(false);
      return;
    }
    if (!formData.cohortImage) {
      toast.error("Please upload a thumbnail to represent this cohort");
      setIsSubmitting(false);
      return;
    }
    if (!formData.cohortStartDate) {
      toast.error("Please select a start date");
      setIsSubmitting(false);
      return;
    }
    if (!formData.cohortEndDate) {
      toast.error("Set an end date to complete the timeline");
      setIsSubmitting(false);
      return;
    }
    if (
      dayjs(formData.cohortStartDate).isAfter(dayjs(formData.cohortEndDate))
    ) {
      toast.error("Start date can't be after the end date");
      setIsSubmitting(false);
      return;
    }
    const invalidTier = formData.cohortPriceTiers.some(
      (tier) => !tier.name.trim() || !tier.amount.trim(),
    );
    if (formData.cohortPriceTiers.length === 0 || invalidTier) {
      toast.error("A cohort with no price? Sounds generous");
      setIsSubmitting(false);
      return;
    }

    // POST to Database
    try {
      createCohort.mutate(
        {
          name: formData.cohortName.trim(),
          description: formData.cohortDescription.trim(),
          status: formData.cohortStatus,
          image: formData.cohortImage,
          start_date: new Date(formData.cohortStartDate).toISOString(),
          end_date: new Date(formData.cohortEndDate).toISOString(),
          cohort_prices: formData.cohortPriceTiers.map((tier: PriceTier) => ({
            name: tier.name.trim(),
            amount: Number(tier.amount),
            status: tier.status,
          })),
        },
        {
          onSuccess: () => {
            toast.success("All set! Your cohort is now live and ready to grow");
            setIsSubmitting(false);
            utils.list.cohorts.invalidate();
            props.onClose();
          },
          onError: (err) => {
            toast.error("Failed to create cohort", {
              description: err.message,
            });
          },
        },
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppSheet
      sheetName="Create Cohort Program"
      sheetDescription="Define your program and launch a new cohort now"
      isOpen={props.isOpen}
      onClose={props.onClose}
    >
      <form
        className="relative w-full h-full flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="form-container flex flex-col px-6 pb-96 gap-5 overflow-y-auto">
          <div className="group-input flex flex-col gap-4">
            <UploadImageCMS
              fileValue={formData.cohortImage}
              onUpload={handleImageForm}
              folderPath="cohorts"
              fileBytes={1024 * 624}
              fileSize="500 KB"
              imageRatio="16/9"
            />
            <InputCMS
              inputId="cohort-name"
              inputName="Program Name"
              inputType="text"
              inputPlaceholder="Name your program"
              value={formData.cohortName}
              onInputChange={handleInputChange("cohortName")}
              required
            />
            <TextAreaCMS
              textAreaId="cohort-description"
              textAreaName="Program Overview"
              textAreaPlaceholder="Tell us about this program"
              textAreaHeight="h-32"
              value={formData.cohortDescription}
              onTextAreaChange={handleInputChange("cohortDescription")}
              required
            />
            <div className="cohort-status flex flex-col gap-1">
              <label
                htmlFor={"cohort-status"}
                className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
              >
                Status <span className="text-red-700">*</span>
              </label>
              <div className="switch-button flex pl-1 gap-2">
                <Switch
                  className="data-[state=checked]:bg-cms-primary"
                  checked={formData.cohortStatus === "ACTIVE"}
                  onCheckedChange={(checked) =>
                    handleInputChange("cohortStatus")(
                      checked ? "ACTIVE" : "INACTIVE",
                    )
                  }
                />
                {formData.cohortStatus && (
                  <StatusLabelCMS variants={formData.cohortStatus} />
                )}
              </div>
            </div>
            <InputCMS
              inputId="start-date"
              inputName="Program Starts"
              inputType="datetime-local"
              value={formData.cohortStartDate}
              onInputChange={handleInputChange("cohortStartDate")}
              required
            />
            <InputCMS
              inputId="end-date"
              inputName="Program Ends"
              inputType="datetime-local"
              value={formData.cohortEndDate}
              onInputChange={handleInputChange("cohortEndDate")}
              required
            />
          </div>
          <PriceTierStepperCMS
            tiers={formData.cohortPriceTiers}
            setTiers={(tiers) =>
              setFormData({ ...formData, cohortPriceTiers: tiers })
            }
          />
        </div>
        <div className="sticky bottom-0 w-full p-4 bg-white z-40">
          <AppButton
            className="w-full"
            variant="cmsPrimary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin size-4" />}
            Create Cohort
          </AppButton>
        </div>
      </form>
    </AppSheet>
  );
}
