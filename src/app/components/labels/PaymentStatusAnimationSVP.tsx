"use client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { TransactionStatus } from "../items/TransactionCardItemSVP";

const variantStyles: Record<
  TransactionStatus,
  {
    source: string;
    scale: string;
  }
> = {
  PAID: {
    source: "/animation/success-payment.lottie",
    scale: "scale-150",
  },
  PENDING: {
    source: "/animation/waiting-payment.lottie",
    scale: "scale-90",
  },
  FAILED: {
    source: "/animation/failed-payment.lottie",
    scale: "scale-125",
  },
};

interface PaymentStatusAnimationSVPProps {
  variant: TransactionStatus;
}

export default function PaymentStatusAnimationSVP({
  variant,
}: PaymentStatusAnimationSVPProps) {
  const { source, scale } = variantStyles[variant];

  return (
    <div className="flex items-center max-w-[320px] w-full justify-center overflow-hidden">
      <div className={`w-full ${scale}`}>
        <DotLottieReact
          src={source}
          loop
          autoplay
          speed={1}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </div>
  );
}
