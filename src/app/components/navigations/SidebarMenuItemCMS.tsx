"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";

interface SidebarMenuItemCMSProps {
  menuName: string;
  menuURL: string;
  menuIcon: ReactNode;
  exact?: boolean;
}

export default function SidebarMenuItemCMS(props: SidebarMenuItemCMSProps) {
  const pathname = usePathname();
  const [clientPath, setClientPath] = useState("");

  // Save current URL to avoid missmatching SSR
  useEffect(() => {
    setClientPath(pathname);
  }, [pathname]);

  // Active state based on URL
  const isActive = props.exact
    ? clientPath === props.menuURL
    : clientPath.startsWith(props.menuURL);

  return (
    <Link
      href={props.menuURL}
      className={`sidebar-menu-item relative flex items-center p-2 gap-3 w-full rounded-md overflow-hidden transition transform active:scale-95
            ${
              isActive
                ? "text-cms-primary bg-[#E1EDFF] font-semibold"
                : "text-[#1A2236]/70 hover:bg-[#EAEAEA] font-medium"
            }`}
    >
      <div className="menu-icon flex size-[18px] items-center justify-center">
        {props.menuIcon}
      </div>
      <p className="menu-name font-bodycopy text-sm">{props.menuName}</p>
      {isActive && (
        <div className="bg-cms-primary w-2 h-1/2 absolute right-0 rounded-full" />
      )}
    </Link>
  );
}
