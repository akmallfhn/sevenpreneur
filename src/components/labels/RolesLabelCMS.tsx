"use client";
import { RolesUser } from "@/lib/app-types";
import {
  faBuildingUser,
  faBullhorn,
  faChalkboardUser,
  faPenNib,
  faUser,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

const variantStyles: Record<
  RolesUser,
  {
    backgroundColor: string;
    labelColor: string;
    labelIcon: ReactNode;
  }
> = {
  superAdmin: {
    backgroundColor: "bg-[#EFEDF9] dark:bg-tertiary/15",
    labelColor: "text-[#42359B] dark:text-[#9088c4]",
    labelIcon: <FontAwesomeIcon icon={faBuildingUser} />,
  },
  administrator: {
    backgroundColor: "bg-warning-background",
    labelColor: "text-warning-foreground",
    labelIcon: <FontAwesomeIcon icon={faUserGear} />,
  },
  educator: {
    backgroundColor: "bg-[#E2F0FF] dark:bg-primary/15",
    labelColor: "text-[#164EA6] dark:text-[#6f96d4]",
    labelIcon: <FontAwesomeIcon icon={faChalkboardUser} />,
  },
  classManager: {
    backgroundColor: "bg-[#ECFDF3] dark:bg-success/15",
    labelColor: "text-[#0A4F2D] dark:text-success-foreground",
    labelIcon: <FontAwesomeIcon icon={faPenNib} />,
  },
  generalUser: {
    backgroundColor: "bg-[#F3F5F9] dark:bg-[#2a2a2a]",
    labelColor: "text-[#41474E] dark:text-[#bbbbbb]",
    labelIcon: <FontAwesomeIcon icon={faUser} />,
  },
  marketer: {
    backgroundColor: "bg-secondary-soft-background",
    labelColor: "text-secondary-soft-foreground",
    labelIcon: <FontAwesomeIcon icon={faBullhorn} />,
  },
};

interface RolesLabelCMSProps {
  labelName: string;
  variants: RolesUser;
}

export default function RolesLabelCMS({
  labelName,
  variants,
}: RolesLabelCMSProps) {
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
