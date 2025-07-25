"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import { RupiahCurrency } from "@/lib/rupiah-currency";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/en";

export type TransactionStatus = "PAID" | "PENDING" | "FAILED";

const variantStyles: Record<
  TransactionStatus,
  {
    statusColor: string;
    statusWord: string;
  }
> = {
  PAID: {
    statusColor: "text-green-700 bg-green-200",
    statusWord: "Success",
  },
  PENDING: {
    statusColor: "text-[#D99E00] bg-[#FEF2D0]",
    statusWord: "Waiting for Payment",
  },
  FAILED: {
    statusColor: "text-destructive bg-semi-destructive",
    statusWord: "Canceled",
  },
};

interface TransactionCardItemSVPProps {
  transactionId: string;
  transactionDate: string | null;
  transactionStatus: TransactionStatus;
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
    <div className="transaction-item flex flex-col p-4 gap-3 bg-white rounded-md shadow-md">
      {/* Status & Date */}
      <div className="flex items-center justify-between font-ui">
        <p className="transaction-date text-sm text-black">
          {dayjs(transactionDate).format("DD MMMM YYYY [at] HH:mm")}
        </p>
        <p
          className={`transaction-status text-xs font-semibold px-2.5 py-1 rounded-sm ${statusColor}`}
        >
          {statusWord}
        </p>
      </div>
      <hr />
      {/* Metadata */}
      <Link
        href={`/transactions/${transactionId}`}
        className="transaction-metadata flex gap-3 items-center"
      >
        <div className="transaction-image aspect-square size-16 rounded-md overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={
              cohortImage ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2aN-5V--yL4NOrcd_becVZJkBTc7T_EdYiw&s"
            }
            alt="Product Image"
            height={400}
            width={400}
          />
        </div>
        <div className="flex flex-col font-ui text-black max-w-[calc(100%-4rem-0.75rem)]">
          <p className="transaction-name font-bold line-clamp-2">
            {cohortName}
          </p>
          <p className="transaction-price-tier text-sm line-clamp-1">
            {cohortPriceName}
          </p>
        </div>
      </Link>
      {/* Price & CTA */}
      <div className="transaction-metadata flex items-center justify-between">
        <div className="flex flex-col font-ui text-black text-sm">
          <p>Total Amount</p>
          <p className="font-bold">
            {RupiahCurrency(Math.round(totalTransactionAmount))}
          </p>
        </div>
        {isPending && (
          <a href={invoiceURL} target="_blank" rel="noopenner noreferrer">
            <AppButton
              className="w-[120px]"
              variant="primary"
              size="smallRounded"
            >
              Pay Now
            </AppButton>
          </a>
        )}
        {isFailed && (
          <Link href={`/cohorts/${cohortSlug}/${cohortId}`}>
            <AppButton
              className="w-[120px]"
              variant="primary"
              size="smallRounded"
            >
              Retry Payment
            </AppButton>
          </Link>
        )}
      </div>
    </div>
  );
}
