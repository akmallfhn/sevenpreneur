"use client";

export type StatusVariant = "ACTIVE" | "INACTIVE";

const variantStyles: Record<
  StatusVariant,
  {
    backgroundColor: string;
    labelColor: string;
    signColor: string;
    label: string;
  }
> = {
  ACTIVE: {
    backgroundColor: "bg-success-background",
    labelColor: "text-success-foreground",
    signColor: "bg-success-foreground",
    label: "ACTIVE",
  },
  INACTIVE: {
    backgroundColor: "bg-danger-background",
    labelColor: "text-danger-foreground",
    signColor: "bg-danger-foreground",
    label: "INACTIVE",
  },
};

interface StatusLabelCMSProps {
  labelName?: string;
  variants: StatusVariant;
}

export default function StatusLabelCMS({
  labelName,
  variants,
}: StatusLabelCMSProps) {
  // --- Variant declarations
  const { backgroundColor, labelColor, signColor, label } =
    variantStyles[variants];

  return (
    <div
      className={`label-container inline-flex py-[2px] px-[10px] w-fit rounded-full items-center justify-center gap-1 text-xs font-semibold font-bodycopy ${backgroundColor} ${labelColor}`}
    >
      <div className={`flex size-2 rounded-full ${signColor}`} />
      {label}
    </div>
  );
}
