"use client";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import CohortDetailsTabsLMS, {
  LearningSessionList,
  ModuleList,
  ProjectList,
  UserList,
} from "../tabs/CohortDetailsTabsLMS";
import HeaderCohortDetailsLMS from "../navigations/HeaderCohortDetailsLMS";

interface CohortDetailsLMSProps extends AvatarBadgeLMSProps {
  sessionUserId: string;
  sessionUserRole: number;
  cohortId: number;
  cohortName: string;
  learningList: LearningSessionList[];
  moduleList: ModuleList[];
  projectList: ProjectList[];
  userList: UserList[];
}

export default function CohortDetailsLMS({
  sessionUserId,
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  cohortId,
  cohortName,
  learningList,
  moduleList,
  projectList,
  userList,
}: CohortDetailsLMSProps) {
  return (
    <div className="root-page hidden w-full h-full gap-7 items-center justify-center pb-8 lg:flex lg:flex-col lg:pl-64">
      <HeaderCohortDetailsLMS
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
        sessionUserRole={sessionUserRole}
      />
      <div className="body-cohort max-w-[calc(100%-4rem)] w-full flex flex-col gap-4 rounded-xl">
        <div className="flex justify-between gap-4">
          <main className="main flex flex-col flex-[2.5] w-full">
            <CohortDetailsTabsLMS
              sessionUserId={sessionUserId}
              cohortId={cohortId}
              learningList={learningList}
              moduleList={moduleList}
              projectList={projectList}
              userList={userList}
            />
          </main>
          <aside className="aside relative flex flex-col flex-1 w-full">
            <div className="present sticky top-7 w-full h-40 bg-white p-4 border rounded-lg">
              <p className="font-bold font-bodycopy">Attendance</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
