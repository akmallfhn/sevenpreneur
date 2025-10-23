"use client";
import Image from "next/image";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import HeaderCohortEntityLMS from "../navigations/HeaderCohortEntityLMS";
import dayjs from "dayjs";
import AppButton from "../buttons/AppButton";
import { MapPinned, Video } from "lucide-react";
import { SessionMethod } from "@/lib/app-types";
import {
  getConferenceAttributes,
  getConferenceVariantFromURL,
} from "@/lib/conference-variant";
import AppVideoPlayer from "../elements/AppVideoPlayer";
import FileItemLMS from "../items/FileItemLMS";

interface LearningDetailsLMSProps extends AvatarBadgeLMSProps {
  cohortId: number;
  cohortName: string;
  sessionUserRole: number;
  learningSessionName: string;
  learningSessionDescription: string;
  learningSessionDate: string;
  learningSessionMethod: SessionMethod;
  learningSessionURL: string;
  learningLocationURL: string;
  learningLocationName: string;
  learningEducatorName: string;
  learningEducatorAvatar: string;
}

export default function LearningDetailsLMS({
  cohortId,
  cohortName,
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  learningSessionName,
  learningSessionDescription,
  learningSessionDate,
  learningSessionMethod,
  learningSessionURL,
  learningLocationURL,
  learningLocationName,
  learningEducatorName,
  learningEducatorAvatar,
}: LearningDetailsLMSProps) {
  const conferencePlatform = getConferenceVariantFromURL(learningSessionURL);
  const { conferenceIcon, conferenceName } =
    getConferenceAttributes(conferencePlatform);

  const isExpired = dayjs().isAfter(dayjs(learningSessionDate).add(4, "hour"));

  let learningPlace;
  if (learningSessionMethod === "ONLINE") {
    learningPlace = conferenceName;
  } else if (learningSessionMethod === "ONSITE") {
    learningPlace = learningLocationName;
  } else if (learningSessionMethod === "HYBRID") {
    learningPlace = "Hybrid Meeting";
  }

  return (
    <div className="root-page hidden flex-col pl-64 w-full h-full gap-4 items-center pb-8 lg:flex">
      <HeaderCohortEntityLMS
        cohortId={cohortId}
        cohortName={cohortName}
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
        sessionUserRole={sessionUserRole}
        headerTitle="Learning Session"
        headerDescription="Test your knowledge and skills by completing the assignment below."
      />
      <div className="body-learning max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
        <div className="hero-learning relative w-full aspect-[5208/702] border border-outline rounded-lg overflow-hidden">
          <Image
            className="object-cover w-full h-full inset-0"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/bg-learning.webp"
            }
            alt={learningSessionName}
            width={800}
            height={800}
          />
          <div className="learning-attribute absolute flex w-full items-center top-1/2 -translate-y-1/2 left-5 gap-4 z-10">
            {learningSessionMethod !== "ONSITE" && (
              <div className="conference-icon size-[50px] aspect-square bg-white p-1 border border-outline shrink-0 rounded-lg overflow-hidden">
                <Image
                  className="object-cover w-full h-full"
                  src={conferenceIcon}
                  alt={"Test"}
                  width={400}
                  height={400}
                />
              </div>
            )}
            <div className="flex flex-col">
              <h2 className="learning-name font-bodycopy font-bold text-[22px]">
                {learningSessionName}
              </h2>
              <p className="learning-date font-bodycopy font-medium text-[15px]">
                {`${dayjs(learningSessionDate).format(
                  "ddd[,] DD MMM YYYY [-] HH:mm"
                )} ${learningPlace ? `@ ${learningPlace}` : ""}`}
              </p>
            </div>
          </div>
          {learningSessionMethod !== "ONSITE" && learningSessionURL && (
            <a
              href={learningSessionURL}
              className="learning-session-url absolute top-1/2 -translate-y-1/2 right-5 z-10"
              target="_blank"
              rel="noopenner noreferrer"
            >
              <AppButton
                size="medium"
                variant="outline"
                className="w-fit"
                disabled={isExpired}
              >
                <Video className="size-5" />
                Launch Meeting
              </AppButton>
            </a>
          )}
          {learningSessionMethod === "ONSITE" && learningLocationURL && (
            <a
              href={learningLocationURL}
              className="learning-location-url absolute top-1/2 -translate-y-1/2 right-5 z-10"
              target="_blank"
              rel="noopenner noreferrer"
            >
              <AppButton
                size="medium"
                variant="outline"
                className="w-fit"
                disabled={isExpired}
              >
                <MapPinned className="size-5" />
                Check Maps
              </AppButton>
            </a>
          )}
        </div>
        <div className="learning-contents w-full flex gap-4">
          <main className="main-contents w-full flex flex-col flex-2 gap-4">
            <div className="learning-description flex flex-col gap-3 bg-white p-4 border rounded-lg">
              <h3 className="font-bold font-bodycopy">
                What&apos;s on this sessions?
              </h3>
              <p className="text-[#333333] font-sm font-bodycopy whitespace-pre-line">
                {learningSessionDescription}
              </p>
            </div>
            <div className="learning-session-recording flex flex-col gap-3 bg-white p-4 border rounded-lg">
              <h3 className="font-bold font-bodycopy">Live Class Recording</h3>
              <div className="video-recording relative w-full h-auto aspect-video overflow-hidden rounded-md">
                <AppVideoPlayer videoId={"d929af5a12b4d3fbe74215e9678b1b58"} />
              </div>
            </div>
          </main>
          <aside className="w-full flex flex-col flex-1 gap-4">
            <div className="learning-description flex flex-col gap-3 bg-white p-4 border rounded-lg">
              <h3 className="font-bold font-bodycopy">Lectured by</h3>
              <div className="educator-container flex items-center p-3 gap-3 bg-section-background rounded-lg">
                <div className="educator-avatar size-9 shrink-0 rounded-full overflow-hidden">
                  <Image
                    className="object-cover w-full h-full"
                    src={learningEducatorAvatar}
                    alt={learningEducatorName}
                    width={80}
                    height={80}
                  />
                </div>
                <div className="educator-attributes flex flex-col font-bodycopy">
                  <p className="text-[15px] text-black font-semibold line-clamp-1">
                    {learningEducatorName}
                  </p>
                  <p className="educator-role text-[13px] text-[#333333]/50 font-medium">
                    BUSINESS COACH
                  </p>
                </div>
              </div>
            </div>
            <div className="learning-materials flex flex-col gap-3 bg-white p-4 border rounded-lg">
              <h3 className="font-bold font-bodycopy">Materials</h3>
              <div className="material-list flex flex-col gap-2">
                <FileItemLMS
                  fileName="Bukan Dokumen Biasa"
                  fileURL="https://docs.google.com/document/d/1jJv8QjSJuVP07ysb5HuN8B4A34IWm6BUBagbTyFln7k/edit?tab=t.0"
                />
                <FileItemLMS
                  fileName="Bukan Dokumen Biasa"
                  fileURL="https://docs.google.com/document/d/1jJv8QjSJuVP07ysb5HuN8B4A34IWm6BUBagbTyFln7k/edit?tab=t.0"
                />
                <FileItemLMS
                  fileName="Bukan Dokumen Biasa"
                  fileURL="https://docs.google.com/document/d/1jJv8QjSJuVP07ysb5HuN8B4A34IWm6BUBagbTyFln7k/edit?tab=t.0"
                />
                <FileItemLMS
                  fileName="Bukan Dokumen Biasa"
                  fileURL="https://docs.google.com/document/d/1jJv8QjSJuVP07ysb5HuN8B4A34IWm6BUBagbTyFln7k/edit?tab=t.0"
                />
                <FileItemLMS
                  fileName="Bukan Dokumen Biasa"
                  fileURL="https://docs.google.com/document/d/1jJv8QjSJuVP07ysb5HuN8B4A34IWm6BUBagbTyFln7k/edit?tab=t.0"
                />
                <FileItemLMS
                  fileName="Bukan Dokumen Biasa"
                  fileURL="https://docs.google.com/document/d/1jJv8QjSJuVP07ysb5HuN8B4A34IWm6BUBagbTyFln7k/edit?tab=t.0"
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
