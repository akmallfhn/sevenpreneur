"use client";
import { setSessionToken, trpc } from "@/trpc/client";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  BanknoteArrowDown,
  CircleUserIcon,
  FlagTriangleRight,
  Globe,
  PenTool,
  Presentation,
  Tags,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import AppSidebar from "./AppSidebar";
import AppSidebarGroupMenu from "./AppSidebarGroupMenu";
import AppSidebarMenuItem from "./AppSidebarMenuItem";

interface SidebarCMSProps {
  sessionToken: string;
  sessionUserRole: number;
}

export default function SidebarCMS(props: SidebarCMSProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const logoURL = isDark
    ? "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-sevenpreneur-square.svg"
    : "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-sevenpreneur-square-black.svg";

  const allowedRolesMenuCohorts = [0, 1, 2];
  const allowedRolesMenuEvents = [0, 2];
  const allowedRolesMenuDiscounts = [0];
  const allowedRolesMenuUsers = [0, 1, 2];
  const allowedRolesMenuTransactions = [0];
  const allowedRolesMenuWebMarketing = [0, 4];
  const allowedRolesMenuArticles = [0];
  const allowedRolesMenuWhatsapp = [0];

  const isAllowedMenuCohorts = allowedRolesMenuCohorts.includes(
    props.sessionUserRole
  );
  const isAllowedMenuEvents = allowedRolesMenuEvents.includes(
    props.sessionUserRole
  );
  const isAllowedMenuDiscounts = allowedRolesMenuDiscounts.includes(
    props.sessionUserRole
  );
  const isAllowedMenuUsers = allowedRolesMenuUsers.includes(
    props.sessionUserRole
  );
  const isAllowedMenuTransactions = allowedRolesMenuTransactions.includes(
    props.sessionUserRole
  );
  const isAllowedMenuWebMarketing = allowedRolesMenuWebMarketing.includes(
    props.sessionUserRole
  );
  const isAllowedMenuArticles = allowedRolesMenuArticles.includes(
    props.sessionUserRole
  );
  const isAllowedMenuWhatsapp = allowedRolesMenuWhatsapp.includes(
    props.sessionUserRole
  );

  useEffect(() => {
    if (props.sessionToken) {
      setSessionToken(props.sessionToken);
    }
  }, [props.sessionToken]);

  const { data } = trpc.auth.checkSession.useQuery(undefined, {
    enabled: !!props.sessionToken,
  });

  return (
    <AppSidebar
      logo={logoURL}
      logoLabel="Sevenpreneur Content Management System"
      avatarSrc={data?.user.avatar ?? undefined}
      avatarName={data?.user.full_name ?? undefined}
      avatarRole={data?.user.role_name ?? undefined}
    >
      {(isAllowedMenuCohorts ||
        isAllowedMenuDiscounts ||
        isAllowedMenuEvents) && (
        <AppSidebarGroupMenu groupName="Product">
          {isAllowedMenuCohorts && (
            <AppSidebarMenuItem
              menuName="Cohorts"
              menuURL="/cohorts"
              menuIcon={<Presentation />}
            />
          )}
          {isAllowedMenuEvents && (
            <AppSidebarMenuItem
              menuName="Events"
              menuURL="/events"
              menuIcon={<FlagTriangleRight />}
            />
          )}
          {isAllowedMenuDiscounts && (
            <AppSidebarMenuItem
              menuName="Discounts"
              menuURL="/discounts"
              menuIcon={<Tags />}
            />
          )}
        </AppSidebarGroupMenu>
      )}
      {(isAllowedMenuUsers || isAllowedMenuTransactions) && (
        <AppSidebarGroupMenu groupName="Administration">
          {isAllowedMenuUsers && (
            <AppSidebarMenuItem
              menuName="Users"
              menuURL="/users"
              menuIcon={<CircleUserIcon />}
            />
          )}
          {isAllowedMenuTransactions && (
            <AppSidebarMenuItem
              menuName="Transactions"
              menuURL="/transactions"
              menuIcon={<BanknoteArrowDown />}
            />
          )}
        </AppSidebarGroupMenu>
      )}
      {(isAllowedMenuWebMarketing ||
        isAllowedMenuArticles ||
        isAllowedMenuWhatsapp) && (
        <AppSidebarGroupMenu groupName="Marketing">
          {isAllowedMenuWebMarketing && (
            <AppSidebarMenuItem
              menuName="Web Marketing"
              menuURL="/web-marketing"
              menuIcon={<Globe />}
            />
          )}
          {isAllowedMenuArticles && (
            <AppSidebarMenuItem
              menuName="SEO Articles"
              menuURL="/articles"
              menuIcon={<PenTool />}
            />
          )}
          {isAllowedMenuWhatsapp && (
            <AppSidebarMenuItem
              menuName="Whatsapp"
              menuURL="/whatsapp"
              menuIcon={<FontAwesomeIcon icon={faWhatsapp} size="lg" />}
            />
          )}
        </AppSidebarGroupMenu>
      )}
    </AppSidebar>
  );
}
