"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DeleteSession } from "@/lib/actions";
import SidebarMenuItemCMS from "@/app/components/navigations/SidebarMenuItemCMS";
import UserBadgeCMS from "@/app/components/buttons/UserBadgeCMS";
import {
  CircleHelp,
  CircleUserIcon,
  DoorOpen,
  GraduationCap,
  HouseIcon,
  Loader2,
} from "lucide-react";

interface SidebarCMSProps {
  currentDomain: string;
  sessionToken: string;
}

export default function SidebarCMS({
  currentDomain,
  sessionToken,
}: SidebarCMSProps) {
  // --- Defining React Hook
  const router = useRouter();
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  // --- Logout function
  const handleLogout = async () => {
    setIsLoadingButton(true);
    const result = await DeleteSession();
    console.log("result logout:", result);
    // -- Redirect to login page
    if (result.code === "SUCCESS") {
      router.push(`https://www.${currentDomain}/auth/login`);
    } else {
      console.error("Logout failed");
    }
    setIsLoadingButton(false);
  };

  return (
    <div className="sidebar-cms-root hidden lg:flex lg:flex-col lg:fixed lg:justify-between lg:pt-5 lg:pb-8 lg:max-w-64 lg:w-full lg:left-0 lg:h-full lg:bg-[#F7F7F7] lg:z-50">
      {/* --- TOP AREA */}
      <div className="sidebar-cms-top flex flex-col max-w-[224px] w-full mx-auto gap-[22px]">
        {/* --- Logo & Platform */}
        <div className="platform-and-logo flex w-full items-center gap-4">
          <div className="logo size-14 aspect-square rounded-md overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src={
                "https://static.wixstatic.com/media/02a5b1_37f72798de574a0eac1c827c176225a0~mv2.webp"
              }
              alt="logo-sevenpreneur"
              width={200}
              height={200}
            />
          </div>
          <div className="platform max-w-[132px] text-black">
            <p className="font-brand font-bold">Sevenpreneur</p>
            <p className="font-brand text-xs">Content Management System</p>
          </div>
        </div>

        {/* --- User & Roles */}
        <UserBadgeCMS sessionToken={sessionToken} />

        {/* --- Sidebar Menu */}
        <div className="sidebar-menu flex flex-col h-full gap-1">
          {/* --- Dashboard */}
          <SidebarMenuItemCMS
            exact
            url={`/`}
            menuTitle={`Dashboard`}
            icon={<HouseIcon />}
          />

          {/* --- User Management */}
          <SidebarMenuItemCMS
            url={`/users`}
            menuTitle={`Users`}
            icon={<CircleUserIcon />}
          />

          {/* --- Cohort Management */}
          <SidebarMenuItemCMS
            url={`/cohorts`}
            menuTitle={`Cohorts`}
            icon={<GraduationCap />}
          />

          {/* --- Help Management */}
          <SidebarMenuItemCMS
            url={`/help`}
            menuTitle={`Help`}
            icon={<CircleHelp />}
          />
        </div>
      </div>

      {/* --- BOTTOM AREA */}
      <div className="sidebar-cms-bottom flex flex-col max-w-[224px] mx-auto w-full">
        {/* --- Logout Button */}
        <div
          className={`logout-button flex w-full items-center p-2 gap-4 text-[#E62314] text-[15px] font-brand font-medium overflow-hidden rounded-md transition transform hover:cursor-pointer hover:bg-[#FFCDC9] active:bg-[#FFB9B4] active:scale-95 ${
            isLoadingButton ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleLogout}
        >
          <div className="flex size-5 items-center justify-center">
            {isLoadingButton ? (
              <Loader2 className="animate-spin" />
            ) : (
              <DoorOpen />
            )}
          </div>
          Logout
        </div>
      </div>
    </div>
  );
}
