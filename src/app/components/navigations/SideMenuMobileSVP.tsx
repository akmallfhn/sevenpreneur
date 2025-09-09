"use client";

import { X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import AppThemeSwitcher from "../buttons/AppThemeSwitcher";

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
        className={`side-menu-container fixed flex flex-col w-3/4 h-full inset-y-0 left-0 gap-4 bg-white/90 backdrop-blur-md transition transform ease-in-out dark:bg-black/60 sm:max-w-md`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="side-menu-box relative flex flex-col w-full h-full justify-center">
          <ul className="side-menu-list flex flex-col p-6 mb-24 gap-5 font-brand font-medium text-lg">
            <li>
              <Link href={"/"} onClick={onClose}>
                Home
              </Link>
            </li>
            <hr className="border-t border-outline dark:border-outline-dark" />
            <li>
              <Link
                href={"/cohorts/sevenpreneur-business-blueprint-program"}
                onClick={onClose}
              >
                Program
              </Link>
            </li>
            <hr className="border-t border-outline dark:border-outline-dark" />
            <li>
              <Link href={"/company"} onClick={onClose}>
                About Us
              </Link>
            </li>
            <hr className="border-t border-outline dark:border-outline-dark" />
            <li>
              <Link href={"/collaboration"} onClick={onClose}>
                Collab with Us
              </Link>
            </li>
            <hr className="border-t border-outline dark:border-outline-dark" />
            <AppThemeSwitcher style="switch" />
          </ul>
          <X
            className="side-menu-close absolute text-alternative size-6 top-4 right-4 cursor-pointer"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}
