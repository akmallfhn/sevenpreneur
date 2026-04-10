"use client";
import { StatusType } from "@/lib/app-types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { AlignLeftIcon, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import AppButton from "../buttons/AppButton";
import AppThemeSwitcher from "../buttons/AppThemeSwitcher";
import AvatarBadgeSVP from "../buttons/AvatarBadgeSVP";
import SevenpreneurLogo from "../svg-logos/SevenpreneurLogo";
import AnnouncementTickerSVP, {
  AnnouncementTickerSVPProps,
} from "./AnnouncementTickerSVP";
import HeaderNavbarItemSVP from "./HeaderNavbarItemSVP";
import SideMenuMobileSVP from "./SideMenuMobileSVP";

dayjs.extend(isBetween);

interface HeaderNavbarSVPProps extends AnnouncementTickerSVPProps {
  isLoggedIn: boolean;
  userAvatar: string | null;
  userName: string | null;
  userEmail: string | null;
  userRole: number | null;
  tickerStatus: StatusType;
  tickerStartDate: string;
  tickerEndDate: string;
}

export default function HeaderNavbarSVP(props: HeaderNavbarSVPProps) {
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
          <div className="navbar-root flex w-full bg-white items-center justify-center shadow-md dark:bg-black/40 dark:backdrop-blur-sm">
            <div className="navbar-container flex items-center w-full justify-between py-3 px-5 lg:px-0 lg:py-3.5 lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
              <Link href={"/"} className="brand-logo-site">
                <SevenpreneurLogo className="max-w-[142px] h-auto lg:max-w-[168px]" />
              </Link>
              {!isConstrainedPath && (
                <nav className="desktop-menu hidden lg:flex">
                  <ul className="menu-item-list flex items-center gap-7">
                    <HeaderNavbarItemSVP
                      menuTitle="Program"
                      menuUrl="/cohorts/sevenpreneur-business-blueprint-program"
                    />
                    <HeaderNavbarItemSVP
                      menuTitle="Learning Series"
                      menuUrl="/playlists/restart-conference-2025/1"
                    />
                    <HeaderNavbarItemSVP
                      menuTitle="Event"
                      menuUrl="/events/spill-your-bizz-iftar-meet-2026/5"
                    />
                    <HeaderNavbarItemSVP
                      menuTitle="Insights"
                      menuUrl="/insights"
                    />
                    <HeaderNavbarItemSVP
                      menuTitle="About Us"
                      menuUrl="/company"
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
          </div>
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
        <SideMenuMobileSVP
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
