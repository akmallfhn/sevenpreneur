"use client";
import AvatarBadgeCMS from "@/app/components/buttons/AvatarBadgeCMS";
import SidebarMenuItemCMS from "@/app/components/navigations/SidebarMenuItemCMS";
import { DeleteSession } from "@/lib/actions";
import { setSessionToken, trpc } from "@/trpc/client";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  BanknoteArrowDown,
  CircleUserIcon,
  FlagTriangleRight,
  Globe,
  Loader2,
  LogOut,
  PanelLeftClose,
  PenTool,
  Presentation,
  Tags,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarMenuGroupCMS from "./SidebarMenuGroupCMS";
import AppButton from "../buttons/AppButton";
import { useSidebar } from "@/app/contexts/SidebarContextCMS";

interface SidebarCMSProps {
  sessionToken: string;
  sessionUserRole: number;
}

export default function SidebarCMS(props: SidebarCMSProps) {
  const router = useRouter();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebar();

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  // Client-side Authorization
  const allowedRolesMenuCohorts = [0, 1, 2];
  const allowedRolesMenuEvents = [0, 2];
  const allowedRolesMenuDiscounts = [0];
  const allowedRolesMenuUsers = [0, 1, 2];
  const allowedRolesMenuTransactions = [0];
  const allowedRolesMenuWebMarketing = [0, 4];
  const allowedRolesMenuArticles = [0];
  const allowedRolesMenuWhatsapp = [0];

  const isAllowedMenuCohorts = allowedRolesMenuCohorts.includes(
    props.sessionUserRole,
  );
  const isAllowedMenuEvents = allowedRolesMenuEvents.includes(
    props.sessionUserRole,
  );
  const isAllowedMenuDiscounts = allowedRolesMenuDiscounts.includes(
    props.sessionUserRole,
  );
  const isAllowedMenuUsers = allowedRolesMenuUsers.includes(
    props.sessionUserRole,
  );
  const isAllowedMenuTransactions = allowedRolesMenuTransactions.includes(
    props.sessionUserRole,
  );
  const isAllowedMenuWebMarketing = allowedRolesMenuWebMarketing.includes(
    props.sessionUserRole,
  );
  const isAllowedMenuArticles = allowedRolesMenuArticles.includes(
    props.sessionUserRole,
  );
  const isAllowedMenuWhatsapp = allowedRolesMenuWhatsapp.includes(
    props.sessionUserRole,
  );

  useEffect(() => {
    if (props.sessionToken) {
      setSessionToken(props.sessionToken);
    }
  }, [props.sessionToken]);

  const { data, isLoading, isError } = trpc.auth.checkSession.useQuery(
    undefined,
    { enabled: !!props.sessionToken },
  );

  // Logout function
  const handleLogout = async () => {
    setIsLoadingButton(true);
    const result = await DeleteSession();
    if (result.code === "NO_CONTENT") {
      router.push(`https://www.${domain}/auth/login`);
    } else {
      console.error("Logout failed");
    }
    setIsLoadingButton(false);
  };

  return (
    <div
      className={`sidebar-cms-root hidden fixed w-full h-full left-0 z-50 lg:flex lg:flex-col ${isCollapsed ? "max-w-16 items-center" : "max-w-64"}`}
    >
      <div className="sidebar-container relative flex flex-col w-full h-full p-4 bg-[#F7F7F7]">
        <div className={`absolute -right-5 ${isCollapsed ? "top-5" : "top-6"}`}>
          <AppButton
            size="mediumIcon"
            variant="outline"
            onClick={() => toggleSidebar()}
          >
            <PanelLeftClose
              className={`size-4 text-alternative transition-all duration-300 ease-in-out ${isCollapsed ? "rotate-180" : ""}`}
            />
          </AppButton>
        </div>
        <div className="sidebar-cms-top flex flex-col w-full gap-[22px]">
          <Link href="/" className="sidebar-logo flex items-center gap-4 pl-1">
            <div
              className={`sidebar-logo flex w-full max-w-11 aspect-square outline-4 outline-black/20 shrink-0 overflow-hidden ${isCollapsed ? "rounded-sm" : "rounded-md"}`}
            >
              <Image
                className="object-cover w-full h-full"
                src={
                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-sevenpreneur-square-black.svg"
                }
                alt="logo-sevenpreneur"
                width={400}
                height={400}
              />
            </div>
            <p
              className={`font-bodycopy font-medium text-sm leading-tight transition-all duration-300 ease-in-out ${isCollapsed ? "-translate-x-10 opacity-0 line-clamp-2" : "translate-x-0 opacity-100"}`}
            >
              Sevenpreneur Content Management System
            </p>
          </Link>
          {isLoading && (
            <div className="flex w-full h-full items-center justify-center text-alternative">
              <Loader2 className="animate-spin size-5 " />
            </div>
          )}
          {isError && (
            <div className="flex w-full h-full items-center justify-center text-alternative font-bodycopy">
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
            {(isAllowedMenuCohorts ||
              isAllowedMenuDiscounts ||
              isAllowedMenuEvents) && (
              <SidebarMenuGroupCMS groupName="Product">
                {isAllowedMenuCohorts && (
                  <SidebarMenuItemCMS
                    menuName="Cohorts"
                    menuURL="/cohorts"
                    menuIcon={<Presentation />}
                  />
                )}
                {isAllowedMenuEvents && (
                  <SidebarMenuItemCMS
                    menuName="Events"
                    menuURL="/events"
                    menuIcon={<FlagTriangleRight />}
                  />
                )}
                {isAllowedMenuDiscounts && (
                  <SidebarMenuItemCMS
                    menuName="Discounts"
                    menuURL="/discounts"
                    menuIcon={<Tags />}
                  />
                )}
              </SidebarMenuGroupCMS>
            )}
            {(isAllowedMenuUsers || isAllowedMenuTransactions) && (
              <SidebarMenuGroupCMS groupName="Administration">
                {isAllowedMenuUsers && (
                  <SidebarMenuItemCMS
                    menuName="Users"
                    menuURL="/users"
                    menuIcon={<CircleUserIcon />}
                  />
                )}
                {isAllowedMenuTransactions && (
                  <SidebarMenuItemCMS
                    menuName="Transactions"
                    menuURL="/transactions"
                    menuIcon={<BanknoteArrowDown />}
                  />
                )}
              </SidebarMenuGroupCMS>
            )}
            {(isAllowedMenuWebMarketing ||
              isAllowedMenuArticles ||
              isAllowedMenuWhatsapp) && (
              <SidebarMenuGroupCMS groupName="Marketing">
                {isAllowedMenuWebMarketing && (
                  <SidebarMenuItemCMS
                    menuName="Web Marketing"
                    menuURL="/web-marketing"
                    menuIcon={<Globe />}
                  />
                )}
                {isAllowedMenuArticles && (
                  <SidebarMenuItemCMS
                    menuName="SEO Articles"
                    menuURL="/articles"
                    menuIcon={<PenTool />}
                  />
                )}
                {isAllowedMenuWhatsapp && (
                  <SidebarMenuItemCMS
                    menuName="Whatsapp"
                    menuURL="/whatsapp"
                    menuIcon={<FontAwesomeIcon icon={faWhatsapp} size="lg" />}
                  />
                )}
              </SidebarMenuGroupCMS>
            )}
          </div>
        </div>
        <div className="sidebar-cms-bottom absolute flex flex-col bottom-4 inset-x-4">
          <AppButton
            size={isCollapsed ? "icon" : "medium"}
            variant="semiDestructive"
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
