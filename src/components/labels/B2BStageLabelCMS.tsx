"use client";
import { B2BStageEnum } from "@prisma/client";
import {
  CheckCircle2,
  Handshake,
  MessagesSquare,
  PauseCircle,
  PhoneCall,
  Target,
  XCircle,
} from "lucide-react";
import { ReactNode } from "react";

const variantStyles: Record<
  B2BStageEnum,
  {
    labelColor: string;
    labelIcon: ReactNode;
    labelName: string;
  }
> = {
  LEAD_IDENTIFIED: {
    labelColor: "text-primary-soft-foreground bg-primary-soft-background",
    labelIcon: <Target className="size-3" />,
    labelName: "Lead Identified",
  },
  CONTACTED: {
    labelColor: "text-[#164EA6] bg-[#E2F0FF] dark:text-[#6f96d4] dark:bg-primary/15",
    labelIcon: <PhoneCall className="size-3" />,
    labelName: "Contacted",
  },
  NEGOTIATION: {
    labelColor:
      "text-[#42359B] bg-[#EFEDF9] dark:text-[#9088c4] dark:bg-tertiary/15",
    labelIcon: <MessagesSquare className="size-3" />,
    labelName: "Negotiation",
  },
  VERBAL_COMMIT: {
    labelColor: "text-warning-foreground bg-warning-background",
    labelIcon: <Handshake className="size-3" />,
    labelName: "Verbal Commit",
  },
  CLOSED_WON: {
    labelColor: "text-success-foreground bg-success-background",
    labelIcon: <CheckCircle2 className="size-3" />,
    labelName: "Closed Won",
  },
  CLOSED_LOST: {
    labelColor: "text-danger-foreground bg-danger-background",
    labelIcon: <XCircle className="size-3" />,
    labelName: "Closed Lost",
  },
  ON_HOLD: {
    labelColor:
      "text-[#3f3f3f] bg-[#EAEAEA] dark:text-[#bbbbbb] dark:bg-[#2a2a2a]",
    labelIcon: <PauseCircle className="size-3" />,
    labelName: "On Hold",
  },
};

interface B2BStageLabelCMSProps {
  variants: B2BStageEnum;
}

export default function B2BStageLabelCMS({ variants }: B2BStageLabelCMSProps) {
  const { labelColor, labelIcon, labelName } = variantStyles[variants];
  return (
    <div
      className={`label-container inline-flex w-fit py-0.5 px-2 rounded-sm items-center justify-center gap-1 text-[13px] font-semibold font-bodycopy truncate ${labelColor}`}
    >
      {labelIcon}
      {labelName}
    </div>
  );
}
