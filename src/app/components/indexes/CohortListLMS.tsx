"use client";
import { StatusType } from "@/lib/app-types";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import CohortItemCardLMS from "../items/CohortItemCardLMS";
import EmptyListLMS from "../state/EmptyListLMS";
import HeaderListLMS from "../navigations/HeaderListLMS";

interface CohortList {
  id: number;
  name: string;
  image: string;
  start_date: string;
  end_date: string;
  status: StatusType;
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
  const activeCohorts = cohortList.filter(
    (cohort) => cohort.status === "ACTIVE"
  );

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full h-full items-center justify-center lg:flex">
      <HeaderListLMS
        headerTitle="Bootcamp Programs"
        headerDescription="View all bootcamps you’ve purchased and enrolled in."
        sessionUserRole={sessionUserRole}
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
      />
      <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4 bg-white px-5 py-7 rounded-lg overflow-y-auto max-h-[calc(100vh-8rem)]">
        {activeCohorts.length > 0 ? (
          <div className="cohort-list grid gap-4 items-center lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
            {activeCohorts.map((post, index) => (
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
        ) : (
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
