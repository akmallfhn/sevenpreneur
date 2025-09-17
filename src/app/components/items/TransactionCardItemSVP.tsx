"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { rupiahCurrency } from "@/lib/rupiah-currency";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { ProductCategory, TransactionStatus } from "@/lib/app-types";

const variantStyles: Record<
  TransactionStatus,
  {
    statusColor: string;
    statusWord: string;
  }
> = {
  PAID: {
    statusColor: "text-green-700 bg-green-200 dark:bg-[#0E2F1B]",
    statusWord: "Success",
  },
  PENDING: {
    statusColor:
      "text-[#D99E00] bg-[#FEF2D0] dark:text-[#BC8A06] dark:bg-[#363010]",
    statusWord: "Waiting for Payment",
  },
  FAILED: {
    statusColor:
      "text-destructive bg-semi-destructive dark:text-red-700 dark:bg-semi-destructive-dark",
    statusWord: "Canceled",
  },
};

interface TransactionCardItemSVPProps {
  transactionId: string;
  transactionDate: string | null;
  transactionStatus: TransactionStatus;
  productCategory: ProductCategory;
  playlistId: number | undefined;
  playlistImage: string | undefined;
  playlistName: string | undefined;
  playlistSlug: string | undefined;
  playlistTotalVideo: number | undefined;
  cohortId: number | undefined;
  cohortImage: string | undefined;
  cohortName: string | undefined;
  cohortSlug: string | undefined;
  cohortPriceName: string | undefined;
  totalTransactionAmount: number;
  invoiceURL: string | undefined;
}

export default function TransactionCardItemSVP({
  transactionId,
  transactionDate,
  transactionStatus,
  productCategory,
  playlistId,
  playlistImage,
  playlistName,
  playlistSlug,
  playlistTotalVideo,
  cohortId,
  cohortImage,
  cohortName,
  cohortSlug,
  cohortPriceName,
  totalTransactionAmount,
  invoiceURL,
}: TransactionCardItemSVPProps) {
  const { statusColor, statusWord } = variantStyles[transactionStatus];
  const isPaid = transactionStatus === "PAID";
  const isPending = transactionStatus === "PENDING";
  const isFailed = transactionStatus === "FAILED";

  return (
    <div className="transaction-item flex flex-col p-4 gap-3 bg-white rounded-md shadow-md dark:bg-surface-black">
      {/* Status & Date */}
      <div className="flex items-center justify-between font-ui">
        <p className="transaction-date text-sm dark:text-alternative">
          {dayjs(transactionDate).format("DD MMMM YYYY [at] HH:mm")}
        </p>
        <p
          className={`transaction-status text-xs font-semibold px-2.5 py-1 rounded-sm ${statusColor}`}
        >
          {statusWord}
        </p>
      </div>
      <hr className="border-t border-outline dark:border-outline-dark" />
      {/* Metadata */}
      <Link
        href={`/transactions/${transactionId}`}
        className="transaction-metadata flex gap-3 items-center"
      >
        <div className="transaction-image aspect-square size-16 rounded-md overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={
              productCategory === "COHORT"
                ? cohortImage ||
                  "https://www.jport.co/Editor/image/4721055615600659_empty.png"
                : playlistImage ||
                  "https://www.jport.co/Editor/image/4721055615600659_empty.png"
            }
            alt="Product Image"
            height={400}
            width={400}
          />
        </div>
        <div className="flex flex-col font-ui max-w-[calc(100%-4rem-0.75rem)]">
          <p className="transaction-name font-bold line-clamp-2">
            {productCategory === "COHORT"
              ? cohortName || "-"
              : playlistName || "-"}
          </p>
          <p className="transaction-price-tier text-sm line-clamp-1 dark:text-alternative">
            {productCategory === "COHORT"
              ? cohortPriceName
              : `${playlistTotalVideo} video course episodes`}
          </p>
        </div>
      </Link>
      {/* Price & CTA */}
      <div className="transaction-metadata flex items-center justify-between">
        <div className="flex flex-col font-ui text-sm">
          <p>Total Amount</p>
          <p className="font-bold">
            {rupiahCurrency(Math.round(totalTransactionAmount))}
          </p>
        </div>
        {isPending && (
          <a href={invoiceURL} target="_blank" rel="noopenner noreferrer">
            <AppButton
              className="w-[120px]"
              variant="primary"
              size="smallRounded"
              featureName="continue_payment"
              featurePagePoint="Transactions Page"
            >
              Pay Now
            </AppButton>
          </a>
        )}
        {isFailed && (
          <Link
            href={
              productCategory === "COHORT"
                ? `/cohorts/${cohortSlug}/${cohortId}`
                : `/playlists/${playlistSlug}/${playlistId}`
            }
          >
            <AppButton
              className="w-[120px]"
              variant="primary"
              size="smallRounded"
              featureName="retry_payment"
              featurePagePoint="Transactions Page"
            >
              Retry Payment
            </AppButton>
          </Link>
        )}
      </div>
    </div>
  );
}
