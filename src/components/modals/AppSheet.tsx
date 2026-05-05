"use client";
import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";

interface AppSheetProps {
  sheetName: string;
  sheetDescription?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function AppSheet({
  sheetName,
  sheetDescription,
  isOpen,
  onClose,
  children,
}: AppSheetProps) {
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
      className={`sheet-root fixed inset-0 flex w-full h-full bg-black/40 items-end justify-center z-50 transition transform ease-in-out dark:bg-black/80`}
      onClick={onClose}
    >
      <div
        className={`sheet-container fixed flex flex-col w-3/4 h-full inset-y-0 right-0 bg-sb-bg border-l border-dashboard-border transition transform ease-in-out sm:max-w-md`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-header relative flex flex-col p-4 px-6">
          <h2 className="text-foreground text-lg font-brand font-bold">
            {sheetName}
          </h2>
          <p className="sheet-description text-emphasis text-sm font-bodycopy font-medium">
            {sheetDescription}
          </p>
          <X
            className="sheet-close absolute text-emphasis size-5 top-2 right-2 cursor-pointer"
            onClick={onClose}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
