"use client";
import React, { useEffect, useRef, useState } from "react";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import AppButton from "../buttons/AppButton";
import {
  Calendar,
  CalendarFoldIcon,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Loader2,
  PenTool,
} from "lucide-react";
import { setSessionToken, trpc } from "@/trpc/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import {
  faCalendar,
  faChalkboardUser,
  faLaptop,
  faLinesLeaning,
  faMoneyBill1Wave,
} from "@fortawesome/free-solid-svg-icons";
import LearningListCMS from "../indexes/LearningListCMS";
import EditCohortFormCMS from "../forms/EditCohortFormCMS";
import EnrolledUserListCMS from "../indexes/EnrolledUserListCMS";
import ModuleListCMS from "../indexes/ModuleListCMS";
import ProjectListCMS from "../indexes/ProjectListCMS";
import StatusLabelCMS, { StatusVariant } from "../labels/StatusLabelCMS";
import StatItemCMS from "../items/StatItemCMS";
import { RupiahCurrency } from "@/lib/rupiah-currency";
import { notFound } from "next/navigation";
import PriceItemCardCMS from "../items/PriceItemCardCMS";

dayjs.extend(localizedFormat);

interface CohortDetailsCMSProps {
  sessionToken: string;
  cohortId: number;
}

export default function CohortDetailsCMS({
  cohortId,
  sessionToken,
}: CohortDetailsCMSProps) {
  const [editCohort, setEditCohort] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  // --- Set token for API
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  // --- Call data from tRPC
  const {
    data: cohortDetailsData,
    isLoading: isLoadingDetailsData,
    isError: isErrorDetailsData,
  } = trpc.read.cohort.useQuery({ id: cohortId }, { enabled: !!sessionToken });

  // --- Checking height content description
  useEffect(() => {
    if (paragraphRef.current && cohortDetailsData?.cohort.description) {
      const el = paragraphRef.current;
      const isOverflow = el.scrollHeight > el.clientHeight;
      setIsOverflowing(isOverflow);
    }
  }, [cohortDetailsData?.cohort.description]);

  // --- Extract variable
  const isLoading = isLoadingDetailsData;
  const isError = isErrorDetailsData;
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
        {/* --- PAGE HEADER */}
        <div className="page-header flex flex-col gap-3">
          <AppBreadcrumb>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href="/cohorts">Cohorts</AppBreadcrumbItem>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href={`/cohorts/${cohortId}`} isCurrentPage>
              {cohortDetailsData?.cohort.name}
            </AppBreadcrumbItem>
          </AppBreadcrumb>
        </div>

        {/* --- PAGE BODY */}
        <div className="body-container flex gap-5">
          {/* -- Main */}
          <main className="flex flex-col flex-[2] w-0 min-w-0 gap-5">
            {/* Cohort Detail */}
            <div className="flex flex-col bg-white border border-outline rounded-md overflow-hidden">
              <div className="image-thumbnail relative flex aspect-thumbnail overflow-hidden">
                <Image
                  className="object-cover w-full h-full"
                  src={cohortDetailsData?.cohort.image || ""}
                  alt={cohortDetailsData?.cohort.name || "Cohort Sevenpreneur"}
                  width={1200}
                  height={1200}
                />
                {/* Overlay */}
                <div
                  className={`overlay absolute inset-0 z-10 bg-linear-to-b from-0% from-black to-30% to-black/20`}
                />
                <div
                  className={`overlay absolute inset-0 z-10 bg-linear-to-t from-0% from-black/50 to-20% to-black/0`}
                />
                {/* Status */}
                <div className="absolute top-4 left-4 z-20">
                  <StatusLabelCMS
                    labelName={cohortDetailsData?.cohort.status || ""}
                    variants={cohortDetailsData?.cohort.status as StatusVariant}
                  />
                </div>
                {/* Button Edit */}
                <div className="absolute top-4 right-4 z-20">
                  <AppButton
                    variant="outline"
                    size="small"
                    onClick={() => setEditCohort(true)}
                  >
                    <PenTool className="size-4" />
                    Edit Cohort
                  </AppButton>
                </div>
              </div>
              <div className="relative flex flex-col mt-[-20px] gap-3 p-4 bg-white text-black z-20 rounded-md">
                {/* Title */}
                <h1 className="cohort-title font-brand font-bold text-2xl line-clamp-2">
                  {cohortDetailsData?.cohort.name}
                </h1>
                {/* Learning Period */}
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
                      Program Wrap-up Date
                    </p>
                    <p>
                      {dayjs(cohortDetailsData?.cohort.end_date).format("ll")}
                    </p>
                  </div>
                </div>
                {/* Description */}
                <div className="description relative flex flex-col">
                  <p
                    className={`font-bodycopy font-medium transition-all ${
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
            {/* Price Tiers */}
            <div className="flex flex-col gap-3">
              <h2 className="label-name font-brand font-bold">Price Tiers</h2>
              <div className="w-full overflow-x-auto scroll-smooth">
                <div className="price-tiers flex gap-4 w-fit max-w-full pb-4 snap-x snap-mandatory">
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

          {/* -- Aside */}
          <aside className="flex flex-col flex-[1] w-full gap-5">
            {/* Stats */}
            <div className="stats flex flex-col gap-3">
              <StatItemCMS
                statsIcon={faChalkboardUser}
                statsIconBg="bg-cms-primary"
                statsName="Total Enrolled User"
                statsValue={345}
              />
              <StatItemCMS
                statsIcon={faLaptop}
                statsIconBg="bg-[#FFA524]"
                statsName="Total Learning Sessions"
                statsValue={8}
              />
              <StatItemCMS
                statsIcon={faLinesLeaning}
                statsIconBg="bg-cms-secondary"
                statsName="Total Materials"
                statsValue={45}
              />
              <StatItemCMS
                statsIcon={faMoneyBill1Wave}
                statsIconBg="bg-secondary"
                statsName="Total Revenue"
                statsValue={RupiahCurrency(3453000000)}
              />
            </div>
            <ModuleListCMS sessionToken={sessionToken} cohortId={cohortId} />
            <EnrolledUserListCMS />
            <ProjectListCMS />
          </aside>
        </div>
      </div>

      {/* Form Edit Cohort */}
      {editCohort && (
        <EditCohortFormCMS
          cohortId={cohortId}
          initialData={cohortDetailsData?.cohort}
          isOpen={editCohort}
          onClose={() => setEditCohort(false)}
        />
      )}
    </React.Fragment>
  );
}
