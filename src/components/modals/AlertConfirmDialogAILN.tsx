"use client";
import { useEffect } from "react";
import ButtonAILN from "../buttons/ButtonAILN";

interface AlertConfirmDialogAILNProps {
  isOpen: boolean;
  alertDialogHeader: string;
  alertDialogMessage: string;
  alertCancelLabel: string;
  alertConfirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AlertConfirmDialogAILN({
  isOpen,
  alertDialogHeader,
  alertDialogMessage,
  alertCancelLabel,
  alertConfirmLabel,
  onClose,
  onConfirm,
}: AlertConfirmDialogAILNProps) {
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
      className="root font-read fixed inset-0 flex w-full h-full items-end justify-center bg-black/40 z-50 dark:bg-black/70"
      onClick={onClose}
    >
      <div
        className="container-alert-dialog fixed flex flex-col bg-white w-full max-w-[calc(100%-2rem)] p-6 gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md dark:bg-card-bg dark:border dark:border-dashboard-border dark:shadow-[0_0_24px_rgba(239,68,68,0.18)] sm:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-text flex flex-col">
          <h2 className="text-lg font-semibold dark:text-white">
            {alertDialogHeader}
          </h2>
          <p className="text-emphasis text-sm font-medium dark:text-gray-400">
            {alertDialogMessage}
          </p>
        </div>
        <div className="button-action flex gap-2 justify-end">
          <ButtonAILN variant="outline" size="medium" onClick={onClose}>
            {alertCancelLabel}
          </ButtonAILN>
          <ButtonAILN size="medium" onClick={onConfirm}>
            {alertConfirmLabel}
          </ButtonAILN>
        </div>
      </div>
    </div>
  );
}
