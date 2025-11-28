"use client";
import { CheckInSession } from "@/lib/actions";
import AppButton, { VariantType } from "../buttons/AppButton";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ClockFading,
  ClockPlus,
  Loader2,
  LockKeyholeIcon,
} from "lucide-react";

interface CheckInAttendanceLMSProps {
  learningSessionId: number;
  hasCheckIn: boolean;
  learningSessionCheckIn: boolean;
}

export default function CheckInAttendanceLMS(props: CheckInAttendanceLMSProps) {
  const router = useRouter();
  const [checkingIn, setCheckingIn] = useState(false);

  const getCheckInState = (hasCheckIn: boolean, canCheckIn: boolean) => {
    if (hasCheckIn)
      return {
        icon: <Check className="size-4" />,
        label: "Checked In",
        disabled: false,
        color: "whatsapp",
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

  const {
    icon: checkInIcon,
    label: checkInAction,
    disabled: checkInDisabled,
    color: checkInVariant,
  } = getCheckInState(props.hasCheckIn, props.learningSessionCheckIn);

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
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="check-in-attendance relative flex items-center justify-between gap-3 bg-linear-to-br from-0% from-[#EFEDF9] to-50% to-white p-4 border rounded-lg overflow-hidden">
      <div className="flex flex-col z-10">
        <h3 className="section-title font-bold font-bodycopy leading-tight">
          Check In
        </h3>
        <p className="font-bodycopy font-medium text-[#111111] text-[15px]">
          Attendance
        </p>
      </div>
      <AppButton
        className="w-fit z-10"
        size="mediumRounded"
        onClick={handleCheckIn}
        disabled={checkInDisabled}
        variant={checkInVariant as VariantType}
      >
        {checkInAction}
        {checkingIn ? <Loader2 className="size-5 animate-spin" /> : checkInIcon}
      </AppButton>

      <div className="check-in-background absolute bottom-2 -right-5 text-black/10 dark:text-white/[0.017]">
        <ClockFading className="size-20" />
      </div>
    </div>
  );
}
