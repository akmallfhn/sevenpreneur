"use client";
import { LeadStatus } from "@/lib/app-types";
import {
  faFire,
  faMugHot,
  faSnowflake,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

const variantStyles: Record<
  LeadStatus,
  {
    name: string;
    labelColor: string;
    labelIcon: ReactNode;
  }
> = {
  HOT: {
    name: "Hot Leads",

    labelColor: "bg-destructive text-white",
    labelIcon: <FontAwesomeIcon icon={faFire} className="text-[#FED106]" />,
  },
  WARM: {
    name: "Warm Leads",
    labelColor: "text-[#FB7A36] bg-[#FDE4D8]",
    labelIcon: <FontAwesomeIcon icon={faMugHot} />,
  },
  COLD: {
    name: "Cold Leads",
    labelColor: "text-cms-primary bg-cms-primary-light",
    labelIcon: <FontAwesomeIcon icon={faSnowflake} />,
  },
};

interface LeadStatusLabelCMSProps {
  variants: LeadStatus;
}

export default function LeadStatusLabelCMS(props: LeadStatusLabelCMSProps) {
  const { name, labelColor, labelIcon } = variantStyles[props.variants];

  return (
    <div
      className={`label-container inline-flex py-0.5 px-2 rounded-full items-center justify-center gap-1 text-sm font-semibold font-bodycopy truncate ${labelColor}`}
    >
      {labelIcon}
      {name}
    </div>
  );
}
