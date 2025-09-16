"use client";
import { LearningSessionVariant } from "./LearningSessionIconCMS";

const variantStyles: Record<
  LearningSessionVariant,
  {
    themeColor: string;
  }
> = {
  ONLINE: {
    themeColor: "bg-cms-primary-light text-cms-primary",
  },
  ONSITE: {
    themeColor: "bg-[#EFEDF9] text-[#42359B]",
  },
  HYBRID: {
    themeColor: "bg-[#DBF2F0] text-[#00A694]",
  },
};

interface LearningMethodCMSProps {
  labelName: string;
  variants: LearningSessionVariant;
}

export default function LearningMethodLabelCMS({
  labelName,
  variants,
}: LearningMethodCMSProps) {
  // --- Variant declaration
  const { themeColor } = variantStyles[variants];

  return (
    <div
      className={`label-container inline-flex py-1.5 px-3 rounded-sm items-center justify-center text-center gap-1 text-xs font-bold font-bodycopy truncate ${themeColor}`}
    >
      {labelName}
    </div>
  );
}
