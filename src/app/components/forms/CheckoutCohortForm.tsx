"use client";
import { useEffect, useMemo, useState } from "react";
import RadioBoxCheckoutPrice from "../fields/RadioBoxCheckoutPrice";
import AppButton from "../buttons/AppButton";
import { useRouter, useSearchParams } from "next/navigation";
import RadioBoxPaymentChannel from "../fields/RadioBoxPaymentChannel";
import { ChevronUp, CreditCard, Loader2 } from "lucide-react";
import PaymentChannelGroupCategory from "../titles/PaymentChannelGroupCategory";
import { RupiahCurrency } from "@/lib/rupiah-currency";
import Image from "next/image";

interface PriceItem {
  id: number;
  name: string;
  amount: number;
  cohort_id: number;
}

interface CheckoutCohortFormProps {
  cohortName: string;
  cohortImage: string;
  ticketListData: PriceItem[];
}
export default function CheckoutCohortForm({
  cohortName,
  cohortImage,
  ticketListData,
}: CheckoutCohortFormProps) {
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState("");
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketIdParams = searchParams.get("ticketId");

  // --- Validating Params ticketId
  const isValidTicketId = useMemo(() => {
    const ticketId = parseInt(ticketIdParams || "");
    return (
      !isNaN(ticketId) && ticketListData.some((item) => item.id === ticketId)
    );
  }, [ticketIdParams, ticketListData]);

  // --- Get Data from selected id Ticket
  const selectedTicket = useMemo(() => {
    return ticketListData.find((item) => item.id === selectedPrice);
  }, [selectedPrice, ticketListData]);

  // --- Iterating Radio Button based on ticketId
  useEffect(() => {
    if (isValidTicketId && ticketIdParams) {
      setSelectedPrice(parseInt(ticketIdParams));
    }
  }, [isValidTicketId, ticketIdParams]);

  // --- Handle Query Params ticketId
  const handleParamsQuery = () => {
    if (selectedPrice !== 0) {
      setIsLoadingCheckout(true);
      router.push(`?ticketId=${selectedPrice}`);
    }
  };
  useEffect(() => {
    setIsLoadingCheckout(false);
  }, [searchParams]);

  // Calculating price
  const totalItem = 1;
  const programPrice = 19000000;
  const subtotal = totalItem * programPrice;
  const adminFee = 4000;
  const totalAmount = subtotal + adminFee;

  return (
    <div className="checkout-form relative flex flex-col p-5 h-screen">
      {!isValidTicketId ? (
        // Programs Tier Ticketing
        <div className="programs-tier flex flex-col gap-4 bg-white p-4 rounded-md shadow-sm z-10">
          <div className="flex flex-col font-ui">
            <h1 className="font-bold text-black text-lg">Programs Tier</h1>
            <p className="text-alternative text-sm">
              Get the most out of your learning. Choose the tier that suits you
              best.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {ticketListData.map((post, index) => (
              <RadioBoxCheckoutPrice
                key={index}
                radioName={post.name}
                radioCohortName={cohortName}
                radioPrice={post.amount}
                value={post.id}
                selectedValue={selectedPrice}
                onChange={setSelectedPrice}
              />
            ))}
          </div>
          <div className="pt-10">
            <AppButton
              size={"defaultRounded"}
              className="w-full"
              onClick={handleParamsQuery}
              disabled={isLoadingCheckout}
            >
              {isLoadingCheckout ? (
                <Loader2 className="animate-spin size-5" />
              ) : (
                <CreditCard className="size-5" />
              )}
              Proceed to Checkout
            </AppButton>
          </div>
        </div>
      ) : (
        // Payment Details
        <div className="payment-details flex flex-col gap-8 z-10">
          {/* Payment Summary */}
          <div className="flex gap-3 p-4 bg-white items-center rounded-md shadow-sm">
            <div className="aspect-square size-16 rounded-md overflow-hidden">
              <Image
                className="object-cover w-full h-full"
                src={cohortImage}
                alt={cohortName}
                height={400}
                width={400}
              />
            </div>
            <div className="flex flex-col font-ui max-w-[calc(100%-4rem-0.75rem)]">
              <p className="font-bold text-black line-clamp-1">
                {selectedTicket?.name || "-"}
              </p>
              <p className="text-alternative text-sm font-medium line-clamp-2">
                {cohortName}
              </p>
            </div>
          </div>
          {/* Payment Method */}
          <div className="payment-method flex flex-col gap-3">
            <h1 className="font-ui font-bold text-black text-lg">
              Payment Method
            </h1>
            <div className="flex flex-col gap-5">
              <PaymentChannelGroupCategory
                groupPaymentName="Bank Virtual Account"
                defaultState
              >
                <RadioBoxPaymentChannel
                  value={"BNI_ACC"}
                  selectedValue={selectedPaymentChannel}
                  onChange={setSelectedPaymentChannel}
                />
                <RadioBoxPaymentChannel
                  value={"BCA_B"}
                  selectedValue={selectedPaymentChannel}
                  onChange={setSelectedPaymentChannel}
                />
                <RadioBoxPaymentChannel
                  value={"BRICS_B"}
                  selectedValue={selectedPaymentChannel}
                  onChange={setSelectedPaymentChannel}
                />
              </PaymentChannelGroupCategory>
              <PaymentChannelGroupCategory groupPaymentName="E-Wallet">
                <RadioBoxPaymentChannel
                  value={"BSI_ACC"}
                  selectedValue={selectedPaymentChannel}
                  onChange={setSelectedPaymentChannel}
                />
                <RadioBoxPaymentChannel
                  value={"BJG_B"}
                  selectedValue={selectedPaymentChannel}
                  onChange={setSelectedPaymentChannel}
                />
                <RadioBoxPaymentChannel
                  value={"BJB_B"}
                  selectedValue={selectedPaymentChannel}
                  onChange={setSelectedPaymentChannel}
                />
              </PaymentChannelGroupCategory>
            </div>
          </div>

          {/* Payment Details */}
          <div className="payment-details flex flex-col gap-3">
            <h1 className="font-ui font-bold text-black text-lg">
              Payment Details
            </h1>
            <div className="calculation-price flex flex-col gap-2">
              <div className="payment-item flex items-center justify-between">
                <p className="font-ui text-alternative text-sm">Total Item</p>
                <p className="font-ui font-medium text-black text-sm text-right">
                  {totalItem}
                </p>
              </div>
              <div className="payment-item flex items-center justify-between">
                <p className="font-ui text-alternative text-sm">
                  Program Price
                </p>
                <p className="font-ui font-medium text-black text-sm text-right">
                  {RupiahCurrency(programPrice)}
                </p>
              </div>
              <hr className="border-t-outline border-dashed" />
              <div className="payment-item flex items-center justify-between">
                <p className="font-ui text-alternative text-sm">Subtotal</p>
                <p className="font-ui font-medium text-black text-sm text-right">
                  {RupiahCurrency(subtotal)}
                </p>
              </div>
              <div className="payment-item flex items-center justify-between">
                <p className="font-ui text-alternative text-sm">Admin Fee</p>
                <p className="font-ui font-medium text-black text-sm text-right">
                  {RupiahCurrency(adminFee)}
                </p>
              </div>
              <hr className="border-t-outline border-dashed" />
              <div className="payment-item flex items-center justify-between">
                <p className="font-ui text-alternative text-sm">Total Amount</p>
                <p className="font-ui font-medium text-black text-sm text-right">
                  {RupiahCurrency(totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-[78px] bg-linear-to-r from-0% from-primary to-100% to-primary-deep" />
    </div>
  );
}
