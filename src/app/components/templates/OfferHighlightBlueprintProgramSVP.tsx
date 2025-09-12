"use client";

import OfferItemBlueprintProgramSVP from "../items/OfferItemBlueprintProgramSVP";

export default function OfferHighlightBlueprintProgramSVP() {
  return (
    <div className="section-root relative flex items-center justify-center bg-black overflow-hidden">
      <div className="section-container flex flex-col w-full items-center gap-8 p-5 py-10 z-20 lg:px-0 lg:py-[60px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {/* Section Title & Desc */}
        <div className="section-title-desc flex flex-col w-full text-center items-center gap-3 z-10">
          <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-center text-2xl sm:max-w-[662px] sm:text-3xl lg:text-4xl ">
            Its Not a Business Class <br /> Its a Tools for Entrepreneur
          </h2>
          {/* <p className="section-desc text-sm font-bodycopy text-white max-w-[326px] lg:text-xl lg:max-w-[672px]">
            Sevenpreneur membuka akses ke strategi, eksekusi, dan insight nyata
            yang bisa langsung mengangkat bisnis kamu ke level berikutnya.
          </p> */}
        </div>

        {/* Offer List */}
        <div className="offers flex flex-col items-center gap-4 lg:gap-6">
          <div className="offer-list flex flex-col w-full items-center gap-4 lg:grid lg:grid-cols-[594px_300px] lg:gap-6 lg:justify-center">
            <OfferItemBlueprintProgramSVP
              offerVariant="imageFirst"
              offerTitle="Live Class Blueprint Curiculum"
              offerDescription="7 sesi online interaktif membahas 7 Framework, dipandu oleh Professional Business Coach."
              offerImage="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/benefit-1.webp"
              offerIcon={
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon-blueprint.svg"
              }
            />
            <OfferItemBlueprintProgramSVP
              offerTitle="Lifetime Access"
              offerDescription="Materi tersimpan di Learning Management System, bisa diakses kapan saja"
              offerBackground="bg-primary"
              offerIcon="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon-infinity.svg"
            />
          </div>
          <div className="offer-list flex flex-col w-full gap-4 lg:grid lg:grid-cols-[300px_594px] lg:gap-6 lg:justify-center">
            <OfferItemBlueprintProgramSVP
              className="lg:order-2"
              offerVariant="imageFirst"
              offerTitle="Insightful Talks"
              offerDescription="Kesempatan belajar langsung dengan business expert dan CEO terkemuka."
              offerImage="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/benefit-2.webp"
              offerIcon={
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon-sparks.svg"
              }
            />
            <OfferItemBlueprintProgramSVP
              className="lg:order-1"
              offerTitle="Modul, Tools &  Framework"
              offerDescription="Pelajari bisnis secara menyeluruh lewat 20+ Modul, Tools & Framework praktis."
              offerBackground="bg-[#CC446A]"
              offerIcon="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon-tools.svg"
            />
          </div>
          <div className="offer-list flex flex-col w-full items-center gap-4 lg:grid lg:grid-cols-[594px_300px] lg:gap-6 lg:justify-center">
            <OfferItemBlueprintProgramSVP
              offerVariant="imageFirst"
              offerTitle="Offline Session+ at Jakarta"
              offerDescription="Workshop strategi fundraising, investor secrets, dan konsultasi bisnis 1-on-1 dalam sesi eksklusif di Jakarta."
              offerImage="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/benefit-3.webp"
              isVip
            />
            <OfferItemBlueprintProgramSVP
              offerTitle="Intimate Dinner & Networking"
              offerDescription="Terhubung dan berbagi insight bersama para visionary business leaders."
              offerBackground="bg-[#3417E3]"
              offerIcon="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon-networking.svg"
              isVip
            />
          </div>
        </div>
      </div>
    </div>
  );
}
