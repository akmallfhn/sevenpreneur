"use client";
import Image from "next/image";

export default function PartnerLogosRestart25() {
  return (
    <div className="flex flex-col items-center gap-10 px-8 pb-20">
      {/* Brand Partner */}
      <div className="flex flex-col items-center gap-2">
        <h3 className="section-title text-white/70 text-sm font-bold font-brand tracking-[0.2em]">
          {"Brand Partner".toUpperCase()}
        </h3>
        <div className="flex w-full h-14 lg:h-28">
          <Image
            className="object-contain w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sponsor-restart/brand-partner.png"
            }
            alt="Brand Partner Logo"
            width={500}
            height={500}
          />
        </div>
      </div>

      {/* Media Partner */}
      <div className="flex flex-col items-center gap-2">
        <h3 className="section-title text-white/70 text-sm font-bold font-brand tracking-[0.2em]">
          {"Media Partner".toUpperCase()}
        </h3>
        <div className="flex w-full h-14 lg:h-28">
          <Image
            className="object-contain w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sponsor-restart/media-partner.png"
            }
            alt="Media Partner Logo"
            width={500}
            height={500}
          />
        </div>
      </div>
    </div>
  );
}
