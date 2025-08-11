"use client";
import { ReactNode } from "react";
import { TransactionStatus } from "../items/TransactionCardItemSVP";
import { Check, ClockFading, X } from "lucide-react";

const variantStyles: Record<
  TransactionStatus,
  {
    statusColor: string;
    statusWord: string;
    statusIcon: ReactNode;
  }
> = {
  PAID: {
    statusColor: "text-success-foreground bg-success-background",
    statusWord: "Paid",
    statusIcon: <Check className="size-3" />,
  },
  PENDING: {
    statusColor: "text-warning-foreground bg-warning-background",
    statusWord: "Pending",
    statusIcon: <ClockFading className="size-3" />,
  },
  FAILED: {
    statusColor: "text-danger-foreground bg-danger-background",
    statusWord: "Failed",
    statusIcon: <X className="size-3" />,
  },
};

interface RolesLabelCMSProps {
  variants: TransactionStatus;
}

export default function TransactionStatusLabelCMS({
  variants,
}: RolesLabelCMSProps) {
  // --- Variant declaration
  const { statusColor, statusWord, statusIcon } = variantStyles[variants];

  return (
    <div
      className={`label-container inline-flex py-0.5 px-2 rounded-sm items-center justify-center gap-1 text-[13px] font-semibold font-bodycopy truncate ${statusColor}`}
    >
      {statusIcon}
      {statusWord}
    </div>
  );
}
