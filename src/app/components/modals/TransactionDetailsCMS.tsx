"use client";
import { Copy, Loader2 } from "lucide-react";
import AppSheet from "./AppSheet";
import { trpc } from "@/trpc/client";
import ReceiptLineItemCMS from "../items/ReceiptLineItemCMS";
import Image from "next/image";
import TransactionStatusLabelCMS from "../labels/TransactionStatusLabelCMS";
import dayjs from "dayjs";
import ProductCategoryLabelCMS from "../labels/ProductCategoryLabelCMS";
import UserItemCMS from "../items/UserItemCMS";
import AppButton from "../buttons/AppButton";
import { useClipboard } from "@/lib/use-clipboard";
import { toast } from "sonner";
import { useState } from "react";
import { CancelPaymentXendit } from "@/lib/actions";
import AppAlertConfirmDialog from "./AppAlertConfirmDialog";
import { getRupiahCurrency } from "@/lib/currency";
import SheetLineItemCMS from "../items/SheetLineItemCMS";

interface TransactionDetailsCMSProps {
  transactionId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TransactionDetailsCMS({
  transactionId,
  isOpen,
  onClose,
}: TransactionDetailsCMSProps) {
  const [loadingCancelInvoice, setLoadingCancelInvoice] = useState(false);
  const [isOpenCancelConfirmation, setIsOpenCancelConfirmation] =
    useState(false);
  const { copy, copied } = useClipboard();
  const utils = trpc.useUtils();

  const { data, isLoading, isError } = trpc.read.transaction.useQuery(
    { id: transactionId },
    { enabled: !!transactionId }
  );
  const transactionDetails = data?.transaction;
  const isPending = transactionDetails?.status === "PENDING";

  let productName = "";
  if (transactionDetails?.category === "COHORT") {
    productName = transactionDetails.cohort_name ?? "";
  } else if (transactionDetails?.category === "PLAYLIST") {
    productName = transactionDetails.playlist_name ?? "";
  } else if (transactionDetails?.category === "EVENT") {
    productName = transactionDetails.event_name ?? "";
  }

  // Handle Copy URL
  const handleCopyInvoiceURL = () => {
    if (transactionDetails?.invoice_url) {
      copy(transactionDetails.invoice_url);
      toast.success("Invoice URL copied to clipboard");
    }
  };

  // Cancel Invoice on Xendit
  const handleCancelation = async () => {
    if (!transactionId) {
      toast.error("The transaction could not be found");
      return;
    }
    setLoadingCancelInvoice(true);
    try {
      const cancelPayment = await CancelPaymentXendit({
        transactionId,
      });
      if (cancelPayment.code === "NO_CONTENT") {
        utils.read.transaction.invalidate();
        utils.list.transactions.invalidate();
      } else {
        toast.error("Cancellation failed. Please try again");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during cancellation");
    } finally {
      setLoadingCancelInvoice(false);
    }
  };

  if (!transactionId) return;

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
      {!isLoading && !isError && (
        <div className="container flex flex-col h-full px-6 pb-20 gap-5 overflow-y-auto">
          <SheetLineItemCMS itemName="Product Name">
            <p className="font-semibold">{productName}</p>
          </SheetLineItemCMS>
          <SheetLineItemCMS itemName="Product Category">
            {transactionDetails?.category && (
              <ProductCategoryLabelCMS
                variants={transactionDetails?.category}
              />
            )}
          </SheetLineItemCMS>
          <div className="customer-details flex flex-col gap-2 p-3 border border-outline rounded-md">
            <h5 className="font-bodycopy font-bold text-sm">
              Customer Details
            </h5>
            <UserItemCMS
              userId={transactionDetails?.user_id || ""}
              userName={transactionDetails?.user_full_name || "-"}
              userAvatar={
                transactionDetails?.user_avatar ||
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
              }
              userEmail={transactionDetails?.user_email || ""}
              userPhoneNumber={transactionDetails?.user_phone_number || ""}
            />
          </div>
          <div className="payment-status flex flex-col gap-4 p-3 border border-outline rounded-md">
            <SheetLineItemCMS itemName="Payment Method">
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
            </SheetLineItemCMS>
            <SheetLineItemCMS itemName="Payment Status">
              {transactionDetails?.status && (
                <TransactionStatusLabelCMS
                  variants={transactionDetails.status}
                />
              )}
            </SheetLineItemCMS>
            <SheetLineItemCMS itemName="Checkout at">
              {dayjs(transactionDetails?.created_at).format(
                "DD MMM YYYY HH:mm"
              )}
            </SheetLineItemCMS>
            <SheetLineItemCMS itemName="Paid at">
              {transactionDetails?.paid_at
                ? dayjs(transactionDetails?.paid_at).format("DD MMM YYYY HH:mm")
                : "-"}
            </SheetLineItemCMS>
            {transactionDetails?.invoice_url && (
              <SheetLineItemCMS itemName="Invoice URL">
                <div className="flex items-center gap-1">
                  <a
                    className="line-clamp-1 hover:text-cms-primary hover:underline hover:underline-offset-2"
                    href={transactionDetails.invoice_url}
                  >
                    {transactionDetails.invoice_url}
                  </a>
                  <AppButton
                    className="shrink-0"
                    variant="outline"
                    size="small"
                    onClick={handleCopyInvoiceURL}
                  >
                    <Copy className="size-4" />
                    {copied ? "Copied!" : "Copy URL"}
                  </AppButton>
                </div>
              </SheetLineItemCMS>
            )}
          </div>
          <div className="payment-details flex flex-col gap-2 p-3 border border-outline rounded-md">
            <h5 className="font-bodycopy font-bold text-sm">Payment Details</h5>
            <ReceiptLineItemCMS
              receiptName="Price"
              receiptValue={getRupiahCurrency(
                Math.round(Number(transactionDetails?.product_price))
              )}
            />
            {transactionDetails?.product_discount !== "0" && (
              <ReceiptLineItemCMS
                receiptName="Discount"
                receiptValue={`-${getRupiahCurrency(
                  Math.round(Number(transactionDetails?.product_discount))
                )}`}
                isDiscount
              />
            )}
            <ReceiptLineItemCMS
              receiptName="Admin Fee"
              receiptValue={getRupiahCurrency(
                Math.round(Number(transactionDetails?.product_admin_fee))
              )}
            />
            <ReceiptLineItemCMS
              receiptName="Value Added Tax"
              receiptValue={getRupiahCurrency(
                Math.round(Number(transactionDetails?.product_vat))
              )}
            />
            <hr className="border-t border-outline" />
            <ReceiptLineItemCMS
              receiptName="Total Amount"
              receiptValue={getRupiahCurrency(
                Math.round(Number(transactionDetails?.product_total_amount))
              )}
              isGrandTotal
            />
          </div>
        </div>
      )}
      {isPending && (
        <div className="cancel-invoice sticky bottom-0 w-full p-4 bg-white z-40">
          <AppButton
            className="w-full"
            variant="destructive"
            onClick={() => setIsOpenCancelConfirmation(true)}
            disabled={loadingCancelInvoice}
          >
            {loadingCancelInvoice && (
              <Loader2 className="animate-spin size-4" />
            )}
            Cancel Invoice
          </AppButton>
        </div>
      )}

      {/* Cancel Invoice Confirmation */}
      {isOpenCancelConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Cancel Invoice?"
          alertDialogMessage="Are you sure you want to cancel this invoice? This action cannot be undone."
          alertCancelLabel="Go Back"
          alertConfirmLabel="Cancel Invoice"
          isOpen={isOpenCancelConfirmation}
          onClose={() => setIsOpenCancelConfirmation(false)}
          onConfirm={() => {
            handleCancelation();
            setIsOpenCancelConfirmation(false);
          }}
        />
      )}
    </AppSheet>
  );
}
