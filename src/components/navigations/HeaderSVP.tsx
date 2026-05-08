"use client";
import { StatusType } from "@/lib/app-types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  AlignLeftIcon,
  Bot,
  Compass,
  PlayCircle,
  UserCircle2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import AppButton from "../buttons/AppButton";
import AppThemeSwitcher from "../buttons/AppThemeSwitcher";
import AvatarBadgeSVP from "../buttons/AvatarBadgeSVP";
import PageContainerSVP from "../pages/PageContainerSVP";
import SevenpreneurLogo from "../svg-logos/SevenpreneurLogo";
import AnnouncementTickerSVP, {
  AnnouncementTickerSVPProps,
} from "./AnnouncementTickerSVP";
import HeaderMegaMenuSVP, { type MegaMenuItem } from "./HeaderMegaMenuSVP";
import HeaderNavbarItemSVP from "./HeaderNavbarItemSVP";
import SidebarMobileSVP from "./SidebarMobileSVP";

const productServiceItems: MegaMenuItem[] = [
  {
    Icon: Compass,
    name: "Business Blueprint Program",
    desc: "Kelas strategi & growth bisnis untuk executive dan entrepreneur.",
    url: "/cohorts/sevenpreneur-business-blueprint-program",
    accent: "bg-gradient-to-br from-[#3417E3] to-[#7B6FF0]",
  },
  {
    Icon: Bot,
    name: "RE:START Conference",
    desc: "Konferensi tahunan tentang masa depan bisnis dan AI.",
    url: "/events/restart-conference",
    accent: "bg-gradient-to-br from-[#CC446A] to-[#7B6FF0]",
  },
  {
    Icon: PlayCircle,
    name: "Video Series",
    desc: "Library video pembelajaran dari para business leader terkemuka.",
    url: "/playlists/restart-conference-2025/1",
    accent: "bg-gradient-to-br from-[#7B6FF0] to-[#B89FE0]",
  },
  {
    Icon: Users,
    name: "Community Events",
    desc: "Networking & komunitas untuk founder dan entrepreneur Indonesia.",
    url: "/events/spill-your-bizz-iftar-meet-2026/5",
    accent: "bg-gradient-to-br from-[#0165fc] to-[#3417E3]",
  },
];

dayjs.extend(isBetween);

interface HeaderSVPProps extends AnnouncementTickerSVPProps {
  isLoggedIn: boolean;
  userAvatar: string | null;
  userName: string | null;
  userEmail: string | null;
  userRole: number | null;
  tickerStatus: StatusType;
  tickerStartDate: string;
  tickerEndDate: string;
}

export default function HeaderSVP(props: HeaderSVPProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const disallowedPath = ["/auth"];
  const isDisallowedPage = disallowedPath.some((path) =>
    pathname.includes(path)
  );

  const constrainedPath = ["/checkout"];
  const isConstrainedPath = constrainedPath.some((path) =>
    pathname.includes(path)
  );

  const nickName = props.userName?.split(" ")[0];

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  // Validate Ticker Based on Start Date and End Date
  const isValidTicker = dayjs().isBetween(
    props.tickerStartDate,
    props.tickerEndDate,
    null,
    "[]"
  );

  return (
    <React.Fragment>
      {!isDisallowedPage && (
        <div className="navbar-group sticky flex flex-col top-0 left-0 z-[90] lg:flex-col-reverse">
          <PageContainerSVP className="flex shadow-md dark:bg-background/40 dark:backdrop-blur-sm">
            <div className="navbar-container flex items-center w-full justify-between py-3 lg:py-3.5">
              <Link href={"/"} className="brand-logo-site">
                <SevenpreneurLogo className="max-w-[142px] h-auto lg:max-w-[168px]" />
              </Link>
              {!isConstrainedPath && (
                <nav className="desktop-menu hidden lg:flex">
                  <ul className="menu-item-list flex items-center gap-7">
                    <HeaderMegaMenuSVP
                      menuTitle="Learning Programs"
                      items={productServiceItems}
                    />
                    <HeaderNavbarItemSVP
                      menuTitle="Corporate Training"
                      menuUrl="/corporate-ai-training"
                    />
                    <HeaderNavbarItemSVP
                      menuTitle="Insights"
                      menuUrl="/insights"
                    />
                    <Link href={`https://agora.${domain}`}>
                      <AppButton size="mediumRounded" variant="flux">
                        <p className="font-medium">My Learning</p>
                      </AppButton>
                    </Link>
                  </ul>
                </nav>
              )}
              {!isConstrainedPath && (
                <div className="navigation-control flex items-center gap-4">
                  <div className="theme-switcher hidden lg:flex">
                    <AppThemeSwitcher />
                  </div>
                  {props.isLoggedIn ? (
                    <AvatarBadgeSVP
                      userAvatar={
                        props.userAvatar ||
                        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                      }
                      userName={nickName || "User"}
                      userRole={props.userRole}
                    />
                  ) : (
                    <Link href={`/auth/login?redirectTo=${pathname}`}>
                      <div className="login-desktop hidden lg:flex">
                        <AppButton variant="primary" size="mediumRounded">
                          <UserCircle2 className="size-5" />
                          Login
                        </AppButton>
                      </div>
                    </Link>
                  )}
                  <div className="mobile-menu-button flex lg:hidden">
                    <AppButton
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileMenuOpen(true)}
                    >
                      <AlignLeftIcon className="size-6" />
                    </AppButton>
                  </div>
                </div>
              )}
            </div>
          </PageContainerSVP>
          {props.tickerStatus === "ACTIVE" &&
            isValidTicker &&
            !isConstrainedPath && (
              <AnnouncementTickerSVP
                tickerTitle={props.tickerTitle}
                tickerCallout={props.tickerCallout}
                tickerTargetURL={props.tickerTargetURL}
              />
            )}
        </div>
      )}

      {/* Open Mobile Navbar */}
      {mobileMenuOpen && (
        <SidebarMobileSVP
          isLoggedIn={props.isLoggedIn}
          userName={props.userName || "User"}
          userAvatar={
            props.userAvatar ||
            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
          }
          userEmail={props.userEmail || "-"}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </React.Fragment>
  );
}
