"use client";
import Image from "next/image";

export type PackageLabelVariant = "regular" | "vip";
export type PackageLabelSize = "default" | "small";

const variantStyles: Record<
  PackageLabelVariant,
  {
    labelName: string;
    labelBackground: string;
  }
> = {
  regular: {
    labelName: "REGULAR",
    labelBackground: "bg-[#5C558B]",
  },
  vip: {
    labelName: "VIP",
    labelBackground:
      "bg-gradient-to-r from-20% from-[#52339E] to-100% to-[#281A53]",
  },
};

interface PackageLabelBlueprintProgramSVPProps {
  variant: PackageLabelVariant;
  size?: PackageLabelSize;
}

export default function PackageLabelBlueprintProgramSVP({
  variant,
  size = "default",
}: PackageLabelBlueprintProgramSVPProps) {
  const { labelName, labelBackground } = variantStyles[variant];
  const smallSize = size === "small";
  const vipVariant = variant === "vip";

  return (
    <div className="label-outline p-[1px] bg-gradient-to-r from-0% from-white/50 to-100% to-[#999999]/20 rounded-full">
      <div
        className={`label-container flex items-center gap-[6px] px-3 py-1 ${labelBackground} rounded-full`}
      >
        {vipVariant && (
          <div
            className={`label-icon aspect-square ${
              smallSize ? "w-3 lg:w-4" : "w-5 lg:w-6"
            } `}
          >
            <Image
              src={
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/label-icon-vip.svg"
              }
              alt="Icon"
              width={400}
              height={400}
            />
          </div>
        )}

        <p
          className={`label-name font-brand font-bold text-white  ${
            smallSize ? "text-xs lg:text-sm" : "text-base lg:text-xl"
          }`}
        >
          {labelName}
        </p>
      </div>
    </div>
  );
}
