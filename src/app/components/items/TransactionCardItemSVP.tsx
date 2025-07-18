"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";

export default function TransactionCardItemSVP() {
  return (
    <div className="transaction-item flex flex-col p-4 gap-3 bg-white rounded-md shadow-md">
      {/* Status & Date */}
      <div className="flex items-center justify-between font-ui">
        <p className="transaction-date text-xs text-black">16 Juli 2025</p>
        <p className="transaction-status text-xs font-semibold px-2.5 py-1 text-green-700 bg-green-200 rounded-sm">
          Sukses
        </p>
      </div>
      <hr />
      {/* Metadata */}
      <div className="transaction-metadata flex gap-3 items-center">
        <div className="transaction-image aspect-square size-16 rounded-md overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2aN-5V--yL4NOrcd_becVZJkBTc7T_EdYiw&s"
            }
            alt="Product Image"
            height={400}
            width={400}
          />
        </div>
        <div className="flex flex-col font-ui text-black max-w-[calc(100%-4rem-0.75rem)]">
          <p className="transaction-name font-bold line-clamp-2">
            TETR College of Business
          </p>
          <p className="transaction-price-tier text-sm line-clamp-1">
            Paket Intensive
          </p>
        </div>
      </div>
      {/* Price & CTA */}
      <div className="transaction-metadata flex items-center justify-between">
        <div className="flex flex-col font-ui text-black text-xs">
          <p>Total Amount</p>
          <p className="font-bold">Rp 1.800.000</p>
        </div>
        <AppButton className="w-[120px]" variant="primary" size="smallRounded">
          Beli Lagi
        </AppButton>
      </div>
    </div>
  );
}
