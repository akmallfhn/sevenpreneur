"use client";
import { RupiahCurrency } from "@/lib/rupiah-currency";
import Image from "next/image";

interface PriceItemCardCMSProps {
  priceIndex: number;
  priceName: string;
  priceAmount: number;
}

export default function PriceItemCardCMS({
  priceIndex,
  priceName,
  priceAmount,
}: PriceItemCardCMSProps) {
  return (
    <div className="price-item relative flex flex-col shrink-0 aspect-video w-64 snap-start overflow-hidden">
      {/* Background */}
      <Image
        className="object-cover z-0"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//price-container-final.webp"
        }
        alt="price-container"
        fill
      />

      {/* Foreground content */}
      <div className="price-data flex w-full h-3/4 z-10">
        <div className="flex flex-col px-5 py-4 gap-1">
          <p className="font-bodycopy font-semibold text-alternative text-sm line-clamp-2">
            TIER {priceIndex}
          </p>
          <p className="font-brand font-semibold text-black line-clamp-2">
            {priceName}
          </p>
        </div>
      </div>
      <div className="price-amount flex w-full h-1/4 z-10">
        <p className="px-5 font-bodycopy text-sm font-semibold text-cms-primary line-clamp-2">
          {RupiahCurrency(priceAmount)}
        </p>
      </div>
    </div>
  );
}
