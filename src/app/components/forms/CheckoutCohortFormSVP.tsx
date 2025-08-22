"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { rupiahCurrency } from "@/lib/rupiah-currency";
import { toSnakeCase } from "@/lib/snake-case";
import { MakePaymentCohortXendit } from "@/lib/actions";
import { toast } from "sonner";
import AppButton from "../buttons/AppButton";
import InputSVP from "../fields/InputSVP";
import RadioBoxProgramTierSVP from "../fields/RadioBoxProgramTierSVP";
import RadioBoxPaymentChannelSVP from "../fields/RadioBoxPaymentChannelSVP";
import PaymentChannelGroupSVP from "../titles/PaymentChannelGroupSVP";
import InternationalPhoneNumberInputSVP from "../fields/InternationalPhoneNumberInputSVP";
import ReceiptLineItemSVP from "../items/ReceiptLineItemSVP";
import ApplyDiscountGatewaySVP from "../gateways/ApplyDiscountGatewaySVP";
import ApplyDiscountModalSVP from "../modals/ApplyDiscountModalSVP";
import AppliedDiscountCardSVP from "../items/AppliedDiscountCardSVP";
import { DiscountType, PaymentMethodItem } from "./CheckoutPlaylistFormSVP";

interface PriceItem {
  id: number;
  name: string;
  amount: number;
  cohort_id: number;
}

interface CheckoutCohortFormSVPProps {
  cohortId: number;
  cohortName: string;
  cohortImage: string;
  initialUserName: string;
  initialUserEmail: string;
  initialUserPhone: string | null;
  ticketListData: PriceItem[];
  paymentMethodData: PaymentMethodItem[];
}

