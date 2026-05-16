"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcherAILN() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const toggle = () => setTheme(isDark ? "light" : "dark");

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="relative flex h-7 w-12 items-center rounded-full bg-gray-200 transition-colors duration-300 dark:bg-red-500/20 dark:shadow-[0_0_8px_rgba(239,68,68,0.4)]"
      suppressHydrationWarning
    >
      <span
        className="absolute size-5 rounded-full bg-white shadow-sm transition-all duration-300 dark:bg-red-500 dark:shadow-[0_0_10px_rgba(239,68,68,0.8)]"
        style={{ left: isDark ? "calc(100% - 22px)" : "2px" }}
      />
      <span className="relative z-10 flex w-1/2 items-center justify-center">
        <Sun
          className={`size-3 transition-opacity ${isDark ? "opacity-40 text-gray-400" : "opacity-100 text-warning"}`}
        />
      </span>
      <span className="relative z-10 flex w-1/2 items-center justify-center">
        <Moon
          className={`size-3 transition-opacity ${isDark ? "opacity-100 text-white" : "opacity-40 text-gray-400"}`}
        />
      </span>
    </button>
  );
}
