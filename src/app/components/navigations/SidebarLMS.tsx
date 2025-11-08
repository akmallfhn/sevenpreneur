"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DeleteSession } from "@/lib/actions";
import {
  BotMessageSquare,
  BowArrow,
  CirclePlay,
  LayoutDashboard,
  Loader2,
  LogOut,
  Presentation,
} from "lucide-react";
import SidebarMenuItemLMS from "./SidebarMenuItemLMS";
import SidebarAIResultItemLMS from "./SidebarAIResultItemLMS";

export interface AIResultListProps {
  id: string;
  name: string;
  ai_tool_slug_url: string;
}

interface SidebarLMSProps {
  aiResultList: AIResultListProps[];
}

export default function SidebarLMS({ aiResultList }: SidebarLMSProps) {
  const router = useRouter();
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  const handleLogout = async () => {
    setIsLoadingButton(true);
    const result = await DeleteSession();
    // Redirect to login page
    if (result.code === "NO_CONTENT") {
      router.push(`https://www.${domain}/auth/login`);
    } else {
      console.error("Logout failed");
    }
    setIsLoadingButton(false);
  };

  return (
    <div className="sidebar-lms-root hidden fixed flex-col gap-4 max-w-64 w-full h-full inset-y-0 left-0 items-center bg-[#FCFDFE] backdrop-blur-md z-50 overflow-y-auto dark:bg-surface-black lg:flex">
      <div className="sidebar-lms-top flex flex-col gap-4 w-full h-full max-w-[224px] pt-5">
        <div className="sidebar-main-menu sticky top-0 flex flex-col w-full gap-5 bg-[#FCFDFE] z-10">
          <div className="sidebar-lms-logo flex w-full p-2 px-2.5">
            <Image
              className="object-cover w-full h-full"
              src={
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/agora-lms-logo.svg"
              }
              alt="logo-agora-sevenpreneur"
              width={400}
              height={400}
            />
          </div>
          <div className="sidebar-lms-menu flex flex-col h-full gap-2">
            <SidebarMenuItemLMS
              menuTitle="Dashboard"
              url="/"
              icon={<LayoutDashboard />}
              isHome
            />
            <SidebarMenuItemLMS
              menuTitle="Bootcamp Programs"
              url="/cohorts"
              icon={<Presentation />}
            />
            {/* <SidebarMenuItemLMS
            menuTitle="Business Templates"
            url="/templates"
            icon={<BowArrow />}
          /> */}
            <SidebarMenuItemLMS
              menuTitle="AI"
              url="/ai"
              icon={<BotMessageSquare />}
            />
            <SidebarMenuItemLMS
              menuTitle="Learning Series"
              url="/playlists"
              icon={<CirclePlay />}
            />
          </div>
        </div>
        {aiResultList.length > 0 && (
          <div className="sidebar-lms-ai-result flex flex-col w-full gap-4">
            <hr />
            <div className="flex flex-col gap-1">
              <h2 className="m-2 mt-0 text-sm text-alternative font-bodycopy font-medium">
                GENERATED RESULT
              </h2>
              <div className="sidebar-ai-result flex flex-col h-full gap-2">
                {aiResultList.map((post) => (
                  <SidebarAIResultItemLMS
                    key={post.id}
                    aiToolSlug={post.ai_tool_slug_url}
                    aiResultId={post.id}
                    aiResultName={post.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="sidebar-lms-bottom sticky bottom-0 flex flex-col max-w-[224px] w-full py-4 bg-[#FCFDFE] gap-4 z-10">
        <div
          className={`logout-button flex w-full items-center p-2 px-2.5 gap-4 text-[#BE0E22] text-sm font-brand font-medium overflow-hidden rounded-md transition transform hover:cursor-pointer hover:bg-semi-destructive active:bg-semi-destructive active:scale-95 ${
            isLoadingButton ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleLogout}
        >
          <div className="flex size-5 items-center justify-center">
            {isLoadingButton ? (
              <Loader2 className="animate-spin" />
            ) : (
              <LogOut />
            )}
          </div>
          Logout
        </div>
      </div>
    </div>
  );
}
