"use client";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import CohortItemCardLMS from "../items/CohortItemCardLMS";
import HeaderNavbarLMS from "../navigations/HeaderPageLMS";
import EmptyListLMS from "../state/EmptyListLMS";

interface CohortList {
  id: number;
  name: string;
  image: string;
  start_date: string;
  end_date: string;
}

interface CohortListLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
  cohortList: CohortList[];
}

export default function CohortListLMS({
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  cohortList,
}: CohortListLMSProps) {
  return (
    <div className="root-page hidden w-full h-full gap-4 items-center justify-center pb-8 lg:flex lg:flex-col lg:pl-64">
      <HeaderNavbarLMS
        headerTitle="Bootcamp Programs"
        headerDescription="View all bootcamps you’ve purchased and enrolled in."
        sessionUserRole={sessionUserRole}
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
      />
      <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4 bg-white px-5 py-7 rounded-lg overflow-y-auto max-h-[calc(100vh-8rem)]">
        {cohortList.length > 0 && (
          <div className="grid gap-4 items-center lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
            {cohortList.map((post, index) => (
              <CohortItemCardLMS
                key={index}
                cohortId={post.id}
                cohortName={post.name}
                cohortImage={post.image}
                cohortStartDate={post.start_date}
                cohortEndDate={post.end_date}
              />
            ))}
          </div>
        )}
        {cohortList.length < 1 && (
          <EmptyListLMS
            stateTitle="No Program Purchased Yet"
            stateDescription="Looks like you haven’t bought any bootcamp programs. Explore our collections
                    and start learning something new today!"
            stateAction="Explore our Program"
          />
        )}
      </div>
    </div>
  );
}
