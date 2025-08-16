"use client";
import { BadgePercent, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import React from "react";

interface AppliedDiscountCardSVPProps
  extends React.HTMLAttributes<HTMLDivElement> {
  discountName: string;
  discountRate: number;
  discountCode: string;
  onClose: () => void;
}

export default function AppliedDiscountCardSVP({
  discountName,
  discountRate,
  discountCode,
  onClose,
  ...rest
}: AppliedDiscountCardSVPProps) {
  return (
    <div
      className="discount-item flex w-full bg-linear-to-r from-0% from-[#AECFFF] to-60% to-white t p-3 border border-outline rounded-md dark:bg-surface-black dark:border-outline-dark sm:hover:cursor-pointer"
      {...rest}
    >
      <div className="discount-content-group flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <BadgePercent className="size-7 text-white shrink-0" fill="#0165F6" />
          <div className="flex flex-col font-bodycopy">
            <h5 className="font-bold text-sm">{`Discount ${discountRate}% - ${discountCode}`}</h5>
            <p className="font-medium text-sm">{discountName}</p>
          </div>
        </div>
        <X className="size-5 shrink-0" onClick={onClose} />
      </div>
    </div>
  );
}
