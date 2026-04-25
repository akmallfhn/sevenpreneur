"use client";
import AvatarBadgeCMS from "@/components/buttons/AvatarBadgeCMS";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import { DeleteSession } from "@/lib/actions";
import { setSessionToken, trpc } from "@/trpc/client";
import { BookOpen, LayoutDashboard, Loader2, LogOut, PanelLeftClose, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppButton from "../buttons/AppButton";
import SidebarMenuGroupCMS from "./SidebarMenuGroupCMS";
import SidebarMenuItemCMS from "./SidebarMenuItemCMS";

interface SidebarAileneProps {
  sessionToken: string;
  sessionUserRole: number;
}

export default function SidebarAilene(props: SidebarAileneProps) {
  const router = useRouter();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebar();

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  const isAdmin = props.sessionUserRole === 0;

  useEffect(() => {
    if (props.sessionToken) setSessionToken(props.sessionToken);
  }, [props.sessionToken]);

  const { data, isLoading, isError } = trpc.auth.checkSession.useQuery(
    undefined,
    { enabled: !!props.sessionToken }
  );

  const handleLogout = async () => {
    setIsLoadingButton(true);
    const result = await DeleteSession();
    if (result.code === "NO_CONTENT") {
      router.push(`https://www.${domain}/auth/login`);
    }
    setIsLoadingButton(false);
  };

  return (
    <div
      className={`sidebar-ailene-root hidden fixed w-full h-full left-0 z-50 lg:flex lg:flex-col ${isCollapsed ? "max-w-16 items-center" : "max-w-64"}`}
    >
      <div className="sidebar-container relative flex flex-col w-full h-full p-4 bg-[#F7F7F7]">
        <div className={`absolute -right-5 ${isCollapsed ? "top-5" : "top-6"}`}>
          <AppButton size="mediumIcon" variant="light" onClick={toggleSidebar}>
            <PanelLeftClose
              className={`size-4 text-emphasis transition-all duration-300 ease-in-out ${isCollapsed ? "rotate-180" : ""}`}
            />
          </AppButton>
        </div>

        <div className="sidebar-ailene-top flex flex-col w-full gap-[22px]">
          <Link href="/" className="sidebar-logo flex items-center gap-4 pl-1">
            <div
              className={`flex w-full max-w-11 aspect-square outline-4 outline-black/20 shrink-0 overflow-hidden ${isCollapsed ? "rounded-sm" : "rounded-md"}`}
            >
              <Image
                className="object-cover w-full h-full"
                src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-sevenpreneur-square-black.svg"
                alt="logo-ailene"
                width={400}
                height={400}
              />
            </div>
            <p
              className={`font-bodycopy font-medium text-sm leading-tight transition-all duration-300 ease-in-out ${isCollapsed ? "-translate-x-10 opacity-0 line-clamp-2" : "translate-x-0 opacity-100"}`}
            >
              Ailene — AI Learning Platform
            </p>
          </Link>

          {isLoading && (
            <div className="flex w-full h-full items-center justify-center text-emphasis">
              <Loader2 className="animate-spin size-5" />
            </div>
          )}
          {isError && (
            <div className="flex w-full h-full items-center justify-center text-emphasis font-bodycopy">
              No Data
            </div>
          )}
          {!isLoading && !isError && !isCollapsed && (
            <AvatarBadgeCMS
              userName={data?.user.full_name || ""}
              userRole={data?.user.role_name.toUpperCase() || ""}
              userAvatar={
                data?.user.avatar ||
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
              }
            />
          )}

          <div className="sidebar-menu flex flex-col h-full gap-1">
            <SidebarMenuGroupCMS groupName="Menu">
              <SidebarMenuItemCMS
                menuName="Dashboard"
                menuURL="/"
                menuIcon={<LayoutDashboard className="size-[18px]" />}
                exact
              />
              <SidebarMenuItemCMS
                menuName="Materi"
                menuURL="/lessons"
                menuIcon={<BookOpen className="size-[18px]" />}
              />
            </SidebarMenuGroupCMS>

            {isAdmin && (
              <SidebarMenuGroupCMS groupName="Admin">
                <SidebarMenuItemCMS
                  menuName="Kelola Materi"
                  menuURL="/admin/lessons"
                  menuIcon={<Settings className="size-[18px]" />}
                />
              </SidebarMenuGroupCMS>
            )}
          </div>
        </div>

        <div className="sidebar-ailene-bottom absolute flex flex-col bottom-4 inset-x-4">
          <AppButton
            size={isCollapsed ? "icon" : "medium"}
            variant="destructiveSoft"
            onClick={handleLogout}
          >
            {isLoadingButton ? (
              <Loader2 className="animate-spin size-4" />
            ) : (
              <LogOut className="size-4" />
            )}
            {!isCollapsed && "Logout"}
          </AppButton>
        </div>
      </div>
    </div>
  );
}
