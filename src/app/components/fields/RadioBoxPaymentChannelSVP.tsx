"use client";
import Image from "next/image";

interface RadioBoxPaymentChannelSVPProps {
  paymentChannelName: string;
  paymentIcon: string;
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

export default function RadioBoxPaymentChannelSVP({
  paymentChannelName,
  paymentIcon,
  value,
  selectedValue,
  onChange,
}: RadioBoxPaymentChannelSVPProps) {
  const isSelected = selectedValue === value;

  return (
    <label className="flex gap-4 rounded-md items-center justify-between hover:cursor-pointer">
      <div className="payment-channel flex items-center gap-3">
        <div className="payment-image flex aspect-square w-8 h-8 rounded-full overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={
              paymentIcon ||
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/payment-icon/payment-bsi.svg"
            }
            alt="Icon Payment"
            width={100}
            height={100}
          />
        </div>
        <p className="payment-channel-name font-ui font-[450px] text-sm">
          {paymentChannelName}
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
