"use client";
import { SubmissionStatus } from "@/lib/app-types";

const variantStyles: Record<
  SubmissionStatus,
  {
    labelColor: string;
    labelText: string;
  }
> = {
  SUBMITTED: {
    labelColor: "bg-success-background text-success-foreground",
    labelText: "SUBMITTED",
  },
  NOT_SUBMITTED: {
    labelColor: "bg-danger-background text-danger-foreground",
    labelText: "NOT SUBMITTED",
  },
};

interface SubmissionStatusLabelLMSProps {
  variant: SubmissionStatus;
}

export default function SubmissionStatusLabelLMS({
  variant,
}: SubmissionStatusLabelLMSProps) {
  const { labelColor, labelText } = variantStyles[variant];

  return (
    <span
      className={`w-fit text-xs font-bodycopy font-semibold px-2 py-0.5 rounded-full ${labelColor}`}
    >
      {labelText}
    </span>
  );
}
