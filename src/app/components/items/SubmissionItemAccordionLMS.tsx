"use client";
import dayjs from "dayjs";
import { ChevronDown, TimerIcon } from "lucide-react";
import { useState } from "react";
import BooleanLabelCMS from "../labels/BooleanLabelCMS";

interface SubmissionItemAccordionLMSProps {
  projectName: string;
  submissionStatus: boolean;
  submissionCreatedAt: string;
}

export default function SubmissionItemAccordionLMS(
  props: SubmissionItemAccordionLMSProps
) {
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(!isOpen);

  return (
    <div
      className="submission-item flex flex-col w-full py-2.5 px-3 bg-white border border-outline rounded-md transform transition duration-500 hover:cursor-pointer"
      onClick={handleOpen}
    >
      <div className="submission-attributes flex justify-between items-center gap-2">
        <p className="learning-session-name font-semibold font-bodycopy text-sm truncate">
          {props.projectName}
        </p>
        <div className="submission-status flex items-center gap-1 shrink-0">
          <BooleanLabelCMS
            label={!!props.submissionStatus ? "SUBMITTED" : "NOT SUBMITTED"}
            value={props.submissionStatus}
          />
          <ChevronDown
            className={`size-4 duration-300 transform transition-all ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      <div
        className={`submission-details overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col w-full gap-1">
          <div className="created-at flex items-center justify-between">
            <div className="flex items-center gap-1 text-[#333333]/80">
              <TimerIcon className="size-4" />
              <p className="font-bodycopy font-medium text-sm">Submitted at</p>
            </div>
            <p className="font-bodycopy font-medium text-sm text-[#333333]/80 shrink-0">
              {!!props.submissionCreatedAt
                ? dayjs(props.submissionCreatedAt).format("DD/MMM/YY [-] HH:mm")
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
