"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface SocialButtonFooterSVPProps {
  iconButton: IconProp;
}

export default function SocialButtonFooterSVP({
  iconButton,
}: SocialButtonFooterSVPProps) {
  return (
    <div className="button-socmed flex items-center justify-center size-9 bg-white text-black rounded-full transition transform border-4 border-[#646464] active:scale-95 lg:size-10">
      <FontAwesomeIcon icon={iconButton} />
    </div>
  );
}
