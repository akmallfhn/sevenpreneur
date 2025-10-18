"use client";
import Image from "next/image";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import HeaderNavbarLMS from "../navigations/HeaderPageLMS";
import CohortDetailsTabsLMS, {
  LearningSessionList,
} from "../tabs/CohortDetailsTabsLMS";

interface CohortDetailsLMSProps extends AvatarBadgeLMSProps {
  userRole: number;
  cohortName: string;
  learningList: LearningSessionList[];
}

export default function CohortDetailsLMS({
  userName,
  userAvatar,
  userRole,
  cohortName,
  learningList,
}: CohortDetailsLMSProps) {
  return (
    <div className="root-page hidden w-full h-full gap-4 items-center justify-center pb-8 lg:flex lg:flex-col lg:pl-64">
      <HeaderNavbarLMS
        headerTitle="Bootcamp Details"
        headerDescription="View all bootcamps you’ve purchased and enrolled in."
        userRole={userRole}
        userName={userName}
        userAvatar={userAvatar}
      />
      <div className="body-cohort max-w-[calc(100%-4rem)] w-full flex flex-col gap-4 rounded-xl">
        <div className="header-cohort relative flex w-full items-center aspect-leaderboard-banner rounded-lg overflow-hidden">
          <div className="metadata-cohort flex flex-col max-w-[528px] pl-8 gap-4 z-10 ">
            <h1 className="font-brand font-bold text-2xl text-white">
              {cohortName}
            </h1>
          </div>
          <div></div>
          <Image
            className="object-cover w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//leaderboard-wallpaper.jpeg"
            }
            alt="Header Banner Cohort"
            fill
          />
        </div>
        <div className="flex justify-between gap-4">
          <main className="main flex flex-col flex-[2.5] w-full">
            <CohortDetailsTabsLMS learningList={learningList} />
          </main>
          <aside className="aside relative flex flex-col flex-1 w-full">
            <div className="present sticky top-20 w-full h-40 bg-white rounded-lg">
              Attendance
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
