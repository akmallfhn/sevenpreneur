"use client";

import { GalleryHorizontalEnd, MapPinned, Video } from "lucide-react";
import { ReactNode } from "react";

export type learningSessionVariant = "ONLINE" | "ONSITE" | "HYBRID";

const variantStyles: Record<
  learningSessionVariant,
  {
    iconColor: string;
    iconLabel: ReactNode;
  }
> = {
  ONLINE: {
    iconColor: "bg-cms-primary-light text-cms-primary",
    iconLabel: <Video className="size-5" />,
  },
  ONSITE: {
    iconColor: "bg-[#EFEDF9] text-[#42359B]",
    iconLabel: <MapPinned className="size-5" />,
  },
  HYBRID: {
    iconColor: "bg-[#DBF2F0] text-[#00A694]",
    iconLabel: <GalleryHorizontalEnd className="size-5" />,
  },
};

interface LearningSessionIconLabelCMSProps {
  variants: learningSessionVariant;
}

export default function LearningSessionIconLabelCMS({
  variants,
}: LearningSessionIconLabelCMSProps) {
  // --- Variant declaration
  const { iconColor, iconLabel } = variantStyles[variants];

  return (
    <div
      className={`icon aspect-square flex flex-col size-14 p-2 gap-[1px] items-center justify-center ${iconColor} rounded-md`}
    >
      {iconLabel}
      <p className="font-bodycopy font-bold text-[11px]">
        {variants.toUpperCase()}
      </p>
    </div>
  );
}
