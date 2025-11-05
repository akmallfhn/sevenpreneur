"use client";
import { StatusType } from "@/lib/app-types";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import EmptyListLMS from "../state/EmptyListLMS";
import AIItemCardLMS from "../items/AIItemCardLMS";
import HeaderListLMS from "../navigations/HeaderListLMS";

interface AIList {
  id: number;
  name: string;
  description: string | null;
  slug_url: string;
  status: StatusType;
}

interface AIListLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
  aiList: AIList[];
}

export default function AIListLMS({
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  aiList,
}: AIListLMSProps) {
  const activeAI = aiList.filter((ai) => ai.status === "ACTIVE");

  return (
    <div className="root-page hidden flex-col pl-64  pb-8 w-full h-full gap-4 items-center justify-center lg:flex">
      <HeaderListLMS
        headerTitle="AI Business Tools"
        headerDescription="Tools to helps you research, analyze, and plan your business faster and more accurately"
        sessionUserRole={sessionUserRole}
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
      />
      <div className="index max-w-[calc(100%-4rem)] w-full flex flex-col gap-4 bg-white px-5 py-7 rounded-lg overflow-y-auto max-h-[calc(100vh-8rem)]">
        {activeAI.length > 0 ? (
          <div className="template-list grid gap-4 items-center lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5">
            {activeAI
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((post) => (
                <AIItemCardLMS
                  key={post.id}
                  aiName={post.name}
                  aiDescriptions={post.description ?? ""}
                  aiSlug={post.slug_url}
                />
              ))}
          </div>
        ) : (
          <EmptyListLMS
            stateTitle="AI Tools Locked"
            stateDescription="Looks like you’re not part of any Bootcamp Programs join one to unlock all AI Tools!"
            stateAction="Explore our Program"
          />
        )}
      </div>
    </div>
  );
}
