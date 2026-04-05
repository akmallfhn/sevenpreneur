"use client";
import { useEffect } from "react";
import AppButton from "../buttons/AppButton";

interface AppAlertConfirmDialogProps {
  isOpen: boolean;
  alertDialogHeader: string;
  alertDialogMessage: string;
  alertCancelLabel: string;
  alertConfirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AppAlertConfirmDialog({
  isOpen,
  alertDialogHeader,
  alertDialogMessage,
  alertCancelLabel,
  alertConfirmLabel,
  onClose,
  onConfirm,
}: AppAlertConfirmDialogProps) {
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
      className="root fixed inset-0 flex w-full h-full items-end justify-center bg-black/40 z-50 dark:bg-black/70"
      onClick={onClose}
    >
      <div
        className="container-alert-dialog fixed flex flex-col bg-white w-full max-w-[calc(100%-2rem)] p-6 gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md dark:bg-surface-black sm:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-text flex flex-col">
          <h2 className="text-lg font-brand font-semibold">
            {alertDialogHeader}
          </h2>
          <p className="text-alternative text-sm font-bodycopy font-medium">
            {alertDialogMessage}
          </p>
        </div>
        <div className="button-action flex gap-2 justify-end">
          <AppButton variant="outline" size="medium" onClick={onClose}>
            {alertCancelLabel}
          </AppButton>
          <AppButton
            variant="semiDestructive"
            size="medium"
            onClick={onConfirm}
          >
            {alertConfirmLabel}
          </AppButton>
        </div>
      </div>
    </div>
  );
}
