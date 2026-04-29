"use client";
import { useSidebar } from "@/contexts/SidebarContext";
import { ChevronDown } from "lucide-react";
import { ReactNode, useState } from "react";

interface AppSidebarGroupMenuProps {
  groupName: string;
  children: ReactNode;
}

export default function AppSidebarGroupMenu({
  groupName,
  children,
}: AppSidebarGroupMenuProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return (
      <div className="flex flex-col gap-1 items-center w-full">{children}</div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="sb-group-hover flex items-center justify-between px-2 py-1.5 rounded-md w-full transition-colors hover:cursor-pointer"
      >
        <p className="sb-group-text text-sb-group-text font-bodycopy text-[11px] font-semibold tracking-widest line-clamp-1">
          {groupName.toUpperCase()}
        </p>
        <ChevronDown
          className={`sb-group-text size-3.5 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      <div
        className={`flex flex-col gap-1 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
