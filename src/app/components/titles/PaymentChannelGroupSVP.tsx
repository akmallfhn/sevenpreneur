"use client";

import { ChevronUp } from "lucide-react";
import { ReactNode, useState } from "react";

interface PaymentChannelGroupSVPProps {
  groupPaymentName: string;
  children: ReactNode;
  defaultState?: boolean;
}

export default function PaymentChannelGroupSVP({
  groupPaymentName,
  children,
  defaultState = false,
}: PaymentChannelGroupSVPProps) {
  const [openPaymentChannel, setOpenPaymentChannel] = useState(defaultState);

  return (
    <div className="group-payment-channel flex flex-col gap-5 hover:cursor-pointer">
      <div
        className="group-payment-name flex justify-between"
        onClick={() => {
          setOpenPaymentChannel(!openPaymentChannel);
        }}
      >
        <p className="font-bodycopy font-semibold text-sm">
          {groupPaymentName}
        </p>
        <ChevronUp
          className={`size-5 transition-transform duration-300 ${
            openPaymentChannel ? "rotate-0" : "rotate-180"
          }`}
        />
      </div>
      {openPaymentChannel && (
        <div className="payment-channel-list flex flex-col gap-5">
          {children}
        </div>
      )}
    </div>
  );
}
