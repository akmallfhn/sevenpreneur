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
  const [editLearning, setEditLearning] = useState(false);
  const [updateRecording, setUpdateRecording] = useState(false);

  // --- Set token for API
  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  // --- Call data from tRPC
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
                      learningDetailsData?.learning.method as SessionMethod
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
                <AppButton
                  variant="outline"
                  size="small"
                  onClick={() => setEditLearning(true)}
                >
                  <PenTool className="size-4" />
                  Edit Learning Session
                </AppButton>
              </div>
              {/* Background */}
              <Image
                className="object-cover w-full h-full"
                src={
                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//leaderboard-wallpaper.jpeg"
                }
                alt="Header Learnings"
                fill
              />
            </div>
            <div className="body-container flex gap-5">
              {/* MAIN */}
              <main className="flex flex-col flex-[2] w-0 min-w-0 gap-5">
                {/* Materials */}
                <MaterialListCMS
                  sessionToken={sessionToken}
                  learningId={learningId}
                />
                {/* Recording File */}
                <div className="description flex flex-col gap-3 p-3 bg-section-background rounded-md">
                  <div className="section-name flex justify-between items-center">
                    <h2 className="font-brand font-bold text-black">
                      Recording Sessions
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
                    <div className="flex flex-col w-full pb-4 gap-5 items-center">
                      <div className="flex flex-col gap-0 text-center items-center">
                        <div className="flex max-w-[180px]">
                          <Image
                            src={
                              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//video-recording-null.webp"
                            }
                            alt="No Video"
                            width={500}
                            height={500}
                          />
                        </div>
                        <h4 className="font-bodycopy font-bold text-black/70">
                          This session currently has no recording
                        </h4>
                        <p className="font-bodycopy font-medium text-sm text-alternative">
                          You can upload one to complete the archive.
                        </p>
                      </div>
                      <div className="flex w-fit">
                        <AppButton
                          variant="cmsPrimary"
                          size="small"
                          onClick={() => setUpdateRecording(true)}
                        >
                          <Disc2 className="size-4" />
                          Add Video Recording
                        </AppButton>
                      </div>
                    </div>
                  )}
                </div>
              </main>

              {/* ASIDE */}
              <aside className="flex flex-col flex-[1] w-full gap-5">
                {/* Description */}
                <div className="description flex flex-col gap-3 p-3 bg-section-background rounded-md">
                  <h2 className="font-brand font-bold text-black">
                    About this sessions
                  </h2>
                  <p className="font-bodycopy font-medium text-sm text-black/50 bg-white p-3 rounded-md">
                    {learningDetailsData?.learning.description}
                  </p>
                </div>
                {/* Speakers */}
                <div className="description flex flex-col gap-3 p-3 bg-section-background rounded-md">
                  <h2 className="font-brand font-bold text-black">
                    Facilitated by
                  </h2>
                  <UserBadgeCMS
                    userName={
                      learningDetailsData?.learning.speaker?.full_name ||
                      "Sevenpreneur Team"
                    }
                    userRole="EDUCATOR"
                    userAvatar={
                      learningDetailsData?.learning.speaker?.avatar ||
                      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
                    }
                  />
                </div>
                <div className="description flex flex-col gap-3 p-3 bg-section-background rounded-md">
                  <h2 className="font-brand font-bold text-black">
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

      {/* Form Edit Cohort */}
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
