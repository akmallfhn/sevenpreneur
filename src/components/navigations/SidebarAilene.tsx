"use client";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  BookOpen,
  Building2,
  CalendarDays,
  LayoutDashboard,
  Trophy,
  UserCircle,
  Users,
  Zap,
} from "lucide-react";
import { useEffect } from "react";
import AppSidebar from "./AppSidebar";
import AppSidebarGroupMenu from "./AppSidebarGroupMenu";
import AppSidebarMenuItem from "./AppSidebarMenuItem";

const DEFAULT_AVATAR =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";

interface SidebarAileneProps {
  sessionToken: string;
  sessionUserRole: number;
}

export default function SidebarAilene(props: SidebarAileneProps) {
  const isAdmin = props.sessionUserRole === 0;

  useEffect(() => {
    if (props.sessionToken) setSessionToken(props.sessionToken);
  }, [props.sessionToken]);

  const { data, isLoading } = trpc.auth.checkSession.useQuery(undefined, {
    enabled: !!props.sessionToken,
  });

  return (
    <AppSidebar
      logo="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-genesis%20(2).webp"
      logoLabel="Ailene — AI Learning Platform"
      avatarSrc={data?.user.avatar || DEFAULT_AVATAR}
      avatarName={isLoading ? "..." : (data?.user.full_name ?? "")}
      avatarRole={isLoading ? "" : (data?.user.role_name ?? "")}
    >
      <AppSidebarGroupMenu groupName="Overview">
        <AppSidebarMenuItem
          menuName="Dashboard"
          menuURL="/"
          menuIcon={<LayoutDashboard className="size-[18px]" />}
          exact
        />
        <AppSidebarMenuItem
          menuName="B2B Platform"
          menuURL="/b2b"
          menuIcon={<Building2 className="size-[18px]" />}
          badge="New"
        />
      </AppSidebarGroupMenu>

      <AppSidebarGroupMenu groupName="Belajar">
        <AppSidebarMenuItem
          menuName="Learning Path"
          menuURL="/lessons"
          menuIcon={<BookOpen className="size-[18px]" />}
        />
        <AppSidebarMenuItem
          menuName="Sesi Live"
          menuURL="/sessions"
          menuIcon={<CalendarDays className="size-[18px]" />}
        />
        <AppSidebarMenuItem
          menuName="Leaderboard"
          menuURL="/leaderboard"
          menuIcon={<Trophy className="size-[18px]" />}
        />
      </AppSidebarGroupMenu>

      <AppSidebarGroupMenu groupName="Akun">
        <AppSidebarMenuItem
          menuName="Profil Saya"
          menuURL="/profile"
          menuIcon={<UserCircle className="size-[18px]" />}
        />
      </AppSidebarGroupMenu>

      {isAdmin && (
        <AppSidebarGroupMenu groupName="Admin">
          <AppSidebarMenuItem
            menuName="Kelola Materi"
            menuURL="/admin/lessons"
            menuIcon={<BookOpen className="size-[18px]" />}
          />
          <AppSidebarMenuItem
            menuName="Kelola Members"
            menuURL="/admin/members"
            menuIcon={<Users className="size-[18px]" />}
          />
          <AppSidebarMenuItem
            menuName="Kelola Sesi"
            menuURL="/admin/sessions"
            menuIcon={<CalendarDays className="size-[18px]" />}
          />
          <AppSidebarMenuItem
            menuName="AI Adoption Insights"
            menuURL="/admin/insights"
            menuIcon={<Zap className="size-[18px]" />}
            badge="Soon"
          />
        </AppSidebarGroupMenu>
      )}
    </AppSidebar>
  );
}
