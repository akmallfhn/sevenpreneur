"use client";
import { useSidebar } from "@/contexts/SidebarContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface AppSidebarMenuItemProps {
  menuName: string;
  menuURL: string;
  menuIcon?: ReactNode;
  exact?: boolean;
  badge?: string;
}

export default function AppSidebarMenuItem({
  menuName,
  menuURL,
  menuIcon,
  exact,
  badge,
}: AppSidebarMenuItemProps) {
  const pathname = usePathname();
  const [clientPath, setClientPath] = useState("");
  const { isCollapsed } = useSidebar();

  useEffect(() => {
    setClientPath(pathname);
  }, [pathname]);

  const isActive = exact
    ? clientPath === menuURL
    : clientPath.startsWith(menuURL);

  return (
    <Link
      href={menuURL}
      className={`relative flex items-center p-2 rounded-lg overflow-hidden transition-all transform active:scale-95 shrink-0
        ${isActive ? "sb-item-active" : "sb-item"}
        ${isCollapsed ? "w-fit justify-center gap-0" : "w-full gap-3"}`}
    >
      {menuIcon && (
        <div className="flex size-[18px] items-center justify-center shrink-0">
          {menuIcon}
        </div>
      )}
      {!isCollapsed && (
        <p className="font-bodycopy text-[13px] line-clamp-1 flex-1">
          {menuName}
        </p>
      )}
      {!isCollapsed && badge && (
        <span className="font-bodycopy text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
          {badge}
        </span>
      )}
      {isActive && !isCollapsed && (
        <div className="sb-indicator absolute right-0 w-[3px] h-5 rounded-full" />
      )}
    </Link>
  );
}
