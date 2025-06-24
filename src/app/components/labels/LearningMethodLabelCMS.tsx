"use client";

export type learningMethodVariant = "online" | "onSite" | "hybrid";

const variantStyles: Record<
  learningMethodVariant,
  {
    backgroundColor: string;
    labelColor: string;
  }
> = {
  online: {
    backgroundColor: "bg-[#EFEDF9]",
    labelColor: "text-[#42359B]",
  },
  onSite: {
    backgroundColor: "bg-[#E2F0FF]",
    labelColor: "text-[#164EA6]",
  },
  hybrid: {
    backgroundColor: "bg-[#ECFDF3]",
    labelColor: "text-[#0A4F2D]",
  },
};

interface LearningMethodCMSProps {
  labelName: string;
  variants: learningMethodVariant;
}

export default function LearningMethodLabelCMS({
  labelName,
  variants,
}: LearningMethodCMSProps) {
  // --- Variant declaration
  const { backgroundColor, labelColor } = variantStyles[variants];

  return (
    <div
      className={`label-container inline-flex py-1 px-1.5 rounded-sm items-center justify-center text-center gap-1 text-xs font-bold font-bodycopy truncate ${labelColor} ${backgroundColor}`}
    >
      {labelName}
    </div>
  );
}
