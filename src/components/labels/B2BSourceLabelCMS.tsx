"use client";
import { B2BSourceEnum } from "@prisma/client";
import {
  Calendar,
  Globe,
  Hash,
  Network,
  UserPlus,
  Users,
} from "lucide-react";
import { ReactNode } from "react";

const variantStyles: Record<
  B2BSourceEnum,
  {
    labelColor: string;
    labelIcon: ReactNode;
    labelName: string;
  }
> = {
  SOCIAL_MEDIA: {
    labelColor:
      "text-[#164EA6] bg-[#E2F0FF] dark:text-[#6f96d4] dark:bg-primary/15",
    labelIcon: <Hash className="size-3" />,
    labelName: "Social Media",
  },
  FOUNDER_NETWORK: {
    labelColor:
      "text-[#42359B] bg-[#EFEDF9] dark:text-[#9088c4] dark:bg-tertiary/15",
    labelIcon: <Network className="size-3" />,
    labelName: "Founder Network",
  },
  EVENT_CONFERENCE: {
    labelColor: "text-warning-foreground bg-warning-background",
    labelIcon: <Calendar className="size-3" />,
    labelName: "Event / Conference",
  },
  REFERRAL_PARTNER: {
    labelColor:
      "text-[#0A4F2D] bg-[#ECFDF3] dark:text-[#62a882] dark:bg-success/15",
    labelIcon: <UserPlus className="size-3" />,
    labelName: "Referral Partner",
  },
  REFERRAL_CLIENT: {
    labelColor:
      "text-[#0A4F2D] bg-[#ECFDF3] dark:text-[#62a882] dark:bg-success/15",
    labelIcon: <Users className="size-3" />,
    labelName: "Referral Client",
  },
  WEBSITE: {
    labelColor:
      "text-[#3f3f3f] bg-[#EAEAEA] dark:text-[#bbbbbb] dark:bg-[#2a2a2a]",
    labelIcon: <Globe className="size-3" />,
    labelName: "Website",
  },
};

interface B2BSourceLabelCMSProps {
  variants: B2BSourceEnum;
}

export default function B2BSourceLabelCMS({
  variants,
}: B2BSourceLabelCMSProps) {
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
