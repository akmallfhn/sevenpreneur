"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import ThemeSwitcherAILN from "@/components/buttons/ThemeSwitcherAILN";
import { useSidebar } from "@/contexts/SidebarContext";
import { DeleteSession } from "@/lib/actions";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  CircleUser,
  ClipboardList,
  LogOut,
  UserRoundKey,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const HUTAMA_KARYA_LOGO =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-hk-danantara.webp";
const HUTAMA_KARYA_LOGO_SQUARE =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-hk-square.webp";
const HUTAMA_KARYA_LOGO_DARK =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-hk-danantara-white.webp";
const HUTAMA_KARYA_LOGO_SQUARE_DARK =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-hk-white-square.webp";
const DEFAULT_AVATAR =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";

const MENUS: {
  name: string;
  url: string;
  icon: LucideIcon;
  exact?: boolean;
}[] = [
  { name: "Hari Ini", url: "/student", icon: CalendarDays, exact: true },
  {
    name: "Modul Belajar",
    url: "/student/modules",
    icon: BookOpen,
    exact: true,
  },
  { name: "Tugas", url: "/student/assignments", icon: ClipboardList },
  { name: "Profile", url: "/student/profile", icon: CircleUser },
];

export default function SidebarStudentAILN({
  sessionToken,
}: {
  sessionToken: string;
}) {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const isDark = mounted && resolvedTheme === "dark";
  const logoUrl = isCollapsed
    ? isDark
      ? HUTAMA_KARYA_LOGO_SQUARE_DARK
      : HUTAMA_KARYA_LOGO_SQUARE
    : isDark
      ? HUTAMA_KARYA_LOGO_DARK
      : HUTAMA_KARYA_LOGO;
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  let loginDomain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    loginDomain = "example.com:3000";
  }

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      const res = await DeleteSession();
      if (res.code === "NO_CONTENT") {
        router.push(`https://www.${loginDomain}/auth/login`);
      } else {
        toast.error("Gagal logout. Coba lagi.");
        setIsLoggingOut(false);
      }
    } catch {
      toast.error("Gagal logout. Coba lagi.");
      setIsLoggingOut(false);
    }
  };

  const userQ = trpc.auth.checkSession.useQuery(undefined, {
    enabled: !!sessionToken,
  });
  const memberQ = trpc.auth.checkAilMember.useQuery(undefined, {
    enabled: !!sessionToken,
  });
  const user = userQ.data?.user;
  const member = memberQ.data?.ail_member;
  const groupName = member?.group?.name ?? "—";

  return (
    <div
      className={`hidden fixed w-full h-full left-0 z-50 lg:flex lg:flex-col bg-white dark:bg-black dark:border-r dark:border-red-500/20 dark:shadow-[2px_0_24px_rgba(239,68,68,0.08)] ${
        isCollapsed ? "max-w-16" : "max-w-64"
      }`}
      style={{ borderRight: "1px solid var(--dashboard-border)" }}
    >
      <div
        className={`relative flex flex-col w-full h-full ${isCollapsed ? "px-2 py-4" : "p-4"}`}
      >
        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-4 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm dark:border-red-500/40 dark:bg-black dark:shadow-[0_0_8px_rgba(239,68,68,0.4)]"
        >
          <ChevronLeft
            className={`h-3 w-3 text-gray-500 transition-transform dark:text-red-400 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>

        {/* Logo full width */}
        <div className="mb-6 flex items-center justify-center">
          <Image
            src={logoUrl}
            alt="Hutama Karya"
            width={400}
            height={400}
            className={
              isCollapsed ? "h-10 w-10 object-contain" : "h-auto w-full"
            }
          />
        </div>

        {/* Mode indicator */}
        <div
          className={`mb-4 flex items-center rounded-md border border-dashboard-border bg-white dark:border-red-500/30 dark:bg-red-500/5 dark:shadow-[0_0_12px_rgba(239,68,68,0.15)] ${
            isCollapsed ? "justify-center p-2" : "gap-2 px-3 py-2"
          }`}
        >
          <span className="size-2 shrink-0 rounded-full bg-red-500 dark:shadow-[0_0_8px_rgba(239,68,68,0.9)]" />
          {!isCollapsed && (
            <span className="text-xs font-semibold text-gray-700 dark:text-red-100">
              Dashboard Student
            </span>
          )}
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
          {MENUS.map((m) => {
            const active = m.exact
              ? pathname === m.url
              : pathname.startsWith(m.url);
            const Icon = m.icon;
            return (
              <Link
                key={m.url}
                href={m.url}
                className={`flex items-center gap-3 rounded-md p-2 text-sm transition ${
                  active
                    ? "bg-black text-white dark:bg-red-500/15 dark:text-red-100 dark:shadow-[inset_0_0_0_1px_rgba(239,68,68,0.4),0_0_12px_rgba(239,68,68,0.25)]"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-red-500/10 dark:hover:text-red-100"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span className="font-medium">{m.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User card */}
        <div className="mt-3 shrink-0">
          {!isCollapsed ? (
            <div className="rounded-lg border border-dashboard-border p-3 dark:border-red-500/25 dark:bg-red-500/5 dark:shadow-[0_0_20px_rgba(239,68,68,0.08)]">
              <div className="flex items-center gap-3">
                <Image
                  src={user?.avatar || DEFAULT_AVATAR}
                  alt={user?.full_name ?? ""}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover dark:ring-1 dark:ring-red-500/40"
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-semibold dark:text-white">
                    {user?.full_name ?? "..."}
                  </div>
                  <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {member?.job_title ?? ""}
                  </div>
                </div>
              </div>
              <div className="mt-2 border-t border-dashboard-border pt-2 dark:border-red-500/20">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      Group
                    </div>
                    <div className="truncate text-xs font-medium text-gray-700 dark:text-red-100">
                      {groupName}
                    </div>
                  </div>
                  <ThemeSwitcherAILN />
                </div>
              </div>
              {member?.role === "CHAMPION" && (
                <Link href="/champion" className="mt-2 block">
                  <ButtonAILN variant="outline" size="small" className="w-full">
                    <UserRoundKey className="size-4" />
                    Mode Champion
                  </ButtonAILN>
                </Link>
              )}
              <ButtonAILN
                size="small"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="mt-2 w-full"
              >
                <LogOut className="size-4" />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </ButtonAILN>
            </div>
          ) : (
            <Image
              src={user?.avatar || DEFAULT_AVATAR}
              alt={user?.full_name ?? ""}
              width={36}
              height={36}
              className="mx-auto h-9 w-9 rounded-full object-cover"
            />
          )}
        </div>
      </div>
    </div>
  );
}
