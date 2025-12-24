"use client";
import { ReactionVariant } from "@/lib/app-types";
import { Heart, LucideIcon, Star } from "lucide-react";

const variantStyles: Record<
  ReactionVariant,
  {
    activeColor: string;
    activeLabel: string;
    inactiveLabel: string;
    icon: LucideIcon;
    iconColor: string;
  }
> = {
  favorite: {
    activeColor: "bg-[#FCEDF1] text-secondary",
    activeLabel: "Favorited",
    inactiveLabel: "Favorite",
    icon: Heart,
    iconColor: "#e74d79",
  },
  scout: {
    activeColor: "bg-[#FEF8E7] text-[#E5BA39]",
    activeLabel: "Scout",
    inactiveLabel: "General",
    icon: Star,
    iconColor: "#E5BA39",
  },
};

interface AppReactionButtonProps {
  isSelected: boolean;
  variant: ReactionVariant;
  onClick: () => void;
}

export default function AppReactionButton(props: AppReactionButtonProps) {
  const {
    activeColor,
    activeLabel,
    inactiveLabel,
    icon: Icon,
    iconColor,
  } = variantStyles[props.variant];

  return (
    <button
      className={`like-button flex w-fit items-center justify-center gap-1.5 py-1.5 px-2.5 transition-transform ease-in-out rounded-full active:scale-90 hover:cursor-pointer ${
        props.isSelected
          ? `border-0 ${activeColor}`
          : "border border-outline text-[#444444]"
      }`}
      onClick={props.onClick}
    >
      <Icon
        className="size-5"
        fill={props.isSelected ? iconColor : "none"}
        strokeWidth={props.isSelected ? 0 : 2}
      />
      <p className="font-bodycopy font-medium text-sm">
        {props.isSelected ? activeLabel : inactiveLabel}
      </p>
    </button>
  );
}
