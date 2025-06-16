"use client";

export type Variant = "ACTIVE" | "INACTIVE";

const variantStyles: Record<
  Variant,
  {
    backgroundColor: string;
    labelColor: string;
    signColor: string;
  }
> = {
  ACTIVE: {
    backgroundColor: "bg-[#E3F9E2]",
    labelColor: "text-[#2F7F2C]",
    signColor: "bg-[#2F7F2C]",
  },
  INACTIVE: {
    backgroundColor: "bg-[#FFF4F3]",
    labelColor: "text-[#DF5B4F]",
    signColor: "bg-[#DF5B4F]",
  },
};

interface StatusLabelCMSProps {
  labelName: string;
  variants: Variant;
}

export default function StatusLabelCMS({
  labelName,
  variants,
}: StatusLabelCMSProps) {
  // --- Variant declarations
  const { backgroundColor, labelColor, signColor } = variantStyles[variants];

  // --- Change value to capital
  const formattedLabel = labelName
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <div
      className={`label-container inline-flex py-[2px] px-[10px] w-fit rounded-full items-center justify-center gap-1 text-xs font-medium font-bodycopy ${backgroundColor} ${labelColor}`}
    >
      <div className={`flex size-2 rounded-full ${signColor}`} />
      {formattedLabel}
    </div>
  );
}
