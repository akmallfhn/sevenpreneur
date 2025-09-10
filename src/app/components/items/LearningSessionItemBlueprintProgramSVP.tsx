"use client";
import Image from "next/image";
import PackageLabelBlueprintProgramSVP from "../labels/PackageLabelBlueprintProgramSVP";

export type LearningSessionVariantBlueprintProgramSVP =
  | "frameworkPrimary"
  | "frameworkSecondary"
  | "founderSeries"
  | "extraordinary";

const variantStyles: Record<
  LearningSessionVariantBlueprintProgramSVP,
  {
    background_color: string;
    overlay_color: string;
    asset_decoration: string;
    image_decoration: string;
  }
> = {
  frameworkPrimary: {
    background_color: "bg-[#003399]",
    overlay_color: "bg-[#E74D79]",
    asset_decoration:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/asset-square-primary.svg",
    image_decoration:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/bg-decoration-primary.svg",
  },
  frameworkSecondary: {
    background_color: "bg-[#0165F6]",
    overlay_color: "bg-[#003399]",
    asset_decoration:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/asset-square-secondary-extra.svg",
    image_decoration:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/bg-decoration-secondary.svg",
  },
  founderSeries: {
    background_color: "bg-[#E74D79]",
    overlay_color: "bg-[#B10032]",
    asset_decoration:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/asset-square-fsos.svg",
    image_decoration:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/bg-decoration-fsos.svg",
  },
  extraordinary: {
    background_color: "bg-black",
    overlay_color: "bg-[#3E3E3E]",
    asset_decoration:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/asset-square-secondary-extra.svg",
    image_decoration:
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/bg-decoration-extra.svg",
  },
};

interface LearningSessionItemBlueprintProgramSVPProps {
  sessionNumber: string;
  sessionName: string;
  sessionDescription?: string;
  sessionEducator: string;
  sessionEducatorTitle: string;
  sessionEducatorAvatar: string;
  variant: LearningSessionVariantBlueprintProgramSVP;
}

export default function LearningSessionItemBlueprintProgramSVP({
  sessionNumber,
  sessionName,
  sessionDescription,
  sessionEducator,
  sessionEducatorTitle,
  sessionEducatorAvatar,
  variant,
}: LearningSessionItemBlueprintProgramSVPProps) {
  const {
    background_color,
    overlay_color,
    asset_decoration,
    image_decoration,
  } = variantStyles[variant];
  const backgroundColor = background_color;
  const overlayColor = overlay_color;
  const assetDecoration = asset_decoration;
  const imageDecoration = image_decoration;

  return (
    <div className="learning-session-outline p-[1px] bg-gradient-to-br from-0% from-[#C4C4C4] to-65% to-[#30266D] rounded-md lg:rounded-lg">
      <div
        className={`learning-session-container relative flex flex-col w-[340px] h-full text-white p-5 justify-between aspect-[340/170] lg:aspect-[624/302] lg:w-[594px] ${backgroundColor} rounded-md overflow-hidden lg:rounded-lg`}
      >
        <div className="learning-session-content flex flex-col z-40">
          {sessionNumber && (
            <h4 className="session-chapter font-bold font-brand text-2xl lg:text-[48px]">
              {sessionNumber}
            </h4>
          )}
          {!sessionNumber && (
            <Image
              className="flex max-w-[52px] pb-1 opacity-70 lg:max-w-[92px] lg:pb-3"
              src={
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/founder-series-logo.svg"
              }
              alt="Founder Series Sevenpreneur"
              width={300}
              height={300}
            />
          )}
          <h3 className="session-title font-bold font-brand max-w-[184px] leading-tight text-transparent bg-clip-text bg-gradient-to-b from-0% from-[#D1CDCD] via-50% via-white to-100% to-[#D1CDCD] line-clamp-3 lg:text-2xl lg:max-w-[336px]">
            {sessionName}
          </h3>
          {sessionDescription && (
            <p className="session-desc font-bodycopy text-[10px] max-w-[184px] lg:text-lg lg:max-w-[332px]">
              {sessionDescription}
            </p>
          )}
        </div>
        <div className="learning-session-content flex flex-col font-bodycopy z-40">
          <h4 className="session-educator font-bold text-xs lg:text-lg">
            {sessionEducator}
          </h4>
          <p className="session-educator-title text-[10px] lg:text-base">
            {sessionEducatorTitle}
          </p>
        </div>

        {/* Absolute Overlay */}
        <Image
          className="neon-side-top-left absolute flex w-44 top-0 left-0 opacity-50 lg:w-[227px]"
          src={
            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//effect-side-neon.webp"
          }
          alt="Effect Neon Side"
          width={200}
          height={200}
          layout="raw"
        />
        <div
          className={`circle-blur-center absolute flex ${overlayColor} w-[354px] h-[128px] -bottom-[115px] left-1/2 -translate-x-1/2 blur-[50px] rounded-full lg:w-[648px] lg:h-[235px] lg:-bottom-[216px]`}
        />
        <Image
          className="asset-decoration absolute flex max-w-8 top-5 right-28 z-10 lg:max-w-14 lg:right-64"
          src={assetDecoration}
          alt="Asset Decoration"
          width={200}
          height={200}
        />
        <Image
          className={`asset-decoration absolute flex w-full top-1/4 -translate-y-1/4 z-10 ${
            variant === "frameworkSecondary" || "extraordinary"
              ? "right-0"
              : "right-2 lg:right-6"
          } ${
            variant === "extraordinary"
              ? "max-w-[160px] lg:max-w-[300px]"
              : "max-w-[120px] lg:max-w-[220px]"
          }`}
          src={imageDecoration}
          alt="Image Decoration"
          width={200}
          height={200}
        />
        {/* Speakers Image */}
        <div className="session-speaker-image absolute flex aspect-square w-[160px] bottom-0 -right-4 z-30 lg:w-[272px]">
          <Image
            className="object-cover w-full h-full"
            src={sessionEducatorAvatar}
            alt={sessionEducator}
            width={400}
            height={400}
          />
        </div>

        {/* Label */}
        {variant === "extraordinary" && (
          <div className="extraordinary-label absolute top-2 right-2 z-30 lg:top-4 lg:right-4">
            <PackageLabelBlueprintProgramSVP variant="vip" size="small" />
          </div>
        )}
      </div>
    </div>
  );
}
