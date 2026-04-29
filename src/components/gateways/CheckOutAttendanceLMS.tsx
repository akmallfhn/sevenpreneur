"use client";
import { setSessionToken } from "@/trpc/client";
import { Check, ClockFading, ClockPlus, LockKeyholeIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import AppButton, { VariantType } from "../buttons/AppButton";
import RatingCheckoutModalLMS from "../modals/RatingCheckoutModalLMS";

interface CheckOutAttendanceLMSProps {
  learningSessionId: number;
  hasCheckOut: boolean;
  learningSessionCheckOut: boolean;
  sessionToken: string;
}

export default function CheckOutAttendanceLMS(
  props: CheckOutAttendanceLMSProps
) {
  const router = useRouter();
  const [openCheckOut, setOpenCheckOut] = useState(false);

  useEffect(() => {
    setSessionToken(props.sessionToken);
  }, [props.sessionToken]);

  const getCheckOutState = (hasCheckOut: boolean, canCheckOut: boolean) => {
    if (hasCheckOut)
      return {
        icon: <Check className="size-4" />,
        label: "Checked Out",
        disabled: false,
        color: "quarternary",
      };
    if (!canCheckOut)
      return {
        icon: <LockKeyholeIcon className="size-4" />,
        label: "Closed",
        disabled: true,
        color: "primary",
      };
    return {
      icon: <ClockPlus className="size-4" />,
      label: "Check Out",
      disabled: false,
      color: "primary",
    };
  };

  const {
    icon: checkOutIcon,
    label: checkOutAction,
    disabled: checkoutDisabled,
    color: checkOutVariant,
  } = getCheckOutState(props.hasCheckOut, props.learningSessionCheckOut);

  const handleOpenCheckoutCode = () => {
    if (props.hasCheckOut) {
      toast.success("You've already checked out!");
      return;
    }

    setOpenCheckOut(true);
  };

  return (
    <React.Fragment>
      <div className="relative flex items-center justify-between gap-3 bg-card-bg p-4 border border-dashboard-border rounded-lg overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="size-11 aspect-square bg-card-bg p-1 border border-dashboard-border shrink-0 rounded-lg overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/clock-icon.svg"
              alt="Check Out"
              width={400}
              height={400}
            />
          </div>
          <div className="flex flex-col z-10">
            <h3 className="font-bold font-bodycopy text-[15px] leading-tight text-sb-text-strong">
              Check Out
            </h3>
            <p className="font-bodycopy font-medium text-emphasis text-sm leading-tight">
              For completion
            </p>
          </div>
        </div>
        <AppButton
          className="w-fit z-10"
          size="mediumRounded"
          onClick={handleOpenCheckoutCode}
          disabled={checkoutDisabled}
          variant={checkOutVariant as VariantType}
        >
          {checkOutAction}
          {checkOutIcon}
        </AppButton>

        <div className="absolute bottom-2 -right-5 text-emphasis/10">
          <ClockFading className="size-20" />
        </div>
      </div>

      {/* Modal Checkout */}
      <RatingCheckoutModalLMS
        learningId={props.learningSessionId}
        isOpen={openCheckOut}
        onClose={() => setOpenCheckOut(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </React.Fragment>
  );
}
