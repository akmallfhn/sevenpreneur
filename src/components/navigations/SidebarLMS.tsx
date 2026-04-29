"use client";
import { useSidebar } from "@/contexts/SidebarContext";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  BotMessageSquare,
  CircleFadingPlus,
  LayoutDashboard,
  LibraryBig,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import AppButton from "../buttons/AppButton";
import AgoraSevenpreneurLogo from "../svg-logos/AgoraSevenpreneurLogo";
import AppSidebar from "./AppSidebar";
import AppSidebarMenuItem from "./AppSidebarMenuItem";
import { useTheme } from "next-themes";

export interface AIResultListProps {
  id: string;
  name: string;
  ai_tool_slug_url: string;
  created_at: string;
}

interface SidebarLMSProps {
  sessionToken: string;
  aiResultList: AIResultListProps[];
}

export default function SidebarLMS({
  sessionToken,
  aiResultList,
}: SidebarLMSProps) {
  const { isCollapsed } = useSidebar();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const logoURL = isDark
    ? "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-sevenpreneur-square.svg"
    : "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-sevenpreneur-square-white.svg";

  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const { data } = trpc.auth.checkSession.useQuery(undefined, {
    enabled: !!sessionToken,
  });

  return (
    <AppSidebar
      logo={logoURL}
      logoLabel="Agora Sevenpreneur"
      logoLabelDisplay={
        <AgoraSevenpreneurLogo className="max-w-[142px] h-auto" />
      }
      avatarSrc={data?.user.avatar ?? undefined}
      avatarName={data?.user.full_name ?? undefined}
      avatarRole={data?.user.role_name ?? undefined}
    >
      <AppSidebarMenuItem
        menuName="Courses"
        menuURL="/"
        menuIcon={<LayoutDashboard />}
        exact
      />
      <AppSidebarMenuItem
        menuName="Library"
        menuURL="/library"
        menuIcon={<LibraryBig />}
      />
      <AppSidebarMenuItem
        menuName="AI"
        menuURL="/ai"
        menuIcon={<BotMessageSquare />}
      />
      {aiResultList.length > 0 && (
        <>
          <hr className="border-b border-dashboard-border mt-3 mb-3" />
          {!isCollapsed && (
            <Link href="/ai/chat" className="w-full">
              <AppButton
                className="w-full"
                size="small"
                variant={isDark ? "tertiary" : "primarySoft"}
              >
                New Chat <CircleFadingPlus className="size-4" />
              </AppButton>
            </Link>
          )}
          {aiResultList.map((item) => (
            <AppSidebarMenuItem
              key={item.id}
              menuName={item.name || "Agora AI"}
              menuURL={`/ai/${item.ai_tool_slug_url}/${item.id}`}
            />
          ))}
        </>
      )}
    </AppSidebar>
  );
}
