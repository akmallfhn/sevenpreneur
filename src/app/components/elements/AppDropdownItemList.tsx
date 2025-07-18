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
      className={`menu-list flex p-2 w-44 items-center gap-2  rounded-sm  hover:cursor-pointer ${
        isDestructive
          ? "text-destructive hover:bg-[#FFCDC9]"
          : "text-black hover:bg-[#F1F5F9]"
      }`}
      onClick={onClick}
    >
      {menuIcon}
      <p className="text-sm font-ui">{menuName}</p>
    </div>
  );
}
