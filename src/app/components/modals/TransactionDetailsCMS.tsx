"use client";
import { Loader2 } from "lucide-react";
import AppSheet from "./AppSheet";
import { trpc } from "@/trpc/client";
import ReceiptLineItemSVP from "../items/ReceiptLineItemSVP";
import { rupiahCurrency } from "@/lib/rupiah-currency";
import ReceiptLineItemCMS from "../items/ReceiptLineItemCMS";
import Image from "next/image";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import TransactionStatusLabelCMS from "../labels/TransactionStatusLabelCMS";
import TransactionDetailItemCMS from "../items/TransactionDetailItem";
import dayjs from "dayjs";
import ProductCategoryLabelCMS from "../labels/ProductCategoryLabelCMS";
import UserItemCMS from "../items/UserItemCMS";

interface TransactionDetailsCMSProps {
  transactionId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionDetailsCMS({
  transactionId,
  isOpen,
  onClose,
}: TransactionDetailsCMSProps) {
  if (!transactionId) return;

  const { data, isLoading, isError } = trpc.read.transaction.useQuery(
    { id: transactionId },
    { enabled: !!transactionId }
  );
  const transactionDetails = data?.transaction;

  let productName = "";
  if (transactionDetails?.category === "COHORT") {
    productName = transactionDetails.cohort_name ?? "";
  } else if (transactionDetails?.category === "PLAYLIST") {
    productName = transactionDetails.playlist_name ?? "";
  }

  return (
    <AppSheet
      sheetName="Transaction Details"
      sheetDescription={`ID: ${transactionDetails?.id}`}
      isOpen={isOpen}
      onClose={onClose}
    >
      {isLoading && (
        <div className="flex w-full h-full items-center justify-center text-alternative">
          <Loader2 className="animate-spin size-5 " />
        </div>
      )}
      {isError && (
        <div className="flex w-full h-full items-center justify-center text-alternative font-bodycopy">
          No Data
        </div>
      )}
      <div className="container flex flex-col h-full px-6 pb-20 gap-5 overflow-y-auto">
        {/* Product Name */}
        <TransactionDetailItemCMS itemName="Product Name">
          <p className="font-semibold">{productName}</p>
        </TransactionDetailItemCMS>

        {/* Product Category */}
        <TransactionDetailItemCMS itemName="Product Category">
          {transactionDetails?.category && (
            <ProductCategoryLabelCMS variants={transactionDetails?.category} />
          )}
        </TransactionDetailItemCMS>

        {/* Customer Details */}
        <div className="flex flex-col gap-2 p-3 border border-outline rounded-md">
          <h5 className="font-bodycopy font-bold text-sm">Customer Details</h5>
          <UserItemCMS
            userName={transactionDetails?.user_full_name || ""}
            userAvatar="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
            userEmail="akmal@sevenpreneur.com"
            userPhoneNumber="895803221561"
            isShowWhatsapp
          />
        </div>

        {/* Payment Status */}
        <div className="flex flex-col gap-4 p-3 border border-outline rounded-md">
          <TransactionDetailItemCMS itemName="Payment Method">
            <div className="flex items-center gap-2">
              {transactionDetails?.payment_channel_image && (
                <div className="aspect-square size-6 rounded-full overflow-hidden">
                  <Image
                    className="object-cover w-full h-full"
                    src={transactionDetails?.payment_channel_image}
                    alt={transactionDetails?.payment_channel_name || ""}
                    width={100}
                    height={100}
                  />
                </div>
              )}
              <p className="text-sm">
                {transactionDetails?.payment_channel_name || ""}
              </p>
            </div>
          </TransactionDetailItemCMS>
          <TransactionDetailItemCMS itemName="Payment Status">
            {transactionDetails?.status && (
              <TransactionStatusLabelCMS variants={transactionDetails.status} />
            )}
          </TransactionDetailItemCMS>
          <TransactionDetailItemCMS itemName="Checkout at">
            {dayjs(transactionDetails?.created_at).format("DD MMM YYYY HH:mm")}
          </TransactionDetailItemCMS>
          <TransactionDetailItemCMS itemName="Paid at">
            {transactionDetails?.paid_at
              ? dayjs(transactionDetails?.paid_at).format("DD MMM YYYY HH:mm")
              : "-"}
          </TransactionDetailItemCMS>
        </div>

        {/* Payment Details */}
        <div className="flex flex-col gap-2 p-3 border border-outline rounded-md">
          <h5 className="font-bodycopy font-bold text-sm">Payment Details</h5>
          <ReceiptLineItemCMS
            receiptName="Price"
            receiptValue={rupiahCurrency(
              Math.round(Number(transactionDetails?.product_price))
            )}
          />
          <ReceiptLineItemCMS
            receiptName="Admin Fee"
            receiptValue={rupiahCurrency(
              Math.round(Number(transactionDetails?.product_admin_fee))
            )}
          />
          <ReceiptLineItemCMS
            receiptName="Value Added Tax"
            receiptValue={rupiahCurrency(
              Math.round(Number(transactionDetails?.product_vat))
            )}
          />
          <hr className="border-t border-outline" />
          <ReceiptLineItemCMS
            receiptName="Total Amount"
            receiptValue={rupiahCurrency(
              Math.round(Number(transactionDetails?.product_total_amount))
            )}
          />
        </div>
      </div>
    </AppSheet>
  );
}
