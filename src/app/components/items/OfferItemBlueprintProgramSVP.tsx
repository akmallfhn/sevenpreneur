"use client";
import Image from "next/image";
import { HTMLAttributes } from "react";
import PackageLabelBlueprintProgramSVP from "../labels/PackageLabelBlueprintProgramSVP";

interface OfferItemBlueprintProgramSVP extends HTMLAttributes<HTMLDivElement> {
  offerVariant?: "default" | "imageFirst";
  offerTitle: string;
  offerDescription: string;
  offerImage?: string;
  offerIcon?: string;
  offerBackground?: string;
  isVip?: boolean;
}

export default function OfferItemBlueprintProgramSVP({
  offerVariant = "default",
  offerTitle,
  offerDescription,
  offerImage,
  offerIcon,
  offerBackground,
  isVip = false,
  className,
  ...res
}: OfferItemBlueprintProgramSVP) {
  const isImageFirst = offerVariant === "imageFirst";
  const isDefault = offerVariant === "default";

  return (
    <div
      className={`offer-outline flex w-full h-full max-w-[380px] items-center p-[1px] bg-gradient-to-br from-0% from-[#C4C4C4]/40 to-65% to-[#999999]/10 rounded-md lg:max-w-none ${
        className || ""
      }`}
      {...res}
    >
      <div
        className={`offer-container group relative flex ${
          offerBackground ? offerBackground : "bg-black"
        } aspect-[3.4/2] rounded-md overflow-hidden ${
          isImageFirst
            ? "w-full h-full lg:aspect-[554/280] "
            : "w-full h-full lg:aspect-square"
        }`}
      >
        {/* Offer Image */}
        {offerImage && (
          <div className="offer-image flex w-full h-full">
            <Image
              className="object-cover w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
              src={offerImage}
              alt={offerTitle!}
              width={500}
              height={500}
            />
          </div>
        )}

        {/* Offer Title & Desc */}
        <div className="offer-content absolute flex flex-col bottom-5 left-5 pr-5 gap-1 z-30 lg:pr-10">
          {isVip && (
            <div className="vip-badge w-fit">
              <PackageLabelBlueprintProgramSVP variant="vip" size="small" />
            </div>
          )}
          {isImageFirst && offerIcon && (
            <div className="offer-image flex size-8">
              <Image
                className="object-cover w-full h-full"
                src={offerIcon}
                alt={offerTitle}
                width={300}
                height={300}
              />
            </div>
          )}
          <h3 className="offer-title font-brand font-bold text-lg text-white leading-tight lg:text-[24px]">
            {offerTitle}
          </h3>
          <p className="offer-description font-bodycopy text-sm text-white lg:text-base">
            {offerDescription}
          </p>
        </div>

        {/* Overlay */}
        {isImageFirst && (
          <>
            <div className="overlay-black-transparent absolute inset-0 bg-black/20 z-10" />
            <div className="overlay-black-transparent absolute inset-0 bg-gradient-to-t from-0% from-black to-100% to-transparent z-20" />
          </>
        )}

        {/* Icon Default */}
        {isDefault && offerIcon && (
          <div className="offer-image absolute flex size-[128px] top-0 right-3 opacity-20 z-10">
            <Image
              className="object-cover w-full h-full"
              src={offerIcon}
              alt={offerTitle}
              width={300}
              height={300}
            />
          </div>
        )}
      </div>
    </div>
  );
}
