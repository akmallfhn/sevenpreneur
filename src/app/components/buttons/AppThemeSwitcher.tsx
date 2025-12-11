"use client";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type SwitcherStyle = "icon" | "dropdown-item" | "switch";

interface AppThemeSwitcherProps {
  style?: SwitcherStyle;
}

export default function AppThemeSwitcher({
  style = "icon",
}: AppThemeSwitcherProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const isIcon = style === "icon";
  const isSwitch = style === "switch";
  const isDark = resolvedTheme === "dark";

  // State Button
  const menuIcon = isDark ? (
    <Sun className="size-4 lg:size-5" />
  ) : (
    <Moon className="size-4 lg:size-5" />
  );
  const menuName = isDark ? "Light Mode" : "Dark Mode";

  return (
    <>
      {isIcon && (
        <div
          className="switcher-theme-icon flex p-1.5 rounded-full hover:cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {menuIcon}
        </div>
      )}
      {isSwitch && (
        <div className="switcher-theme-toggle flex items-center space-x-2">
          <Switch
            checked={isDark}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
          <label className="text-[15px] font-bodycopy font-medium">
            {menuName}
          </label>
        </div>
      )}
    </>
  );
}
