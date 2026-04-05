"use client";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import AppButton from "@/components/buttons/AppButton";
import CreateCohortFormCMS from "@/components/forms/CreateCohortFormCMS";
import CohortItemCardCMS from "@/components/items/CohortItemCardCMS";
import PageTitleSectionCMS from "@/components/titles/PageTitleSectionCMS";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { ChevronRight, Loader2, PlusCircle } from "lucide-react";
import React, { useState } from "react";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";

dayjs.extend(isBetween);

interface CohortListCMSProps {
  sessionToken: string;
  sessionUserRole: number;
}

export default function CohortListCMS({
  sessionToken,
  sessionUserRole,
}: CohortListCMSProps) {
  const { isCollapsed } = useSidebar();
  const utils = trpc.useUtils();
  const [createCohort, setCreateCohort] = useState(false);

  const allowedRolesCreateCohort = [0, 2];

  const {
    data: cohortListData,
    isError,
    isLoading,
  } = trpc.list.cohorts.useQuery({}, { enabled: !!sessionToken });

  return (
    <React.Fragment>
      <div
        className={`root hidden w-full h-full justify-center bg-white py-8 lg:flex ${isCollapsed ? "pl-16" : "pl-64"}`}
      >
        <div className="page-container max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
          <div className="page-header flex flex-col gap-3">
            <AppBreadcrumb>
              <ChevronRight className="size-3.5" />
              <AppBreadcrumbItem isCurrentPage>Cohorts</AppBreadcrumbItem>
            </AppBreadcrumb>
            <div className="page-title flex justify-between items-center">
              <PageTitleSectionCMS
                pageTitle="Cohort Programs"
                pageDesc="View and manage all your existing cohort programs in one place"
              />
              {allowedRolesCreateCohort.includes(sessionUserRole) && (
                <AppButton
                  onClick={() => setCreateCohort(true)}
                  variant="tertiary"
                >
                  <PlusCircle className="size-5" />
                  Create Cohort
                </AppButton>
              )}
            </div>
          </div>

          {isLoading && (
            <div className="flex w-full h-full py-10 items-center justify-center text-alternative">
              <Loader2 className="animate-spin size-5 " />
            </div>
          )}
          {isError && (
            <div className="flex w-full h-full py-10 items-center justify-center text-alternative font-bodycopy font-medium">
              No Data
            </div>
          )}

          {cohortListData && !isLoading && !isError && (
            <div className="index w-full flex flex-col gap-4 bg-section-background px-5 py-7 rounded-lg overflow-y-auto max-h-[calc(100vh-8rem)]">
              <div className="cohort-list grid gap-4 items-center lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
                {cohortListData?.list.map((post) => (
                  <CohortItemCardCMS
                    key={post.id}
                    sessionToken={sessionToken}
                    sessionUserRole={sessionUserRole}
                    cohortId={post.id}
                    cohortName={post.name}
                    cohortImage={post.image}
                    cohortStartDate={post.start_date}
                    cohortEndDate={post.end_date}
                    onDeleteSuccess={() => utils.list.cohorts.invalidate()}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Create Cohort */}
      {createCohort && (
        <CreateCohortFormCMS
          isOpen={createCohort}
          onClose={() => setCreateCohort(false)}
        />
      )}
    </React.Fragment>
  );
}
