"use client";
import { ChevronDown, Loader2, LogIn, LogOut, TimerIcon } from "lucide-react";
import { useState } from "react";
import AppButton from "../buttons/AppButton";
import BooleanLabelCMS from "../labels/BooleanLabelCMS";
import dayjs from "dayjs";

interface AttendanceItemAccordionLMSProps {
  learningSessionName: string;
  attendanceStatus: boolean;
  attendanceCheckInAt: string;
  attendanceCheckOutAt: string;
  onManualCheckIn?: () => void;
  onManualCheckOut?: () => void;
  isCheckingIn?: boolean;
  isCheckingOut?: boolean;
}

export default function AttendanceItemAccordionLMS(
  props: AttendanceItemAccordionLMSProps
) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(!isOpen);

  const showManualActions =
    props.onManualCheckIn !== undefined || props.onManualCheckOut !== undefined;

  return (
    <div
      className="attendance-item flex flex-col w-full py-2.5 px-3 bg-card-bg border border-dashboard-border rounded-md transform transition duration-500 hover:cursor-pointer"
      onClick={handleOpen}
    >
      <div className="attendance-attributes flex justify-between items-center gap-2">
        <p className="learning-session-name font-semibold font-bodycopy text-sm truncate">
          {props.learningSessionName}
        </p>
        <div className="attendance-status flex items-center gap-1 shrink-0">
          <BooleanLabelCMS
            label={!!props.attendanceStatus ? "PRESENT" : "ABSENT"}
            value={props.attendanceStatus}
          />
          <ChevronDown
            className={`size-4 duration-300 transform transition-all ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      <div
        className={`attendance-details overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col w-full gap-1">
          <div className="check-in-at flex items-center justify-between">
            <div className="flex items-center gap-1 text-emphasis">
              <TimerIcon className="size-4" />
              <p className="font-bodycopy font-medium text-sm">Check In</p>
            </div>
            <p className="font-bodycopy font-medium text-sm text-emphasis shrink-0">
              {!!props.attendanceCheckInAt
                ? dayjs(props.attendanceCheckInAt).format("DD/MMM/YY [-] HH:mm")
                : "-"}
            </p>
          </div>
          <div className="check-out-at flex items-center justify-between">
            <div className="flex items-center gap-1 text-emphasis">
              <TimerIcon className="size-4" />
              <p className="font-bodycopy font-medium text-sm">Check Out</p>
            </div>
            <p className="font-bodycopy font-medium text-sm text-emphasis shrink-0">
              {!!props.attendanceCheckOutAt
                ? dayjs(props.attendanceCheckOutAt).format(
                    "DD/MMM/YY [-] HH:mm"
                  )
                : "-"}
            </p>
          </div>
          {showManualActions && (
            <div
              className="manual-actions flex gap-2 pt-2 mt-1 border-t border-dashboard-border"
              onClick={(e) => e.stopPropagation()}
            >
              {props.onManualCheckIn && (
                <AppButton
                  variant="tertiary"
                  size="small"
                  className="flex-1"
                  onClick={props.onManualCheckIn}
                  disabled={!!props.attendanceCheckInAt || props.isCheckingIn}
                >
                  {props.isCheckingIn ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : (
                    <LogIn className="size-4" />
                  )}
                  {!!props.attendanceCheckInAt ? "Checked In" : "Check In"}
                </AppButton>
              )}
              {props.onManualCheckOut && (
                <AppButton
                  variant="tertiary"
                  size="small"
                  className="flex-1"
                  onClick={props.onManualCheckOut}
                  disabled={!!props.attendanceCheckOutAt || props.isCheckingOut}
                >
                  {props.isCheckingOut ? (
                    <Loader2 className="animate-spin size-4" />
                  ) : (
                    <LogOut className="size-4" />
                  )}
                  {!!props.attendanceCheckOutAt ? "Checked Out" : "Check Out"}
                </AppButton>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
