"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import { useSidebar } from "@/contexts/SidebarContext";
import { DeleteSession } from "@/lib/actions";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const HUTAMA_KARYA_LOGO =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-hk-danantara.webp";
const HUTAMA_KARYA_LOGO_SQUARE =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-hk-square.webp";
const DEFAULT_AVATAR =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";

const ACCENT = "#00359D";

const MENUS: {
  name: string;
  url: string;
  icon: LucideIcon;
  exact?: boolean;
}[] = [
  { name: "Dashboard", url: "/sponsor", icon: LayoutDashboard, exact: true },
];

export default function SidebarSponsorAILN({
  sessionToken,
}: {
  sessionToken: string;
}) {
  const { isCollapsed, toggleSidebar } = useSidebar();
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

  return (
    <div
      className={`hidden fixed w-full h-full left-0 z-50 lg:flex lg:flex-col bg-white ${
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
          className="absolute -right-4 top-6 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white shadow-sm"
        >
          <ChevronLeft
            className={`h-3 w-3 text-gray-500 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>

        {/* Logo full width */}
        <div className="mb-6 flex items-center justify-center">
          <Image
            src={isCollapsed ? HUTAMA_KARYA_LOGO_SQUARE : HUTAMA_KARYA_LOGO}
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
          className={`mb-4 flex items-center rounded-md border border-dashboard-border bg-white ${
            isCollapsed ? "justify-center p-2" : "gap-2 px-3 py-2"
          }`}
        >
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ backgroundColor: ACCENT }}
          />
          {!isCollapsed && (
            <span className="text-xs font-semibold text-gray-700">
              Dashboard Sponsor
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
                style={active ? { backgroundColor: ACCENT } : undefined}
                className={`flex items-center gap-3 rounded-md p-2 text-sm transition ${
                  active
                    ? "text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
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
            <div className="rounded-lg border border-dashboard-border p-3">
              <div className="flex items-center gap-3">
                <Image
                  src={user?.avatar || DEFAULT_AVATAR}
                  alt={user?.full_name ?? ""}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-semibold">
                    {user?.full_name ?? "..."}
                  </div>
                  <div className="truncate text-xs text-gray-500">
                    {member?.job_title ?? ""}
                  </div>
                </div>
              </div>
              <ButtonAILN
                variant="tertiary"
                size="small"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="mt-3 w-full"
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
