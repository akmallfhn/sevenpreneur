"use client";
import AntarestarLogo from "../svg-logos/AntarestarLogo";
import GentanalaLogo from "../svg-logos/GentanalaLogo";

export default function BusinessesAlumniSVP() {
  return (
    <div className="section-root relative flex items-center justify-center bg-[#F1F6FF] overflow-hidden dark:bg-surface-black">
      <div className="section-container flex flex-col w-full items-center gap-8 lg:gap-[48px] p-5 py-10 z-20 lg:px-0 lg:py-[60px]">
        <h2 className="section-title w-fit text-transparent leading-snug bg-clip-text bg-gradient-to-r from-40% from-black to-100% to-primary font-brand font-bold text-center text-xl sm:text-2xl lg:text-4xl lg:max-w-[680px] dark:from-white">
          Our Businesses Alumni
        </h2>
        <div className="flex items-center gap-10">
          <AntarestarLogo className="max-h-20 w-auto" />
          {/* <div className="max-h-80">
            <Image
              src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-geprekin-aja.webp"
              alt="Geprekin Aja"
              width={200}
              height={200}
            />
          </div> */}
          <GentanalaLogo className="max-h-24 w-auto" />
        </div>
      </div>
    </div>
  );
}
