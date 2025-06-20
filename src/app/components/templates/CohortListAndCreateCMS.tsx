"use client";
import React, { useState } from "react";
import AppBreadcrumb from "@/app/components/elements/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/elements/AppBreadcrumbItem";
import AppButton from "@/app/components/elements/AppButton";
import { ChevronRight, PlusCircle, School } from "lucide-react";
import TitleRevealCMS from "@/app/components/elements/TitleRevealCMS";
import CohortItemCardCMS from "@/app/components/elements/CohortItemCardCMS";
import AppSheet from "../elements/AppSheet";
import InputCMS from "../elements/InputCMS";
import TextAreaCMS from "../elements/TextAreaCMS";

export default function CohortListAndCreateCMS() {
  const [createCohort, setCreateCohort] = useState(false);

  return (
    <React.Fragment>
      <div className="container max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
        {/* --- PAGE HEADER */}
        <div className="page-header flex flex-col gap-3">
          <AppBreadcrumb>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href="/cohorts" isCurrentPage>
              Cohorts
            </AppBreadcrumbItem>
          </AppBreadcrumb>
          <div className="page-title-actions flex justify-between items-center">
            {/* --- Page Title */}
            <TitleRevealCMS
              titlePage={"Cohort Event"}
              descPage={
                "Manage your published content easily. Click on an article to view or edit its details."
              }
            />

            {/* --- Page Actions */}
            <AppButton
              onClick={() => setCreateCohort(true)}
              variant="cmsPrimary"
            >
              <PlusCircle className="size-5" />
              Create Cohort
            </AppButton>
          </div>
        </div>

        {/* --- List Cohort */}
        <div className="w-full flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold font-brand text-xl text-black">
              Active Event
            </h2>
            <div className="flex flex-wrap gap-4">
              <CohortItemCardCMS />
              <CohortItemCardCMS />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-bold font-brand text-xl text-black">
              Finished Event
            </h2>
            <div className="flex flex-wrap gap-4">
              <CohortItemCardCMS />
              <CohortItemCardCMS />
              <CohortItemCardCMS />
              <CohortItemCardCMS />
              <CohortItemCardCMS />
              <CohortItemCardCMS />
              <CohortItemCardCMS />
            </div>
          </div>
        </div>
      </div>

      {createCohort && (
        <AppSheet isOpen={createCohort} onClose={() => setCreateCohort(false)}>
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
      )}
    </React.Fragment>
  );
}
