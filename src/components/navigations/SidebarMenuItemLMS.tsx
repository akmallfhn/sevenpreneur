"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";

interface SidebarMenuItemLMSProps {
  url: string;
  icon: ReactNode;
  menuTitle: string;
  isHome?: boolean;
}

export default function SidebarMenuItemLMS({
  url,
  icon,
  menuTitle,
  isHome = false,
}: SidebarMenuItemLMSProps) {
  const pathname = usePathname();
  const [clientPath, setClientPath] = useState("");

  // Save current URL to avoid missmatching SSR
  useEffect(() => {
    setClientPath(pathname);
  }, [pathname]);

  // Active state based on URL
  const isActive = isHome ? clientPath === url : clientPath.startsWith(url);

  return (
    <Link
      href={url}
      className={`sidebar-menu-item relative flex items-center p-2 px-2.5 gap-4 w-full rounded-md overflow-hidden transition transform shrink-0 active:scale-95
            ${
              isActive
                ? "text-white bg-tertiary font-semibold"
                : "text-black hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/5 font-medium"
            }`}
    >
      <div className="menu-icon flex size-5 items-center justify-center shrink-0">
        {icon}
      </div>
      <p className="menu-title font-bodycopy text-sm">{menuTitle}</p>
      {isActive && (
        <div className="active-state-menu absolute bg-secondary w-2 h-1/2  right-0 rounded-full" />
      )}
    </Link>
  );
}
