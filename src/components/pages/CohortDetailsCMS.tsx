"use client";
import { StatusType } from "@/lib/app-types";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { CalendarFoldIcon, ChevronRight, PenTool } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import AppButton from "../buttons/AppButton";
import AttendancesChartCMS from "../charts/AttendancesChartCMS";
import EditCohortFormCMS from "../forms/EditCohortFormCMS";
import EnrollmentScorecardListCMS from "../indexes/EnrollmentScorecardListCMS";
import LearningListCMS from "../indexes/LearningListCMS";
import ModuleListCMS from "../indexes/ModuleListCMS";
import ProjectListCMS from "../indexes/ProjectListCMS";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import AppLoadingComponents from "../states/AppLoadingComponents";
import PageContainerCMS from "./PageContainerCMS";
import AppErrorComponents from "../states/AppErrorComponents";

dayjs.extend(localizedFormat);

interface CohortDetailsCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId: number;
}

export default function CohortDetailsCMS(props: CohortDetailsCMSProps) {
  const [editCohort, setEditCohort] = useState(false);

  const allowedRolesUpdateCohort = [0, 2];
  const isAllowedUpdateCohort = allowedRolesUpdateCohort.includes(
    props.sessionUserRole
  );

  // Fetch data from tRPC
  const {
    data: cohortDetailsData,
    isLoading: isLoadingCohortDetails,
    isError: isErrorCohortDetails,
  } = trpc.read.cohort.useQuery(
    { id: props.cohortId },
    { enabled: !!props.sessionToken }
  );

  const isLoading = isLoadingCohortDetails;
  const isError = isErrorCohortDetails;

  return (
    <React.Fragment>
      <PageContainerCMS>
        <div className="container w-full flex flex-col gap-5">
          <div className="page-header flex flex-col gap-3">
            <AppBreadcrumb>
              <ChevronRight className="size-3.5" />
              <AppBreadcrumbItem href="/cohorts">Cohorts</AppBreadcrumbItem>
              <ChevronRight className="size-3.5" />
              <AppBreadcrumbItem isCurrentPage>
                {cohortDetailsData?.cohort.name}
              </AppBreadcrumbItem>
            </AppBreadcrumb>
          </div>

          {isLoading && <AppLoadingComponents />}
          {isError && <AppErrorComponents />}

          {cohortDetailsData && !isLoading && !isError && (
            <div className="body-container flex gap-4">
              <main className="main-contents flex flex-col flex-2 min-w-0 gap-4">
                <div className="cohort-attributes flex flex-col bg-white border rounded-md overflow-hidden">
                  <div className="cohort-image relative flex aspect-thumbnail overflow-hidden">
                    <Image
                      className="object-cover w-full h-full"
                      src={cohortDetailsData.cohort.image}
                      alt={cohortDetailsData.cohort.name}
                      width={1200}
                      height={1200}
                    />
                    <div
                      className={`overlay absolute inset-0 z-10 bg-linear-to-b from-0% from-black to-30% to-black/20`}
                    />
                    <div
                      className={`overlay absolute inset-0 z-10 bg-linear-to-t from-0% from-black/50 to-20% to-black/0`}
                    />
                    <div className="cohort-status absolute top-4 left-4 z-20">
                      <StatusLabelCMS
                        variants={cohortDetailsData.cohort.status as StatusType}
                      />
                    </div>
                    {isAllowedUpdateCohort && (
                      <div className="edit-cohort absolute top-4 right-4 z-20">
                        <AppButton
                          variant="light"
                          size="small"
                          onClick={() => setEditCohort(true)}
                        >
                          <PenTool className="size-4" />
                          Edit Cohort
                        </AppButton>
                      </div>
                    )}
                  </div>
                  <div className="cohort-attributes relative flex flex-col mt-[-20px] gap-3 p-4 bg-white text-black z-20 rounded-md">
                    <h1 className="cohort-title font-brand font-bold text-2xl line-clamp-2">
                      {cohortDetailsData.cohort.name}
                    </h1>
                    <div className="cohort-timeline flex w-fit gap-4 items-center bg-white rounded-md p-2 px-3.5 border">
                      <CalendarFoldIcon className="size-6 text-emphasis" />
                      <div className="flex flex-col font-bodycopy font-medium text-sm text-emphasis">
                        <p className="text-black font-semibold">
                          Program Kickoff Date
                        </p>
                        <p>
                          {dayjs(cohortDetailsData?.cohort.start_date).format(
                            "ll"
                          )}
                        </p>
                      </div>
                      <div className="w-[1px] h-full bg-outline" />
                      <div className="flex flex-col font-bodycopy font-medium text-sm text-emphasis">
                        <p className="text-black font-semibold">
                          Program Finish Date
                        </p>
                        <p>
                          {dayjs(cohortDetailsData?.cohort.end_date).format(
                            "ll"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="cohort-description relative flex flex-col">
                      <p className="font-bodycopy font-medium text-sm text-black/50 transition-all">
                        {cohortDetailsData.cohort.description}
                      </p>
                    </div>
                  </div>
                </div>
                {/* <div className="cohort-prices flex flex-col gap-3">
              <h2 className="section-name font-brand font-bold">Price Tiers</h2>
              <div className="w-full overflow-x-auto scroll-smooth">
                <div className="cohort-price-list flex gap-4 w-fit max-w-full pb-4 snap-x snap-mandatory">
                  {cohortDetailsData.cohort.cohort_prices.map((post, index) => (
                    <PriceItemCardCMS
                      key={index}
                      priceIndex={index + 1}
                      priceName={post.name}
                      priceAmount={Number(post.amount)}
                    />
                  ))}
                </div>
              </div>
            </div> */}
                <AttendancesChartCMS
                  sessionToken={props.sessionToken}
                  sessionUserRole={props.sessionUserRole}
                  cohortId={props.cohortId}
                />
                <LearningListCMS
                  sessionToken={props.sessionToken}
                  sessionUserRole={props.sessionUserRole}
                  cohortId={props.cohortId}
                />
              </main>
              <aside className="aside-contents flex flex-col flex-[1.2] min-w-0 gap-5">
                <EnrollmentScorecardListCMS
                  sessionToken={props.sessionToken}
                  sessionUserRole={props.sessionUserRole}
                  cohortId={props.cohortId}
                />
                <ModuleListCMS
                  sessionToken={props.sessionToken}
                  sessionUserRole={props.sessionUserRole}
                  cohortId={props.cohortId}
                />
                <ProjectListCMS
                  sessionToken={props.sessionToken}
                  sessionUserRole={props.sessionUserRole}
                  cohortId={props.cohortId}
                />
              </aside>
            </div>
          )}
        </div>
      </PageContainerCMS>

      {/* Edit Cohort */}
      {editCohort && (
        <EditCohortFormCMS
          sessionToken={props.sessionToken}
          cohortId={props.cohortId}
          isOpen={editCohort}
          onClose={() => setEditCohort(false)}
        />
      )}
    </React.Fragment>
  );
}
