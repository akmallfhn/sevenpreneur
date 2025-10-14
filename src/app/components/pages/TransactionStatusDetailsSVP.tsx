"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AppButton from "../buttons/AppButton";
import { ChevronDown, Loader2, RefreshCcw, Timer } from "lucide-react";
import ReceiptLineItemSVP from "../items/ReceiptLineItemSVP";
import PaymentStatusAnimationSVP from "../labels/PaymentStatusAnimationSVP";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { CancelPaymentXendit } from "@/lib/actions";
import { toast } from "sonner";
import AppAlertConfirmDialog from "../modals/AppAlertConfirmDialog";
import { useTheme } from "next-themes";
import { ProductCategory, TransactionStatus } from "@/lib/app-types";
import { useCountdownHours } from "@/lib/date-time-manipulation";
import { getRupiahCurrency } from "@/lib/currency";

const variantStyles: Record<
  TransactionStatus,
  {
    statusWord: string;
    statusDescription: string;
  }
> = {
  PAID: {
    statusWord: "Payment successful",
    statusDescription:
      "We've received your payment successfully. Welcome aboard, and enjoy your learning journey!",
  },
  PENDING: {
    statusWord: "Waiting for payment",
    statusDescription:
      "Complete your payment to prevent automatic cancellation.",
  },
  FAILED: {
    statusWord: "Payment canceled",
    statusDescription:
      "Your payment was either cancelled or the payment window has expired",
  },
};

interface TransactionStatusDetailsSVPProps {
  transactionId: string;
  transactionStatus: TransactionStatus;
  invoiceNumber: string;
  invoiceURL: string | undefined;
  productCategory: ProductCategory;
  productPrice: number;
  productDiscount: number;
  productAdminFee: number;
  productVAT: number;
  productTotalAmount: number;
  playlistId: number | undefined;
  playlistName: string | undefined;
  playlistImage: string | undefined;
  playlistSlug: string | undefined;
  playlistTotalVideo: number | undefined;
  cohortId: number | undefined;
  cohortName: string | undefined;
  cohortImage: string | undefined;
  cohortSlug: string | undefined;
  cohortPriceName: string | undefined;
  eventId: number | undefined;
  eventName: string | undefined;
  eventImage: string | undefined;
  eventSlug: string | undefined;
  eventPriceName: string | undefined;
  paymentChannelName: string | undefined;
  paymentChannelImage: string | undefined;
  userName: string;
  createTransactionAt: string;
  paidTransactionAt: string | undefined;
}

