"use client";
import { Check } from "lucide-react";
import Image from "next/image";

export default function OffersBlueprintProgramSVP() {
  const offerList = [
    {
      title: "Kurikulum bisnis terlengkap dengan Seven Framework+",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/Frame%201686552596.png",
      benefits: [
        "Menentukan arah dan model bisnis yang tepat",
        "Strategi marketing & sales yang terbukti jalan",
        "Sistem operasional dalam mengelola sumber daya dan cashflow",
      ],
    },
    {
      title: "Coach dengan pengalaman bertahun-tahun di dunia bisnis.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/Frame%201686552595.png",
      benefits: [
        "Q&A bahas case bisnis kamu selama kelas",
        "Mentoring 1-on-1  sesuai kondisi bisnismu",
        "Insight praktis dari pengalaman langsung di industri",
      ],
    },
    {
      title: "AI business tools di setiap tahap bisnis",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/Frame%201686552595-1.png",
      benefits: [
        "AI Tools untuk menentukan market, ide bisnis, pricing, dan validasi keputusan",
        "Virtual Coach AI untuk konsultasi strategi, diskusi, dan pengambilan keputusan bisnis",
        "Lifetime Access, sekali daftar bisa digunakan kapan saja selamanya",
      ],
    },
    {
      title: "Dukungan pembelajaran terintegrasi melalui LMS",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/Frame%201686552595-2.png",
      benefits: [
        "Materi terekam, tersimpan, dan dapat dipelajari kapan saja tanpa batas waktu",
        "Diskusi langsung atau sesi Q&A bersama coach",
        "Business assessment untuk evaluasi kesehatan dan kesiapan bisnis",
      ],
    },
  ];

  return (
    <div className="section-root relative flex items-center justify-center bg-black overflow-hidden">
      <div className="section-container flex flex-col w-full items-center gap-8 p-5 py-10 z-20 lg:px-0 lg:py-[60px] lg:gap-[64px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-center text-2xl sm:max-w-[662px] sm:text-3xl lg:max-w-[788px] lg:text-4xl">
          Not Just a Business Class. <br /> It’s The Perfect Ecosystem for
          Entrepreneurs.
        </h2>
        <div className="offers relative flex flex-col w-fit justify-center items-center gap-10 lg:gap-14">
          {offerList.map((post, index) => (
            <div
              className="offer-item flex w-full gap-5 z-10 lg:justify-normal lg:items-center lg:gap-16"
              key={index}
            >
              <p className="offer-index flex items-center justify-center text-white size-6 bg-[#48363B] outline-4 outline-[#2A2A2A] rounded-full font-brand font-medium text-sm shrink-0 lg:size-10 lg:text-xl lg:outline-[6]">
                {index + 1}
              </p>
              <div className="offer-metadata flex flex-col gap-4 lg:gap-10 lg:flex-row lg:items-center">
                <div className="flex w-fit max-h-[334px] aspect-[500/334] shrink-0 xl:max-h-[348px]">
                  <Image
                    className="object-cover w-full h-full"
                    src={post.image}
                    alt={post.title}
                    width={700}
                    height={700}
                  />
                </div>
                <div className="flex flex-col gap-4 max-w-[521px] lg:max-w-none">
                  <h4 className="offer-title font-bold font-brand text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] text-2xl sm:text-3xl lg:text-4xl">
                    {post.title}
                  </h4>
                  <div className="benefits flex flex-col gap-4">
                    {post.benefits.map((post, index) => (
                      <div
                        key={index}
                        className="audience-list flex text-white text-left font-bodycopy items-center gap-3 rounded-md"
                      >
                        <div className="audience-check flex aspect-square p-1 items-center justify-center bg-[#3417E3] rounded-full shrink-0">
                          <Check
                            color="#FFFFFF"
                            className="w-3.5 h-auto lg:w-4"
                          />
                        </div>
                        <p className="audience-item text-[15px] font-bodycopy text-white/70 sm:text-base lg:text-xl">
                          {post}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div
            className="rail absolute w-[1px] left-3 top-0 h-full self-stretch lg:w-[2px] lg:h-3/4 lg:top-1/2 lg:left-[17px] lg:translate-x-0 lg:-translate-y-1/2"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, #5E5E5E 0, #5E5E5E 6px, transparent 6px, transparent 12px)",
            }}
          />
          {/* <div className="offer-list flex flex-col w-full items-center gap-4 lg:grid lg:grid-cols-[594px_300px] lg:gap-6 lg:justify-center">
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
              offerDescription="Praktis, aplikatif, dan bisa dipakai langsung di bisnismu"
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
