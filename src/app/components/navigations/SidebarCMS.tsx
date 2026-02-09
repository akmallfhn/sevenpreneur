"use client";
import AvatarBadgeCMS from "@/app/components/buttons/AvatarBadgeCMS";
import SidebarMenuItemCMS from "@/app/components/navigations/SidebarMenuItemCMS";
import { DeleteSession } from "@/lib/actions";
import { setSessionToken, trpc } from "@/trpc/client";
import {
  BanknoteArrowDown,
  CircleUserIcon,
  FlagTriangleRight,
  Globe,
  HouseIcon,
  Loader2,
  LogOut,
  PenTool,
  Presentation,
  Tags,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarMenuGroupCMS from "./SidebarMenuGroupCMS";

interface SidebarCMSProps {
  sessionToken: string;
  sessionUserRole: number;
}

export default function SidebarCMS(props: SidebarCMSProps) {
  const router = useRouter();
  const [isLoadingButton, setIsLoadingButton] = useState(false);

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
    <div className="sidebar-cms-root hidden fixed justify-between pt-5 pb-8 max-w-64 w-full left-0 h-full bg-[#F7F7F7] z-50 lg:flex lg:flex-col">
      <div className="sidebar-cms-top flex flex-col max-w-[224px] w-full mx-auto gap-[22px]">
        <div className="sidebar-logo flex items-center gap-4 pl-1">
          <div className="sidebar-logo flex size-11 rounded-sm outline-4 outline-black/20 shrink-0 overflow-hidden">
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
          <p className="font-bodycopy font-medium text-sm leading-tight">
            Sevenpreneur Content Management System
          </p>
        </div>

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

        {!isLoading && !isError && (
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
          <SidebarMenuItemCMS
            menuName="Dashboard"
            menuURL="/"
            menuIcon={<HouseIcon />}
            exact
          />
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
          {(isAllowedMenuWebMarketing || isAllowedMenuArticles) && (
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
            </SidebarMenuGroupCMS>
          )}
        </div>
      </div>
      <div className="sidebar-cms-bottom flex flex-col max-w-[224px] mx-auto w-full">
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
              <LogOut />
            )}
          </div>
          Logout
        </div>
      </div>
    </div>
  );
}
