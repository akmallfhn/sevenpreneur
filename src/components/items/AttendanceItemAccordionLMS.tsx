"use client";
import { ChevronDown, TimerIcon } from "lucide-react";
import { useState } from "react";
import BooleanLabelCMS from "../labels/BooleanLabelCMS";
import dayjs from "dayjs";

interface AttendanceItemAccordionLMSProps {
  learningSessionName: string;
  attendanceStatus: boolean;
  attendanceCheckInAt: string;
  attendanceCheckOutAt: string;
}

export default function AttendanceItemAccordionLMS(
  props: AttendanceItemAccordionLMSProps
) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(!isOpen);

  return (
    <div
      className="attendance-item flex flex-col w-full py-2.5 px-3 bg-white border border-outline rounded-md transform transition duration-500 hover:cursor-pointer"
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
            <div className="flex items-center gap-1 text-[#333333]/80">
              <TimerIcon className="size-4" />
              <p className="font-bodycopy font-medium text-sm">Check In</p>
            </div>
            <p className="font-bodycopy font-medium text-sm text-[#333333]/80 shrink-0">
              {!!props.attendanceCheckInAt
                ? dayjs(props.attendanceCheckInAt).format("DD/MMM/YY [-] HH:mm")
                : "-"}
            </p>
          </div>
          <div className="check-out-at flex items-center justify-between">
            <div className="flex items-center gap-1 text-[#333333]/80">
              <TimerIcon className="size-4" />
              <p className="font-bodycopy font-medium text-sm">Check Out</p>
            </div>
            <p className="font-bodycopy font-medium text-sm text-[#333333]/80 shrink-0">
              {!!props.attendanceCheckOutAt
                ? dayjs(props.attendanceCheckOutAt).format(
                    "DD/MMM/YY [-] HH:mm"
                  )
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
