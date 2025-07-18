"use client";
import React from "react";

interface AppDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function AppDropdown({
  isOpen,
  onClose,
  children,
}: AppDropdownProps) {
  if (!isOpen) return null;

  return (
    <div className="dropdown-container absolute flex flex-col w-max bg-white p-3 mt-2 top-full right-0 shadow-[0px_0px_14px_rgba(0,0,0,0.15)] rounded-md z-30 overflow-hidden lg:left-1/2 lg:-translate-x-1/2">
      {children}
    </div>
  );
}
