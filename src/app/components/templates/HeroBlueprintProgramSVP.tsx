"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import CountdownTimerRestart25 from "../custom-components-restart25/CountdownTimerRestart25";
import Link from "next/link";
import { ArrowDown, Sparkles } from "lucide-react";
import ScorecardItemSVP from "../items/ScorecardItemSVP";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "react";

export default function HeroBlueprintProgramSVP() {
  const [buttonSize, setButtonSize] = useState<
    "defaultRounded" | "largeRounded"
  >(
    typeof window !== "undefined" && window.innerWidth < 1024
      ? "defaultRounded"
      : "largeRounded"
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setButtonSize("defaultRounded");
      } else {
        setButtonSize("largeRounded");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  return (
    <div className="relative gap-5 flex flex-col items-center w-full bg-black overflow-hidden">
      {/* Hero Container */}
      <div className="hero-container relative flex w-full items-center py-14 px-4 z-[70] lg:px-0 lg:pt-20 lg:pb-24 lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {/* Content */}
        <div className="hero-content flex flex-col w-full items-center gap-52 lg:gap-[28px] lg:items-start">
          <div className="flex flex-col gap-3 items-center text-white lg:items-start ">
            <div className="flex flex-col items-center text-center gap-2.5 lg:flex-row lg:text-left">
              <h1 className="text-sm font-brand font-semibold tracking-widest lg:text-lg xl:text-xl">
                BUSINESS BLUEPRINT PROGRAM
              </h1>
              <div className="p-[1px] bg-gradient-to-br from-0% from-[#C4C4C4] to-100% to-[#30266D] rounded-full">
                <div className="flex text-white items-center gap-1 py-1 px-3.5 bg-gradient-to-tr from-0% from-[#2B0E6E] to-100% to-[#1C125F] rounded-full">
                  <p className="text-[13px] font-brand font-bold">
                    INTEGRATED WITH AI
                  </p>
                  <div className="flex size-4">
                    <Image
                      className="object-cover w-full h-full"
                      src={
                        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sparkles-icon.svg"
                      }
                      alt="AI Icon"
                      height={100}
                      width={100}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center text-center font-brand font-bold text-2xl max-w-[380px] lg:items-start lg:text-[32px] lg:text-left lg:max-w-[472px] xl:text-[52px] xl:max-w-[698px]">
              <h2 className="w-full text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] truncate">
                Don’t Just Start a Business.
              </h2>
              <h2 className="w-fit text-transparent bg-clip-text bg-gradient-to-r from-57% from-primary to-90% to-secondary">
                Build a Blueprint.
              </h2>
            </div>
            <p className="w-[317px] italic text-sm text-center font-bodycopy lg:w-[460px] lg:text-lg lg:text-left xl:w-[518px] xl:text-xl">
              End-to-end business mastery with proven frameworks and top-tier
              coaching.
            </p>
            <div className="scorecards flex gap-4">
              <ScorecardItemSVP
                scorecardValue={7}
                scorecardName="Business Chapters"
                isMoreValue
              />
              <ScorecardItemSVP
                scorecardValue={20}
                scorecardName="Modules & AI Tools"
                isMoreValue
              />
              <ScorecardItemSVP
                scorecardValue={10}
                scorecardName="Coaches & Speakers"
                isMoreValue
              />
              <ScorecardItemSVP
                scorecardValue={3000}
                scorecardName="Program Alumni"
                isMoreValue
              />
            </div>
          </div>
          <div className="flex flex-col w-[300px] items-center gap-3 lg:w-fit lg:flex-row">
            <Link
              href={`https://www.${domain}/playlists/restart-conference-2025/1`}
              className="w-full p-[1px] rounded-full bg-gradient-to-b from-0% from-[#7B6FF0] to-69% to-[#4C3FEC]"
            >
              <AppButton
                size={buttonSize}
                variant="primaryGradient"
                className="w-full lg:w-fit"
                featureName="join_program_scroll"
              >
                <p className="text-base lg:text-lg">Gabung Program</p>
              </AppButton>
            </Link>
            <a
              href="https://wa.me/62895803221561"
              className="w-full"
              target="_blank"
              rel="noopenner noreferrer"
            >
              <AppButton
                size={buttonSize}
                variant="hollowWhatsapp"
                className="w-full lg:w-fit"
                featureName="whatsapp_consultation"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                <p className="text-base lg:text-lg">Konsultasi Gratis</p>
              </AppButton>
            </a>
          </div>
        </div>

        {/* All Speakers 2XL */}
        <Image
          className="all-speakers absolute hidden max-w-[672px] -bottom-5 -right-10 2xl:flex"
          src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers.webp"
          alt="Sevenpreneur Coach and Mentor"
          width={2440}
          height={2440}
        />
      </div>

      {/* Absolute Decoration */}
      {/* All Speakers */}
      <Image
        className="all-speakers absolute flex max-w-[424px] bottom-0 left-1/2 -translate-x-1/2 z-30 lg:left-auto lg:translate-x-0 lg:max-w-[638px] lg:-bottom-5 lg:-right-20 xl:max-w-[662px] xl:right-5 2xl:hidden"
        src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers.webp"
        alt="Sevenpreneur Coach and Mentor"
        width={2440}
        height={2440}
      />

      {/* Circle Blur */}
      <div className="circle-blur-top-left absolute flex bg-[#3417E3] size-64 -top-32 -left-32 blur-[90px] rounded-full z-10 lg:size-80 lg:-top-20 lg:blur-[120px]" />
      <div className="circle-blur-right absolute flex bg-secondary size-64 bottom-20 -right-36 blur-[90px] rounded-full z-10 lg:size-80 lg:top-1/2 lg:-translate-y-1/2 lg:blur-[120px]" />
      <div className="circle-blur-center absolute flex bg-[#3417E3] w-[685px] h-[230px] -bottom-[115px] left-1/2 -translate-x-1/2 blur-[90px] rounded-full z-10" />

      {/* Overlay Maps */}
      <Image
        className="maps absolute flex opacity-15 top-[200px] scale-150 z-10 lg:scale-100 lg:top-1/2 lg:-translate-y-1/2"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/hero-maps.webp"
        }
        alt="Overlay Maps"
        width={1000}
        height={1000}
      />

      {/* Main Background */}
      <Image
        className="main-background absolute flex inset-0 w-full h-full object-cover"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/hero-background-sbbp.webp"
        }
        alt="Main Background"
        width={1000}
        height={1000}
      />
    </div>
  );
}
