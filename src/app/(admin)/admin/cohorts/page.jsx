import AppBreadcrumb from "@/app/components/elements/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/elements/AppBreadcrumbItem";
import AppButton from "@/app/components/elements/AppButton";
import { ChevronRight, PlusCircle } from "lucide-react";
import TitleRevealCMS from "@/app/components/elements/TitleRevealCMS";
import CohortItemCardCMS from "@/app/components/elements/CohortItemCardCMS";

export default async function CohortListPage() {
  return (
    <div className="root flex w-full h-full bg-white justify-center bg-main-root py-8 pb-24 overflow-y-auto lg:pl-64">
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
            <AppButton variant="cmsPrimary">
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
    </div>
  );
}
