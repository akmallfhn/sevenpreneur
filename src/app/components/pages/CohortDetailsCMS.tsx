"use client";
import React, { useEffect, useRef, useState } from "react";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import AppButton from "../buttons/AppButton";
import {
  CalendarFoldIcon,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Loader2,
  PenTool,
} from "lucide-react";
import { trpc } from "@/trpc/client";
import Image from "next/image";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import LearningListCMS from "../indexes/LearningListCMS";
import EditCohortFormCMS from "../forms/EditCohortFormCMS";
import EnrolledUserListCMS from "../indexes/EnrolledUserListCMS";
import ModuleListCMS from "../indexes/ModuleListCMS";
import ProjectListCMS from "../indexes/ProjectListCMS";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import { notFound } from "next/navigation";
import PriceItemCardCMS from "../items/PriceItemCardCMS";
import ScorecardItemCMS from "../items/ScorecardItemCMS";
import { StatusType } from "@/lib/app-types";

dayjs.extend(localizedFormat);

interface CohortDetailsCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId: number;
}

export default function CohortDetailsCMS({
  cohortId,
  sessionUserRole,
  sessionToken,
}: CohortDetailsCMSProps) {
  const [editCohort, setEditCohort] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  const allowedRolesUpdateCohort = [0, 2];
  const isAllowedUpdateCohort =
    allowedRolesUpdateCohort.includes(sessionUserRole);

  // Call data from tRPC
  const {
    data: cohortDetailsData,
    isLoading,
    isError,
  } = trpc.read.cohort.useQuery({ id: cohortId }, { enabled: !!sessionToken });

  // Checking height content description
  useEffect(() => {
    if (paragraphRef.current && cohortDetailsData?.cohort.description) {
      const el = paragraphRef.current;
      const isOverflow = el.scrollHeight > el.clientHeight;
      setIsOverflowing(isOverflow);
    }
  }, [cohortDetailsData?.cohort.description]);

  // Extract variable
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
  if (!cohortDetailsData?.cohort) {
    return notFound();
  }

  return (
    <React.Fragment>
      <div className="container max-w-[calc(100%-4rem)] w-full flex flex-col gap-5">
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

        <div className="body-container flex gap-4">
          <main className="main-contents flex flex-col flex-2 min-w-0 gap-4">
            <div className="cohort-attributes flex flex-col bg-white border border-outline rounded-md overflow-hidden">
              <div className="cohort-image relative flex aspect-thumbnail overflow-hidden">
                <Image
                  className="object-cover w-full h-full"
                  src={cohortDetailsData?.cohort.image || ""}
                  alt={cohortDetailsData?.cohort.name || "Cohort Sevenpreneur"}
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
                    variants={cohortDetailsData?.cohort.status as StatusType}
                  />
                </div>
                {isAllowedUpdateCohort && (
                  <div className="edit-cohort absolute top-4 right-4 z-20">
                    <AppButton
                      variant="outline"
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
                  {cohortDetailsData?.cohort.name}
                </h1>
                <div className="cohort-timeline flex w-fit gap-4 items-center bg-white rounded-md p-2 px-3.5 border border-outline">
                  <CalendarFoldIcon className="size-6 text-alternative" />
                  <div className="flex flex-col font-bodycopy font-medium text-sm text-alternative">
                    <p className="text-black font-semibold">
                      Program Kickoff Date
                    </p>
                    <p>
                      {dayjs(cohortDetailsData?.cohort.start_date).format("ll")}
                    </p>
                  </div>
                  <div className="w-[1px] h-full bg-outline" />
                  <div className="flex flex-col font-bodycopy font-medium text-sm text-alternative">
                    <p className="text-black font-semibold">
                      Program Finish Date
                    </p>
                    <p>
                      {dayjs(cohortDetailsData?.cohort.end_date).format("ll")}
                    </p>
                  </div>
                </div>
                <div className="cohort-description relative flex flex-col">
                  <p
                    className={`font-bodycopy font-medium text-sm text-black/50 transition-all ${
                      !isExpanded && "line-clamp-3"
                    }`}
                    ref={paragraphRef}
                  >
                    {cohortDetailsData?.cohort.description}
                  </p>
                  {!isExpanded && isOverflowing && (
                    <div className="overlay absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  )}
                </div>
                {isOverflowing && (
                  <div className="flex justify-center transition-all transform">
                    <AppButton
                      variant="cmsLink"
                      size="small"
                      onClick={() => setIsExpanded((prev) => !prev)}
                    >
                      {isExpanded ? (
                        <>
                          <p>Show Less</p>
                          <ChevronUp className="size-4" />
                        </>
                      ) : (
                        <>
                          <p>Show more</p>
                          <ChevronDown className="size-4" />
                        </>
                      )}
                    </AppButton>
                  </div>
                )}
              </div>
            </div>
            <div className="cohort-prices flex flex-col gap-3">
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
            </div>
            <LearningListCMS sessionToken={sessionToken} cohortId={cohortId} />
          </main>

          <aside className="aside-contents flex flex-col flex-[1.2] min-w-0 gap-5">
            {/* Stats */}
            <div className="cohort-stats flex flex-col gap-3">
              <ScorecardItemCMS
                scorecardName="Total Learning Sessions"
                scorecardValue={cohortDetailsData.cohort.total_learning_session}
                scorecardBackground="bg-success-foreground"
              />
              <ScorecardItemCMS
                scorecardName="Total Materials"
                scorecardValue={cohortDetailsData.cohort.total_materials}
                scorecardBackground="bg-warning-foreground"
              />
            </div>
            <ModuleListCMS sessionToken={sessionToken} cohortId={cohortId} />
            <ProjectListCMS sessionToken={sessionToken} cohortId={cohortId} />
            <EnrolledUserListCMS
              sessionToken={sessionToken}
              cohortId={cohortId}
            />
          </aside>
        </div>
      </div>

      {/* Edit Cohort */}
      {editCohort && (
        <EditCohortFormCMS
          sessionToken={sessionToken}
          cohortId={cohortId}
          isOpen={editCohort}
          onClose={() => setEditCohort(false)}
        />
      )}
    </React.Fragment>
  );
}
