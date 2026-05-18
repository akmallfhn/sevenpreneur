"use client";
import { ProductCategory, TransactionStatus } from "@/lib/app-types";
import { getRupiahCurrency } from "@/lib/currency";
import dayjs from "dayjs";
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
    main_icon_color:
      "text-tertiary bg-section-background dark:text-sevenpreneur-purple-lavender dark:bg-dashboard-border",
    status_icon: <Check className="size-3" />,
    status_icon_color: "bg-green-700 text-white",
    amount_color: "text-green-600 dark:text-green-400",
  },
  PENDING: {
    main_icon_color:
      "text-emphasis bg-section-background dark:bg-dashboard-border",
    status_icon: <Clock7 className="size-3" />,
    status_icon_color: "bg-[#F8AC4B] text-white",
    amount_color: "text-[#333333] dark:text-sevenpreneur-white",
  },
  FAILED: {
    main_icon_color:
      "text-emphasis bg-section-background dark:bg-dashboard-border",
    status_icon: <X className="size-3" />,
    status_icon_color: "bg-destructive text-white",
    amount_color: "text-[#333333] dark:text-sevenpreneur-white",
  },
};

interface UserTransactionItemCMSProps {
  transactionId: string;
  transactionStatus: TransactionStatus;
  transactionCreatedAt: string | Date;
  netTransactionAmount: string;
  productCategory: ProductCategory;
  playlistName?: string;
  cohortName?: string;
  cohortPriceName?: string;
  eventName?: string;
  eventPriceName?: string;
}

export default function UserTransactionItemCMS({
  // transactionId,
  transactionStatus,
  transactionCreatedAt,
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
          <p className="font-bodycopy font-medium text-[15px] text-[#333333] dark:text-sevenpreneur-white line-clamp-1">
            {productName}
          </p>
          <p className="font-bodycopy font-medium text-sm text-emphasis line-clamp-1">
            {productPriceName}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end shrink-0">
        <div
          className={`net-transaction-amount font-bodycopy font-semibold text-sm ${statusIcon.amount_color}`}
        >
          +{getRupiahCurrency(Math.round(Number(netTransactionAmount)))}
        </div>
        <p className="font-bodycopy text-xs text-emphasis">
          {dayjs(transactionCreatedAt).format("D MMM YYYY")}
        </p>
      </div>
    </div>
  );
}
