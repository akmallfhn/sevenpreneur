"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";

interface SidebarMenuItemCMSProps {
  url: string;
  icon: ReactNode;
  menuTitle: string;
  exact?: boolean;
}

export default function SidebarMenuItemCMS({
  url,
  icon,
  menuTitle,
  exact = false,
}: SidebarMenuItemCMSProps) {
  const pathname = usePathname();
  const [clientPath, setClientPath] = useState("");

  // --- Save current URL to avoid missmatching SSR
  useEffect(() => {
    setClientPath(pathname);
  }, [pathname]);

  // --- Active state based on URL
  const isActive = exact ? clientPath === url : clientPath.startsWith(url);

  return (
    <Link
      href={url}
      className={`sidebar-menu-item relative flex items-center p-2 gap-4 w-full rounded-md overflow-hidden transition transform active:scale-95
            ${
              isActive
                ? "text-cms-primary bg-[#E1EDFF] font-semibold"
                : "text-[#1A2236]/70 hover:bg-[#EAEAEA] font-medium"
            }`}
    >
      {/* --- Menu Title & Icons */}
      <div className="flex size-5 items-center justify-center">{icon}</div>
      <p className="font-brand text-sm">{menuTitle}</p>

      {/* --- Active State */}
      {isActive && (
        <div className="bg-cms-primary w-2 h-1/2 absolute right-0 rounded-full" />
      )}
    </Link>
  );
}
