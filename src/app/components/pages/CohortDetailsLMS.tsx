"use client";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import CohortDetailsTabsLMS, {
  LearningSessionList,
  ModuleList,
  ProjectList,
  UserList,
} from "../tabs/CohortDetailsTabsLMS";
import HeroCohortDetailsLMS from "../templates/HeroCohortDetailsLMS";
import AttendanceProgressBarLMS from "../elements/AttendanceProgressBarLMS";
import NearestScheduleCardLMS from "../elements/NearestScheduleCardLMS";

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
    <div className="root-page hidden flex-col pl-64 pb-8 w-full gap-7 items-center justify-center lg:flex">
      <HeroCohortDetailsLMS
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
        sessionUserRole={sessionUserRole}
        cohortName={cohortName}
      />
      <div className="body-cohort max-w-[calc(100%-4rem)] w-full flex justify-between gap-4">
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
        <aside className="aside relative flex flex-col flex-1 w-full gap-4">
          <div className="sticky top-4 flex flex-col w-full gap-4">
            <AttendanceProgressBarLMS learningList={learningList} />
            <NearestScheduleCardLMS learningList={learningList} />
          </div>
        </aside>
      </div>
    </div>
  );
}
