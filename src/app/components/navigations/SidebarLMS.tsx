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

export default function SidebarLMS() {
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
    <div className="sidebar-lms-root hidden fixed justify-between pt-5 pb-8 max-w-64 w-full left-0 h-full bg-white/70 backdrop-blur-md z-50 dark:bg-surface-black lg:flex lg:flex-col">
      <div className="sidebar-lms-top flex flex-col max-w-[224px] w-full mx-auto gap-[22px]">
        <div className="platform-logo flex w-full p-2 px-2.5">
          <Image
            className="object-cover w-full h-full text-black dark:text-white"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/agora-lms-logo.svg"
            }
            alt="logo-agora-sevenpreneur"
            width={400}
            height={400}
          />
        </div>

        <div className="sidebar-menu flex flex-col h-full gap-2">
          {/* <SidebarMenuItemLMS
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
          <SidebarMenuItemLMS
            menuTitle="Business Templates"
            url="/templates"
            icon={<BowArrow />}
          />
          <SidebarMenuItemLMS
            menuTitle="AI"
            url="/ai"
            icon={<BotMessageSquare />}
          /> */}
          <SidebarMenuItemLMS
            menuTitle="Learning Series"
            url="/playlists"
            icon={<CirclePlay />}
          />
        </div>
      </div>

      <div className="sidebar-lms-bottom flex flex-col max-w-[224px] mx-auto w-full gap-4">
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
