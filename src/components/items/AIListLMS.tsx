"use client";
import { StatusType } from "@/lib/app-types";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import AIItemCardLMS from "./AIItemCardLMS";
import PageHeaderLMS from "../../app/components/navigations/PageHeaderLMS";
import DisallowedMobile from "../../app/components/states/DisallowedMobile";
import EmptyListLMS from "../../app/components/states/EmptyListLMS";

export interface AIList {
  id: number;
  name: string;
  description: string | null;
  slug_url: string;
  status: StatusType;
}

interface AIListLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
  hasAIAccess: boolean;
  aiList: AIList[];
}

export default function AIListLMS({
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  hasAIAccess,
  aiList,
}: AIListLMSProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const activeAI = aiList.filter((ai) => ai.status === "ACTIVE");

  // Dynamic mobile rendering
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  // Render Mobile
  if (isMobile) {
    return <DisallowedMobile />;
  }

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 gap-5 w-full h-full items-center justify-center lg:flex">
      <PageHeaderLMS
        headerTitle="AI Business Tools"
        headerIcon={<FontAwesomeIcon icon={faBrain} size="lg" />}
        headerIconColor="bg-[#FFE8E7] text-[#C76151]"
        sessionUserRole={sessionUserRole}
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
      />
      <div className="index max-w-[calc(100%-4rem)] max-h-[calc(100vh-10rem)] w-full flex flex-col gap-4 bg-white px-5 py-7 rounded-lg overflow-y-auto">
        {hasAIAccess ? (
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
            stateDescription="Looks like you’re not part of any Bootcamp Programs. Join one to unlock all AI Tools!"
            stateAction="Explore our Program"
          />
        )}
      </div>
      <div className="remarks-open-ai flex items-center pt-5 gap-2 opacity-60">
        <p className="font-bodycopy font-medium text-[#333333] text-sm">
          Powered by
        </p>
        <div className="logo-open-ai w-[70px] h-full">
          <Image
            className="object-cover w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/open-ai-logo.svg"
            }
            alt="Logo Open AI"
            width={300}
            height={300}
          />
        </div>
      </div>
    </div>
  );
}
