"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { ProductCategory, TransactionStatus } from "@/lib/app-types";
import { getRupiahCurrency } from "@/lib/currency";

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
  eventId: number | undefined;
  eventName: string | undefined;
  eventImage: string | undefined;
  eventSlug: string | undefined;
  eventPriceName: string | undefined;
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
  eventId,
  eventName,
  eventImage,
  eventSlug,
  eventPriceName,
  totalTransactionAmount,
  invoiceURL,
}: TransactionCardItemSVPProps) {
  const { statusColor, statusWord } = variantStyles[transactionStatus];
  const isPaid = transactionStatus === "PAID";
  const isPending = transactionStatus === "PENDING";
  const isFailed = transactionStatus === "FAILED";
  const isCohort = productCategory === "COHORT";
  const isPlaylist = productCategory === "PLAYLIST";
  const isEvent = productCategory === "EVENT";

  // Product Conditional Rendering
  let productImage =
    "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/empty-icon.svg";
  if (isCohort && cohortImage) {
    productImage = cohortImage;
  } else if (isEvent && eventImage) {
    productImage = eventImage;
  } else if (isPlaylist && playlistImage) {
    productImage = playlistImage;
  }

  let productName = "-";
  if (isCohort && cohortName) {
    productName = cohortName;
  } else if (isEvent && eventName) {
    productName = eventName;
  } else if (isPlaylist && playlistName) {
    productName = playlistName;
  }

  let productTier = "-";
  if (isCohort && cohortPriceName) {
    productTier = cohortPriceName;
  } else if (isEvent && eventPriceName) {
    productTier = eventPriceName;
  } else if (isPlaylist && playlistTotalVideo) {
    productTier = `Learning Series - ${playlistTotalVideo} episodes`;
  }

  let productPage = "/";
  if (isCohort && cohortSlug && cohortId) {
    productPage = `/cohorts/${cohortSlug}/${cohortId}/checkout`;
  } else if (isEvent && eventSlug && eventId) {
    productPage = `/events/${eventSlug}/${eventId}/checkout`;
  } else if (isPlaylist && playlistSlug && playlistId) {
    productPage = `/playlist/${playlistSlug}/${playlistId}/checkout`;
  }

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
        className="product-metadata flex gap-3 items-center"
      >
        <div className="product-image aspect-square size-16 rounded-md overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={productImage}
            alt="Product Image"
            height={400}
            width={400}
          />
        </div>
        <div className="flex flex-col font-ui max-w-[calc(100%-4rem-0.75rem)]">
          <p className="product-name font-bold line-clamp-2">{productName}</p>
          <p className="product-tier text-sm line-clamp-1 dark:text-alternative">
            {productTier}
          </p>
        </div>
      </Link>
      {/* Price & CTA */}
      <div className="transaction-metadata flex items-center justify-between">
        <div className="flex flex-col font-ui text-sm">
          <p>Total Amount</p>
          <p className="font-bold">
            {getRupiahCurrency(Math.round(totalTransactionAmount))}
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
          <Link href={productPage}>
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
