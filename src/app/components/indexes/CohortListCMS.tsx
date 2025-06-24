"use client";
import React, { useEffect, useState } from "react";
import AppBreadcrumb from "@/app/components/navigations/AppBreadcrumb";
import AppBreadcrumbItem from "@/app/components/navigations/AppBreadcrumbItem";
import AppButton from "@/app/components/buttons/AppButton";
import { ChevronRight, Loader2, PlusCircle } from "lucide-react";
import TitleRevealCMS from "@/app/components/titles/TitleRevealCMS";
import CohortItemCardCMS from "@/app/components/items/CohortItemCardCMS";
import CreateCohortFormCMS from "@/app/components/forms/CreateCohortFormCMS";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";

interface CohortListCMSProps {
  sessionToken: string;
}

export default function CohortListCMS({ sessionToken }: CohortListCMSProps) {
  const [createCohort, setCreateCohort] = useState(false);

  // --- Set token for API
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  const {
    data: cohortListData,
    isError: isErrorCohortList,
    isLoading: isLoadingCohortList,
  } = trpc.list.cohorts.useQuery(undefined, { enabled: !!sessionToken });

  const isLoading = isLoadingCohortList;
  const isError = isErrorCohortList;

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative">
        <Loader2 className="animate-spin size-5 " />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative font-bodycopy">
        No Data
      </div>
    );
  }

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
              titlePage={"Cohort Programs"}
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
          <div className="flex flex-col gap-4 p-5 bg-section-background rounded-lg">
            <h2 className="font-bold font-brand text-xl text-black">
              On Going Programs
            </h2>
            <div className="flex flex-wrap gap-4">
              {cohortListData?.list
                .filter((post) => dayjs().isBefore(dayjs(post.end_date)))
                .map((post, index) => (
                  <CohortItemCardCMS
                    key={index}
                    cohortId={post.id}
                    cohortName={post.name}
                    cohortImage={post.image}
                    cohortStartDate={post.start_date}
                    cohortEndDate={post.end_date}
                  />
                ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 p-5 bg-section-background rounded-lg">
            <h2 className="font-bold font-brand text-xl text-black">
              Finished Programs
            </h2>
            <div className="flex flex-wrap gap-4">
              {cohortListData?.list
                .filter((post) => dayjs().isAfter(dayjs(post.end_date)))
                .map((post, index) => (
                  <CohortItemCardCMS
                    key={index}
                    cohortId={post.id}
                    cohortName={post.name}
                    cohortImage={post.image}
                    cohortStartDate={post.start_date}
                    cohortEndDate={post.end_date}
                  />
                ))}
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
