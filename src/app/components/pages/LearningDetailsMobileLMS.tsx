"use client";
import HeaderMobileLMS from "../navigations/HeaderMobileLMS";
import Image from "next/image";
import LearningDetailsTabsMobileLMS, {
  LearningDetailsTabsMobileLMSProps,
} from "../tabs/LearningDetailsTabsMobileLMS";
import { Star } from "lucide-react";
import AppButton from "../buttons/AppButton";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";

interface LearningDetailsMobileLMSProps
  extends LearningDetailsTabsMobileLMSProps,
    AvatarBadgeLMSProps {
  cohortId: number;
  cohortName: string;
  sessionUserRole: number;
  learningSessionName: string;
  learningEducatorName: string;
  learningEducatorAvatar: string;
  learningSessionFeedbackURL: string;
}

export default function LearningDetailsMobileLMS(
  props: LearningDetailsMobileLMSProps
) {
  return (
    <div className="root-page flex flex-col w-full items-center pb-20 lg:hidden">
      <HeaderMobileLMS
        headerTitle="Session Details"
        headerBackURL={`/cohorts/${props.cohortId}`}
      />
      <div className="hero-learning-session relative flex flex-col w-full aspect-[16/7] overflow-hidden">
        <Image
          className="hero-background-session object-cover w-full h-full scale-125"
          src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/bg-learning-mob%20(1).webp"
          alt="Session Details"
          width={400}
          height={400}
        />
        <div className="learning-session-attributes absolute flex flex-col gap-2 top-1/2 -translate-y-1/2 left-5 pr-5">
          <div className="educator-avatar flex w-8 aspect-square outline-4 outline-white/50 rounded-full overflow-hidden">
            <Image
              className="object-cover w-full h-full scale-125"
              src={props.learningEducatorAvatar}
              alt="Session Details"
              width={400}
              height={400}
            />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="learning-session-name font-bodycopy font-bold text-white text-lg leading-snug line-clamp-2">
              {props.learningSessionName}
            </h1>
            <p className="educator-name font-bodycopy font-medium text-sm text-white/80 leading-snug">
              {props.learningEducatorName}
            </p>
          </div>
        </div>
      </div>
      <LearningDetailsTabsMobileLMS
        sessionUserId={props.sessionUserId}
        sessionUserAvatar={props.sessionUserAvatar}
        sessionUserName={props.sessionUserName}
        learningSessionId={props.learningSessionId}
        learningSessionDescription={props.learningSessionDescription}
        learningSessionDate={props.learningSessionDate}
        learningSessionMethod={props.learningSessionMethod}
        learningSessionURL={props.learningSessionURL}
        learningLocationName={props.learningLocationName}
        learningLocationURL={props.learningLocationURL}
        learningSessionCheckIn={props.learningSessionCheckIn}
        learningSessionCheckOut={props.learningSessionCheckOut}
        learningRecordingCloudflare={props.learningRecordingCloudflare}
        learningRecordingYoutube={props.learningRecordingYoutube}
        hasCheckIn={props.hasCheckIn}
        hasCheckOut={props.hasCheckOut}
        materialList={props.materialList}
        discussionStarterList={props.discussionStarterList}
      />
      {props.learningSessionFeedbackURL && props.learningSessionCheckOut && (
        <div className="ratings-feedback fixed flex w-full bottom-0 inset-x-0 items-center justify-between bg-white py-4 px-5 gap-6 border-t border-outline transition-all z-[90]">
          <p className="section-title font-bold font-bodycopy text-[15px]">
            How satisfied are you with this session?
          </p>
          <a
            href={props.learningSessionFeedbackURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AppButton className="shrink-0" variant="tertiary">
              Rate us <Star className="size-6" fill="#FFB21D" stroke="0" />
            </AppButton>
          </a>
        </div>
      )}
    </div>
  );
}
