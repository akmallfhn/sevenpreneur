"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import CountdownTimerRestart25 from "./CountdownTimerRestart25";
import Link from "next/link";
import { ArrowDown, Sparkles } from "lucide-react";
import ScorecardItemSVP from "../items/ScorecardItemSVP";

export default function HeroBlueprintProgramBatch7SVP() {
  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  return (
    <div className="relative gap-5 flex flex-col items-center w-full bg-black overflow-hidden">
      {/* Hero Content */}
      <div className="hero-content flex flex-col w-full items-center gap-72 py-14 px-4 z-[70] lg:gap-[28px] lg:px-0 lg:items-start lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {/* Top Group Component */}
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
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center text-center font-brand font-bold text-2xl max-w-[380px] lg:items-start lg:text-[32px] lg:text-left lg:max-w-[472px] xl:text-[52px] xl:max-w-[698px]">
            <h2 className="w-full text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] truncate">
              Don’t Just Start a Business.
            </h2>
            <h2 className="w-fit text-transparent bg-clip-text bg-gradient-to-r from-57% from-primary to-secondary">
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
          {/* <p className="font-semibold text-base truncate lg:text-xl xl:text-2xl">
              27 November - 14 Desember 2025
            </p> */}
        </div>
        {/* Bottom Group Component */}
        <div className="flex flex-col items-center gap-5 lg:items-start lg:gap-[28px]">
          <div className="flex flex-col items-center gap-5 lg:flex-row">
            <Link
              href={`https://www.${domain}/playlists/restart-conference-2025/1`}
            >
              <AppButton
                size="largeRounded"
                variant="secondary"
                featureName="join_restart"
              >
                <p className="text-base lg:text-lg">Gabung Program</p>
              </AppButton>
            </Link>
            <a href="https://wa.me/62895803221561">
              <AppButton
                size="largeRounded"
                variant="secondary"
                featureName="join_restart"
              >
                <p className="text-base lg:text-lg">Konsultasi Gratis</p>
              </AppButton>
            </a>
          </div>
        </div>
      </div>

      {/* --- Overlay */}
      <div
        className={`overlay absolute left-1/2 -translate-x-1/2 bottom-0 w-full h-[288px] z-40 bg-gradient-to-t from-0% from-[#202020] via-60% via-[#202020] to-100% to-[#202020]/0 lg:h-[254px] lg:from-black/80 lg:via-[#202020]/[0.42]`}
      />
      {/* --- All Speakers */}
      {/* <Image
        className="all-speakers absolute flex max-w-[392px] bottom-[176px] left-1/2 -translate-x-1/2 z-30 lg:left-auto lg:-right-5 lg:translate-x-0 lg:max-w-[638px] lg:-bottom-5 xl:max-w-[856px] 2xl:right-[2vw]"
        src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//speakers-restart-25.webp"
        alt="Sevenpreneur Brand Representative"
        width={2440}
        height={2440}
        loading="lazy"
      /> */}
      {/* Ornament Square */}
      <Image
        className="ornament-square-left absolute flex max-w-[108px] top-1/2 -translate-y-1/2 -left-2 blur-sm opacity-70 z-10 lg:max-w-[172px] lg:translate-y-0 lg:top-auto lg:bottom-[112px] lg:blur-lg"
        src={
          "https://static.wixstatic.com/shapes/02a5b1_9616da59cbeb438fa0394a699d7f0955.svg"
        }
        alt="Ornament Square"
        width={200}
        height={200}
      />
      <Image
        className="ornament-square-right absolute flex max-w-[72px] right-0 bottom-[180px] rotate-90 z-50 blur-xs lg:max-w-[98px] lg:right-[320px] lg:bottom-auto lg:top-[112px] lg:z-10 xl:right-[480px] xl:top-[72px]"
        src={
          "https://static.wixstatic.com/shapes/02a5b1_9616da59cbeb438fa0394a699d7f0955.svg"
        }
        alt="Ornament Square"
        width={200}
        height={200}
      />
      {/* Rainbow Effect */}
      <Image
        className="rainbow-effect absolute flex max-w-[288px] top-[280px] -right-32 z-10 lg:max-w-[420px] lg:-right-12 lg:top-36 xl:top-24"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//effect-rainbow.svg"
        }
        alt="Rainbow Effect"
        width={500}
        height={500}
      />
      {/* Effect Neon Side */}
      <Image
        className="neon-side-top-left absolute flex w-80 top-0 left-0 z-10 lg:w-[520px]"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//effect-side-neon.webp"
        }
        alt="Effect Neon Side"
        width={200}
        height={200}
        layout="raw"
      />
      <Image
        className="neon-side-bottom-left absolute hidden bottom-0 left-0 scale-y-[-1] z-10 lg:flex lg:w-[520px]"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//effect-side-neon.webp"
        }
        alt="Effect Neon Side"
        width={200}
        height={200}
        layout="raw"
      />
      <Image
        className="neon-side-top-right absolute flex w-80 top-0 right-0 scale-x-[-1] z-10 lg:w-[520px]"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//effect-side-neon.webp"
        }
        alt="Effect Neon Side"
        width={200}
        height={200}
        layout="raw"
      />
      {/* Glowing Arrow */}
      <Image
        className="glowing-arrow-left absolute flex max-w-[320px] -top-10 -left-[120px] mix-blend-plus-lighter opacity-80 lg:max-w-[478px] lg:-left-[98px]"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//glowing-restart-1.webp"
        }
        alt="Glowing Arrow"
        width={1000}
        height={1000}
      />
      <Image
        className="glowing-arrow-left absolute flex max-w-[185px] top-32 -right-[60px] scale-x-[-1] mix-blend-plus-lighter opacity-60 lg:max-w-[302px] lg:top-0 lg:right-0 xl:-top-10"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//glowing-restart-1.webp"
        }
        alt="Glowing Arrow"
        width={1000}
        height={1000}
      />
      {/* Center Gradient */}
      <Image
        className="center-gradient absolute flex max-w-[500px] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 lg:max-w-[1092px]"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//center-gradient.svg"
        }
        alt="Center Gradient"
        width={1000}
        height={1000}
      />
    </div>
  );
}
