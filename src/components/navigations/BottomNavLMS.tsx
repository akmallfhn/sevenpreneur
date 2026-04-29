"use client";
import { BotMessageSquare, House, LibraryBig, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/", icon: House },
  { label: "AI Tools", href: "/ai", icon: BotMessageSquare },
  { label: "Library", href: "/library", icon: LibraryBig },
  { label: "Profile", href: "/account", icon: User },
];

export default function BottomNavLMS() {
  const pathname = usePathname();

  return (
    <div className="bottom-nav fixed bottom-0 left-0 right-0 flex items-center bg-card-bg border-t border-dashboard-border z-50 lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-item flex flex-col items-center justify-center flex-1 py-3 gap-0.5 font-bodycopy text-[11px] font-medium transition-colors ${
              isActive ? "text-tertiary" : "text-emphasis"
            }`}
          >
            <Icon className="size-5" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
