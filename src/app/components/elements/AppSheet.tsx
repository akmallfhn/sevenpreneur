"use client";
import { X } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";

interface AppSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function AppSheet({ isOpen, onClose, children }: AppSheetProps) {
  // --- Blocked scroll behind
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
      className={`root fixed inset-0 flex w-full h-full bg-black/40 items-end justify-center z-50 transition transform ease-in-out`}
      onClick={onClose}
    >
      <div
        className={`sheet-container fixed flex flex-col w-3/4 h-full inset-y-0 right-0 gap-4 bg-white  transition transform ease-in-out sm:max-w-sm`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-header relative flex flex-col gap-1.5 p-4">
          <h2 className="text-black text-lg font-brand font-bold">
            Create Cohort
          </h2>
          <p className="text-alternative text-sm font-bodycopy font-medium">
            Make changes to your profile here. Click save when youre done.
          </p>
          <X
            className="absolute text-alternative size-5 top-0 right-2 cursor-pointer"
            onClick={onClose}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
