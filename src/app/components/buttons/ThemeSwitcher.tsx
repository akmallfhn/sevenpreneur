"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import AppDropdownItemList from "../elements/AppDropdownItemList";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
    menuIcon = <Sun className="size-4" />;
  } else {
    menuName = "Dark Mode";
    menuIcon = <Moon className="size-4" />;
  }

  if (!mounted) return null;

  return (
    <AppDropdownItemList
      menuIcon={menuIcon}
      menuName={menuName}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  );
}
