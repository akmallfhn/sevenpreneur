"use client";
import {
  Flag,
  HouseIcon,
  LayoutDashboard,
  LogOut,
  PlayCircle,
  Presentation,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import AppThemeSwitcher from "../buttons/AppThemeSwitcher";
import Image from "next/image";
import SideMenuItemMobileSVP from "./SideMenuItemMobileSVP";
import { DeleteSession } from "@/lib/actions";
import { usePathname } from "next/navigation";

interface SideMenuMobileSVPProps {
  isLoggedIn: boolean;
  userName: string;
  userAvatar: string;
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenuMobileSVP(props: SideMenuMobileSVPProps) {
  const pathname = usePathname();

  // Blocked scroll behind
  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [props.isOpen]);

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  // Sign out function
  const handleSignOut = async () => {
    await DeleteSession();
    props.onClose();
  };

  if (!props.isOpen) return null;

  return (
    <div
      className={`side-menu-root fixed inset-0 flex w-full h-full bg-black/40 items-end justify-center z-[91] transition transform ease-in-out`}
      onClick={props.onClose}
    >
      <div
        className={`side-menu-container fixed flex flex-col w-3/4 h-full inset-y-0 left-0 gap-4 bg-white/90 backdrop-blur-md transition transform ease-in-out dark:bg-black/60 sm:max-w-md`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="side-menu-box relative flex flex-col w-full h-full p-5 gap-5 justify-center">
          {props.isLoggedIn ? (
            <div className="user-informations flex w-full items-center gap-2 p-3 border border-outline bg-white rounded-lg overflow-hidden dark:bg-surface-black dark:border-outline-dark">
              <div className="user-avatar aspect-square size-9 shrink-0 rounded-full overflow-hidden">
                <Image
                  className="user-avatar object-cover w-full h-full"
                  src={props.userAvatar}
                  alt="User Avatar"
                  width={320}
                  height={320}
                />
              </div>
              <div className="flex flex-col">
                <p className="user-name font-bodycopy font-semibold text-[15px] line-clamp-1 leading-snug">
                  {props.userName}
                </p>
                <p className="user-email font-bodycopy font-medium text-sm text-[#111111]/70 line-clamp-1 leading-snug dark:text-white/60">
                  {props.userEmail}
                </p>
              </div>
            </div>
          ) : (
            <Link
              href={`/auth/login?redirectTo=${pathname}`}
              onClick={props.onClose}
            >
              <div className="user-informations flex w-full items-center gap-2 p-3 border border-outline bg-white rounded-lg overflow-hidden dark:bg-surface-black dark:border-outline-dark">
                <div className="user-avatar aspect-square size-9 shrink-0 rounded-full overflow-hidden">
                  <Image
                    className="user-avatar object-cover w-full h-full"
                    src={
                      props.isLoggedIn
                        ? props.userAvatar
                        : "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                    }
                    alt="User Avatar"
                    width={320}
                    height={320}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="login-title font-bodycopy font-semibold text-[15px] line-clamp-1 leading-snug">
                    Login to your account
                  </p>
                  <p className="login-subtitle font-bodycopy font-medium text-sm text-[#111111]/70 line-clamp-1 leading-snug dark:text-white/60">
                    Explore more features
                  </p>
                </div>
              </div>
            </Link>
          )}
          <ul className="side-menu-list flex flex-col gap-3 p-4 border border-outline bg-white/30 rounded-lg dark:bg-surface-black dark:border-outline-dark">
            <SideMenuItemMobileSVP
              menuName="Home"
              menuIcon={<HouseIcon className="size-5" />}
              menuURL="/"
              onClick={props.onClose}
            />
            <hr className="border-t border-outline dark:border-outline-dark" />
            <SideMenuItemMobileSVP
              menuName="Program"
              menuIcon={<Presentation className="size-5" />}
              menuURL="/cohorts/sevenpreneur-business-blueprint-program"
              onClick={props.onClose}
            />
            <hr className="border-t border-outline dark:border-outline-dark" />
            <SideMenuItemMobileSVP
              menuName="Learning Series"
              menuIcon={<PlayCircle className="size-5" />}
              menuURL="/playlists/restart-conference-2025/1"
              onClick={props.onClose}
            />
            <hr className="border-t border-outline dark:border-outline-dark" />
            <SideMenuItemMobileSVP
              menuName="Event"
              menuIcon={<Flag className="size-5" />}
              menuURL="/events/sevenpreneur-business-network/1"
              onClick={props.onClose}
            />
          </ul>
          <ul className="side-menu-list flex flex-col mb-24 gap-3 p-4 border border-outline bg-white/30 rounded-lg dark:bg-surface-black dark:border-outline-dark">
            <SideMenuItemMobileSVP
              menuName="My Learning"
              menuIcon={<LayoutDashboard className="size-5" />}
              menuURL={`https://agora.${domain}`}
              onClick={props.onClose}
            />
            <hr className="border-t border-outline dark:border-outline-dark" />
            <SideMenuItemMobileSVP
              menuName="Transactions"
              menuIcon={<Wallet className="size-5" />}
              menuURL="/transactions"
              onClick={props.onClose}
            />
            {props.isLoggedIn && (
              <>
                <hr className="border-t border-outline dark:border-outline-dark" />
                <SideMenuItemMobileSVP
                  menuName="Sign Out"
                  menuIcon={<LogOut className="size-5" />}
                  destructiveColor
                  onClick={handleSignOut}
                />
              </>
            )}
            <hr className="border-t border-outline dark:border-outline-dark" />
            <AppThemeSwitcher style="switch" />
          </ul>
        </div>
      </div>
    </div>
  );
}
