"use client";
import React from "react";

interface AppDropdownItemListProps {
  menuIcon: React.ReactNode;
  menuName: string;
  isDestructive?: boolean;
  onClick?: () => void;
}

export default function AppDropdownItemList({
  menuIcon,
  menuName,
  isDestructive = false,
  onClick,
}: AppDropdownItemListProps) {
  return (
    <div
      className={`menu-list flex p-2 w-44 items-center gap-2 rounded-sm hover:cursor-pointer ${
        isDestructive
          ? "text-destructive-soft-foreground hover:bg-destructive-soft-background dark:hover:bg-white/10"
          : "hover:bg-muted-background/10 dark:hover:bg-white/10"
      }`}
      onClick={onClick}
    >
      {menuIcon}
      <p className="text-sm font-medium font-bodycopy">{menuName}</p>
    </div>
  );
}
