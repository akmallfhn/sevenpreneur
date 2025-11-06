"use client";
import { StatusType } from "@/lib/app-types";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import TemplateItemCardLMS from "../items/TemplateItemCardLMS";
import EmptyListLMS from "../state/EmptyListLMS";
import HeaderListLMS from "../navigations/HeaderListLMS";

interface TemplateList {
  id: number;
  name: string;
  description?: string | null;
  image: string;
  document_url: string;
  status: StatusType;
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
  const activeTemplates = templateList.filter(
    (template) => template.status === "ACTIVE"
  );

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full h-full items-center justify-center lg:flex">
      <HeaderListLMS
        headerTitle="Business Templates"
        headerDescription="Ready-to-use templates to help you plan, analyze, and execute your business"
        sessionUserRole={sessionUserRole}
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
      />
      <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4 bg-white px-5 py-7 rounded-lg overflow-y-auto max-h-[calc(100vh-8rem)]">
        {activeTemplates.length > 0 ? (
          <div className="template-list grid gap-4 items-center lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5">
            {activeTemplates
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((post, index) => (
                <TemplateItemCardLMS
                  key={index}
                  templateName={post.name}
                  templateTags={post.description ?? ""}
                  templateImage={post.image}
                  templateURL={post.document_url}
                />
              ))}
          </div>
        ) : (
          <EmptyListLMS
            stateTitle="Business Templates Locked"
            stateDescription="Looks like you’re not part of any Bootcamp Programs join one to unlock all business templates!"
            stateAction="Explore our Program"
          />
        )}
      </div>
    </div>
  );
}
