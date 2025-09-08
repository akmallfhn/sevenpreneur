"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import AppDropdownItemList from "../elements/AppDropdownItemList";

type SwitcherSize = "square" | "dropdown-item";

interface AppThemeSwitcherProps {
  size?: SwitcherSize;
}

export default function AppThemeSwitcher({
  size = "square",
}: AppThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isSquare = size === "square";
  const isDropdownItem = size === "dropdown-item";

  // Flagging that inform React finished mounting in client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only set default once when theme is undefined or "system"
  useEffect(() => {
    if (mounted && theme !== "light" && theme !== "dark") {
      setTheme("dark");
    }
  }, [mounted, theme, setTheme]);

  // State Button
  let menuIcon;
  let menuName;
  if (theme === "dark") {
    menuName = "Light Mode";
    menuIcon = <Sun className="size-4 lg:size-5" />;
  } else {
    menuName = "Dark Mode";
    menuIcon = <Moon className="size-4 lg:size-5" />;
  }

  if (!mounted) return null;

  return (
    <>
      {isSquare && (
        <div
          className="switcher-square flex p-1.5 rounded-full hover:cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {menuIcon}
        </div>
      )}
      {isDropdownItem && (
        <AppDropdownItemList
          menuIcon={menuIcon}
          menuName={menuName}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      )}
    </>
  );
}
