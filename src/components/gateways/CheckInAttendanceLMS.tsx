"use client";
import { CheckInSession } from "@/lib/actions";
import {
  Check,
  ClockFading,
  ClockPlus,
  Loader2,
  LockKeyholeIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AppButton, { VariantType } from "../buttons/AppButton";

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
    } catch {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="relative flex items-center justify-between gap-3 bg-card-bg p-4 border border-dashboard-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2">
        <div className="size-11 aspect-square bg-card-bg p-1 border border-dashboard-border shrink-0 rounded-lg overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/clock-icon.svg"
            alt="Check In"
            width={400}
            height={400}
          />
        </div>
        <div className="flex flex-col z-10">
          <h3 className="font-bold font-bodycopy text-[15px] leading-tight text-sb-text-strong">
            Check In
          </h3>
          <p className="font-bodycopy font-medium text-emphasis text-sm leading-tight">
            For attendance entry
          </p>
        </div>
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

      <div className="absolute bottom-2 -right-5 text-emphasis/10">
        <ClockFading className="size-20" />
      </div>
    </div>
  );
}
