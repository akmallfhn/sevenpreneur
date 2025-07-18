"use client";
import {
  faBuildingUser,
  faChalkboardUser,
  faPenNib,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

export type RolesVariant =
  | "administrator"
  | "educator"
  | "classManager"
  | "generalUser";

const variantStyles: Record<
  RolesVariant,
  {
    backgroundColor: string;
    labelColor: string;
    labelIcon: ReactNode;
  }
> = {
  administrator: {
    backgroundColor: "bg-[#EFEDF9]",
    labelColor: "text-[#42359B]",
    labelIcon: <FontAwesomeIcon icon={faBuildingUser} />,
  },
  educator: {
    backgroundColor: "bg-[#E2F0FF]",
    labelColor: "text-[#164EA6]",
    labelIcon: <FontAwesomeIcon icon={faChalkboardUser} />,
  },
  classManager: {
    backgroundColor: "bg-[#ECFDF3]",
    labelColor: "text-[#0A4F2D]",
    labelIcon: <FontAwesomeIcon icon={faPenNib} />,
  },
  generalUser: {
    backgroundColor: "bg-[#F3F5F9]",
    labelColor: "text-[#41474E]",
    labelIcon: <FontAwesomeIcon icon={faUser} />,
  },
};

interface RolesLabelCMSProps {
  labelName: string;
  variants: RolesVariant;
}

export default function RolesLabelCMS({
  labelName,
  variants,
}: RolesLabelCMSProps) {
  // --- Variant declaration
  const { backgroundColor, labelColor, labelIcon } = variantStyles[variants];

  return (
    <div
      className={`label-container inline-flex py-0.5 px-2 rounded-md items-center justify-center gap-1 text-xs font-semibold font-bodycopy truncate ${labelColor} ${backgroundColor}`}
    >
      {labelIcon}
      {labelName}
    </div>
  );
}
