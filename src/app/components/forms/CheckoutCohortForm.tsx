"use client";
import React, { useEffect, useMemo, useState } from "react";
import RadioBoxCheckoutPrice from "../fields/RadioBoxCheckoutPrice";
import AppButton from "../buttons/AppButton";
import { useRouter, useSearchParams } from "next/navigation";
import RadioBoxPaymentChannel from "../fields/RadioBoxPaymentChannel";
import { ChevronUp, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import PaymentChannelGroupCategory from "../titles/PaymentChannelGroupCategory";
import { RupiahCurrency } from "@/lib/rupiah-currency";
import Image from "next/image";
import InputCMS from "../fields/InputCMS";

interface PriceItem {
  id: number;
  name: string;
  amount: number;
  cohort_id: number;
}

interface CheckoutCohortFormProps {
  cohortName: string;
  cohortImage: string;
  initialUserName: string;
  initialUserEmail: string;
  initialUserPhone?: string;
  ticketListData: PriceItem[];
  paymentMethodData: any;
}
export default function CheckoutCohortForm({
  cohortName,
  cohortImage,
  initialUserName,
  initialUserEmail,
  initialUserPhone,
  ticketListData,
  paymentMethodData,
}: CheckoutCohortFormProps) {
  const [selectedPriceTierId, setSelectedPriceTierId] = useState(0);
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState("");
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketIdParams = searchParams.get("ticketId");

  // --- Beginning State
  const [formData, setFormData] = useState<{
    userFullName: string;
    userEmail: string;
    userPhoneNumber: string;
  }>({
    userFullName: initialUserName || "",
    userEmail: initialUserEmail || "",
    userPhoneNumber: initialUserPhone || "",
  });

  // --- Validating params ticketId based on Cohort Data
  const isValidTicketId = useMemo(() => {
    const ticketId = parseInt(ticketIdParams || "");
    return (
      !isNaN(ticketId) && ticketListData.some((item) => item.id === ticketId)
    );
  }, [ticketIdParams, ticketListData]);

  // --- Get Data from selected TicketId
  const selectedTicket = useMemo(() => {
    return ticketListData.find((item) => item.id === selectedPriceTierId);
  }, [selectedPriceTierId, ticketListData]);

  // --- Iterating selected ticket based on params ticketId
  useEffect(() => {
    if (isValidTicketId && ticketIdParams) {
      setSelectedPriceTierId(parseInt(ticketIdParams));
    }
  }, [isValidTicketId, ticketIdParams]);

  // --- Set default payment channel to BCA_VIRTUAL_ACCOUNT
  useEffect(() => {
    if (!selectedPaymentChannel && paymentMethodData?.length > 0) {
      const defaultVA = paymentMethodData.find(
        (item: any) => item.code === "BCA_VIRTUAL_ACCOUNT"
      );
      if (defaultVA) {
        setSelectedPaymentChannel("BCA_VIRTUAL_ACCOUNT");
      }
    }
  }, [paymentMethodData, selectedPaymentChannel]);

  // --- Handle Query Params ticketId
  const handleParamsQuery = () => {
    if (selectedPriceTierId !== 0) {
      setIsLoadingCheckout(true);
      router.push(`?ticketId=${selectedPriceTierId}`);
    }
  };
  useEffect(() => {
    setIsLoadingCheckout(false);
  }, [searchParams]);

  // --- Handle data changes
  const handleInputChange = (fieldName: string) => (value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Calculating price
  const totalItem = 1;
  const programPrice = selectedTicket?.amount || 0;
  const subtotal = totalItem * programPrice;
  const adminFee = 4000;
  const totalAmount = subtotal + adminFee;

  return (
    <React.Fragment>
      <div className="checkout-form relative flex flex-col min-h-full p-5 pb-36 bg-white">
        {!isValidTicketId ? (
          // Programs Tier Ticketing
          <div className="programs-tier flex flex-col gap-4 bg-white p-4 rounded-md shadow-sm z-10">
            <div className="flex flex-col font-ui">
              <h1 className="font-bold text-black text-lg">Programs Tier</h1>
              <p className="text-alternative text-sm">
                Get the most out of your learning. Choose the tier that suits
                you best.
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
                  selectedValue={selectedPriceTierId}
                  onChange={setSelectedPriceTierId}
                />
              ))}
            </div>
            <div className="button-cta pt-10">
              <AppButton
                size={"defaultRounded"}
                className="w-full"
                onClick={handleParamsQuery}
                disabled={isLoadingCheckout || selectedPriceTierId === 0}
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
          <div className="payment-details relative flex flex-col gap-8 z-10">
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
            {/* Personal Information */}
            <div className="payment-method flex flex-col gap-3">
              <h2 className="font-ui font-bold text-black text-lg">
                Personal Information
              </h2>
              <div className="flex flex-col gap-3">
                <InputCMS
                  inputId="user-full-name"
                  inputName="Full Name"
                  inputType="text"
                  inputPlaceholder="Name your program"
                  value={formData.userFullName}
                  onInputChange={handleInputChange("userFullName")}
                  required
                />
                <InputCMS
                  inputId="user-email"
                  inputName="Email"
                  inputType="email"
                  inputPlaceholder="Name your program"
                  value={formData.userEmail}
                  onInputChange={handleInputChange("userEmail")}
                  required
                />
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
                  {paymentMethodData
                    .filter((post: any) => post.method === "VIRTUAL_ACCOUNT")
                    .map((post: any, index: number) => (
                      <RadioBoxPaymentChannel
                        key={index}
                        paymentChannelName={post.label}
                        paymentIcon={post.image}
                        value={post.code}
                        selectedValue={selectedPaymentChannel}
                        onChange={setSelectedPaymentChannel}
                      />
                    ))}
                </PaymentChannelGroupCategory>
                <PaymentChannelGroupCategory groupPaymentName="E-Wallet">
                  {paymentMethodData
                    .filter((post: any) => post.method === "EWALLET")
                    .map((post: any, index: number) => (
                      <RadioBoxPaymentChannel
                        key={index}
                        paymentChannelName={post.label}
                        paymentIcon={post.image}
                        value={post.code}
                        selectedValue={selectedPaymentChannel}
                        onChange={setSelectedPaymentChannel}
                      />
                    ))}
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
                  <p className="font-ui text-alternative text-sm">
                    Total Amount
                  </p>
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

        {/* Footer */}
        <div className="footer flex items-center p-5 gap-1.5 mx-auto">
          <p className="font-ui font-medium text-xs text-alternative/60 truncate">
            PROTECTED AND POWERED BY
          </p>
          <Image
            className="object-contain h-[29px] w-auto"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//xendit-logo.png"
            }
            alt="Xendit"
            width={100}
            height={100}
          />
        </div>
      </div>

      {/* Floating CTA */}
      {isValidTicketId && (
        <div className="floating-cta sticky flex bg-white bottom-0 left-0 w-full justify-between p-5 border-t border-outline/50 z-40">
          <div className="flex flex-col font-ui text-black">
            <p className="text-sm">Total Amount</p>
            <p className="font-bold">{RupiahCurrency(totalAmount)}</p>
          </div>
          <AppButton>
            <ShieldCheck className="size-5" />
            Pay
          </AppButton>
        </div>
      )}
    </React.Fragment>
  );
}
