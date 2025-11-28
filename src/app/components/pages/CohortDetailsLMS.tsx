"use client";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import CohortDetailsTabsLMS, {
  LearningSessionList,
  ModuleList,
  ProjectList,
  UserList,
} from "../tabs/CohortDetailsTabsLMS";
import HeroCohortDetailsLMS from "../heroes/HeroCohortDetailsLMS";
import AttendanceProgressBarLMS from "../elements/AttendanceProgressBarLMS";
import NearestScheduleCardLMS from "../elements/NearestScheduleCardLMS";

interface CohortDetailsLMSProps extends AvatarBadgeLMSProps {
  sessionUserId: string;
  sessionUserRole: number;
  cohortId: number;
  cohortName: string;
  attendanceCount: number;
  learningList: LearningSessionList[];
  moduleList: ModuleList[];
  projectList: ProjectList[];
  userList: UserList[];
}

export default function CohortDetailsLMS(props: CohortDetailsLMSProps) {
  const learningCount = props.learningList.length;

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full gap-7 items-center justify-center lg:flex">
      <HeroCohortDetailsLMS
        sessionUserName={props.sessionUserName}
        sessionUserAvatar={props.sessionUserAvatar}
        sessionUserRole={props.sessionUserRole}
        cohortName={props.cohortName}
      />
      <div className="body-cohort max-w-[calc(100%-4rem)] w-full flex justify-between gap-4">
        <main className="main flex flex-col flex-[2.5] w-full">
          <CohortDetailsTabsLMS
            sessionUserId={props.sessionUserId}
            cohortId={props.cohortId}
            learningList={props.learningList}
            moduleList={props.moduleList}
            projectList={props.projectList}
            userList={props.userList}
          />
        </main>
        <aside className="aside relative flex flex-col flex-1 w-full gap-4">
          <div className="sticky top-4 flex flex-col w-full gap-4">
            <AttendanceProgressBarLMS
              learningCount={learningCount}
              attendanceCount={props.attendanceCount}
            />
            <NearestScheduleCardLMS learningList={props.learningList} />
          </div>
        </aside>
      </div>
    </div>
  );
}
