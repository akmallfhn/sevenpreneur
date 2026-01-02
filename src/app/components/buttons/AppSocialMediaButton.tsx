"use client";
import { SocialMediaVariant } from "@/lib/app-types";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faWhatsapp,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const variantSocialMedia: Record<SocialMediaVariant, { icon: IconProp }> = {
  instagram: {
    icon: faInstagram,
  },
  facebook: {
    icon: faFacebookF,
  },
  linkedin: {
    icon: faLinkedinIn,
  },
  x: {
    icon: faXTwitter,
  },
  whatsapp: {
    icon: faWhatsapp,
  },
};

interface AppSocialMediaButtonProps {
  link: string;
  variant: SocialMediaVariant;
}

export default function AppSocialMediaButton(props: AppSocialMediaButtonProps) {
  const { icon } = variantSocialMedia[props.variant];

  return (
    <a href={props.link} target="_blank" rel="noopener noreferrer">
      <div className="button-socmed group flex items-center justify-center size-9 bg-[#F1F5F9] rounded-full transition transform duration-200 hover:bg-primary active:bg-primary-dark active:scale-95 lg:size-10">
        <div className="flex items-center justify-center p-1 bg-[#8B95A5] text-[#F1F5F9] aspect-square rounded-full transition transform duration-200 group-hover:bg-primary group-hover:text-white">
          <FontAwesomeIcon icon={icon} />
        </div>
      </div>
    </a>
  );
}
