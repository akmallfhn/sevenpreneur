"use client";

import { RupiahCurrency } from "@/lib/rupiah-currency";
import Image from "next/image";

interface RadioBoxPaymentChannelProps {
  radioName?: string;
  radioCohortName?: string;
  radioPrice?: number;
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

export default function RadioBoxPaymentChannel({
  radioName,
  radioCohortName,
  radioPrice,
  value,
  selectedValue,
  onChange,
}: RadioBoxPaymentChannelProps) {
  const isSelected = selectedValue === value;

  return (
    <label className="flex gap-4 rounded-md items-center justify-between">
      <div className="payment-channel flex items-center gap-3">
        <div className="payment-image flex aspect-square w-8 h-8 rounded-full overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={
              "https://serayunews.pw/wp-content/uploads/2025/02/WhatsApp-Image-2025-02-11-at-10.52.41_f29c6342.jpg"
            }
            alt="Icon Payment"
            width={100}
            height={100}
          />
        </div>
        <p className="payment-channel-name font-ui font-medium text-black text-sm">
          BCA Virtual Account
        </p>
      </div>
      <div className="flex size-5 items-center justify-center">
        <input
          className="size-4"
          type="radio"
          name="payment_channel"
          value={value}
          checked={isSelected}
          onChange={() => onChange(value)}
        />
      </div>
    </label>
  );
}
