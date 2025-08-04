"use client";
import React from "react";

interface AppDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  alignMobile?: "left" | "center" | "right";
  alignDesktop?: "left" | "center" | "right";
}

export default function AppDropdown({
  isOpen,
  onClose,
  children,
  alignMobile = "center",
  alignDesktop = "center",
}: AppDropdownProps) {
  if (!isOpen) return null;

  const mobileAlignmentClass = {
    left: "left-0 translate-x-0",
    center: "left-1/2 -translate-x-1/2",
    right: "right-0 translate-x-0",
  }[alignMobile];

  const desktopAlignmentClass = {
    left: "lg:left-0 lg:right-auto lg:translate-x-0",
    center: "lg:left-1/2 lg:-translate-x-1/2 lg:right-auto",
    right: "lg:right-0 lg:left-auto lg:translate-x-0",
  }[alignDesktop];

  return (
    <div
      className={`dropdown-container absolute flex flex-col w-max bg-white p-3 mt-2 top-full shadow-[0px_0px_14px_rgba(0,0,0,0.15)] rounded-md z-30 overflow-hidden dark:bg-surface-black ${mobileAlignmentClass} ${desktopAlignmentClass}`}
    >
      {children}
    </div>
  );
}
