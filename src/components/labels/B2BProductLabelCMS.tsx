"use client";
import { B2BProductEnum } from "@prisma/client";
import { Briefcase, GraduationCap, Sparkles } from "lucide-react";
import { ReactNode } from "react";

const variantStyles: Record<
  B2BProductEnum,
  {
    labelColor: string;
    labelIcon: ReactNode;
    labelName: string;
  }
> = {
  SPONSORSHIP: {
    labelColor:
      "text-[#42359B] bg-[#EFEDF9] dark:text-[#9088c4] dark:bg-tertiary/15",
    labelIcon: <Briefcase className="size-3" />,
    labelName: "Sponsorship",
  },
  CORPORATE_TRAINING: {
    labelColor:
      "text-[#164EA6] bg-[#E2F0FF] dark:text-[#6f96d4] dark:bg-primary/15",
    labelIcon: <GraduationCap className="size-3" />,
    labelName: "Corporate Training",
  },
  CORPORATE_AI_TRAINING: {
    labelColor:
      "text-[#0A4F2D] bg-[#ECFDF3] dark:text-[#62a882] dark:bg-success/15",
    labelIcon: <Sparkles className="size-3" />,
    labelName: "Corporate AI Training",
  },
};

interface B2BProductLabelCMSProps {
  variants: B2BProductEnum;
}

export default function B2BProductLabelCMS({
  variants,
}: B2BProductLabelCMSProps) {
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
