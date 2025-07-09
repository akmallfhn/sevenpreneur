"use client";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AppButton from "../buttons/AppButton";
import CountdownTimerRestart25 from "../elements/CountdownTimerRestart25";

export default function HeroEventRestart2025() {
  return (
    <div className="relative gap-5 flex flex-col items-center w-full bg-[#3417E3] overflow-hidden lg:items-start">
      {/* --- Hero Content */}
      <div className="hero-content flex flex-col pt-10 pb-10 px-5 items-center gap-72 z-[70] lg:py-28 lg:pb-[42px] lg:px-12 lg:gap-[28px] lg:items-start xl:py-[132px] xl:px-[72px] xl:pb-[82px]">
        {/* Top Group Component */}
        <div className="flex flex-col gap-3 items-center lg:items-start lg:gap-5">
          {/* Logo RE:START */}
          <div className="flex flex-col items-center gap-2 lg:items-start lg:gap-3">
            <Image
              className="flex max-w-[280px] lg:max-w-[472px] xl:max-w-[612px]"
              src={
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//restart-logo.webp"
              }
              alt="Logo RE:START"
              width={500}
              height={500}
            />
            <div className="flex items-center gap-2">
              <p className="font-medium font-bodycopy text-white text-xs lg:text-xl">
                Powered by
              </p>
              <Image
                className="flex max-w-[98px] lg:max-w-[168px]"
                src={
                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//logo-sevenpreneur-white-icon.webp"
                }
                alt="Logo Sevenpreneur White Icon"
                width={500}
                height={500}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 items-center font-bodycopy text-white text-center lg:items-start lg:text-left">
            {/* Event Title */}
            <h1 className="font-bold text-xl max-w-[280px] lg:text-[32px] lg:max-w-[472px] xl:text-[38px] xl:max-w-[612px]">
              A conference for founders stepping into next big move
            </h1>
            {/* Event Date & Place */}
            <p className="font-semibold text-base truncate lg:text-xl xl:text-2xl">
              July 26, 2025 - Kuningan City, Jakarta
            </p>
          </div>
        </div>
        {/* Bottom Group Component */}
        <div className="flex flex-col items-center gap-5 lg:items-start lg:gap-[28px]">
          {/* Countdown */}
          <CountdownTimerRestart25 targetDateTime="2025-07-26T09:00:00" />
          {/* CTA */}
          <Link href={"#ticket-id"}>
            <AppButton
              size="largeRounded"
              variant="secondary"
              featureName="join_restart"
            >
              <p className="text-base lg:text-lg">
                Join RE:START Conference 2025
              </p>
              <div className="aspect-square p-1 bg-primary rounded-full">
                <ArrowDown className="text-white size-5" />
              </div>
            </AppButton>
          </Link>
        </div>
      </div>

      {/* --- Overlay */}
      <div
        className={`overlay absolute left-1/2 -translate-x-1/2 bottom-0 w-full h-[288px] z-40 bg-gradient-to-t from-0% from-[#202020] via-60% via-[#202020] to-100% to-[#202020]/0 lg:h-[254px] lg:from-black/80 lg:via-[#202020]/[0.42]`}
      />
      {/* --- All Speakers */}
      <Image
        className="all-speakers absolute flex max-w-[382px] bottom-[158px] left-1/2 -translate-x-1/2 z-30 lg:left-auto lg:-right-14 lg:translate-x-0 lg:max-w-[638px] lg:-bottom-5 xl:max-w-[848px]"
        src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//all-speakers-restart.webp"
        alt="Sevenpreneur Brand Representative"
        width={2440}
        height={2440}
        loading="lazy"
      />
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
