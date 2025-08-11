"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import {
  faPenNib,
  faPersonChalkboard,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";

export type ProductCategory = "COHORT" | "PLAYLIST" | "AI";

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
    labelIcon: <FontAwesomeIcon icon={faPersonChalkboard} />,
    labelName: "Cohort",
  },
  PLAYLIST: {
    backgroundColor: "bg-[#E2F0FF]",
    labelColor: "text-[#164EA6]",
    labelIcon: <FontAwesomeIcon icon={faPlay} />,
    labelName: "Playlist",
  },
  AI: {
    backgroundColor: "bg-[#ECFDF3]",
    labelColor: "text-[#0A4F2D]",
    labelIcon: <FontAwesomeIcon icon={faPenNib} />,
    labelName: "AI",
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
      className={`label-container inline-flex py-0.5 px-2 rounded-md items-center justify-center gap-1 text-xs font-semibold font-bodycopy truncate ${labelColor} ${backgroundColor}`}
    >
      {labelIcon}
      {labelName}
    </div>
  );
}
