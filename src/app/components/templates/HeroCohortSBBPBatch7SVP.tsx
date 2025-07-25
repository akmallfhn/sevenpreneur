"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";

export default function HeroCohortSBBPBatch7SVP() {
  return (
    <div className="hero-container flex relative w-full">
      <Image
        className="flex object-cover w-full h-full lg:hidden"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/cohort/hero-sbbp-mobile.webp"
        }
        alt="Hero SBBP 7"
        width={1000}
        height={1000}
      />
      <Image
        className="hidden object-cover w-full h-full lg:flex"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/cohort/hero-sbbp-desktop-high.webp"
        }
        alt="Hero SBBP 7"
        width={1000}
        height={1000}
      />

      {/* CTA */}
      <a
        href={"https://forms.gle/bsMEhPyh2nLCHHsK8"}
        className="absolute hidden bottom-14 left-1/2 -translate-x-1/2 lg:flex xl:bottom-24"
        target="_blank"
        rel="noopenner noreferrer"
      >
        <AppButton size="largeRounded" className="w-[320px]">
          Get 50% Discount
        </AppButton>
      </a>

      <a
        href={"https://forms.gle/bsMEhPyh2nLCHHsK8"}
        className="absolute flex bottom-16 left-1/2 -translate-x-1/2 lg:hidden"
        target="_blank"
        rel="noopenner noreferrer"
      >
        <AppButton size="defaultRounded" className="w-[320px]">
          Get 50% Discount
        </AppButton>
      </a>
    </div>
  );
}
