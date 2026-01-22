"use client";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import AppButton from "../buttons/AppButton";

export default function InstagramTypeContentSVP() {
  return (
    <div className="section-root relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-0% from-white to-70% to-[#DEEBFF] dark:from-coal-black dark:to-[#1A0951]">
      <div className="section-container flex flex-col w-full items-center gap-20 p-5 py-10 z-20 lg:px-0 lg:py-[60px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        <div className="section-item flex flex-col w-full items-center gap-8 lg:gap-[48px]">
          <div className="flex flex-col items-center gap-4">
            <h2 className="section-title w-fit text-transparent leading-snug bg-clip-text bg-gradient-to-r from-40% from-black to-100% to-primary font-brand font-bold text-center text-xl max-w-[420px] sm:text-2xl lg:text-4xl lg:max-w-[680px] dark:from-white">
              Trusted source of business knowledge, trends, and insights.
            </h2>
            <a
              href="https://www.instagram.com/7preneur/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AppButton variant="primaryGradient" size="defaultRounded">
                <FontAwesomeIcon icon={faInstagram} />
                Follow us on Instagram
              </AppButton>
            </a>
          </div>
          <div className="content-types grid grid-cols-2 w-full gap-5 sm:grid-cols-4 lg:gap-10">
            <div className="deep-data flex flex-col w-full gap-5 mt-[36px] lg:mt-[72px] lg:gap-10">
              <Image
                className="w-full"
                src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/hvc-dd.webp"
                alt="Deep Data"
                width={400}
                height={400}
              />
              <Image
                className="w-full"
                src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/hvc-dd-1.webp"
                alt="Deep Data"
                width={400}
                height={400}
              />
            </div>
            <div className="flash flex flex-col w-full gap-5 lg:gap-10">
              <Image
                className="w-full"
                src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/hvc-flash.webp"
                alt="Deep Data"
                width={400}
                height={400}
              />
              <Image
                className="w-full"
                src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/hvc-flash-1.webp"
                alt="Deep Data"
                width={400}
                height={400}
              />
            </div>
            <div className="founder-series flex flex-col w-full gap-5 sm:mt-[68px] lg:mt-[124px] lg:gap-10">
              <Image
                className="w-full"
                src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/hvc-fs.webp"
                alt="Deep Data"
                width={400}
                height={400}
              />
              <Image
                className="w-full"
                src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/hvc-fs-1.webp"
                alt="Deep Data"
                width={400}
                height={400}
              />
            </div>
            <div className="think-like-this flex flex-col w-full gap-5 -mt-[36px] sm:mt-[24px] lg:gap-10">
              <Image
                className="w-full"
                src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/hvc-tlt.webp"
                alt="Deep Data"
                width={400}
                height={400}
              />
              <Image
                className="w-full"
                src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/hvc-tlt-1.webp"
                alt="Deep Data"
                width={400}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
