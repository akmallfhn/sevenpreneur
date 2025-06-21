"use client";
import React, { useState } from "react";
import AppBreadcrumb from "@/app/components/navigations/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/navigations/AppBreadcrumbItem";
import AppButton from "@/app/components/buttons/AppButton";
import { ChevronRight, PlusCircle } from "lucide-react";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import CohortItemCardCMS from "@/app/components/items/CohortItemCardCMS";
import CreateCohortFormCMS from "@/app/components/forms/CreateCohortFormCMS";

export default function CohortListCMS() {
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
        <CreateCohortFormCMS
          isOpen={createCohort}
          onClose={() => setCreateCohort(false)}
        />
      )}
    </React.Fragment>
  );
}
