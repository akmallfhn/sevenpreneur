"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

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

  if (!mounted) return null;

  return (
    <div
      className="theme-switcher flex p-2 w-44 items-center gap-2 rounded-sm text-black hover:cursor-pointer hover:bg-[#F1F5F9] dark:text-white dark:hover:bg-[#27292E]"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <>
          <Sun className="size-4" />
          <p className="text-sm font-ui">Light Mode</p>
        </>
      ) : (
        <>
          <Moon className="size-4" />
          <p className="text-sm font-ui">Dark Mode</p>
        </>
      )}
    </div>
  );
}
