"use client";
import React, { useEffect, useRef, useState } from "react";

interface AppDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  alignMobile?: "left" | "center" | "right";
  alignDesktop?: "left" | "center" | "right";
  anchorEl?: HTMLElement | null;
}

export default function AppDropdown({
  isOpen,
  onClose,
  children,
  alignMobile = "center",
  alignDesktop = "center",
  anchorEl = null,
}: AppDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<"top" | "bottom">("bottom");

  useEffect(() => {
    if (!isOpen) return;

    const decidePlacement = () => {
      const winH = window.innerHeight;

      if (anchorEl) {
        // stable: gunakan posisi anchor (trigger) untuk menentukan placement
        const r = anchorEl.getBoundingClientRect();
        // aturan sederhana: kalau anchor lebih dekat ke bawah viewport -> tampilkan di atas
        setPlacement(r.top > winH / 2 ? "top" : "bottom");
      } else if (dropdownRef.current) {
        // fallback lama (kalau anchor gak dikirim)
        const r = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - r.bottom;
        const spaceAbove = r.top;
        setPlacement(
          spaceBelow < 20 && spaceAbove > spaceBelow ? "top" : "bottom"
        );
      }
    };

    decidePlacement();
    // re-evaluate saat resize/scroll biar tidak terpotong pas user scroll
    window.addEventListener("resize", decidePlacement);
    window.addEventListener("scroll", decidePlacement, true);

    return () => {
      window.removeEventListener("resize", decidePlacement);
      window.removeEventListener("scroll", decidePlacement, true);
    };
  }, [isOpen, anchorEl]);

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
      ref={dropdownRef}
      className={`dropdown-container absolute flex flex-col w-max bg-white p-3 shadow-[0px_0px_14px_rgba(0,0,0,0.15)] rounded-md z-30 overflow-hidden dark:bg-surface-black  ${
        placement === "bottom" ? "mt-2 top-full" : "mb-2 bottom-full"
      } ${mobileAlignmentClass} ${desktopAlignmentClass}`}
    >
      {children}
    </div>
  );
}
