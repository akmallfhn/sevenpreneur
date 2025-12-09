"use client";
import AppButton, { VariantType } from "../buttons/AppButton";
import { toast } from "sonner";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ClockFading, ClockPlus, LockKeyholeIcon } from "lucide-react";
import ApplyCheckOutSessionLMS from "../modals/ApplyCheckOutSessionLMS";
import Image from "next/image";

interface CheckOutAttendanceLMSProps {
  learningSessionId: number;
  hasCheckOut: boolean;
  learningSessionCheckOut: boolean;
}

export default function CheckOutAttendanceLMS(
  props: CheckOutAttendanceLMSProps
) {
  const router = useRouter();
  const [openCheckOut, setOpenCheckOut] = useState(false);

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
      <div className="check-out-attendance relative flex items-center justify-between gap-3 bg-linear-to-br from-0% from-[#EFEDF9] to-50% to-white p-4 border rounded-lg overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="clock-icon size-11 aspect-square bg-white p-1 border border-outline shrink-0 rounded-lg overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/clock-icon.svg"
              alt={"Test"}
              width={400}
              height={400}
            />
          </div>
          <div className="flex flex-col z-10">
            <h3 className="section-title font-bold font-bodycopy leading-tight">
              Check Out
            </h3>
            <p className="font-bodycopy font-medium text-[#111111]/70 text-sm leading-tight">
              For attendance completion
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

        <div className="check-out-background absolute bottom-2 -right-5 text-black/10 dark:text-white/[0.017]">
          <ClockFading className="size-20" />
        </div>
      </div>

      {/* Modal Checkout */}
      <ApplyCheckOutSessionLMS
        learningId={props.learningSessionId}
        isOpen={openCheckOut}
        onClose={() => setOpenCheckOut(false)}
        onSuccessCheckOut={() => {
          router.refresh();
        }}
      />
    </React.Fragment>
  );
}
