"use client";

const variantStyles: Record<
  "true" | "false",
  {
    backgroundColor: string;
    labelColor: string;
    signColor: string;
  }
> = {
  true: {
    backgroundColor: "bg-success-background",
    labelColor: "text-success-foreground",
    signColor: "bg-success-foreground",
  },
  false: {
    backgroundColor: "bg-danger-background",
    labelColor: "text-danger-foreground",
    signColor: "bg-danger-foreground",
  },
};

interface BooleanLabelCMSProps {
  label: string;
  value: boolean;
}

export default function BooleanLabelCMS(props: BooleanLabelCMSProps) {
  const { backgroundColor, labelColor, signColor } =
    variantStyles[String(props.value) as "true" | "false"];

  return (
    <div
      className={`label-container inline-flex py-[2px] px-[10px] w-fit rounded-full items-center justify-center gap-1 text-xs font-semibold font-bodycopy ${backgroundColor} ${labelColor}`}
    >
      <div className={`flex size-2 rounded-full ${signColor}`} />
      {props.label}
    </div>
  );
}
