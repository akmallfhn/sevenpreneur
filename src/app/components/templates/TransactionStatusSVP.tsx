"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RupiahCurrency } from "@/lib/rupiah-currency";
import AppButton from "../buttons/AppButton";
import { ChevronDown, RefreshCcw, Timer } from "lucide-react";
import ReceiptLineItemSVP from "../items/ReceiptLineItemSVP";
import PaymentStatusAnimationSVP from "../labels/PaymentStatusAnimationSVP";

export default function TransactionStatusSVP() {
  const [openAmountDetails, setOpenAmountDetails] = useState(false);

  return (
    <div className="transaction-page relative flex flex-col pb-36 gap-1 bg-[#F9F9F9] lg:mx-auto lg:w-full lg:max-w-[960px] lg:gap-3 lg:flex-row lg:bg-white lg:pt-12 xl:max-w-[1208px]">
      <div className="flex flex-col gap-1 lg:flex-1 lg:gap-3">
        {/* Transaction Status */}
        <div className="transaction-status flex flex-col p-5 items-center gap-5 bg-white lg:border lg:border-outline lg:rounded-lg">
          <div className="status-guidance flex flex-col items-center text-center font-ui">
            <PaymentStatusAnimationSVP variant={"PENDING"} />
            <div className="flex flex-col items-center gap-2">
              <h2 className="font-bold text-black">Menunggu Pembayaran</h2>
              <p className="text-alternative text-sm">
                Complete your payment to prevent automatic cancellation.
              </p>
              <AppButton
                className="w-fit"
                variant="primaryLight"
                size="mediumRounded"
              >
                <RefreshCcw className="size-5" />
                Refresh Payment Status
              </AppButton>
            </div>
          </div>
          <div className="flex font-ui w-full items-center justify-between">
            <div className="flex flex-col text-sm">
              <p className="text-black font-bold">Make the payment before</p>
              <p className="text-alternative">12 Jan 2002 Pukul 12:45</p>
            </div>
            <div className="flex p-1 px-2 items-center gap-1 bg-secondary-light text-sm text-secondary rounded-full">
              <Timer className="size-4" />
              <p className="font-bold">20:04:05</p>
            </div>
          </div>
        </div>
        {/* Payment Method & Details*/}
        <div className="payment flex flex-col w-full bg-white p-5 lg:border lg:border-outline lg:rounded-lg">
          <div className="payment-channel flex items-center gap-3 pb-4">
            <div className="payment-image flex aspect-square w-8 h-8 rounded-full overflow-hidden">
              <Image
                className="object-cover w-full h-full"
                src={
                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/payment-icon/payment-mandiri.svg"
                }
                alt="Icon Payment"
                width={100}
                height={100}
              />
            </div>
            <p className="payment-channel-name font-ui font-[450px] text-black text-sm">
              BSI Virtual Account
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
                receiptName="Price"
                receiptValue={RupiahCurrency(10000000)}
              />
              <ReceiptLineItemSVP
                receiptName="Price"
                receiptValue={RupiahCurrency(10000000)}
              />
              <ReceiptLineItemSVP
                receiptName="Price"
                receiptValue={RupiahCurrency(10000000)}
              />
              <hr className="border-t-outline border-dashed" />
            </div>
          </div>
          <div
            className="payment-details flex items-center justify-between"
            onClick={() => setOpenAmountDetails(!openAmountDetails)}
          >
            <div className="amount flex flex-col font-ui text-black text-sm">
              <p>Total Amount</p>
              <p className="font-bold">Rp 1,800,000</p>
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
        {/* Program Metadata */}
        <div className="program-metadata flex w-full items-center gap-4 bg-white p-5 lg:border lg:border-outline lg:rounded-lg">
          <div className="program-image aspect-square size-16 rounded-md overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2aN-5V--yL4NOrcd_becVZJkBTc7T_EdYiw&s"
              }
              alt="Product Image"
              height={400}
              width={400}
            />
          </div>
          <div className="flex flex-col font-ui text-black max-w-[calc(100%-4rem-0.75rem)]">
            <p className="program-name font-bold line-clamp-2">
              TETR College of Business
            </p>
            <p className="program-price-tier text-sm line-clamp-1">
              Paket Intensive
            </p>
          </div>
        </div>
        {/* Transaction Metadata */}
        <div className="transaction-metadata flex flex-col gap-1 bg-white p-5 lg:border lg:border-outline lg:rounded-lg">
          <ReceiptLineItemSVP
            receiptName="Transaction ID"
            receiptValue={"bg435h9349g75"}
          />
          <ReceiptLineItemSVP
            receiptName="Invoice Number"
            receiptValue={"SVP-2384626813"}
          />
          <ReceiptLineItemSVP
            receiptName="Transaction Date"
            receiptValue={"2 Feb 2024 19:45"}
          />
          <ReceiptLineItemSVP
            receiptName="Customer Name"
            receiptValue={"Akmal Luthfiansyah"}
          />
        </div>

        {/* Support Helpdesk */}
        <div className="support-helpdesk flex gap-1 bg-white py-4 p-5 items-center justify-between lg:border lg:border-outline lg:rounded-lg">
          <div className="flex items-center gap-2">
            <div className="helpdesk-icon flex aspect-square size-[52px] overflow-hidden">
              <Image
                className="object-cover w-full h-full"
                src={
                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/customer-service-icon.svg"
                }
                alt="helpdesk-icon"
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col font-ui text-sm">
              <p className="font-bold text-black">Having Trouble?</p>
              <p className="text-alternative">We are ready to help you</p>
            </div>
          </div>
          <Link
            href={"https://wa.me/6285353533844"}
            target="_blank"
            rel="noopenner noreferrer"
          >
            <AppButton variant="primaryLight" size="smallRounded">
              Contact Us
            </AppButton>
          </Link>
        </div>

        {/* CTA */}
        <div className="flex flex-col p-5 pt-8 gap-3 items-center lg:mx-auto lg:flex-row-reverse">
          <AppButton size="defaultRounded" className="w-full lg:w-[240px]">
            Continue Payment
          </AppButton>
          <AppButton
            variant="semiDestructive"
            size="defaultRounded"
            className="w-full lg:w-[240px]"
          >
            Cancel Order
          </AppButton>
        </div>
      </div>
    </div>
  );
}
