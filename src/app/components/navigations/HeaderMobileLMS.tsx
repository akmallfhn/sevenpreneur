"use client";
import { useClipboard } from "@/lib/use-clipboard";
import { ChevronLeft, Link2 } from "lucide-react";
import Link from "next/link";
import AppButton from "../buttons/AppButton";
import { useEffect } from "react";
import { toast } from "sonner";

interface HeaderMobileLMSProps {
  headerTitle: string;
  headerBackURL: string;
}

export default function HeaderMobileLMS(props: HeaderMobileLMSProps) {
  const { copy, copied } = useClipboard();

  useEffect(() => {
    if (copied) {
      toast.success("Link copied to clipboard!");
    }
  }, [copied]);

  return (
    <div className="mobile-header sticky flex w-full top-0 left-0 items-center justify-between py-2 px-5 gap-4 bg-white border-b border-outline z-[90]">
      <Link href={props.headerBackURL} className="shrink-0">
        <AppButton variant="ghost" size="icon">
          <ChevronLeft className="size-5" />
        </AppButton>
      </Link>
      <h1 className="font-bodycopy font-bold line-clamp-1 text-center">
        {props.headerTitle}
      </h1>
      <AppButton
        className="shrink-0"
        variant="ghost"
        size="icon"
        onClick={() => copy(window.location.href)}
      >
        <Link2 className="size-5" />
      </AppButton>
    </div>
  );
}
