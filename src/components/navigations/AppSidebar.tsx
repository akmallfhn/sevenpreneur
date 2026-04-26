"use client";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, PanelLeftClose, Sun } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";
import AppButton from "../buttons/AppButton";

interface AppSidebarProps {
  logo: string | ReactNode;
  logoLabel: string;
  avatarSrc: string;
  avatarName: string;
  avatarRole: string;
  children: ReactNode;
}

export default function AppSidebar({
  logo,
  logoLabel,
  avatarSrc,
  avatarName,
  avatarRole,
  children,
}: AppSidebarProps) {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      className={`${isDark ? "dark" : ""} hidden fixed w-full h-full left-0 z-50 lg:flex lg:flex-col ${
        isCollapsed ? "max-w-16 items-center" : "max-w-64"
      }`}
    >
      <div
        className={`sb-root relative flex flex-col w-full h-full gap-0 ${
          isCollapsed ? "px-2 py-4" : "p-4"
        }`}
        style={{ borderRight: "1px solid var(--sb-border)" }}
      >
        {/* Collapse toggle */}
        <div
          className={`absolute -right-5 ${isCollapsed ? "top-5" : "top-6"} z-10`}
        >
          <AppButton size="mediumIcon" variant="light" onClick={toggleSidebar}>
            <PanelLeftClose
              className={`size-4 text-emphasis transition-all duration-300 ease-in-out ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </AppButton>
        </div>

        {/* Top: logo + menu */}
        <div
          className={`flex flex-col w-full gap-5 flex-1 min-h-0 overflow-hidden ${isCollapsed ? "items-center" : ""}`}
        >
          {/* Logo */}
          <div
            className={`flex items-center gap-3 shrink-0 ${
              isCollapsed ? "justify-center w-full" : "pl-1"
            }`}
          >
            <div
              className={`flex aspect-square shrink-0 overflow-hidden rounded-lg ${
                isCollapsed ? "w-9" : "w-11"
              }`}
            >
              {typeof logo === "string" ? (
                <Image
                  className="object-cover w-full h-full"
                  src={logo}
                  alt={logoLabel}
                  width={400}
                  height={400}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  {logo}
                </div>
              )}
            </div>
            {!isCollapsed && (
              <p className="font-bodycopy font-semibold text-[13px] leading-snug line-clamp-2 transition-all duration-300 ease-in-out text-sb-text-strong">
                {logoLabel}
              </p>
            )}
          </div>

          {/* Menu */}
          <nav
            className={`flex flex-col gap-1 flex-1 overflow-y-auto w-full ${isCollapsed ? "items-center" : ""}`}
          >
            {children}
          </nav>
        </div>

        {/* Bottom: theme toggle + avatar */}
        <div
          className={`flex flex-col gap-2 pt-3 mt-3 shrink-0 w-full ${isCollapsed ? "items-center" : ""}`}
          style={{ borderTop: "1px solid var(--sb-item-hover)" }}
        >
          {/* Dark / Light toggle */}
          {!isCollapsed && (
            <div className="px-1">
              <button
                onClick={toggleTheme}
                className="relative flex items-center p-1 rounded-full transition-all duration-300"
                style={{ backgroundColor: "var(--sb-item-hover)" }}
                aria-label="Toggle dark mode"
              >
                {/* sliding indicator */}
                <div
                  className="absolute size-7 rounded-full transition-all duration-300 ease-in-out"
                  style={{
                    left: isDark ? "calc(100% - 32px)" : "4px",
                    backgroundColor: isDark
                      ? "rgba(255,255,255,0.12)"
                      : "#ffffff",
                    boxShadow: isDark ? "none" : "0 1px 4px rgba(0,0,0,0.12)",
                  }}
                />
                <span className="relative flex items-center justify-center size-7">
                  <Sun className="size-3.5 text-sb-text" />
                </span>
                <span className="relative flex items-center justify-center size-7">
                  <Moon className="size-3.5 text-sb-text" />
                </span>
              </button>
            </div>
          )}

          {/* Avatar badge */}
          <div
            className={`flex items-center rounded-md cursor-pointer bg-sb-avatar-bg ${
              isCollapsed ? "justify-center py-2" : "gap-3 p-2"
            }`}
            style={
              isCollapsed ? undefined : { border: "1px solid var(--sb-border)" }
            }
          >
            <div className="flex size-8 rounded-full overflow-hidden shrink-0">
              <Image
                className="object-cover w-full h-full"
                src={avatarSrc}
                alt={avatarName}
                width={100}
                height={100}
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-bodycopy font-semibold text-[13px] text-sb-text-strong truncate">
                  {avatarName}
                </p>
                <p className="font-bodycopy text-xs text-sb-text truncate font-medium">
                  {avatarRole}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
