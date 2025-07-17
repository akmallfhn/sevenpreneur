"use client";
import Image from "next/image";
import Link from "next/link";
import AvatarBadgeSVP from "../buttons/AvatarBadgeSVP";
import AppButton from "../buttons/AppButton";

interface HeaderNavbarSVPProps {
  isLoggedIn: boolean;
  userAvatar: string | null;
}

export default function HeaderNavbarSVP({
  isLoggedIn,
  userAvatar,
}: HeaderNavbarSVPProps) {
  return (
    <div className="navbar-container flex sticky w-full bg-white top-0 left-0 py-4 px-5 items-center justify-between shadow-md z-[90] lg:px-24">
      <Link href={"/"}>
        <Image
          className="max-w-[180px]"
          src={
            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//logo-sevenpreneur-main.svg"
          }
          alt="Homepage"
          width={320}
          height={320}
        />
      </Link>
      {isLoggedIn ? (
        <AvatarBadgeSVP userAvatar={userAvatar} />
      ) : (
        <AppButton>Login</AppButton>
      )}
    </div>
  );
}
