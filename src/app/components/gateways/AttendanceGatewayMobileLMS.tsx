"use client";
import { CheckInSession } from "@/lib/actions";
import { Check, ClockPlus, Loader2, LockKeyholeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import AppButton, { VariantType } from "../buttons/AppButton";
import ApplyCheckOutSessionLMS from "../modals/ApplyCheckOutSessionLMS";

interface AttendanceGatewayMobileLMSProps {
  learningSessionId: number;
  hasCheckIn: boolean;
  hasCheckOut: boolean;
  learningSessionCheckIn: boolean;
  learningSessionCheckOut: boolean;
}

export default function AttendanceGatewayMobileLMS(
  props: AttendanceGatewayMobileLMSProps
) {
  const router = useRouter();
  const [checkingIn, setCheckingIn] = useState(false);
  const [openCheckOut, setOpenCheckOut] = useState(false);

  const getCheckInState = (hasCheckIn: boolean, canCheckIn: boolean) => {
    if (hasCheckIn)
      return {
        icon: <Check className="size-4" />,
        label: "Checked In",
        disabled: false,
        color: "quarternary",
      };
    if (!canCheckIn)
      return {
        icon: <LockKeyholeIcon className="size-4" />,
        label: "Closed",
        disabled: true,
        color: "primary",
      };
    return {
      icon: <ClockPlus className="size-4" />,
      label: "Check In",
      disabled: false,
      color: "primary",
    };
  };

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
    icon: checkInIcon,
    label: checkInAction,
    disabled: checkInDisabled,
    color: checkInVariant,
  } = getCheckInState(props.hasCheckIn, props.learningSessionCheckIn);

  const {
    icon: checkOutIcon,
    label: checkOutAction,
    disabled: checkoutDisabled,
    color: checkOutVariant,
  } = getCheckOutState(props.hasCheckOut, props.learningSessionCheckOut);

  // Check In Attendance
  const handleCheckIn = async () => {
    if (props.hasCheckIn) {
      toast.success("You've already checked in!");
      return;
    }

    setCheckingIn(true);

    try {
      const checkInSession = await CheckInSession({
        learningId: props.learningSessionId,
      });
      if (checkInSession.code === "CREATED") {
        toast.success("You’ve successfully checked in!");
        router.refresh();
      } else {
        toast.error("Unable to complete check-in. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setCheckingIn(false);
    }
  };

  const handleOpenCheckoutCode = () => {
    if (props.hasCheckOut) {
      toast.success("You've already checked out!");
      return;
    }

    setOpenCheckOut(true);
  };

  return (
    <React.Fragment>
      <div className="attendance-gateway relative flex flex-col w-full p-3.5 gap-3 bg-linear-to-br from-0% from-[#D2E5FC] to-40% to-white border border-outline rounded-lg overflow-hidden">
        <div className="section-title flex flex-col gap-1 z-20">
          <h3 className="font-bodycopy font-bold ">Sudah Hadir Sesi Ini?</h3>
          <p className="font-bodycopy  text-sm">
            Yuk, lakukan check-in sekarang dan check-out setelah sesi selesai.
          </p>
        </div>
        <div className="attendance-actions flex w-full items-center gap-3 z-20">
          <AppButton
            className="check-in-action w-full"
            size="medium"
            onClick={handleCheckIn}
            disabled={checkInDisabled}
            variant={checkInVariant as VariantType}
          >
            {checkInAction}
            {checkingIn ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              checkInIcon
            )}
          </AppButton>
          <AppButton
            className="check-out-action w-full"
            size="medium"
            onClick={handleOpenCheckoutCode}
            disabled={checkoutDisabled}
            variant={checkOutVariant as VariantType}
          >
            {checkOutAction}
            {checkOutIcon}
          </AppButton>
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
