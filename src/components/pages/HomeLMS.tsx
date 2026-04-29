"use client";
import { faCubes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import HeroHomeLMS from "../heroes/HeroHomeLMS";
import PageHeaderLMS from "../navigations/PageHeaderLMS";
import CourseTabsLMS, { CourseList } from "../tabs/CourseTabsLMS";
import HomeMobileLMS, {
  MobileCourseSummary,
  UpcomingSessionMobile,
} from "./HomeMobileLMS";
import PageContainerDashboard from "./PageContainerDashboard";

interface HomeLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
  courseList: CourseList[];
  mobileCourses: MobileCourseSummary[];
  upcomingSessions: UpcomingSessionMobile[];
  totalAttendanceCount: number;
  totalSessionCount: number;
}

export default function HomeLMS(props: HomeLMSProps) {
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
      <HomeMobileLMS
        sessionUserName={props.sessionUserName}
        sessionUserAvatar={props.sessionUserAvatar}
        sessionUserRole={props.sessionUserRole}
        courses={props.mobileCourses}
        upcomingSessions={props.upcomingSessions}
        totalAttendanceCount={props.totalAttendanceCount}
        totalSessionCount={props.totalSessionCount}
      />
    );
  }

  return (
    <PageContainerDashboard className="pb-8 gap-5 h-full items-center justify-center">
      <PageHeaderLMS
        headerTitle="Courses"
        headerIcon={<FontAwesomeIcon icon={faCubes} size="lg" />}
        headerIconColor="bg-secondary-light text-secondary"
        sessionUserRole={props.sessionUserRole}
        sessionUserName={props.sessionUserName}
        sessionUserAvatar={props.sessionUserAvatar}
      />
      <div className="body-home max-w-[calc(100%-4rem)] w-full flex flex-col gap-5">
        <HeroHomeLMS sessionUserName={props.sessionUserName} />
        <CourseTabsLMS courseList={props.courseList} />
      </div>
    </PageContainerDashboard>
  );
}