export default function CheckoutCohortFormSVP({
  cohortId,
  cohortName,
  cohortImage,
  initialUserName,
  initialUserEmail,
  initialUserPhone,
  ticketListData,
  paymentMethodData,
}: CheckoutCohortFormSVPProps) {
  const [selectedPriceTierId, setSelectedPriceTierId] = useState(0);
  const [selectedPaymentChannel, setSelectedPaymentChannel] = useState("");
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [openDiscount, setOpenDiscount] = useState(false);
  const [discount, setDiscount] = useState<DiscountType | null>(null);
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
  // --- ticketId not included on Cohort Data will be fallback to Programs Tier Form
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

  // --- Set default payment channel to MANDIRI
  const defaultPaymentChannel = useMemo(() => {
    return (
      paymentMethodData.find((item) => item.code === "MANDIRI")?.code ?? ""
    );
  }, [paymentMethodData]);
  useEffect(() => {
    if (!selectedPaymentChannel && defaultPaymentChannel) {
      setSelectedPaymentChannel(defaultPaymentChannel);
    }
  }, [defaultPaymentChannel, selectedPaymentChannel]);

  // --- Handle Query Params ticketId
  const handleParamsQuery = () => {
    if (
      selectedPriceTierId !== 0 &&
      ticketIdParams !== String(selectedPriceTierId)
    ) {
      setIsLoadingCheckout(true);
      router.replace(`?ticketId=${selectedPriceTierId}`);
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

  // --- Get Data from Chosen Payment Channel
  const chosenPaymentChannelData = useMemo(() => {
    return paymentMethodData.find(
      (item: PaymentMethodItem) => item.code === selectedPaymentChannel
    );
  }, [selectedPaymentChannel, paymentMethodData]);

  // --- Calculating price
  const totalItem = 1;
  const programPrice = selectedTicket?.amount || 0;
  let subtotal = totalItem * programPrice;
  if (discount?.calc_percent) {
    const discountRate = discount.calc_percent / 100;
    subtotal = Math.round(totalItem * programPrice * (1 - discountRate));
  }
  const vatRate = 0.11;
  const paymentCalculation = useMemo(() => {
    if (!chosenPaymentChannelData) {
      return { adminFee: 0, valueAddedTax: 0, totalAmount: 0 };
    }

    if (
      chosenPaymentChannelData.calc_flat === 0 &&
      chosenPaymentChannelData.calc_percent > 0
    ) {
      const percentRate = chosenPaymentChannelData.calc_percent / 100;
      if (chosenPaymentChannelData.calc_vat) {
        const total = Math.round(subtotal / (1 - percentRate * (1 + vatRate)));
        const fee = Math.round(percentRate * total);
        const tax = Math.round(vatRate * fee);
        return { adminFee: fee, valueAddedTax: tax, totalAmount: total };
      } else {
        const total = Math.round(subtotal / (1 - percentRate));
        const fee = Math.round(percentRate * total);
        return { adminFee: fee, valueAddedTax: 0, totalAmount: total };
      }
    } else if (
      chosenPaymentChannelData.calc_flat > 0 &&
      chosenPaymentChannelData.calc_percent === 0
    ) {
      const flatFee = chosenPaymentChannelData.calc_flat;
      const tax = flatFee * vatRate;
      const total = subtotal + flatFee + tax;
      return { adminFee: flatFee, valueAddedTax: tax, totalAmount: total };
    } else if (
      chosenPaymentChannelData.calc_flat > 0 &&
      chosenPaymentChannelData.calc_percent > 0
    ) {
      const percentRate = chosenPaymentChannelData.calc_percent / 100;
      const flatFee = chosenPaymentChannelData.calc_flat;
      const total = Math.round(
        (subtotal + flatFee * (1 + vatRate)) / (1 - percentRate * (1 + vatRate))
      );
      const percentFee = percentRate * total;
      const allFee = Math.round(flatFee + percentFee);
      const tax = Math.round(allFee * vatRate);
      return { adminFee: allFee, valueAddedTax: tax, totalAmount: total };
    }

    return { adminFee: 0, valueAddedTax: 0, totalAmount: subtotal };
  }, [chosenPaymentChannelData, subtotal]);

  // --- Make Payment on Xendit
  const handlePayment = async () => {
    setIsLoadingPayment(true);

    // -- Validation
    if (!formData.userPhoneNumber) {
      toast.error("Phone number is required before making a payment");
      setIsLoadingPayment(false);
      return;
    }
    if (!selectedTicket?.id || !chosenPaymentChannelData?.id) {
      toast.error("Please select a ticket or a payment method first");
      return;
    }

    // -- Call tRPC Payment
    try {
      const makePayment = await MakePaymentCohortXendit({
        // Mandatory fields
        cohortPriceId: selectedTicket.id,
        paymentChannelId: chosenPaymentChannelData.id,
        phoneNumber: formData.userPhoneNumber.trim(),

        // Optional fields
        discountCode: discount?.code,
      });
      if (makePayment.status === 200) {
        window.open(makePayment.invoice_url, "_blank");
        router.replace(`/transactions/${makePayment.transaction_id}`);
      } else {
        toast.error("Failed to create invoice", {
          description: makePayment.message,
        });
      }
    } catch (error) {
      console.error("Error during payment:", error);
      toast.error("Unexpected error occurred during payment.");
    } finally {
      setIsLoadingPayment(false);
    }
  };

  return (
    <React.Fragment>
      <div className="checkout-form relative flex flex-col min-h-full pb-36 bg-[#F9F9F9] dark:bg-[#121212]">
        {!isValidTicketId ? (
          // Programs Tier Ticketing
          <div className="programs-tier-box flex p-5 pt-8">
            <div className="programs-tier flex flex-col gap-4 bg-white p-4 rounded-md shadow-sm z-10">
              <div className="flex flex-col font-bodycopy">
                <h1 className="font-bold text-black">Programs Tier</h1>
                <p className="text-alternative text-sm">
                  Get the most out of your learning. Choose the tier that suits
                  you best.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {ticketListData.map((post, index) => (
                  <RadioBoxProgramTierSVP
                    key={index}
                    programTierName={post.name}
                    programTierCohortName={cohortName}
                    programTierPrice={post.amount}
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
                  featureName="checkout_price_cohort"
                  featureItem={toSnakeCase(cohortName)}
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
          </div>
        ) : (
          // Payment Details
          <div className="payment-details relative flex flex-col gap-1 z-10">
            {/* Payment Summary */}
            <div className="payment-summary flex gap-3 p-4 m-5 mb-0 bg-white items-center rounded-md shadow-sm dark:bg-surface-black dark:border-outline-dark">
              <div className="aspect-square size-16 rounded-md overflow-hidden">
                <Image
                  className="object-cover w-full h-full"
                  src={cohortImage}
                  alt={cohortName}
                  height={400}
                  width={400}
                />
              </div>
              <div className="flex flex-col font-bodycopy max-w-[calc(100%-4rem-0.75rem)]">
                <p className="font-bold line-clamp-1">
                  {selectedTicket?.name || "-"}
                </p>
                <p className="text-alternative text-sm font-medium line-clamp-2">
                  {cohortName}
                </p>
              </div>
            </div>
            {/* Personal Information */}
            <div className="payment-method flex flex-col gap-3 bg-white p-5 dark:bg-coal-black">
              <h2 className="font-bodycopy font-bold">Personal Information</h2>
              <div className="flex flex-col gap-3">
                <InputSVP
                  inputId="user-full-name"
                  inputName="Full Name"
                  inputType="text"
                  value={initialUserName}
                  disabled
                />
                <InputSVP
                  inputId="user-email"
                  inputName="Email"
                  inputType="email"
                  value={initialUserEmail}
                  disabled
                />
                <InternationalPhoneNumberInputSVP
                  inputId="user-phone-number"
                  inputName="Phone Number"
                  inputIcon="🇮🇩"
                  inputCountryCode="62"
                  inputPlaceholder="Enter Mobile or WhatsApp number"
                  value={formData.userPhoneNumber}
                  onInputChange={handleInputChange("userPhoneNumber")}
                  required
                />
              </div>
            </div>
            {/* Payment Method */}
            <div className="payment-method flex flex-col gap-3 bg-white p-5 dark:bg-coal-black">
              <h1 className="font-bodycopy font-bold">Payment Method</h1>
              <div className="flex flex-col gap-5">
                <PaymentChannelGroupSVP
                  groupPaymentName="Bank Virtual Account"
                  defaultState
                >
                  {paymentMethodData
                    .filter(
                      (post: PaymentMethodItem) =>
                        post.method === "BANK_TRANSFER"
                    )
                    .map((post: PaymentMethodItem, index: number) => (
                      <RadioBoxPaymentChannelSVP
                        key={index}
                        paymentChannelName={post.label}
                        paymentIcon={post.image}
                        value={post.code}
                        selectedValue={selectedPaymentChannel}
                        onChange={setSelectedPaymentChannel}
                      />
                    ))}
                </PaymentChannelGroupSVP>
                <PaymentChannelGroupSVP groupPaymentName="Instant Payment">
                  {paymentMethodData
                    .filter(
                      (post: PaymentMethodItem) => post.method === "QR_CODE"
                    )
                    .map((post: PaymentMethodItem, index: number) => (
                      <RadioBoxPaymentChannelSVP
                        key={index}
                        paymentChannelName={post.label}
                        paymentIcon={post.image}
                        value={post.code}
                        selectedValue={selectedPaymentChannel}
                        onChange={setSelectedPaymentChannel}
                      />
                    ))}
                </PaymentChannelGroupSVP>
                <PaymentChannelGroupSVP groupPaymentName="E-Wallet">
                  {paymentMethodData
                    .filter(
                      (post: PaymentMethodItem) => post.method === "EWALLET"
                    )
                    .map((post: PaymentMethodItem, index: number) => (
                      <RadioBoxPaymentChannelSVP
                        key={index}
                        paymentChannelName={post.label}
                        paymentIcon={post.image}
                        value={post.code}
                        selectedValue={selectedPaymentChannel}
                        onChange={setSelectedPaymentChannel}
                      />
                    ))}
                </PaymentChannelGroupSVP>
                {/* <PaymentChannelGroupSVP groupPaymentName="Credit Card">
                  {paymentMethodData
                    .filter(
                      (post: PaymentMethodItem) => post.method === "CREDIT_CARD"
                    )
                    .map((post: PaymentMethodItem, index: number) => (
                      <RadioBoxPaymentChannelSVP
                        key={index}
                        paymentChannelName={post.label}
                        paymentIcon={post.image}
                        value={post.code}
                        selectedValue={selectedPaymentChannel}
                        onChange={setSelectedPaymentChannel}
                      />
                    ))}
                </PaymentChannelGroupSVP> */}
                <PaymentChannelGroupSVP groupPaymentName="Paylater">
                  {paymentMethodData
                    .filter(
                      (post: PaymentMethodItem) => post.method === "PAYLATER"
                    )
                    .map((post: PaymentMethodItem, index: number) => (
                      <RadioBoxPaymentChannelSVP
                        key={index}
                        paymentChannelName={post.label}
                        paymentIcon={post.image}
                        value={post.code}
                        selectedValue={selectedPaymentChannel}
                        onChange={setSelectedPaymentChannel}
                      />
                    ))}
                </PaymentChannelGroupSVP>
              </div>
            </div>

            {/* Promo Discount */}
            <div className="discount-promo flex bg-white p-5 dark:bg-coal-black">
              {/* Discount Gateway */}
              {!discount && (
                <ApplyDiscountGatewaySVP
                  onClick={() => setOpenDiscount(true)}
                />
              )}
              {/* Applied Discount */}
              {discount && (
                <AppliedDiscountCardSVP
                  discountName={discount.name || ""}
                  discountRate={discount.calc_percent || 0}
                  discountCode={discount.code || ""}
                  onClose={() => setDiscount(null)}
                />
              )}
            </div>

            {/* Payment Details */}
            <div className="payment-details flex flex-col gap-2 bg-white p-5 dark:bg-coal-black">
              <h1 className="font-bodycopy font-bold">Payment Details</h1>
              <div className="calculation-price flex flex-col gap-2">
                <ReceiptLineItemSVP
                  receiptName="Payment Method"
                  receiptValue={chosenPaymentChannelData?.label}
                />
                <ReceiptLineItemSVP
                  receiptName="Program Price"
                  receiptValue={rupiahCurrency(programPrice)}
                />
                {discount?.calc_percent && (
                  <ReceiptLineItemSVP
                    receiptName={`Discount (${discount.calc_percent}%)`}
                    receiptValue={`- ${rupiahCurrency(
                      Math.round(programPrice - subtotal)
                    )}`}
                    isDiscount
                  />
                )}
                <hr className="border-t-1 border-outline border-dashed dark:border-outline-dark" />
                <ReceiptLineItemSVP
                  receiptName="Subtotal"
                  receiptValue={rupiahCurrency(subtotal)}
                />
                <ReceiptLineItemSVP
                  receiptName="Admin Fee"
                  receiptValue={rupiahCurrency(paymentCalculation.adminFee)}
                />
                <ReceiptLineItemSVP
                  receiptName="VAT"
                  receiptValue={rupiahCurrency(
                    paymentCalculation.valueAddedTax
                  )}
                />
                <hr className="border-t-1 border-outline border-dashed dark:border-outline-dark" />
                <ReceiptLineItemSVP
                  receiptName="Total Amount"
                  receiptValue={rupiahCurrency(paymentCalculation.totalAmount)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Background */}
        <div className="absolute top-0 left-0 w-full h-[78px] bg-linear-to-r from-0% from-primary to-100% to-primary-deep" />
        <div className="absolute top-[78px] left-0 w-full h-[78px] bg-white dark:bg-coal-black" />

        {/* Footer */}
        <div className="footer-box flex p-5">
          <div className="footer-container flex w-full items-center p-3 gap-1.5 bg-white border border-outline rounded-md dark:bg-surface-black dark:border-outline-dark">
            <div className="flex aspect-square size-10">
              <Image
                className="object-cover w-full h-full"
                src={
                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/safety-payment-icon.svg"
                }
                alt="Xendit"
                width={100}
                height={100}
              />
            </div>
            <p className="font-bodycopy text-xs text-alternative">
              Payment is securely processed with advanced encryption. Powered by{" "}
              {""}
              <a href="https://www.xendit.co/id/" className="font-bold">
                Xendit,
              </a>{" "}
              a trusted payment infrastructure across Southeast Asia.
            </p>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      {isValidTicketId && (
        <div className="floating-cta fixed flex bg-white bottom-0 left-0 w-full justify-between p-5 border-t border-outline/50 z-40 dark:bg-surface-black dark:border-outline-dark">
          <div className="flex flex-col font-bodycopy">
            <p className="text-sm">Total Amount</p>
            <p className="font-bold">
              {rupiahCurrency(paymentCalculation.totalAmount)}
            </p>
          </div>
          <AppButton
            onClick={handlePayment}
            disabled={isLoadingPayment}
            featureName="payment_cohort"
            featureItem={toSnakeCase(cohortName)}
          >
            {isLoadingPayment ? (
              <Loader2 className="animate-spin size-5" />
            ) : (
              <ShieldCheck className="size-5" />
            )}
            Pay Now
          </AppButton>
        </div>
      )}

      {/* Modal Discount */}
      <ApplyDiscountModalSVP
        cohortId={selectedTicket?.id}
        isOpen={openDiscount}
        onClose={() => setOpenDiscount(false)}
        onApplyDiscount={(discountData) => {
          setDiscount(discountData);
        }}
      />
    </React.Fragment>
  );
}
