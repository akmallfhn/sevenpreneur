"use client";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

interface WhatsappImagePreviewCMSProps {
  imageURL: string;
  imageCaption: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsappImagePreviewCMS(
  props: WhatsappImagePreviewCMSProps
) {
  // Prevent background scroll while modal is open
  useEffect(() => {
    if (props.isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [props.isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    if (!props.isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") props.onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [props]);

  if (!props.isOpen) return null;

  return (
    <div
      className="root fixed inset-0 flex bg-black/80 z-99"
      onClick={props.onClose}
    >
      <div className="relative flex w-full h-full items-center justify-center">
        <div
          className="fixed top-6 right-6 text-white/60 hover:cursor-pointer"
          onClick={props.onClose}
        >
          <X className="size-6" />
        </div>
        <div
          className="relative w-[800px] h-[420px]"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            className="object-contain"
            src={props.imageURL}
            alt={props.imageCaption || "Image Whatsapp"}
            fill
          />
        </div>
        {!!props.imageCaption && (
          <p className="fixed w-full max-w-[700px] bottom-10 left-1/2 -translate-x-1/2 text-[15px] text-white/75 text-center font-bodycopy line-clamp-3">
            {props.imageCaption}
          </p>
        )}
      </div>
    </div>
  );
}
