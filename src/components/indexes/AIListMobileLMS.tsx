"use client";
import Image from "next/image";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import { AIList } from "./AIListLMS";
import AIItemCardLMS from "../items/AIItemCardLMS";
import BottomNavLMS from "../navigations/BottomNavLMS";
import EmptyComponentsLMS from "../states/EmptyComponentsLMS";

interface AIListMobileLMSProps extends AvatarBadgeLMSProps {
  hasAIAccess: boolean;
  aiList: AIList[];
}

export default function AIListMobileLMS({
  sessionUserAvatar,
  sessionUserName,
  hasAIAccess,
  aiList,
}: AIListMobileLMSProps) {
  const activeAI = aiList
    .filter((ai) => ai.status === "ACTIVE")
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="root-page relative flex flex-col w-full min-h-screen pb-20 lg:hidden">
      <div className="header flex items-center justify-between w-full px-5 pt-12 pb-8 bg-tertiary text-white">
        <div className="greeting flex flex-col gap-0.5">
          <p className="font-bodycopy font-bold text-xl">AI Business Tools</p>
          <p className="font-bodycopy font-medium text-sm text-white/70">
            Powered by AI to grow your business
          </p>
        </div>
        <div className="avatar aspect-square size-12 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
          <Image
            src={sessionUserAvatar}
            alt={sessionUserName}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="content flex flex-col gap-4 p-5">
        {hasAIAccess ? (
          <div className="ai-grid grid grid-cols-2 gap-3">
            {activeAI.map((post) => (
              <AIItemCardLMS
                key={post.id}
                aiName={post.name}
                aiDescriptions={post.description ?? ""}
                aiSlug={post.slug_url}
              />
            ))}
          </div>
        ) : (
          <EmptyComponentsLMS variant="AI_TOOLS" />
        )}
      </div>

      <div className="flex items-center gap-2 px-5 pb-4 opacity-60">
        <p className="font-bodycopy font-medium text-emphasis text-sm">
          Powered by
        </p>
        <div className="logo-open-ai w-[70px]">
          <Image
            className="object-cover w-full h-full"
            src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/open-ai-logo.svg"
            alt="Logo Open AI"
            width={300}
            height={300}
          />
        </div>
      </div>

      <BottomNavLMS />
    </div>
  );
}
