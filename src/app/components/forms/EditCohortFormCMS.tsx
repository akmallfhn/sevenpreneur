"use client";
import { Loader2 } from "lucide-react";
import AppButton from "../buttons/AppButton";
import InputCMS from "../fields/InputCMS";
import TextAreaCMS from "../fields/TextAreaCMS";
import UploadThumbnailCohortCMS from "../fields/UploadThumbnailCohortCMS";
import AppSheet from "../modals/AppSheet";
import PriceTierStepperCMS, { PriceTier } from "../stepper/PriceTierStepperCMS";
import { toast } from "sonner";
import { FormEvent, useEffect, useState } from "react";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import { StatusType } from "@/lib/app-types";
import { Switch } from "@/components/ui/switch";
import StatusLabelCMS from "../labels/StatusLabelCMS";

interface EditCohortFormCMSProps {
  sessionToken: string;
  cohortId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditCohortFormCMS({
  sessionToken,
  cohortId,
  isOpen,
  onClose,
}: EditCohortFormCMSProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editCohort = trpc.update.cohort.useMutation();
  const editCohortPrices = trpc.update.cohortPrice.useMutation();
  const createCohortPrices = trpc.create.cohortPrice.useMutation();
  const deleteCohortPrices = trpc.delete.cohortPrice.useMutation();
  const utils = trpc.useUtils();

  // Return initial data
  const {
    data: cohortDetailsData,
    isLoading: isLoadingInitial,
    isError: isErrorInitial,
  } = trpc.read.cohort.useQuery({ id: cohortId }, { enabled: !!sessionToken });
  const initialData = cohortDetailsData?.cohort;

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
    cohortName: initialData?.name || "",
    cohortImage: initialData?.image || "",
    cohortDescription: initialData?.description || "",
    cohortStartDate: initialData?.start_date
      ? dayjs(initialData?.start_date).format("YYYY-MM-DDTHH:mm")
      : "",
    cohortEndDate: initialData?.end_date
      ? dayjs(initialData.end_date).format("YYYY-MM-DDTHH:mm")
      : "",
    cohortStatus: initialData?.status as StatusType,
    cohortPriceTiers:
      initialData?.cohort_prices.map(
        (post: { id: number; name: string; amount: string }) => ({
          id: post.id,
          name: post.name,
          amount: post.amount,
        })
      ) || [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        cohortName: initialData.name || "",
        cohortImage: initialData.image || "",
        cohortDescription: initialData.description || "",
        cohortStartDate: initialData.start_date
          ? dayjs(initialData.start_date).format("YYYY-MM-DDTHH:mm")
          : "",
        cohortEndDate: initialData.end_date
          ? dayjs(initialData.end_date).format("YYYY-MM-DDTHH:mm")
          : "",
        cohortStatus: initialData.status as StatusType,
        cohortPriceTiers: initialData.cohort_prices.map(
          (post: { id: number; name: string; amount: string }) => ({
            id: post.id,
            name: post.name,
            amount: post.amount,
          })
        ),
      });
    }
  }, [initialData]);

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
  const handleInputChange = (fieldName: string) => (value: any) => {
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
      (tier) => !tier.name.trim() || !tier.amount.trim()
    );
    if (formData.cohortPriceTiers.length === 0 || invalidTier) {
      toast.error("A cohort with no price? Sounds generous");
      setIsSubmitting(false);
      return;
    }

    try {
      await editCohort.mutateAsync({
        id: cohortId,
        name: formData.cohortName.trim(),
        description: formData.cohortDescription.trim(),
        status: formData.cohortStatus,
        image: formData.cohortImage,
        start_date: new Date(formData.cohortStartDate).toISOString(),
        end_date: new Date(formData.cohortEndDate).toISOString(),
      });
      // Use id to mapping initial Cohort Price data
      const initialPricesMap = initialData?.cohort_prices.map(
        (post: any) => post.id
      );
      // Update & Create Cohort Prices
      await Promise.all(
        formData.cohortPriceTiers.map(async (tier) => {
          // existing → update
          // If the tier has an id → it means this is old data, so do an update.
          if (tier.id) {
            await editCohortPrices.mutateAsync({
              cohort_id: cohortId,
              id: tier.id,
              name: tier.name.trim(),
              amount: Number(tier.amount),
              status: "ACTIVE",
            });
          } else {
            // new → create
            // If the id doesn't exist → it means this is new data, so create it.
            await createCohortPrices.mutateAsync({
              cohort_id: cohortId,
              name: tier.name.trim(),
              amount: Number(tier.amount),
              status: "ACTIVE",
            });
          }
        })
      );
      // Get all id of tier that are on change in current form → This is the list that should remain in the database.
      const currentIds = formData.cohortPriceTiers
        .filter((tier) => tier.id)
        .map((tier) => tier.id);
      // Compare with initialPricesMap. If there is an id that is not in the form now, So, save it as deletedIds.
      const deletedIds =
        initialPricesMap?.filter((id: number) => !currentIds.includes(id)) ||
        [];
      // Delete all tiers listed in deletedIds.
      await Promise.all(
        deletedIds.map((id: number) => {
          try {
            deleteCohortPrices.mutateAsync({ id });
          } catch (error) {
            toast.error("Failed to delete price tier");
          }
        })
      );

      // Final toast & refetch
      await utils.read.cohort.invalidate();
      await utils.list.cohorts.invalidate();
      toast.success("Cohort updated successfully");
      onClose();
    } catch (error) {
      toast.error("Something went wrong. Failed to update cohort.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppSheet
      sheetName="Edit Cohort"
      sheetDescription="Update your cohort's details to keep everything current and aligned."
      isOpen={isOpen}
      onClose={onClose}
    >
      {isLoadingInitial && (
        <div className="flex w-full h-full py-10 items-center justify-center text-alternative">
          <Loader2 className="animate-spin size-5 " />
        </div>
      )}
      {isErrorInitial && (
        <div className="flex w-full h-full py-10 items-center justify-center text-alternative font-bodycopy font-medium">
          No Data
        </div>
      )}

      {!isLoadingInitial && !isErrorInitial && initialData && (
        <form
          className="relative w-full h-full flex flex-col"
          onSubmit={handleSubmit}
        >
          <div className="form-container flex flex-col px-6 pb-96 gap-5 overflow-y-auto">
            <div className="group-input flex flex-col gap-4">
              <UploadThumbnailCohortCMS
                onUpload={handleImageForm}
                value={formData.cohortImage}
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
                        checked ? "ACTIVE" : "INACTIVE"
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
              Save Changes
            </AppButton>
          </div>
        </form>
      )}
    </AppSheet>
  );
}
