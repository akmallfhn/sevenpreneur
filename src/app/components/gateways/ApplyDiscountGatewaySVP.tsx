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
      className="discount-gateway flex w-full bg-[#F8FBFF] p-3 border border-primary/30 rounded-md dark:bg-surface-black dark:border-0 sm:hover:cursor-pointer"
      {...rest}
    >
      <div className="discount-container flex w-full items-center justify-between">
        <div className="discount-attributes flex items-center gap-3">
          <div className="discount-icon flex aspect-square size-[48px] p-1 bg-[#E3EFFF] rounded-md shrink-0 overflow-hidden dark:bg-white/5">
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
          <div className="flex flex-col font-bodycopy">
            <p className="font-bold w-fit text-sm text-primary">
              SPECIAL DISCOUNT
            </p>
            <p className="font-medium text-[13px] text-[#333333] dark:text-white">
              Save more with discounts
            </p>
          </div>
        </div>
        <ChevronRight className="size-5" />
      </div>
    </div>
  );
}
