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

interface HeaderNavbarLMSProps {
  isLoggedIn: boolean;
  userAvatar: string | null;
  userName: string | undefined;
  userRole: number | undefined;
}

export default function HeaderNavbarLMS({
  isLoggedIn,
  userAvatar,
  userName,
  userRole,
}: HeaderNavbarLMSProps) {
  const [isActionsOpened, setIsActionsOpened] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

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

  return (
    <React.Fragment>
      <div className="navbar-root flex sticky w-full bg-white top-0 left-0 items-center justify-center shadow-md z-[90]">
        <div className="navbar-container flex items-center w-full justify-between py-3 px-5 lg:px-0 lg:py-4 lg:max-w-[960px] xl:max-w-[1208px]">
          <Link href={"/"} className="flex flex-col hover:cursor-pointer">
            <h1 className="font-brand font-bold lg:text-xl">
              Agora Learning | Sevenpreneur
            </h1>
          </Link>
          <div
            className="user-menu relative flex hover:cursor-pointer"
            ref={wrapperRef}
            onClick={handleActionsDropdown}
          >
            <div className="flex items-center gap-3">
              <AvatarBadgeSVP userAvatar={userAvatar} />
              <div className="hidden items-center gap-1 lg:flex">
                <p className="max-w-28 font-ui font-semibold text-sm text-black overflow-hidden text-ellipsis whitespace-nowrap">
                  {nickName}
                </p>
                <ChevronDown className="size-3" />
              </div>
            </div>
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
              <AppDropdownItemList
                menuIcon={<LogOut className="size-4" />}
                menuName="Sign out"
                isDestructive
                onClick={handleSignOut}
              />
            </AppDropdown>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
