"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AvatarBadgeSVP from "../buttons/AvatarBadgeSVP";
import AppButton from "../buttons/AppButton";
import {
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
import ThemeSwitcher from "../buttons/ThemeSwitcher";
import { useTheme } from "next-themes";

interface HeaderNavbarSVPProps {
  isLoggedIn: boolean;
  userAvatar: string | null;
  userName: string | undefined;
  userRole: number | undefined;
}

export default function HeaderNavbarSVP({
  isLoggedIn,
  userAvatar,
  userName,
  userRole,
}: HeaderNavbarSVPProps) {
  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { theme } = useTheme();

  // Path yang tidak mau menampilkan Navbar & Footer
  const disallowedPath = ["/auth", "/checkout", "/event"];
  const isDisallowedPage = disallowedPath.some((path) =>
    pathname.includes(path)
  );

  //  --- Get Nickname
  const nickName = userName?.split(" ")[0];

  // --- Detect screen size
  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsDesktop(window.innerWidth >= 1024);
  //   };
  //   handleResize(); // Initial check
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // --- Open and close dropdown
  const handleActionsDropdown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsActionsOpened((prev) => !prev);
  };

  // --- Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent | (MouseEvent & { target: Node })
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsActionsOpened(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Domain Logic
  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  // --- Sign out function
  const handleSignOut = async () => {
    await DeleteSession();
  };

  // --- Render if component client mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <React.Fragment>
      {!isDisallowedPage && (
        <div className="navbar-root flex sticky w-full bg-white top-0 left-0 items-center justify-center shadow-md z-[90] dark:bg-black/40 dark:backdrop-blur-sm">
          <div className="navbar-container flex items-center w-full justify-between py-3 px-5 lg:px-0 lg:py-3.5 lg:max-w-[960px] xl:max-w-[1208px]">
            <Link href={"/"}>
              {mounted && (
                <Image
                  className="max-w-[142px] lg:max-w-[168px]"
                  src={
                    theme === "dark"
                      ? "https://static.wixstatic.com/media/02a5b1_f73718a961f344cd80016aa1f5522fb6~mv2.webp"
                      : "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//logo-sevenpreneur-main.svg"
                  }
                  alt="Homepage"
                  width={320}
                  height={320}
                />
              )}
            </Link>
            {isLoggedIn ? (
              <div
                className="user-menu relative flex hover:cursor-pointer"
                ref={wrapperRef}
                onClick={handleActionsDropdown}
              >
                <AvatarBadgeSVP userAvatar={userAvatar} userName={nickName} />
                <AppDropdown
                  isOpen={isActionsOpened}
                  onClose={() => setIsActionsOpened(false)}
                  alignMobile="right"
                >
                  {/* <Link href={`https://www.${domain}/account`}>
                <AppDropdownItemList
                  menuIcon={<UserRound className="size-4" />}
                  menuName="Profile"
                />
              </Link> */}
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
                  <Link href={`https://www.${domain}/transactions`}>
                    <AppDropdownItemList
                      menuIcon={<Wallet className="size-4" />}
                      menuName="Transaction"
                    />
                  </Link>
                  <hr className="my-1" />
                  <ThemeSwitcher />
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
                <AppButton variant="dark" size="defaultRounded">
                  <UserCircle2 className="size-5" />
                  Login
                </AppButton>
              </Link>
            )}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
