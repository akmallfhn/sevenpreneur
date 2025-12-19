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
import { useEffect, useState } from "react";
import CohortDetailsMobileLMS from "./CohortDetailsMobileLMS";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { Eye } from "lucide-react";

interface CohortDetailsLMSProps extends AvatarBadgeLMSProps {
  sessionUserId: string;
  sessionUserRole: number;
  cohortId: number;
  cohortName: string;
  cohorImage: string;
  userCertificate: string;
  attendanceCount: number;
  learningList: LearningSessionList[];
  moduleList: ModuleList[];
  projectList: ProjectList[];
  userList: UserList[];
}

export default function CohortDetailsLMS(props: CohortDetailsLMSProps) {
  const learningCount = props.learningList.length;
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // Dynamic mobile rendering
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) {
    return (
      <CohortDetailsMobileLMS
        cohortId={props.cohortId}
        cohortName={props.cohortName}
        cohortImage={props.cohorImage}
        learningList={props.learningList}
      />
    );
  }

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
            {props.userCertificate && (
              <div className="certificate-gateway relative flex w-full aspect-[1280/494] rounded-lg overflow-hidden">
                <Image
                  className="object-cover w-full h-full"
                  src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/gateway-certificate.webp"
                  alt="Certificate Gateway"
                  width={600}
                  height={600}
                />
                <div className="absolute flex flex-col top-1/2 -translate-y-1/2 left-4 text-white gap-3 z-10">
                  <h4 className="font-bodycopy font-semibold max-w-32 leading-tight">
                    Certificate of Completion
                  </h4>
                  <a
                    href={props.userCertificate}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AppButton variant="outline" size="small">
                      <Eye className="size-4" /> View Certificate
                    </AppButton>
                  </a>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
