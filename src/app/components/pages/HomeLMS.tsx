"use client";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import HeroHomeLMS from "../heroes/HeroHomeLMS";
import HeaderListLMS from "../navigations/HeaderListLMS";

interface HomeLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
}

export default function HomeLMS(props: HomeLMSProps) {
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
