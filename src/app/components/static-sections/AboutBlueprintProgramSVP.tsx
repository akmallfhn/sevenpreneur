"use client";
import { Check } from "lucide-react";
import Image from "next/image";

export default function AboutBlueprintProgramSVP() {
  return (
    <div>
      <div className="section-root relative flex items-center justify-center bg-black overflow-hidden">
        <div className="section-container flex flex-col w-full items-center p-5 py-10 gap-8 z-10 lg:flex-row lg:justify-between lg:px-0 lg:gap-[64px] lg:py-[60px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
          {/* Section Image */}
          <div className="section-image w-full lg:max-w-[548px] shrink-0">
            <Image
              src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/overview-image.webp"
              alt="Program Overview Sevenpreneur Business Blueprint Program"
              width={1000}
              height={1000}
            />
          </div>

          {/* Section Content */}
          <div className="section-content flex flex-col text-center items-center gap-6 lg:text-left lg:items-start">
            <div className="section-title-desc flex flex-col w-full items-center gap-3 z-10">
              <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl max-w-[598px] sm:text-3xl lg:text-4xl lg:max-w-full">
                Punya ide bisnis brilian tapi nggak tahu mulai dari mana?
              </h2>
              <p className="section-desc text-sm font-bodycopy text-white max-w-[598px] sm:text-base lg:max-w-full lg:text-xl">
                Sevenpreneur Business Blueprint Program memberikan panduan{" "}
                <b>step-by-step membangun bisnis</b>. Dengan roadmap yang
                terstruktur, kamu bisa membangun bisnis yang scalable dan siap
                tumbuh tanpa bingung harus mulai dari mana atau harus tanya
                siapa.
              </p>
            </div>

            {/* Section Audiences */}
            <div className="section-audiences flex flex-col gap-3 items-start">
              <p className="section-desc text-sm font-bodycopy text-white max-w-[326px] sm:text-base lg:text-xl lg:max-w-[712px]">
                Just right for you:
              </p>
              <div className="audiences flex flex-col gap-2">
                <div className="audience-list flex bg-[#1C1C1C] p-3 text-white text-left font-bodycopy items-center gap-3 rounded-md max-w-[598px] lg:p-4">
                  <div className="audience-check flex size-6 lg:size-8 items-center justify-center bg-[#3417E3] rounded-full shrink-0">
                    <Check color="#FFFFFF" className="w-3.5 h-auto lg:w-5" />
                  </div>
                  <p className="audience-item text-sm font-bodycopy sm:text-base lg:text-xl">
                    <b>Pengusaha pemula</b> yang mulai berbisnis
                  </p>
                </div>
                <div className="audience-list flex bg-[#1C1C1C] p-3 text-white text-left font-bodycopy items-center gap-3 rounded-md max-w-[598px] lg:p-4">
                  <div className="audience-check flex size-6 lg:size-8 items-center justify-center bg-[#3417E3] rounded-full shrink-0">
                    <Check color="#FFFFFF" className="w-3.5 h-auto lg:w-5" />
                  </div>
                  <p className="audience-item text-sm font-bodycopy sm:text-base lg:text-xl">
                    <b>Karyawan korporasi</b> dengan side-business
                  </p>
                </div>
                <div className="audience-list flex bg-[#1C1C1C] p-3 text-white text-left font-bodycopy items-center gap-3 rounded-md max-w-[598px] lg:p-4">
                  <div className="audience-check flex size-6 lg:size-8 items-center justify-center bg-[#3417E3] rounded-full shrink-0">
                    <Check color="#FFFFFF" className="w-3.5 h-auto lg:w-5" />
                  </div>
                  <p className="audience-item text-sm font-bodycopy sm:text-base lg:text-xl">
                    <b>Business owner</b> yang stuck & ingin level up
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="color-background absolute bg-[#3417E3] blur-[120px] w-[500px] h-[1000px] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-full z-[1] will-change-transform lg:blur-[200px] lg:w-[1488px] lg:h-[400px]" /> */}
      </div>
    </div>
  );
}
