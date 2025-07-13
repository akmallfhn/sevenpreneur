"use client";
import { useEffect, useMemo, useState } from "react";
import RadioBoxCheckoutPrice from "../fields/RadioBoxCheckoutPrice";
import AppButton from "../buttons/AppButton";
import { useRouter, useSearchParams } from "next/navigation";
import RadioBoxPaymentChannel from "../fields/RadioBoxPaymentChannel";
import { CreditCard, Loader2 } from "lucide-react";

interface PriceItem {
  id: number;
  name: string;
  amount: number;
  cohort_id: number;
}

interface CheckoutCohortFormProps {
  cohortName: string;
  ticketListData: PriceItem[];
}
export default function CheckoutCohortForm({
  cohortName,
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

  return (
    <div className="checkout-form flex flex-col p-5 h-screen">
      {!isValidTicketId ? (
        // Programs Tier Ticketing
        <div className="programs-tier flex flex-col gap-4">
          <div className="flex flex-col font-ui">
            <h1 className="font-bold text-black text-lg">Programs Tier</h1>
            <p className="text-alternative">
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
        <div className="payment-details flex flex-col gap-4 pt-4">
          <div className="flex flex-col font-ui">
            <h1 className="font-bold text-black text-lg">Payment Method</h1>
          </div>
          <RadioBoxPaymentChannel
            value={"BNI_ACC"}
            selectedValue={selectedPaymentChannel}
            onChange={setSelectedPaymentChannel}
          />
          <div className="pt-10">
            <AppButton
              size={"defaultRounded"}
              className="w-full"
              onClick={handleParamsQuery}
            >
              Proceed to Checkout
            </AppButton>
          </div>
        </div>
      )}
    </div>
  );
}
