"use client";
import { setSessionToken, trpc } from "@/trpc/client";
import { LabStakeholderEnum } from "@prisma/client";
import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  Building2,
  ClipboardList,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Star,
  Target,
  Users,
} from "lucide-react";
import { useEffect } from "react";
import AppSidebar from "./AppSidebar";
import AppSidebarGroupMenu from "./AppSidebarGroupMenu";
import AppSidebarMenuItem from "./AppSidebarMenuItem";

const DEFAULT_AVATAR =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";

interface SidebarLabProps {
  sessionToken: string;
  stakeholderType: LabStakeholderEnum;
}

export default function SidebarLab({ sessionToken, stakeholderType }: SidebarLabProps) {
  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const { data, isLoading } = trpc.auth.checkSession.useQuery(undefined, {
    enabled: !!sessionToken,
  });

  const isStudent = stakeholderType === LabStakeholderEnum.STUDENT;
  const isChampion = stakeholderType === LabStakeholderEnum.CHAMPION;
  const isSponsor = stakeholderType === LabStakeholderEnum.SPONSOR;

  const roleLabel = isStudent ? "Student" : isChampion ? "Champion" : "Sponsor";

  return (
    <AppSidebar
      logo="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-genesis%20(2).webp"
      logoLabel="Lab — AI Adoption Platform"
      avatarSrc={data?.user.avatar || DEFAULT_AVATAR}
      avatarName={isLoading ? "..." : (data?.user.full_name ?? "")}
      avatarRole={roleLabel}
    >
      <AppSidebarGroupMenu groupName="Overview">
        <AppSidebarMenuItem
          menuName="Dashboard"
          menuURL="/"
          menuIcon={<LayoutDashboard className="size-[18px]" />}
          exact
        />
      </AppSidebarGroupMenu>

      {isStudent && (
        <AppSidebarGroupMenu groupName="My Work">
          <AppSidebarMenuItem
            menuName="Use Cases"
            menuURL="/use-cases"
            menuIcon={<BookOpen className="size-[18px]" />}
          />
          <AppSidebarMenuItem
            menuName="Competency"
            menuURL="/competency"
            menuIcon={<BrainCircuit className="size-[18px]" />}
          />
          <AppSidebarMenuItem
            menuName="Obstacles"
            menuURL="/obstacles"
            menuIcon={<Target className="size-[18px]" />}
          />
          <AppSidebarMenuItem
            menuName="Coaching"
            menuURL="/coaching"
            menuIcon={<MessageSquare className="size-[18px]" />}
          />
        </AppSidebarGroupMenu>
      )}

      {isChampion && (
        <AppSidebarGroupMenu groupName="My Team">
          <AppSidebarMenuItem
            menuName="Team Overview"
            menuURL="/team"
            menuIcon={<Users className="size-[18px]" />}
          />
          <AppSidebarMenuItem
            menuName="Review Queue"
            menuURL="/use-cases"
            menuIcon={<ClipboardList className="size-[18px]" />}
          />
          <AppSidebarMenuItem
            menuName="Coaching"
            menuURL="/coaching"
            menuIcon={<MessageSquare className="size-[18px]" />}
          />
          <AppSidebarMenuItem
            menuName="Obstacles"
            menuURL="/obstacles"
            menuIcon={<Target className="size-[18px]" />}
          />
          <AppSidebarMenuItem
            menuName="Competency"
            menuURL="/competency"
            menuIcon={<BrainCircuit className="size-[18px]" />}
          />
        </AppSidebarGroupMenu>
      )}

      {isSponsor && (
        <AppSidebarGroupMenu groupName="Executive">
          <AppSidebarMenuItem
            menuName="ROI Overview"
            menuURL="/overview"
            menuIcon={<BarChart3 className="size-[18px]" />}
          />
          <AppSidebarMenuItem
            menuName="Departments"
            menuURL="/team"
            menuIcon={<Building2 className="size-[18px]" />}
          />
          <AppSidebarMenuItem
            menuName="Use Cases"
            menuURL="/use-cases"
            menuIcon={<ClipboardList className="size-[18px]" />}
          />
          <AppSidebarMenuItem
            menuName="Champions"
            menuURL="/coaching"
            menuIcon={<ShieldCheck className="size-[18px]" />}
          />
        </AppSidebarGroupMenu>
      )}

      <AppSidebarGroupMenu groupName="Community">
        <AppSidebarMenuItem
          menuName="Achievements"
          menuURL="/achievements"
          menuIcon={<Star className="size-[18px]" />}
        />
      </AppSidebarGroupMenu>
    </AppSidebar>
  );
}
