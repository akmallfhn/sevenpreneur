"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface SideMenuMobileSVPProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenuMobileSVP({
  isOpen,
  onClose,
}: SideMenuMobileSVPProps) {
  // Blocked scroll behind
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`side-menu-root fixed inset-0 flex w-full h-full bg-black/40 items-end justify-center z-[91] transition transform ease-in-out`}
      onClick={onClose}
    >
      <div
        className={`side-menu-container fixed flex flex-col w-3/4 h-full inset-y-0 left-0 gap-4 bg-white  transition transform ease-in-out sm:max-w-md`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="side-menu-box relative flex flex-col p-4 px-6">
          <X
            className="side-menu-close absolute text-alternative size-6 top-4 right-4 cursor-pointer"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}
