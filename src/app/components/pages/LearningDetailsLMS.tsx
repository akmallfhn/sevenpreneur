"use client";
import Image from "next/image";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import HeaderCohortEntityLMS from "../navigations/HeaderCohortEntityLMS";
import HeaderProjectDetailsLMS from "../navigations/HeaderCohortEntityLMS";
import dayjs from "dayjs";
import AppButton from "../buttons/AppButton";
import { MapPinned, Video } from "lucide-react";
import { SessionMethod } from "@/lib/app-types";
import MeetingPlatformItemCMS from "../items/MeetingPlatformItemCMS";
import { getMeetingPlatformVariantFromURL } from "@/lib/meeting-platform-variants";
import {
  getConferenceAttributes,
  getConferenceVariantFromURL,
} from "@/lib/conference-variant";

interface LearningDetailsLMSProps extends AvatarBadgeLMSProps {
  cohortId: number;
  cohortName: string;
  sessionUserRole: number;
  learningSessionName: string;
  learningSessionDate: string;
  learningSessionMethod: SessionMethod;
  learningSessionURL: string;
  learningLocationURL: string;
  learningLocationName: string;
}

export default function LearningDetailsLMS({
  cohortId,
  cohortName,
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  learningSessionName,
  learningSessionDate,
  learningSessionMethod,
  learningSessionURL,
  learningLocationURL,
  learningLocationName,
}: LearningDetailsLMSProps) {
  const conferencePlatform = getConferenceVariantFromURL(learningSessionURL);
  const { conferenceIcon, conferenceName } =
    getConferenceAttributes(conferencePlatform);

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
      <div className="body-learning max-w-[calc(100%-4rem)] w-full flex gap-4">
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
                )} ${learningPlace ? ` | ${learningPlace}` : ""}`}
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
              <AppButton size="medium" variant="outline" className="w-fit">
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
              <AppButton size="medium" variant="outline" className="w-fit">
                <MapPinned className="size-5" />
                Check Maps
              </AppButton>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
