"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  CalendarFold,
  ChevronRight,
  Disc2,
  Loader2,
  PenTool,
  Plus,
  TvMinimalPlay,
} from "lucide-react";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import AppButton from "../buttons/AppButton";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import MaterialListCMS from "../indexes/MaterialListCMS";
import UserBadgeCMS from "../buttons/UserBadgeCMS";
import LearningMethodLabelCMS from "../labels/LearningMethodLabelCMS";
import LocationItemCMS from "../items/LocationItemCMS";
import EditLearningFormCMS from "../forms/EditLearningFormCMS";
import UpdateVideoRecordingFormCMS from "../forms/UpdateVideoRecordingForm";
import { extractEmbedPathFromYouTubeURL } from "@/lib/extract-youtube-id";
import { SessionMethod } from "@/lib/app-types";
import ConferenceItemCMS from "../items/ConferenceItemCMS";
import EmptyRecordingCMS from "../state/EmptyRecordingCMS";

dayjs.extend(localizedFormat);

interface LearningDetailsCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId: number;
  learningId: number;
}

export default function LearningDetailsCMS({
  sessionToken,
  sessionUserRole,
  cohortId,
  learningId,
}: LearningDetailsCMSProps) {
  const [editLearning, setEditLearning] = useState(false);
  const [updateRecording, setUpdateRecording] = useState(false);

  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  // Fetch tRPC Data
  const {
    data: learningDetailsData,
    isLoading,
    isError,
  } = trpc.read.learning.useQuery(
    { id: learningId },
    { enabled: !!sessionToken }
  );
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

  const recordingURL = learningDetailsData?.learning.recording_url || "";
  const embedYoutube = extractEmbedPathFromYouTubeURL(recordingURL);

  return (
    <React.Fragment>
      <div className="container max-w-[calc(100%-4rem)] w-full flex flex-col gap-5">
        <div className="header-cms flex flex-col gap-3">
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

          <div className="body-learning flex flex-col w-full gap-4">
            <div className="hero-learning relative flex w-full items-center aspect-leaderboard-banner rounded-lg overflow-hidden">
              <Image
                className="hero-background object-cover w-full h-full inset-0 z-0"
                src={
                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//leaderboard-wallpaper.jpeg"
                }
                alt="Header Learnings"
                width={800}
                height={800}
              />
              <div className="learning-attributes absolute flex flex-col max-w-[528px] top-1/2 -translate-y-1/2 left-8 gap-3 z-10">
                <div className="learning-method flex w-fit">
                  <LearningMethodLabelCMS
                    labelName={learningDetailsData?.learning.method || ""}
                    variants={
                      learningDetailsData?.learning.method as SessionMethod
                    }
                  />
                </div>
                <h1 className="learning-name font-brand font-bold text-2xl text-white">
                  {learningDetailsData?.learning.name}
                </h1>
                <div className="learning-date flex w-fit gap-2 items-center bg-black/15 text-white rounded-md p-2">
                  <CalendarFold className="size-5" />
                  <p className="flex font-bodycopy font-medium text-sm">
                    {dayjs(learningDetailsData?.learning.meeting_date).format(
                      "ddd[,] DD MMM YYYY [-] HH:mm"
                    )}
                  </p>
                </div>
              </div>
              <div className="edit-learning absolute flex top-4 right-4 z-10">
                <AppButton
                  variant="outline"
                  size="small"
                  onClick={() => setEditLearning(true)}
                >
                  <PenTool className="size-4" />
                  Edit Learning Session
                </AppButton>
              </div>
            </div>
            <div className="body-contents flex w-full justify-between gap-4">
              <main className="flex flex-col flex-2 min-w-0 shrink-0 gap-4">
                <div className="learning-description flex flex-col gap-3 p-3 bg-section-background rounded-md">
                  <h2 className="section-name font-brand font-bold text-black">
                    What&apos;s on this sessions?
                  </h2>
                  <p className="font-bodycopy font-medium text-sm text-[#333333] bg-white p-3 rounded-md whitespace-pre-line">
                    {learningDetailsData?.learning.description}
                  </p>
                </div>
                <div className="video-recording flex flex-col gap-3 p-3 bg-section-background rounded-md">
                  <div className="section-name flex justify-between items-center">
                    <h2 className="font-brand font-bold text-black">
                      Video Recording
                    </h2>
                    {learningDetailsData?.learning.recording_url && (
                      <AppButton
                        variant="outline"
                        size="small"
                        onClick={() => setUpdateRecording(true)}
                      >
                        <TvMinimalPlay className="size-4" />
                        Change Video
                      </AppButton>
                    )}
                  </div>
                  {learningDetailsData?.learning.recording_url && (
                    <div className="relative w-full aspect-video rounded-md overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${embedYoutube}&amp;controls=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                  {!learningDetailsData?.learning.recording_url && (
                    <EmptyRecordingCMS
                      actionClick={() => setUpdateRecording(true)}
                    />
                  )}
                </div>
              </main>

              <aside className="aside-contents flex flex-col flex-1 min-w-0 gap-4">
                <div className="learning-educator flex flex-col gap-3 p-3 bg-section-background rounded-md">
                  <h2 className="section-name font-brand font-bold text-black">
                    Lectured by
                  </h2>
                  <UserBadgeCMS
                    userName={
                      learningDetailsData?.learning.speaker?.full_name ||
                      "Sevenpreneur Educator"
                    }
                    userRole="EDUCATOR"
                    userAvatar={
                      learningDetailsData?.learning.speaker?.avatar ||
                      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
                    }
                  />
                </div>
                <MaterialListCMS
                  sessionToken={sessionToken}
                  sessionUserRole={sessionUserRole}
                  learningId={learningId}
                />
                <div className="learning-location-conference flex flex-col gap-3 p-3 bg-section-background rounded-md">
                  <h2 className="section-name font-brand font-bold text-black">
                    Place and Access
                  </h2>
                  {/* Location */}
                  {learningDetailsData?.learning.location_name &&
                    learningDetailsData?.learning.location_url && (
                      <LocationItemCMS
                        locationName={
                          learningDetailsData?.learning.location_name
                        }
                        locationURL={learningDetailsData?.learning.location_url}
                      />
                    )}
                  {/* Meeting Link */}
                  {learningDetailsData?.learning.meeting_url && (
                    <ConferenceItemCMS
                      conferenceURL={
                        learningDetailsData?.learning.meeting_url || ""
                      }
                    />
                  )}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>

      {/* Form Edit Learning */}
      {editLearning && (
        <EditLearningFormCMS
          sessionToken={sessionToken}
          learningId={learningId}
          initialData={learningDetailsData?.learning}
          isOpen={editLearning}
          onClose={() => setEditLearning(false)}
        />
      )}

      {/* Form Update Recording */}
      {updateRecording && (
        <UpdateVideoRecordingFormCMS
          learningId={learningId}
          initialData={learningDetailsData?.learning}
          isOpen={updateRecording}
          onClose={() => setUpdateRecording(false)}
        />
      )}
    </React.Fragment>
  );
}
