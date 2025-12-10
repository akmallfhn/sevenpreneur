"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderNavbarItemSVPProps {
  menuTitle: string;
  menuUrl?: string;
  activeUrls?: string[];
  isDropdownMenu?: boolean;
}

export default function HeaderNavbarItemSVP({
  menuTitle,
  menuUrl,
  activeUrls,
  isDropdownMenu = false,
}: HeaderNavbarItemSVPProps) {
  const pathname = usePathname();
  const isActive =
    pathname === menuUrl ||
    activeUrls?.some((post) => pathname.startsWith(post));

  return (
    <li
      className={`menu-item relative flex items-center font-brand text-[15px] ${
        isActive ? "font-bold" : ""
      }`}
    >
      {isDropdownMenu ? (
        <span>{menuTitle}</span>
      ) : (
        <Link href={menuUrl!}>{menuTitle}</Link>
      )}

      <div
        className={`menu-active-state absolute flex bg-primary -bottom-3 w-full h-1 rounded-md transition-opacity ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />
    </li>
  );
}
