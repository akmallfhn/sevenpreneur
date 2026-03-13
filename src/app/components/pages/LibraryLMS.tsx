"use client";
import { useEffect, useState } from "react";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import HeaderListLMS from "../navigations/HeaderListLMS";
import LibraryTabsLMS, { TemplateList } from "../tabs/LibraryTabsLMS";
import DisallowedMobile from "../states/DisallowedMobile";

interface LibraryLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
  templateList: TemplateList[];
  hasTemplateAccess: boolean;
}

export default function LibraryLMS(props: LibraryLMSProps) {
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
    return <DisallowedMobile />;
  }

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full h-full items-center justify-center lg:flex">
      <HeaderListLMS
        headerTitle="Library"
        sessionUserRole={props.sessionUserRole}
        sessionUserName={props.sessionUserName}
        sessionUserAvatar={props.sessionUserAvatar}
      />
      <div className="body-home max-w-[calc(100%-4rem)] w-full flex flex-col gap-5">
        <LibraryTabsLMS
          templateList={props.templateList}
          hasTemplateAccess={props.hasTemplateAccess}
        />
      </div>
    </div>
  );
}
