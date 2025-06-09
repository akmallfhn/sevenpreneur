"use client";
import SidebarMenuItemCMS from "../elements/SidebarMenuItemCMS";
import Image from "next/image";
import Link from "next/link";
import {
  CircleHelp,
  CircleUserIcon,
  DoorOpen,
  GraduationCap,
  HouseIcon,
} from "lucide-react";

export default function SidebarCMS() {
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
          <div className="platform max-w-[132px]">
            <p className="font-brand font-bold">Sevenpreneur</p>
            <p className="font-brand text-xs">Content Management System</p>
          </div>
        </div>

        {/* --- User & Roles */}
        <Link
          href={"/"}
          className="user-roles-container flex w-full p-2 px-3 items-center gap-3 bg-white border border-[#E3E3E3] rounded-lg"
        >
          <div className="avatar size-9 rounded-full overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src={
                "https://media.licdn.com/dms/image/v2/D5603AQHWg6uUtVHxBg/profile-displayphoto-shrink_800_800/B56ZRRstItGQAc-/0/1736537464736?e=1754524800&v=beta&t=zSxAGjzqpwRhAB69Fck4CiLLcyPmFqC2oFHBLJw2Ynk"
              }
              alt="avatar-user"
              width={200}
              height={200}
            />
          </div>
          <div className="user-roles flex flex-col font-brand gap-0">
            <p className="user text-sm font-semibold">Aulia Askha</p>
            <p className="roles text-xs font-medium text-alternative">
              EDUCATOR
            </p>
          </div>
        </Link>

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
        <div className="logout-button flex w-full items-center p-2 gap-4 text-[#E62314] text-[15px] font-brand font-medium overflow-hidden rounded-md transition transform hover:cursor-pointer hover:bg-[#FFCDC9] active:bg-[#FFB9B4] active:scale-95">
          <div className="flex size-5 items-center justify-center">
            <DoorOpen />
          </div>
          Logout
        </div>
      </div>
    </div>
  );
}
