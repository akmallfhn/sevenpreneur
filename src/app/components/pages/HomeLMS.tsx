"use client";
import { useEffect, useState } from "react";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import HeroHomeLMS from "../heroes/HeroHomeLMS";
import HeaderListLMS from "../navigations/HeaderListLMS";
import HomeMobileLMS, {
  CohortListMobile,
  PlaylistMobile,
} from "./HomeMobileLMS";

interface HomeLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
  cohortList: CohortListMobile[];
  playlist: PlaylistMobile[];
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
        cohortList={props.cohortList}
        playlist={props.playlist}
      />
    );
  }
  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full h-full items-center justify-center lg:flex">
      <HeaderListLMS
        headerTitle="Dashboard"
        sessionUserRole={props.sessionUserRole}
        sessionUserName={props.sessionUserName}
        sessionUserAvatar={props.sessionUserAvatar}
      />
      <div className="body-home max-w-[calc(100%-4rem)] w-full flex flex-col gap-4">
        <HeroHomeLMS sessionUserName={props.sessionUserName} />
      </div>
    </div>
  );
}