export default function TransactionStatusDetailsSVP({
  transactionId,
  transactionStatus,
  invoiceNumber,
  invoiceURL,
  productCategory,
  productPrice,
  productDiscount,
  productAdminFee,
  productVAT,
  productTotalAmount,
  playlistId,
  playlistName,
  playlistImage,
  playlistSlug,
  playlistTotalVideo,
  cohortId,
  cohortName,
  cohortImage,
  cohortSlug,
  cohortPriceName,
  eventId,
  eventName,
  eventImage,
  eventSlug,
  eventPriceName,
  paymentChannelName,
  paymentChannelImage,
  userName,
  createTransactionAt,
  paidTransactionAt,
}: TransactionStatusDetailsSVPProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [openAmountDetails, setOpenAmountDetails] = useState(false);
  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [loadingCancelation, setLoadingCancelation] = useState(false);
  const [isOpenCancelConfirmation, setIsOpenCancelConfirmation] =
    useState(false);
  const { statusWord, statusDescription } = variantStyles[transactionStatus];
  const isPaid = transactionStatus === "PAID";
  const isPending = transactionStatus === "PENDING";
  const isFailed = transactionStatus === "FAILED";
  const isCohort = productCategory === "COHORT";
  const isPlaylist = productCategory === "PLAYLIST";
  const isEvent = productCategory === "EVENT";

  // Refresh data without full page reload
  const handleRefresh = () => {
    setLoadingRefresh(true);
    router.refresh();
    setTimeout(() => {
      setLoadingRefresh(false);
    }, 600);
  };

  // Set Max Payment Deadline
  const paymentDeadline = dayjs(createTransactionAt).add(12, "hour");
  const countdown = useCountdownHours(paymentDeadline);

  // Cancel Payment on Xendit
  const handleCancelation = async () => {
    if (!transactionId) {
      toast.error("The transaction could not be found");
      return;
    }
    setLoadingCancelation(true);
    try {
      const cancelPayment = await CancelPaymentXendit({
        transactionId,
      });
      if (cancelPayment.code === "NO_CONTENT") {
        router.refresh();
      } else {
        toast.error("Cancellation failed. Please try again");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during cancellation");
    } finally {
      setLoadingCancelation(false);
    }
  };

  // Product Conditional Rendering
  let productImage =
    "https://www.jport.co/Editor/image/4721055615600659_empty.png";
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
    <React.Fragment>
      <div className="transaction-page relative flex flex-col pb-36 gap-1 bg-[#F9F9F9] dark:bg-coal-black lg:mx-auto lg:w-full lg:max-w-[960px] lg:gap-3 lg:flex-row lg:bg-white lg:pt-12 xl:max-w-[1208px]">
        <div className="flex flex-col gap-1 lg:flex-1 lg:gap-3">
          {/* Transaction Status */}
          <div className="transaction-status flex flex-col p-5 items-center gap-5 bg-white dark:bg-surface-black lg:border lg:border-outline lg:dark:border-outline-dark lg:rounded-lg">
            <div className="status-guidance flex flex-col items-center text-center font-ui">
              <PaymentStatusAnimationSVP variant={transactionStatus} />
              <div className="flex flex-col items-center gap-2">
                <h2 className="font-bold">{statusWord}</h2>
                <p className="text-alternative text-sm">{statusDescription}</p>
                <AppButton
                  className="w-fit"
                  variant={theme === "dark" ? "surfaceDark" : "primaryLight"}
                  size="mediumRounded"
                  onClick={handleRefresh}
                >
                  <RefreshCcw
                    className={`size-5 ${loadingRefresh ? "animate-spin" : ""}`}
                  />
                  Refresh Payment Status
                </AppButton>
              </div>
            </div>
            {transactionStatus !== "FAILED" && (
              <div
                className={`flex font-ui w-full items-center ${
                  isPaid ? "justify-center" : "justify-between"
                }`}
              >
                <div className="flex flex-col text-sm">
                  <p className="font-bold">
                    {isPaid && "Payment received on"}
                    {isPending && "Make the payment before"}
                  </p>
                  <p className="payment-deadline text-alternative">
                    {isPaid &&
                      dayjs(paidTransactionAt).format("DD MMM YYYY [at] HH:mm")}
                    {isPending &&
                      paymentDeadline.format("DD MMM YYYY [at] HH:mm")}
                  </p>
                </div>
                {isPending && (
                  <div className="flex p-1 px-2 items-center gap-1 bg-secondary-light text-sm text-secondary rounded-full dark:bg-[#2C0D17]">
                    <Timer className="size-4" />
                    <p className="font-bold">{countdown}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Payment Method & Details*/}
          <div className="payment flex flex-col w-full bg-white p-5 dark:bg-surface-black lg:border lg:border-outline lg:dark:border-outline-dark lg:rounded-lg">
            <div className="payment-channel flex items-center gap-3 pb-4">
              <div className="payment-image flex aspect-square w-8 h-8 rounded-full overflow-hidden">
                <Image
                  className="object-cover w-full h-full"
                  src={
                    paymentChannelImage ||
                    "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/payment-icon/payment-mandiri.svg"
                  }
                  alt="Icon Payment"
                  width={100}
                  height={100}
                />
              </div>
              <p className="payment-channel-name font-ui font-[450px] text-sm">
                {paymentChannelName}
              </p>
            </div>
            <div
              className={`amount-details-wrapper overflow-hidden transition-all duration-500 ease-in-out ${
                openAmountDetails
                  ? "max-h-96 opacity-100 pb-4"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="amount-details flex flex-col gap-2">
                <ReceiptLineItemSVP
                  receiptName="Program Price"
                  receiptValue={getRupiahCurrency(productPrice)}
                />
                {productDiscount !== 0 && (
                  <ReceiptLineItemSVP
                    receiptName="Discount"
                    receiptValue={`-${getRupiahCurrency(
                      Math.round(productDiscount)
                    )}`}
                    isDiscount
                  />
                )}
                <ReceiptLineItemSVP
                  receiptName="Admin Fee"
                  receiptValue={getRupiahCurrency(Math.round(productAdminFee))}
                />
                <ReceiptLineItemSVP
                  receiptName="VAT"
                  receiptValue={getRupiahCurrency(Math.round(productVAT))}
                />
                <hr className="border-t border-outline border-dashed dark:border-outline-dark" />
              </div>
            </div>
            <div
              className="payment-details flex items-center justify-between"
              onClick={() => setOpenAmountDetails(!openAmountDetails)}
            >
              <div className="amount flex flex-col font-ui text-sm">
                <p>Total Amount</p>
                <p className="font-bold">
                  {getRupiahCurrency(Math.round(productTotalAmount))}
                </p>
              </div>
              <ChevronDown
                className={`text-alternative size-6 transition-transform duration-300 ${
                  openAmountDetails ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 lg:flex-2 lg:gap-3">
          {/* Product Metadata */}
          <div className="product-metadata flex w-full items-center gap-4 bg-white p-5 dark:bg-surface-black lg:border lg:border-outline lg:rounded-lg lg:dark:border-outline-dark">
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
              <p className="product-name font-bold line-clamp-2">
                {productName}
              </p>
              <p className="product-tier text-sm line-clamp-1">{productTier}</p>
            </div>
          </div>
          {/* Transaction Metadata */}
          <div className="transaction-metadata flex flex-col gap-1 bg-white p-5 dark:bg-surface-black lg:border lg:border-outline lg:rounded-lg lg:dark:border-outline-dark">
            <ReceiptLineItemSVP
              receiptName="Transaction ID"
              receiptValue={transactionId}
            />
            <ReceiptLineItemSVP
              receiptName="Invoice Number"
              receiptValue={invoiceNumber}
            />
            <ReceiptLineItemSVP
              receiptName="Transaction Date"
              receiptValue={dayjs(createTransactionAt).format(
                "DD MMM YYYY HH:mm"
              )}
            />
            <ReceiptLineItemSVP
              receiptName="Customer Name"
              receiptValue={userName}
            />
          </div>

          {/* Support Helpdesk */}
          <div className="support-helpdesk flex gap-1 bg-white py-4 p-5 items-center justify-between dark:bg-surface-black lg:border lg:border-outline lg:rounded-lg lg:dark:border-outline-dark">
            <div className="flex items-center gap-2">
              <div className="helpdesk-icon flex aspect-square size-[52px] overflow-hidden">
                <Image
                  className="object-cover w-full h-full"
                  src={
                    "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//customer-service-icon.svg"
                  }
                  alt="helpdesk-icon"
                  width={100}
                  height={100}
                />
              </div>
              <div className="flex flex-col font-ui text-sm">
                <p className="font-bold">Having Trouble?</p>
                <p className="text-alternative">We are ready to help you</p>
              </div>
            </div>
            <Link
              href={"https://wa.me/6285353533844"}
              target="_blank"
              rel="noopenner noreferrer"
            >
              <AppButton
                variant={theme === "dark" ? "surfaceDark" : "primaryLight"}
                size="smallRounded"
              >
                Contact Us
              </AppButton>
            </Link>
          </div>

          {/* CTA */}
          <div className="flex flex-col p-5 pt-8 gap-3 items-center lg:mx-auto lg:flex-row-reverse">
            {isPending && (
              <>
                <a
                  href={invoiceURL}
                  target="_blank"
                  rel="noopenner noreferrer"
                  className="w-full lg:w-[240px]"
                >
                  <AppButton
                    size="defaultRounded"
                    className="w-full lg:w-[240px]"
                    featureName="continue_payment"
                    featurePagePoint="Transaction Details Page"
                  >
                    Continue Payment
                  </AppButton>
                </a>
                <AppButton
                  variant="semiDestructive"
                  size="defaultRounded"
                  className="w-full lg:w-[240px]"
                  onClick={() => setIsOpenCancelConfirmation(true)}
                  disabled={loadingCancelation}
                  featureName="cancel_payment_initiated"
                  featurePagePoint="Transaction Details Page"
                >
                  {loadingCancelation && (
                    <Loader2 className="animate-spin size-5" />
                  )}
                  Cancel Order
                </AppButton>
              </>
            )}
            {isFailed && (
              <Link href={productPage}>
                <AppButton
                  size="defaultRounded"
                  className="w-full lg:w-[240px]"
                  featureName="retry_payment"
                  featurePagePoint="Transaction Details Page"
                >
                  Retry Payment
                </AppButton>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation */}
      {isOpenCancelConfirmation && (
        <AppAlertConfirmDialog
          alertDialogHeader="Cancel Payment?"
          alertDialogMessage="Are you sure you want to cancel this payment? This action cannot be undone."
          alertCancelLabel="Go Back"
          alertConfirmLabel="Cancel Payment"
          isOpen={isOpenCancelConfirmation}
          onClose={() => setIsOpenCancelConfirmation(false)}
          onConfirm={() => {
            handleCancelation();
            setIsOpenCancelConfirmation(false);
          }}
        />
      )}
    </React.Fragment>
  );
}
