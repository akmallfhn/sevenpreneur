"use client";
import { StatusType } from "@/lib/app-types";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import HeaderNavbarLMS from "../navigations/HeaderPageLMS";
import TemplateItemCardLMS from "../items/TemplateItemCardLMS";

interface TemplateList {
  id: number;
  name: string;
  image: string;
  document_url: string;
  // status: StatusType;
}

interface TemplateListLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
  templateList: TemplateList[];
}

export default function TemplateListLMS({
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  templateList,
}: TemplateListLMSProps) {
  const activeTemplates = templateList;

  return (
    <div className="root-page hidden flex-col pl-64  pb-8 w-full h-full gap-4 items-center justify-center lg:flex">
      <HeaderNavbarLMS
        headerTitle="Business Templates"
        headerDescription="View all bootcamps you’ve purchased and enrolled in."
        sessionUserRole={sessionUserRole}
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
      />
      <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4 bg-white px-5 py-7 rounded-lg overflow-y-auto max-h-[calc(100vh-8rem)]">
        <div className="template-list grid gap-4 items-center lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5">
          {activeTemplates
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((post, index) => (
              <TemplateItemCardLMS
                key={index}
                templateName={post.name}
                templateImage={post.image}
                templateURL={post.document_url}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
