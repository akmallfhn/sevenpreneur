"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DeleteSession } from "@/lib/actions";
import SidebarMenuItemCMS from "@/app/components/navigations/SidebarMenuItemCMS";
import UserBadgeCMS from "@/app/components/buttons/UserBadgeCMS";
import {
  BanknoteArrowDown,
  CircleUserIcon,
  DoorOpen,
  HouseIcon,
  Loader2,
  Presentation,
} from "lucide-react";
import { setSessionToken, trpc } from "@/trpc/client";

interface SidebarCMSProps {
  sessionToken: string;
  userSessionRole: number;
}

export default function SidebarCMS({
  sessionToken,
  userSessionRole,
}: SidebarCMSProps) {
  // --- Defining React Hook
  const router = useRouter();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const isAdministrator = userSessionRole === 0;

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  useEffect(() => {
    if (sessionToken) {
      setSessionToken(sessionToken);
    }
  }, [sessionToken]);

  const { data, isLoading, isError } = trpc.auth.checkSession.useQuery(
    undefined,
    { enabled: !!sessionToken }
  );
  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative">
        <Loader2 className="animate-spin size-5 " />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex w-full h-full items-center justify-center text-alternative font-bodycopy">
        No Data
      </div>
    );
  }

  // --- Logout function
  const handleLogout = async () => {
    setIsLoadingButton(true);
    const result = await DeleteSession();
    // -- Redirect to login page
    if (result.code === "SUCCESS") {
      router.push(`https://www.${domain}/auth/login`);
    } else {
      console.error("Logout failed");
    }
    setIsLoadingButton(false);
  };

  return (
    <div className="sidebar-cms-root hidden fixed justify-between pt-5 pb-8 max-w-64 w-full left-0 h-full bg-[#F7F7F7] z-50 lg:flex lg:flex-col">
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
        <UserBadgeCMS
          userName={data?.user.full_name || ""}
          userRole={data?.user.role_name.toUpperCase() || ""}
          userAvatar={
            data?.user.avatar ||
            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
          }
        />

        {/* --- Sidebar Menu */}
        <div className="sidebar-menu flex flex-col h-full gap-1">
          <SidebarMenuItemCMS
            menuTitle="Dashboard"
            url="/"
            icon={<HouseIcon />}
            exact
          />
          <SidebarMenuItemCMS
            menuTitle="Cohort & Program"
            url="/cohorts"
            icon={<Presentation />}
          />
          {isAdministrator && (
            <SidebarMenuItemCMS
              menuTitle="Users"
              url="/users"
              icon={<CircleUserIcon />}
            />
          )}
          {isAdministrator && (
            <SidebarMenuItemCMS
              menuTitle="Transactions"
              url="/transactions"
              icon={<BanknoteArrowDown />}
            />
          )}
        </div>
      </div>

      {/* --- BOTTOM AREA */}
      <div className="sidebar-cms-bottom flex flex-col max-w-[224px] mx-auto w-full">
        {/* --- Logout Button */}
        <div
          className={`logout-button flex w-full items-center p-2 gap-4 text-[#E62314] text-sm font-brand font-medium overflow-hidden rounded-md transition transform hover:cursor-pointer hover:bg-[#FFCDC9] active:bg-[#FFB9B4] active:scale-95 ${
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
