"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AvatarBadgeSVP from "../buttons/AvatarBadgeSVP";
import AppButton from "../buttons/AppButton";
import {
  AlignLeftIcon,
  Blocks,
  BookMarked,
  ChevronDown,
  LogOut,
  UserCircle2,
  Wallet,
} from "lucide-react";
import AppDropdown from "../elements/AppDropdown";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import { DeleteSession } from "@/lib/actions";
import { useTheme } from "next-themes";
import HeaderNavbarItemSVP from "./HeaderNavbarItemSVP";
import SideMenuMobileSVP from "./SideMenuMobileSVP";
import AppThemeSwitcher from "../buttons/AppThemeSwitcher";
import AnnouncementTickerSVP, {
  AnnouncementTickerSVPProps,
} from "./AnnouncementTickerSVP";
import { StatusType } from "@/lib/app-types";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

interface HeaderNavbarSVPProps extends AnnouncementTickerSVPProps {
  isLoggedIn: boolean;
  userAvatar: string | null;
  userName: string | undefined;
  userRole: number | undefined;
  tickerStatus: StatusType;
  tickerStartDate: string;
  tickerEndDate: string;
}

export default function HeaderNavbarSVP({
  isLoggedIn,
  userAvatar,
  userName,
  userRole,
  tickerTitle,
  tickerCallout,
  tickerTargetURL,
  tickerStatus,
  tickerStartDate,
  tickerEndDate,
}: HeaderNavbarSVPProps) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { theme } = useTheme();

  // Path yang tidak mau menampilkan Navbar & Footer
  const disallowedPath = ["/auth", "/checkout"];
  const isDisallowedPage = disallowedPath.some((path) =>
    pathname.includes(path)
  );

  //  Get Nickname
  const nickName = userName?.split(" ")[0];

  // Open and close dropdown
  const handleActionsDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setAccountMenuOpen((prev) => !prev);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent | (MouseEvent & { target: Node })
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Domain Logic
  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  // Sign out function
  const handleSignOut = async () => {
    await DeleteSession();
  };

  // Render if component client mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Validate Ticker Based on Start Date and End Date
  const isValidTicker = dayjs().isBetween(
    tickerStartDate,
    tickerEndDate,
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
                {mounted && (
                  <Image
                    className="max-w-[142px] lg:max-w-[168px]"
                    src={
                      theme === "dark"
                        ? "https://static.wixstatic.com/media/02a5b1_f73718a961f344cd80016aa1f5522fb6~mv2.webp"
                        : "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//logo-sevenpreneur-main.svg"
                    }
                    alt="Logo Sevenpreneur"
                    width={320}
                    height={320}
                  />
                )}
              </Link>

              <nav className="desktop-menu hidden lg:flex">
                <ul className="menu-item-list flex items-center gap-10">
                  <HeaderNavbarItemSVP
                    menuTitle="Program"
                    menuUrl="/cohorts/sevenpreneur-business-blueprint-program"
                    // activeUrls={["/cohorts", "/playlists", "/events"]}
                  />
                  <HeaderNavbarItemSVP
                    menuTitle="Learning Series"
                    menuUrl="/playlists/restart-conference-2025/1"
                    // activeUrls={["/cohorts", "/playlists", "/events"]}
                  />
                  <HeaderNavbarItemSVP
                    menuTitle="Event"
                    menuUrl="/events/sevenpreneur-business-network/1"
                    // activeUrls={["/cohorts", "/playlists", "/events"]}
                  />
                  <HeaderNavbarItemSVP
                    menuTitle="About Us"
                    menuUrl="/company"
                  />
                  <HeaderNavbarItemSVP
                    menuTitle="Collab with Us"
                    menuUrl="/collaboration"
                  />
                </ul>
              </nav>

              <div className="navigation-control flex items-center gap-4">
                <div className="theme-switcher hidden lg:flex">
                  <AppThemeSwitcher />
                </div>

                {isLoggedIn ? (
                  <div
                    className="user-menu relative flex hover:cursor-pointer"
                    ref={wrapperRef}
                    onClick={handleActionsDropdown}
                  >
                    <AvatarBadgeSVP
                      userAvatar={userAvatar}
                      userName={nickName}
                    />
                    <AppDropdown
                      isOpen={accountMenuOpen}
                      onClose={() => setAccountMenuOpen(false)}
                      alignMobile="right"
                    >
                      {userRole !== 3 && (
                        <Link href={`https://admin.${domain}`}>
                          <AppDropdownItemList
                            menuIcon={<Blocks className="size-4" />}
                            menuName="Dashboard Admin"
                          />
                        </Link>
                      )}
                      <Link href={`https://agora.${domain}`}>
                        <AppDropdownItemList
                          menuIcon={<BookMarked className="size-4" />}
                          menuName="My Learning"
                        />
                      </Link>
                      <Link href={`/transactions`}>
                        <AppDropdownItemList
                          menuIcon={<Wallet className="size-4" />}
                          menuName="Transaction"
                        />
                      </Link>
                      <hr className="my-1" />
                      <AppDropdownItemList
                        menuIcon={<LogOut className="size-4" />}
                        menuName="Sign out"
                        isDestructive
                        onClick={handleSignOut}
                      />
                    </AppDropdown>
                  </div>
                ) : (
                  <Link href={`/auth/login?redirectTo=${pathname}`}>
                    <div className="login-mobile flex lg:hidden">
                      <AppButton variant="ghost" size="iconRounded">
                        <UserCircle2 className="size-6" />
                      </AppButton>
                    </div>
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
            </div>
          </div>
          {tickerStatus === "ACTIVE" && isValidTicker && (
            <AnnouncementTickerSVP
              tickerTitle={tickerTitle}
              tickerCallout={tickerCallout}
              tickerTargetURL={tickerTargetURL}
            />
          )}
        </div>
      )}

      {mobileMenuOpen && (
        <SideMenuMobileSVP
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </React.Fragment>
  );
}
