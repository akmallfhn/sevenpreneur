"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import AppDropdownItemList from "../elements/AppDropdownItemList";
import { Switch } from "@/components/ui/switch";

type SwitcherStyle = "icon" | "dropdown-item" | "switch";

interface AppThemeSwitcherProps {
  style?: SwitcherStyle;
}

export default function AppThemeSwitcher({
  style = "icon",
}: AppThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isIcon = style === "icon";
  const isSwitch = style === "switch";
  const isDropdownItem = style === "dropdown-item";

  // Flagging that inform React finished mounting in client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Only set default once when theme is undefined or "system"
  useEffect(() => {
    if (mounted && theme !== "light" && theme !== "dark") {
      setTheme("light");
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
      {isIcon && (
        <div
          className="switcher-square flex p-1.5 rounded-full hover:cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {menuIcon}
        </div>
      )}
      {isSwitch && (
        <div className="flex items-center space-x-2">
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
          <label>{menuName}</label>
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
