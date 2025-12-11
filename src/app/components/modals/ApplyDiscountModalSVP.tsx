"use client";
import {
  CheckDiscountCohort,
  CheckDiscountEvent,
  CheckDiscountPlaylist,
} from "@/lib/actions";
import { ProductCategory } from "@/lib/app-types";
import { Loader2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import AppButton from "../buttons/AppButton";
import InputSVP from "../fields/InputSVP";

interface DiscountType {
  name: string | undefined;
  code: string | undefined;
  calc_percent: number | undefined;
  category: ProductCategory;
  item_id: number | undefined;
}

interface ApplyDiscountModalSVPProps {
  playlistId?: number;
  cohortId?: number;
  eventId?: number;
  isOpen: boolean;
  onClose: () => void;
  onApplyDiscount: (discount: DiscountType) => void;
}

export default function ApplyDiscountModalSVP({
  playlistId,
  cohortId,
  eventId,
  isOpen,
  onClose,
  onApplyDiscount,
}: ApplyDiscountModalSVPProps) {
  const [discountCode, setDiscountCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingApplyDiscount, setIsLoadingApplyDiscount] = useState(false);

  // Blocked scroll behind
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Reset in every open modal
  useEffect(() => {
    if (isOpen) {
      setDiscountCode("");
      setErrorMessage("");
    }
  }, [isOpen]);

  // Handle input change
  const handleInputChange = (value: string) => {
    setDiscountCode(value);
    setErrorMessage("");
  };

  // Handle Checking
  const handleDiscountChecking = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoadingApplyDiscount(true);

    if (!discountCode.trim()) {
      setErrorMessage("Please enter a promo code before redeeming");
      setIsLoadingApplyDiscount(false);
      return;
    }

    try {
      let responseDiscount;
      if (playlistId) {
        responseDiscount = await CheckDiscountPlaylist({
          discountCode: discountCode.trim(),
          playlistId: playlistId,
        });
      } else if (cohortId) {
        responseDiscount = await CheckDiscountCohort({
          discountCode: discountCode.trim(),
          cohortId: cohortId,
        });
      } else if (eventId) {
        responseDiscount = await CheckDiscountEvent({
          discountCode: discountCode.trim(),
          eventId: eventId,
        });
      }
      const discountData: DiscountType = {
        name: responseDiscount?.data?.name,
        code: responseDiscount?.data?.code,
        calc_percent: responseDiscount?.data?.calc_percent,
        category: responseDiscount?.data?.category as ProductCategory,
        item_id: responseDiscount?.data?.item_id,
      };
      if (responseDiscount?.code === "OK") {
        onApplyDiscount?.(discountData);
        onClose();
      } else {
        setErrorMessage("Invalid discount code");
      }
    } catch {
      setErrorMessage("Invalid discount code");
    } finally {
      setIsLoadingApplyDiscount(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <div
        className="modal-root fixed inset-0 flex w-full h-full items-end justify-center bg-black/65 z-[999]"
        onClick={onClose}
      >
        <div
          className="modal-container fixed flex bg-white max-w-[calc(100%-2rem)] p-6 w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md dark:bg-surface-black sm:max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <form
            className="apply-discount-form flex flex-col w-full items-center gap-4"
            onSubmit={handleDiscountChecking}
          >
            <div className="flex flex-col w-full gap-2">
              <h2 className="w-full font-bodycopy font-bold pl-0.5">
                Redeem Promo
              </h2>
              <InputSVP
                inputId="discount-code"
                inputName="Promo Code"
                inputType="text"
                inputPlaceholder="Enter promo code here. e.g. GOODLUCK20"
                characterLength={32}
                value={discountCode}
                onInputChange={handleInputChange}
                errorMessage={errorMessage}
              />
            </div>
            <AppButton type="submit" disabled={isLoadingApplyDiscount}>
              {isLoadingApplyDiscount && (
                <Loader2 className="animate-spin size-5" />
              )}
              Redeem Now
            </AppButton>
          </form>
          {/* Button Close */}
          <div
            className="absolute flex top-4 right-4 hover:cursor-pointer"
            onClick={onClose}
          >
            <X className="size-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
