"use client";
import Image from "next/image";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import HeaderMobileLMS from "../navigations/HeaderMobileLMS";
import { LearningSessionList } from "../tabs/CohortDetailsTabsLMS";
import EmptyItemLMS from "../state/EmptyItemLMS";
import LearningSessionItemMobileLMS from "../items/LearningSessionItemMobileLMS";

interface CohortDetailsMobileLMSProps extends AvatarBadgeLMSProps {
  sessionUserId: string;
  sessionUserRole: number;
  cohortId: number;
  cohortName: string;
  cohortImage: string;
  attendanceCount: number;
  learningList: LearningSessionList[];
}

export default function CohortDetailsMobileLMS(
  props: CohortDetailsMobileLMSProps
) {
  const activeLearnings = props.learningList.filter(
    (learning) => learning.status === "ACTIVE"
  );

  return (
    <div className="root-page flex flex-col w-full items-center pb-20 lg:hidden">
      <HeaderMobileLMS headerTitle={props.cohortName} headerBackURL={`/`} />
      <div className="hero-cohort relative flex flex-col w-full aspect-thumbnail overflow-hidden">
        <Image
          className="hero-background-cohort object-cover w-full h-full"
          src={props.cohortImage}
          alt={props.cohortName}
          width={400}
          height={400}
        />
      </div>
      <div className="cohort-sessions flex flex-col w-full gap-3 bg-white p-5">
        <h2 className="section-title font-bodycopy font-bold">Sessions</h2>
        <div className="tab-content flex flex-col gap-3 w-full min-h-96">
          {activeLearnings.length > 0 ? (
            <>
              {activeLearnings
                .sort(
                  (a, b) =>
                    new Date(a.meeting_date).getTime() -
                    new Date(b.meeting_date).getTime()
                )
                .map((post, index) => (
                  <LearningSessionItemMobileLMS
                    key={index}
                    cohortId={props.cohortId}
                    learningSessionId={post.id}
                    learningSessionName={post.name}
                    learningSessionMethod={post.method}
                    learningSessionEducatorName={
                      post.speaker?.full_name || "Sevenpreneur Educator"
                    }
                    learningSessionEducatorAvatar={
                      post.speaker?.avatar ||
                      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                    }
                    learningSessionDate={post.meeting_date}
                    learningSessionPlace={
                      post.location_name || "To Be Announced"
                    }
                  />
                ))}
            </>
          ) : (
            <div className="flex w-full h-full items-center">
              <EmptyItemLMS
                stateTitle="No Sessions Available"
                stateDescription="There are no learning sessions scheduled right now. Please check back later or contact your program coordinator for updates."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
