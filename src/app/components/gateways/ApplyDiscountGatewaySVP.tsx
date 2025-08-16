"use client";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ApplyDiscountGatewaySVPProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export default function ApplyDiscountGatewaySVP({
  ...rest
}: ApplyDiscountGatewaySVPProps) {
  return (
    <div
      className="discount-gateway flex w-full bg-[#F8FBFF] p-3 border border-primary/30 rounded-md sm:hover:cursor-pointer"
      {...rest}
    >
      <div className="discount-content-group flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="discount-icon flex aspect-square size-[44px] shrink-0 overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src={
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/discount-icon.svg"
              }
              alt="discount-icon"
              width={100}
              height={100}
            />
          </div>
          <div className="flex flex-col font-bodycopy gap-0.5">
            <p className="font-bold text-xs text-primary">
              {`Special Discount for you`.toUpperCase()}
            </p>
            <p className="font-semibold text-sm">
              Apply discount for extra savings!
            </p>
          </div>
        </div>
        <ChevronRight className="size-5" />
      </div>
    </div>
  );
}
