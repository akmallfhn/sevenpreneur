"use client";
import AppSheet from "../modals/AppSheet";
import InputCMS from "../fields/InputCMS";
import TextAreaCMS from "../fields/TextAreaCMS";
import AppButton from "../buttons/AppButton";
import { School } from "lucide-react";

interface CohortCreateCMSProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCohortFormCMS({
  isOpen,
  onClose,
}: CohortCreateCMSProps) {
  return (
    <AppSheet isOpen={isOpen} onClose={onClose}>
      <form className="relative w-full h-full flex flex-col">
        <div className="flex-1 px-4 pb-68 overflow-y-auto">
          <div className="form-input flex flex-col gap-4">
            <InputCMS
              inputId="cohort-name"
              inputName="Cohort Name"
              inputType="text"
              inputPlaceholder="Masukkan Nama"
              value=""
              required
            />
            <TextAreaCMS
              textAreaId="cohort-description"
              textAreaName="Description"
              textAreaPlaceholder="Tambahkan Deskripsi"
              textAreaHeight="h-32"
              value=""
              required
            />
            <div className="flex flex-1 w-full gap-4">
              <InputCMS
                inputId="start-date"
                inputName="Start date"
                inputType="date"
                value=""
                required
              />
              <InputCMS
                inputId="start-date"
                inputName="Finish date"
                inputType="date"
                value=""
                required
              />
            </div>
          </div>
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
