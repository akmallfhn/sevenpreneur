"use client";
import { Check } from "lucide-react";
import Image from "next/image";

export default function AboutBlueprintProgramSVP() {
  const audiences = [
    "<b>Business owner</b> yang stuck & ingin level up dengan sistem",
    "<b>Corporate leaders</b> yang ingin scale-up unit bisnis",
    "<b>Family business owners</b> yang ingin membangun bisnis yang bertahan lintas generasi",
    "<b>Professional</b> yang ingin berkarier sebagai business leaders",
  ];

  return (
    <div>
      <div className="section-root relative flex items-center justify-center bg-black overflow-hidden">
        <div className="section-container flex flex-col w-full items-center p-5 py-10 gap-8 z-10 lg:flex-row lg:justify-between lg:px-0 lg:gap-[64px] lg:py-[60px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
          {/* Section Image */}
          <div className="section-image w-full lg:max-w-[548px] shrink-0">
            <Image
              src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/about-sbbp8.webp"
              alt="Program Overview Sevenpreneur Business Blueprint Program"
              width={1000}
              height={1000}
            />
          </div>

          {/* Section Content */}
          <div className="section-content flex flex-col text-center items-center gap-6 lg:text-left lg:items-start">
            <div className="section-title-desc flex flex-col w-full items-center gap-3 z-10">
              <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl max-w-[598px] sm:text-3xl lg:text-4xl lg:max-w-full">
                Bantu bisnis keluar dari stagnasi dengan sistem dan strategi
              </h2>
              <p className="section-desc text-[15px] font-bodycopy text-white max-w-[598px] sm:text-base lg:max-w-full lg:text-xl">
                Kelas dengan strategi framework praktis untuk segala aspek
                bisnis seperti memperluas market, membangun offer yang kuat,
                menciptakan sistem kerja tim, dan sistem cashflow yang siap
                scale.
              </p>
            </div>

            {/* Section Audiences */}
            <div className="section-audiences flex flex-col gap-3 items-start">
              <p className="section-desc text-[15px] font-bodycopy text-white max-w-[326px] sm:text-base lg:text-xl lg:max-w-[712px]">
                Just right for you:
              </p>
              <div className="audiences flex flex-col gap-2">
                {audiences.map((post) => (
                  <div
                    key={post}
                    className="audience-list flex bg-[#1C1C1C] p-3 text-white text-left font-bodycopy items-center gap-3 rounded-md max-w-[598px] lg:p-4"
                  >
                    <div className="audience-check flex size-6 lg:size-8 items-center justify-center bg-[#3417E3] rounded-full shrink-0">
                      <Check color="#FFFFFF" className="w-3.5 h-auto lg:w-5" />
                    </div>
                    <p
                      className="audience-item text-[15px] font-bodycopy sm:text-base lg:text-xl"
                      dangerouslySetInnerHTML={{ __html: post }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
