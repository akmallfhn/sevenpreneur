"use client";
import { useSidebar } from "@/contexts/SidebarContext";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  faChevronLeft,
  faRightFromBracket,
  faUsers,
  faUsersGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const HUTAMA_KARYA_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Danantara_Indonesia.svg/1280px-Danantara_Indonesia.svg.png";
const DEFAULT_AVATAR =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";

const MENUS = [
  { name: "Team Overview", url: "/champion", icon: faUsers, exact: true },
  { name: "Members", url: "/champion/members", icon: faUsersGear },
];

export default function SidebarChampionAILN({
  sessionToken,
}: {
  sessionToken: string;
}) {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  useEffect(() => {
    if (sessionToken) setSessionToken(sessionToken);
  }, [sessionToken]);

  const userQ = trpc.auth.checkSession.useQuery(undefined, {
    enabled: !!sessionToken,
  });
  const memberQ = trpc.auth.checkAilMember.useQuery(undefined, {
    enabled: !!sessionToken,
  });
  const groupsQ = trpc.ailene.champion.listGroups.useQuery(undefined, {
    enabled: !!sessionToken,
  });

  const user = userQ.data?.user;
  const member = memberQ.data?.ail_member;
  const groups = groupsQ.data?.list ?? [];
  const groupName =
    groups.length > 0 ? groups.map((g) => g.name).join(", ") : "—";
  const totalMembers = groups.reduce(
    (sum, g) => sum + (g._count?.members ?? 0),
    0
  );

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
          <FontAwesomeIcon
            icon={faChevronLeft}
            className={`h-3 w-3 text-gray-500 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>

        {/* Logo full width */}
        <div className="max-w-44 mb-6 flex items-center justify-center">
          <Image
            src={HUTAMA_KARYA_LOGO}
            alt="Hutama Karya"
            width={400}
            height={160}
            className={
              isCollapsed ? "h-10 w-10 object-contain" : "h-auto w-full"
            }
          />
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
          {MENUS.map((m) => {
            const active = m.exact
              ? pathname === m.url
              : pathname.startsWith(m.url);
            return (
              <Link
                key={m.url}
                href={m.url}
                className={`flex items-center gap-3 rounded-lg p-2 text-sm transition ${
                  active
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black"
                } ${isCollapsed ? "justify-center" : ""}`}
              >
                <FontAwesomeIcon icon={m.icon} className="h-4 w-4 shrink-0" />
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
                    {member?.role ?? ""}
                  </div>
                </div>
              </div>
              <div className="mt-2 border-t border-dashboard-border pt-2">
                <div className="text-[10px] uppercase tracking-wide text-gray-500">
                  Group
                </div>
                <div className="truncate text-xs font-medium text-gray-700">
                  {groupName}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-600">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="h-3 w-3 text-black"
                  />
                  <span className="font-semibold">{totalMembers}</span>
                  <span className="text-gray-500">members led</span>
                </div>
              </div>
              <Link
                href="/logout"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border border-dashboard-border py-1.5 text-xs text-gray-600 hover:bg-gray-50"
              >
                <FontAwesomeIcon
                  icon={faRightFromBracket}
                  className="h-3 w-3"
                />
                Logout
              </Link>
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
