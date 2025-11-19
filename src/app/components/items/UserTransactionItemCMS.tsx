"use client";
import { ProductCategory, TransactionStatus } from "@/lib/app-types";
import { getRupiahCurrency } from "@/lib/currency";
import { Check, Clock7, Landmark, X } from "lucide-react";
import { ReactNode } from "react";

const statusAttributes: Record<
  TransactionStatus,
  {
    main_icon_color: string;
    status_icon: ReactNode;
    status_icon_color: string;
    amount_color: string;
  }
> = {
  PAID: {
    main_icon_color: "text-cms-primary bg-cms-primary-light/40",
    status_icon: <Check className="size-3" />,
    status_icon_color: "bg-green-700 text-white",
    amount_color: "text-green-600",
  },
  PENDING: {
    main_icon_color: "text-alternative bg-section-background",
    status_icon: <Clock7 className="size-3" />,
    status_icon_color: "bg-[#F8AC4B] text-white",
    amount_color: "text-[#333333]",
  },
  FAILED: {
    main_icon_color: "text-alternative bg-section-background",
    status_icon: <X className="size-3" />,
    status_icon_color: "bg-destructive text-white",
    amount_color: "text-[#333333]",
  },
};

interface UserTransactionItemCMSProps {
  transactionId: string;
  transactionStatus: TransactionStatus;
  netTransactionAmount: string;
  productCategory: ProductCategory;
  playlistName?: string;
  cohortName?: string;
  cohortPriceName?: string;
  eventName?: string;
  eventPriceName?: string;
}

export default function UserTransactionItemCMS({
  transactionId,
  transactionStatus,
  netTransactionAmount,
  productCategory,
  playlistName,
  cohortName,
  cohortPriceName,
  eventName,
  eventPriceName,
}: UserTransactionItemCMSProps) {
  const statusIcon = statusAttributes[transactionStatus];
  const isCohort = productCategory === "COHORT";
  const isPlaylist = productCategory === "PLAYLIST";
  const isEvent = productCategory === "EVENT";

  let productName = "-";
  if (isCohort && cohortName) {
    productName = cohortName;
  } else if (isEvent && eventName) {
    productName = eventName;
  } else if (isPlaylist && playlistName) {
    productName = playlistName;
  }

  let productPriceName = "-";
  if (isCohort && cohortPriceName) {
    productPriceName = cohortPriceName;
  } else if (isEvent && eventPriceName) {
    productPriceName = eventPriceName;
  } else if (isPlaylist && playlistName) {
    productPriceName = "Playlist Video";
  }

  return (
    <div className="transaction-item flex justify-between p-2 items-center gap-3">
      <div className="transaction-attributes flex gap-3 items-center">
        <div className="transaction-icon relative flex">
          <div
            className={`main-icon flex size-10 aspect-square justify-center items-center rounded-full ${statusIcon.main_icon_color}`}
          >
            <Landmark className="size-6 shrink-0" />
          </div>
          <div
            className={`status-icon absolute flex right-0 bottom-0 size-4 rounded-full items-center justify-center ${statusIcon.status_icon_color}`}
          >
            {statusIcon.status_icon}
          </div>
        </div>
        <div className="flex flex-col">
          <p className="font-bodycopy font-medium text-[15px] text-[#333333] line-clamp-1">
            {productName}
          </p>
          <p className="font-bodycopy font-medium text-sm text-alternative line-clamp-1">
            {productPriceName}
          </p>
        </div>
      </div>
      <div
        className={`net-transaction-amount font-bodycopy font-semibold text-sm shrink-0 ${statusIcon.amount_color}`}
      >
        +{getRupiahCurrency(Math.round(Number(netTransactionAmount)))}
      </div>
    </div>
  );
}
