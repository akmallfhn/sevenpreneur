"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import {
  faPenNib,
  faPersonChalkboard,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { ProductCategory } from "@/lib/app-types";

const variantStyles: Record<
  ProductCategory,
  {
    backgroundColor: string;
    labelColor: string;
    labelIcon: ReactNode;
    labelName: string;
  }
> = {
  COHORT: {
    backgroundColor: "bg-[#EFEDF9]",
    labelColor: "text-[#42359B]",
    labelIcon: <FontAwesomeIcon icon={faPersonChalkboard} className="size-3" />,
    labelName: "Cohort",
  },
  PLAYLIST: {
    backgroundColor: "bg-[#E2F0FF]",
    labelColor: "text-[#164EA6]",
    labelIcon: <FontAwesomeIcon icon={faPlay} className="size-3" />,
    labelName: "Playlist",
  },
  AI: {
    backgroundColor: "bg-[#ECFDF3]",
    labelColor: "text-[#0A4F2D]",
    labelIcon: <FontAwesomeIcon icon={faPenNib} className="size-3" />,
    labelName: "AI",
  },
  EVENT: {
    backgroundColor: "bg-[#ECFDF3]",
    labelColor: "text-[#0A4F2D]",
    labelIcon: <FontAwesomeIcon icon={faPenNib} className="size-3" />,
    labelName: "Event",
  },
};

interface ProductCategoryLabelCMSProps {
  variants: ProductCategory;
}

export default function ProductCategoryLabelCMS({
  variants,
}: ProductCategoryLabelCMSProps) {
  // --- Variant declaration
  const { backgroundColor, labelColor, labelIcon, labelName } =
    variantStyles[variants];

  return (
    <div
      className={`label-container inline-flex w-fit py-0.5 px-2 rounded-sm items-center justify-center gap-1 text-[13px] font-semibold font-bodycopy truncate ${labelColor} ${backgroundColor}`}
    >
      {labelIcon}
      {labelName}
    </div>
  );
}
