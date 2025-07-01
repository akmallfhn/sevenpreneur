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

interface EditCohortFormCMSProps {
  cohortId: number;
  initialData: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditCohortFormCMS({
  cohortId,
  initialData,
  isOpen,
  onClose,
}: EditCohortFormCMSProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editCohort = trpc.update.cohort.useMutation();
  const editCohortPrices = trpc.update.cohortPrice.useMutation();
  const createCohortPrices = trpc.create.cohortPrice.useMutation();
  const deleteCohortPrices = trpc.delete.cohortPrice.useMutation();
  const utils = trpc.useUtils();

  // --- Beginning State
  const [formData, setFormData] = useState<{
    cohortName: string;
    cohortImage: string;
    cohortDescription: string;
    cohortStartDate: string;
    cohortEndDate: string;
    cohortPriceTiers: PriceTier[];
  }>({
    cohortName: initialData.name || "",
    cohortImage: initialData.image || "",
    cohortDescription: initialData.description || "",
    cohortStartDate: initialData.start_date
      ? dayjs(initialData.start_date).format("YYYY-MM-DDTHH:mm")
      : "",
    cohortEndDate: initialData.end_date
      ? dayjs(initialData.end_date).format("YYYY-MM-DDTHH:mm")
      : "",
    cohortPriceTiers: initialData.cohort_prices.map(
      (post: { id: number; name: string; amount: number }) => ({
        id: post.id,
        name: post.name,
        amount: post.amount,
      })
    ),
  });

  // --- Add event listener to prevent page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // --- Handle data changes
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

  // --- Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // -- Required field checking
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

    // -- POST to Database
    try {
      // Update Cohort
      await editCohort.mutateAsync({
        id: cohortId,
        name: formData.cohortName.trim(),
        description: formData.cohortDescription.trim(),
        status: "ACTIVE",
        image: formData.cohortImage,
        start_date: new Date(formData.cohortStartDate).toISOString(),
        end_date: new Date(formData.cohortEndDate).toISOString(),
      });
      // Use id to mapping initial Cohort Price data
      const initialPricesMap = initialData.cohort_prices.map(
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
      const deletedIds = initialPricesMap.filter(
        (id: number) => !currentIds.includes(id)
      );
      // Delete all tiers listed in deletedIds.
      await Promise.all(
        deletedIds.map((id: number) => deleteCohortPrices.mutateAsync({ id }))
      );
      toast.success("Cohort updated successfully");
      await utils.read.cohort.invalidate();
      await utils.list.cohorts.invalidate();
      onClose();
    } catch (error: any) {
      toast.error("Failed to update cohort", {
        description: error,
      });
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
      <form
        className="relative w-full h-full flex flex-col"
        onSubmit={handleSubmit}
      >
        <div className="form-container flex flex-col px-6 pb-68 gap-5 overflow-y-auto">
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
              onInputChange={handleInputChange("cohortDescription")}
              required
            />
            <div className="date flex flex-1 w-full gap-4">
              <div className="w-full">
                <InputCMS
                  inputId="start-date"
                  inputName="Program Starts"
                  inputType="datetime-local"
                  value={formData.cohortStartDate}
                  onInputChange={handleInputChange("cohortStartDate")}
                  required
                />
              </div>
              <div className="w-full">
                <InputCMS
                  inputId="end-date"
                  inputName="Program Ends"
                  inputType="datetime-local"
                  value={formData.cohortEndDate}
                  onInputChange={handleInputChange("cohortEndDate")}
                  required
                />
              </div>
            </div>
          </div>
          <PriceTierStepperCMS
            tiers={formData.cohortPriceTiers}
            setTiers={(tiers) =>
              setFormData({ ...formData, cohortPriceTiers: tiers })
            }
          />
        </div>
        <div className="sticky bottom-0 w-full p-4 bg-white z-10">
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
    </AppSheet>
  );
}
