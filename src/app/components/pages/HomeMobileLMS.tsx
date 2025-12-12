"use client";
import { StatusType } from "@/lib/app-types";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import EmptyListLMS from "../states/EmptyListLMS";
import CohortItemCardLMS from "../items/CohortItemCardLMS";

interface CohortList {
  id: number;
  name: string;
  image: string;
  start_date: string;
  end_date: string;
  status: StatusType;
}

interface HomeMobileLMSProps extends AvatarBadgeLMSProps {
  cohortList: CohortList[];
}

export default function HomeMobileLMS(props: HomeMobileLMSProps) {
  const nickName = props.sessionUserName.split(" ")[0];
  const activeCohorts = props.cohortList.filter(
    (cohort) => cohort.status === "ACTIVE"
  );

  return (
    <div className="root-page flex flex-col w-full items-center pb-20 lg:hidden">
      <div className="greetings-content flex flex-col w-full p-5 pt-10 pb-10 bg-tertiary text-white">
        <p className="greetings-for font-bodycopy font-semibold text-lg">
          Welcome, {nickName}!
        </p>
        <p className="greetings-word font-bodycopy font-medium text-[#ffffff]/80">
          Let’s drive your business forward
        </p>
      </div>
      <div className="bootcamp-programs flex flex-col gap-3 bg-white p-5">
        <h2 className="section-title font-bodycopy font-bold">
          Bootcamp/Programs
        </h2>
        <div className="index w-full flex flex-col">
          {activeCohorts.length > 0 ? (
            <div className="cohort-list flex flex-col gap-4">
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
    </div>
  );
}
