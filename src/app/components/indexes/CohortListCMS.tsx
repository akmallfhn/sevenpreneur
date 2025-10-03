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
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

interface CohortListCMSProps {
  sessionToken: string;
}

export default function CohortListCMS({ sessionToken }: CohortListCMSProps) {
  const [createCohort, setCreateCohort] = useState(false);
  const utils = trpc.useUtils();

  // --- Set token for API
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  const {
    data: cohortListData,
    isError,
    isLoading,
  } = trpc.list.cohorts.useQuery({}, { enabled: !!sessionToken });

  return (
    <React.Fragment>
      <div className="container max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
        {/* PAGE HEADER */}
        <div className="page-header flex flex-col gap-3">
          <AppBreadcrumb>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href="/cohorts" isCurrentPage>
              Cohorts
            </AppBreadcrumbItem>
          </AppBreadcrumb>
          <div className="page-title-actions flex justify-between items-center">
            <TitleRevealCMS
              titlePage={"Cohort Programs"}
              descPage={
                "View and manage all your existing cohort programs in one place"
              }
            />
            <AppButton
              onClick={() => setCreateCohort(true)}
              variant="cmsPrimary"
            >
              <PlusCircle className="size-5" />
              Create Cohort
            </AppButton>
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

        {/* List Cohort */}
        {cohortListData && !isLoading && !isError && (
          <div className="w-full flex flex-col gap-8">
            {cohortListData?.list.some((post) =>
              dayjs().isBetween(
                dayjs(post.start_date),
                dayjs(post.end_date),
                "day",
                "[]"
              )
            ) && (
              <div className="flex flex-col gap-4 p-5 bg-section-background rounded-lg">
                <h2 className="font-bold font-brand text-black">
                  On Going Programs
                </h2>
                <div className="flex flex-wrap gap-4">
                  {cohortListData?.list
                    .filter((post) =>
                      dayjs().isBetween(
                        dayjs(post.start_date),
                        dayjs(post.end_date),
                        "day",
                        "[]"
                      )
                    )
                    .map((post, index) => (
                      <CohortItemCardCMS
                        key={index}
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
            {cohortListData?.list.some((post) =>
              dayjs().isBefore(dayjs(post.start_date))
            ) && (
              <div className="flex flex-col gap-4 p-5 bg-section-background rounded-lg">
                <h2 className="font-bold font-brand text-black">
                  Upcoming Programs
                </h2>
                <div className="flex flex-wrap gap-4">
                  {cohortListData?.list
                    .filter((post) => dayjs().isBefore(dayjs(post.start_date)))
                    .map((post, index) => (
                      <CohortItemCardCMS
                        key={index}
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
            {cohortListData?.list.some((post) =>
              dayjs().isAfter(dayjs(post.end_date))
            ) && (
              <div className="flex flex-col gap-4 p-5 bg-section-background rounded-lg">
                <h2 className="font-bold font-brand text-black">
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
                        onDeleteSuccess={() => utils.list.cohorts.invalidate()}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
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
