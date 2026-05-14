"use client";
import { B2BActivityTypeEnum } from "@prisma/client";
import {
  CalendarClock,
  FileSignature,
  FileText,
  Headphones,
  Mail,
  MessageCircle,
  Phone,
  Users,
  Video,
} from "lucide-react";
import { ReactNode } from "react";

const variantStyles: Record<
  B2BActivityTypeEnum,
  {
    labelColor: string;
    labelIcon: ReactNode;
    labelName: string;
  }
> = {
  CHAT_WHATSAPP: {
    labelColor:
      "text-[#0A4F2D] bg-[#ECFDF3] dark:text-[#62a882] dark:bg-success/15",
    labelIcon: <MessageCircle className="size-3" />,
    labelName: "WhatsApp Chat",
  },
  COLD_EMAIL: {
    labelColor:
      "text-[#164EA6] bg-[#E2F0FF] dark:text-[#6f96d4] dark:bg-primary/15",
    labelIcon: <Mail className="size-3" />,
    labelName: "Cold Email",
  },
  PHONE_CALL: {
    labelColor: "text-warning-foreground bg-warning-background",
    labelIcon: <Phone className="size-3" />,
    labelName: "Phone Call",
  },
  CONFERENCE_CALL: {
    labelColor:
      "text-[#42359B] bg-[#EFEDF9] dark:text-[#9088c4] dark:bg-tertiary/15",
    labelIcon: <Headphones className="size-3" />,
    labelName: "Conference Call",
  },
  OFFLINE_MEETING: {
    labelColor: "text-primary-soft-foreground bg-primary-soft-background",
    labelIcon: <Users className="size-3" />,
    labelName: "Offline Meeting",
  },
  IN_PERSON_MEETING: {
    labelColor: "text-primary-soft-foreground bg-primary-soft-background",
    labelIcon: <Users className="size-3" />,
    labelName: "In-Person Meeting",
  },
  SENT_PROPOSAL: {
    labelColor:
      "text-[#3f3f3f] bg-[#EAEAEA] dark:text-[#bbbbbb] dark:bg-[#2a2a2a]",
    labelIcon: <FileText className="size-3" />,
    labelName: "Sent Proposal",
  },
  SENT_CONTRACT: {
    labelColor: "text-success-foreground bg-success-background",
    labelIcon: <FileSignature className="size-3" />,
    labelName: "Sent Contract",
  },
  FOLLOW_UP: {
    labelColor: "text-warning-foreground bg-warning-background",
    labelIcon: <CalendarClock className="size-3" />,
    labelName: "Follow Up",
  },
};

interface B2BActivityTypeLabelCMSProps {
  variants: B2BActivityTypeEnum;
}

export default function B2BActivityTypeLabelCMS({
  variants,
}: B2BActivityTypeLabelCMSProps) {
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
