"use client";
import { DeleteSession } from "@/lib/actions";
import {
  BotMessageSquare,
  CircleFadingPlus,
  LayoutDashboard,
  LibraryBig,
  Loader2,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AppButton from "../buttons/AppButton";
import AgoraSevenpreneurLogo from "../svg-logos/AgoraSevenpreneurLogo";
import SidebarAIResultItemLMS from "./SidebarAIResultItemLMS";
import SidebarMenuItemLMS from "./SidebarMenuItemLMS";

export interface AIResultListProps {
  id: string;
  name: string;
  ai_tool_slug_url: string;
  created_at: string;
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
    <div className="sidebar-lms-root hidden fixed flex-col max-w-64 w-full h-full inset-y-0 left-0 items-center bg-[#FCFDFE] backdrop-blur-md z-50 dark:bg-surface-black lg:flex">
      <div className="sidebar-lms-container relative flex flex-col w-full h-full">
        <div className="sidebar-main-menu fixed top-0 left-0 w-64 flex flex-col p-3 pt-5 gap-5 bg-[#FCFDFE] z-10">
          <div className="sidebar-logo flex items-center gap-4 pl-1">
            <div className="sidebar-logo flex size-11 rounded-md outline-4 outline-primary/5 shrink-0 overflow-hidden">
              <Image
                className="object-cover w-full h-full"
                src={
                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-sevenpreneur-square-white.svg"
                }
                alt="logo-sevenpreneur"
                width={400}
                height={400}
              />
            </div>
            <Link href="/" className="sidebar-logo flex">
              <AgoraSevenpreneurLogo className="max-w-[142px] h-auto" />
            </Link>
          </div>
          <div className="sidebar-lms-menu flex flex-col w-full h-full gap-2">
            <SidebarMenuItemLMS
              menuTitle="Courses"
              url="/"
              icon={<LayoutDashboard />}
              isHome
            />
            <SidebarMenuItemLMS
              menuTitle="Library"
              url="/library"
              icon={<LibraryBig />}
            />
            <SidebarMenuItemLMS
              menuTitle="AI"
              url="/ai"
              icon={<BotMessageSquare />}
            />
          </div>
        </div>
        <div className="sidebar-scroll-body flex flex-col w-full h-full gap-4 mt-[224px] mb-[68px] px-3 overflow-y-auto">
          <hr />
          <Link href="/ai/chat" className="w-full">
            <AppButton className="w-full" size="medium" variant="primaryLight">
              New Chat <CircleFadingPlus className="size-4.5" />
            </AppButton>
          </Link>
          {aiResultList.length > 0 && (
            <div className="sidebar-lms-ai-result flex flex-col w-full gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="m-2 mt-0 text-sm text-alternative font-bodycopy font-medium">
                  Generated Result
                </h2>
                <div className="sidebar-ai-result flex flex-col h-full gap-2">
                  {aiResultList.map((post) => (
                    <SidebarAIResultItemLMS
                      key={post.id}
                      aiToolSlug={post.ai_tool_slug_url}
                      aiResultId={post.id}
                      aiResultName={post.name || "Agora AI"}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="sidebar-lms-bottom fixed flex bottom-0 mx-auto w-full px-3 py-4 bg-[#FCFDFE] z-10">
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
    </div>
  );
}
