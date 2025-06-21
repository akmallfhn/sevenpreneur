"use client";
import { useState, useEffect } from "react";
import AppSheet from "../modals/AppSheet";
import InputCMS from "../fields/InputCMS";
import TextAreaCMS from "../fields/TextAreaCMS";
import AppButton from "../buttons/AppButton";
import { DollarSign, School } from "lucide-react";
import UploadThumbnailCohortCMS from "../fields/UploadThumbnailCohortCMS";
import PriceTierStepperCMS from "../stepper/PriceTierStepperCMS";

interface CohortCreateCMSProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCohortFormCMS({
  isOpen,
  onClose,
}: CohortCreateCMSProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    image: string;
  }>({
    name: "",
    image: "",
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
      avatar: url ?? "",
    }));
  };

  return (
    <AppSheet
      sheetName="Create Cohort Program"
      sheetDescription="Form Buat Bikin Cohort"
      isOpen={isOpen}
      onClose={onClose}
    >
      <form className="relative w-full h-full flex flex-col">
        <div className="form-container flex flex-col px-6 pb-68 gap-5 overflow-y-auto">
          <div className="group-input flex flex-col gap-4">
            <UploadThumbnailCohortCMS onUpload={handleImageForm} />
            <InputCMS
              inputId="cohort-name"
              inputName="Program Name"
              inputType="text"
              inputPlaceholder="Name your program"
              value=""
              required
            />
            <TextAreaCMS
              textAreaId="cohort-description"
              textAreaName="Program Overview"
              textAreaPlaceholder="Tell us about this program"
              textAreaHeight="h-32"
              value=""
              required
            />
            <div className="date flex flex-1 w-full gap-4">
              <div className="w-full">
                <InputCMS
                  inputId="start-date"
                  inputName="Program Starts"
                  inputType="date"
                  value=""
                  required
                />
              </div>
              <div className="w-full">
                <InputCMS
                  inputId="end-date"
                  inputName="Program Ends"
                  inputType="date"
                  value=""
                  required
                />
              </div>
            </div>
          </div>
          <PriceTierStepperCMS />
        </div>
        <div className="sticky bottom-0 w-full p-4 bg-white z-10">
          <AppButton className="w-full" variant="cmsPrimary">
            <School className="size-4" />
            Create Cohort
          </AppButton>
        </div>
      </form>
    </AppSheet>
  );
}
