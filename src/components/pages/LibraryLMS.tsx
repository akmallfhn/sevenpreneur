"use client";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import PageHeaderLMS from "../navigations/PageHeaderLMS";
import AppPageState from "../states/AppPageState";
import LibraryTabsLMS, { TemplateList } from "../tabs/LibraryTabsLMS";
import PageContainerDashboard from "./PageContainerDashboard";

interface LibraryLMSProps extends AvatarBadgeLMSProps {
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
    return <AppPageState variant="ONLY_MOBILE" />;
  }

  return (
    <PageContainerDashboard className="pb-8 gap-5 h-full items-center justify-center">
      <PageHeaderLMS
        headerTitle="Library"
        headerIcon={<FontAwesomeIcon icon={faBookOpen} size="lg" />}
        headerIconColor="bg-[#ECEBFE] dark:bg-[#1a1640] text-tertiary"
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
    </PageContainerDashboard>
  );
}
