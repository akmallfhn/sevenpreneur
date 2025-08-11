"use client";

export type StatusVariant = "ACTIVE" | "INACTIVE";

const variantStyles: Record<
  StatusVariant,
  {
    backgroundColor: string;
    labelColor: string;
    signColor: string;
  }
> = {
  ACTIVE: {
    backgroundColor: "bg-success-background",
    labelColor: "text-success-foreground",
    signColor: "bg-success-foreground",
  },
  INACTIVE: {
    backgroundColor: "bg-danger-background",
    labelColor: "text-danger-foreground",
    signColor: "bg-danger-foreground",
  },
};

interface StatusLabelCMSProps {
  labelName: string;
  variants: StatusVariant;
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
      className={`label-container inline-flex py-[2px] px-[10px] w-fit rounded-full items-center justify-center gap-1 text-xs font-semibold font-bodycopy ${backgroundColor} ${labelColor}`}
    >
      <div className={`flex size-2 rounded-full ${signColor}`} />
      {labelName}
    </div>
  );
}
