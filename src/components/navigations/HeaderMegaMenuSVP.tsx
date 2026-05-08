"use client";
import { ChevronDown, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export interface MegaMenuItem {
  Icon: LucideIcon;
  name: string;
  desc: string;
  url: string;
  accent?: string;
}

interface HeaderMegaMenuSVPProps {
  menuTitle: string;
  items: MegaMenuItem[];
}

export default function HeaderMegaMenuSVP({
  menuTitle,
  items,
}: HeaderMegaMenuSVPProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const isActive = items.some((item) => pathname.startsWith(item.url));

  const handleEnter = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <li
      className="menu-item relative flex items-center"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        type="button"
        className={`mega-menu-trigger inline-flex items-center gap-1.5 font-bodycopy text-[15px] cursor-pointer transition-colors ${
          isActive ? "font-bold" : "font-medium"
        }`}
      >
        {menuTitle}
        <ChevronDown
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        className={`menu-active-state absolute flex bg-primary -bottom-3 w-full h-1 rounded-md transition-opacity ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Dropdown Panel */}
      <div
        className={`mega-menu-panel absolute top-full left-1/2 -translate-x-1/2 pt-5 transition-all duration-200 ${
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="relative w-[640px] bg-white rounded-2xl p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)] dark:bg-sevenpreneur-surface-black">
          <div className="grid grid-cols-2 gap-1.5">
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.url}
                onClick={() => setOpen(false)}
                className="group flex items-start gap-3 p-3 rounded-md transition-colors hover:bg-[#f5f5f5] dark:hover:bg-white/5"
              >
                <span
                  className={`flex items-center justify-center rounded-md size-10 shrink-0 transition-transform group-hover:scale-105 ${
                    item.accent ??
                    "bg-gradient-to-br from-[#3417E3] to-[#7B6FF0]"
                  }`}
                >
                  <item.Icon className="size-5 text-white" />
                </span>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="font-brand font-bold text-[14px] text-[#0a0a0a] leading-tight dark:text-white">
                    {item.name}
                  </p>
                  <p className="font-bodycopy text-[12px] text-[#3a3a3a] leading-snug dark:text-white/60">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}
