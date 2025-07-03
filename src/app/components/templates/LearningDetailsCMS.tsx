"use client";
import { CalendarFold, ChevronRight, Loader2, PenTool } from "lucide-react";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { useEffect } from "react";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import MeetingPlatformOptionItemCMS, {
  MeetingPlatformVariant,
} from "../items/MeetingPlatformItemCMS";
import { getMeetingPlatformVariantFromURL } from "@/lib/meeting-platform-variants";
import LearningListCMS from "../indexes/LearningListCMS";
import MaterialListCMS from "../indexes/MaterialListCMS";
import UserBadgeCMS from "../buttons/UserBadgeCMS";
import LearningMethodLabelCMS from "../labels/LearningMethodLabelCMS";
import { LearningSessionVariant } from "../labels/LearningSessionIconLabelCMS";

dayjs.extend(localizedFormat);

interface LearningDetailsCMSProps {
  sessionToken: string;
  cohortId: number;
  learningId: number;
}

export default function LearningDetailsCMS({
  sessionToken,
  cohortId,
  learningId,
}: LearningDetailsCMSProps) {
  // --- Set token for API
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  // --- Call data from tRPC
  const {
    data: learningDetailsData,
    isLoading: isLoadingLearningDetails,
    isError: isErrorLearningDetails,
  } = trpc.read.learning.useQuery(
    { id: learningId },
    { enabled: !!sessionToken }
  );
  // --- Extract variable
  const isLoading = isLoadingLearningDetails;
  const isError = isErrorLearningDetails;
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
    <div className="container max-w-[calc(100%-4rem)] w-full flex flex-col gap-5">
      {/* --- PAGE HEADER */}
      <div className="page-header flex flex-col gap-3">
        <AppBreadcrumb>
          <ChevronRight className="size-3.5" />
          <AppBreadcrumbItem href="/cohorts">Cohorts</AppBreadcrumbItem>
          <ChevronRight className="size-3.5" />
          <AppBreadcrumbItem href={`/cohorts/${cohortId}`}>
            Details
          </AppBreadcrumbItem>
          <ChevronRight className="size-3.5" />
          <AppBreadcrumbItem
            href={`/cohorts/${cohortId}/learnings/${learningId}`}
            isCurrentPage
          >
            {learningDetailsData?.learning.name}
          </AppBreadcrumbItem>
        </AppBreadcrumb>

        {/* --- DETAILS */}
        <div className="flex flex-col gap-5">
          {/* --- LEADERBOARD HEADER */}
          <div className="container-leaderboard-learning relative flex w-full items-center aspect-leaderboard-banner rounded-lg overflow-hidden">
            {/* Metadata */}
            <div className="metadata-leaderboard-learning flex flex-col max-w-[528px] pl-8 gap-4 z-10 ">
              <div className="flex w-fit">
                <LearningMethodLabelCMS
                  labelName={learningDetailsData?.learning.method || ""}
                  variants={
                    learningDetailsData?.learning
                      .method as LearningSessionVariant
                  }
                />
              </div>
              <h1 className="font-brand font-bold text-2xl text-white">
                {learningDetailsData?.learning.name}
              </h1>
              <div className="date flex w-fit gap-2 items-center bg-black/15 text-white rounded-md p-2">
                <CalendarFold className="size-5" />
                <p className="flex font-bodycopy font-medium text-sm">
                  {dayjs(learningDetailsData?.learning.meeting_date).format(
                    "lll"
                  )}
                </p>
              </div>
            </div>

            {/* Edit */}
            <div className="absolute flex top-4 right-4 z-10">
              <AppButton variant="outline" size="small">
                <PenTool className="size-4" />
                Edit Learning Session
              </AppButton>
            </div>

            {/* Background */}
            <Image
              className="object-cover w-full h-full"
              src={
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//header-wall-learning.webp"
              }
              alt="Header Learnings"
              fill
            />
          </div>
          <div className="body-container flex gap-5">
            {/* MAIN */}
            <main className="flex flex-col flex-[2] w-0 min-w-0 gap-5">
              {/* Description */}
              <div className="description flex flex-col gap-3 p-3 bg-section-background rounded-md">
                <h2 className="font-brand font-bold text-black">
                  About this sessions
                </h2>
                <p className="font-bodycopy font-medium text-sm text-black/50 bg-white p-3 rounded-md">
                  {learningDetailsData?.learning.description}
                </p>
              </div>
              {/* Materials */}
              <MaterialListCMS
                sessionToken={sessionToken}
                learningId={learningId}
              />
            </main>
            {/* ASIDE */}
            <aside className="flex flex-col flex-[1] w-full gap-5">
              {/* Speakers */}
              <div className="description flex flex-col gap-3 p-3 bg-section-background rounded-md">
                <h2 className="font-brand font-bold text-black">
                  Facilitated by
                </h2>
                <UserBadgeCMS
                  userName="Radha Wulandari"
                  userRole="EDUCATOR"
                  userAvatar={
                    learningDetailsData?.learning.speaker_id ||
                    "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
                  }
                />
              </div>
              {/* Meeting Link */}
              {learningDetailsData?.learning.meeting_url && (
                <MeetingPlatformOptionItemCMS
                  meetingURL={learningDetailsData?.learning.meeting_url || ""}
                  variant={
                    getMeetingPlatformVariantFromURL(
                      learningDetailsData?.learning.meeting_url || ""
                    ) as MeetingPlatformVariant
                  }
                />
              )}
              {/* Location */}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
