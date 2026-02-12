"use client";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import AppButton from "../buttons/AppButton";
import ScorecardItemSVP from "../items/ScorecardItemSVP";

interface HeroBlueprintProgramSVPProps {
  cohortId: number;
}

export default function HeroBlueprintProgramSVP({
  cohortId,
}: HeroBlueprintProgramSVPProps) {
  return (
    <div className="relative gap-5 flex flex-col items-center w-full bg-black overflow-hidden">
      {/* Hero Container */}
      <div className="hero-container relative flex w-full items-center py-10 px-4 z-[70] lg:px-0 lg:pt-20 lg:pb-24 lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        <div className="hero-content flex flex-col w-full items-center gap-60 lg:gap-[28px] lg:items-start">
          <div className="flex flex-col gap-4 items-center text-white lg:items-start lg:gap-5">
            <div className="flex flex-col items-center text-center gap-2.5 lg:flex-row lg:text-left">
              <h1 className="text-sm font-brand font-semibold tracking-widest lg:text-lg xl:text-xl">
                BUSINESS BLUEPRINT PROGRAM
              </h1>
              <div className="p-[1px] bg-gradient-to-br from-0% from-[#C4C4C4] to-100% to-[#30266D] rounded-full">
                <div className="flex text-white items-center gap-1 py-1 px-3.5 bg-gradient-to-tr from-0% from-[#2B0E6E] to-100% to-[#1C125F] rounded-full">
                  <p className="text-[13px] font-brand font-bold">
                    INTEGRATED WITH AI TOOLS
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
            <div className="hero-title flex flex-col items-center text-center font-brand font-bold text-2xl max-w-[380px] sm:text-3xl lg:items-start lg:text-[32px] lg:text-left lg:max-w-[472px] xl:text-[52px] xl:max-w-[720px]">
              <h2 className="w-full text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0]">
                Tumbuhkan Skala Bisnis
              </h2>
              <h2 className="w-fit text-transparent bg-clip-text bg-gradient-to-r from-57% from-primary to-90% to-secondary">
                Hingga 1 M per bulan
              </h2>
            </div>
            <p className="hero-description w-[317px] text-sm text-center font-bodycopy lg:w-[460px] lg:text-lg lg:text-left xl:w-[518px] xl:text-xl">
              Entrepreneurship Bootcamp with <b>End-to-End Frameworks</b> &{" "}
              <b>Top-Tier Coaching</b>
            </p>
            <div className="scorecards flex gap-4">
              <ScorecardItemSVP
                scorecardValue={7}
                scorecardName="Business Chapters"
                isMoreValue
              />
              <ScorecardItemSVP
                scorecardValue={7}
                scorecardName="AI Business Tools"
                isMoreValue
              />
              <ScorecardItemSVP
                scorecardValue={10}
                scorecardName="Coaches & Speakers"
                isMoreValue
              />
              <ScorecardItemSVP
                scorecardValue={5500}
                scorecardName="Program Alumnee"
                isMoreValue
              />
            </div>
          </div>
          <div className="flex flex-col w-[300px] items-center gap-3 lg:w-fit lg:flex-row">
            <Link
              href={"#package-plans"}
              className="w-full p-[1px] rounded-full bg-gradient-to-b from-0% from-[#7B6FF0] to-69% to-[#4C3FEC]"
            >
              <div className="flex lg:hidden">
                <AppButton
                  size="defaultRounded"
                  variant="primaryGradient"
                  className="w-full lg:w-fit"
                  featureName="join_program_scroll"
                >
                  <p className="text-base lg:text-lg">Gabung Program</p>
                </AppButton>
              </div>
              <div className="hidden lg:flex">
                <AppButton
                  size="largeRounded"
                  variant="primaryGradient"
                  className="w-full lg:w-fit"
                  featureName="join_program_scroll"
                >
                  <p className="text-base lg:text-lg">Gabung Program</p>
                </AppButton>
              </div>
            </Link>
            <a
              href="https://wa.me/6282312492067?text=Halo%2C%20MinSeven!%20👋%0AAku%20tertarik%20untuk%20mengikuti%20*Sevenpreneur%20Business%20Blueprint%20Program%20Batch%207*%20dan%20mau%20konsultasi%20lebih%20lanjut.%20Berikut%20dataku%3A%0A•%20Nama%3A%20(isi%20di%20sini)%0A•%20Email%3A%20(isi%20di%20sini)%0A%0ATerima%20kasih%2C%20MinSeven%20🙏"
              className="w-full p-[1px]"
              target="_blank"
              rel="noopenner noreferrer"
            >
              <div className="flex lg:hidden">
                <AppButton
                  size="defaultRounded"
                  variant="whatsapp"
                  className="w-full lg:w-fit"
                  // GTM
                  featureName="whatsapp_consultation"
                  featureId={String(cohortId)}
                  featureProductCategory="COHORT"
                  featureProductName="Sevenpreneur Business Blueprint Program Batch 7"
                  featurePagePoint="Product Detail Page"
                  featurePlacement="hero-banner-mobile"
                  // Meta
                  metaEventName="Contact"
                  metaContentIds={[String(cohortId)]}
                  metaContentType="service"
                  metaContentCategory="Business Education Program"
                  metaContentName="Sevenpreneur Business Blueprint Program Batch 7"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  <p className="text-base lg:text-lg">Konsultasi Gratis</p>
                </AppButton>
              </div>
              <div className="hidden lg:flex">
                <AppButton
                  size="largeRounded"
                  variant="hollowWhatsapp"
                  className="w-full lg:w-fit"
                  // GTM
                  featureName="whatsapp_consultation"
                  featureId={String(cohortId)}
                  featureProductCategory="COHORT"
                  featureProductName="Sevenpreneur Business Blueprint Program Batch 7"
                  featurePagePoint="Product Detail Page"
                  featurePlacement="hero-banner-desktop"
                  // Meta
                  metaEventName="Contact"
                  metaContentIds={[String(cohortId)]}
                  metaContentType="service"
                  metaContentCategory="Business Education Program"
                  metaContentName="Sevenpreneur Business Blueprint Program Batch 7"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  <p className="text-base lg:text-lg">Konsultasi Gratis</p>
                </AppButton>
              </div>
            </a>
          </div>
        </div>

        {/* All Speakers Desktop XL */}
        <Image
          className="all-speakers absolute hidden max-w-[672px] -bottom-5 -right-10 2xl:flex"
          src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers-8-12-2.webp"
          alt="Sevenpreneur Coach and Mentor"
          width={2440}
          height={2440}
        />
      </div>

      {/* Absolute Decoration */}
      {/* All Speakers Mobile */}
      <Image
        className="all-speakers absolute flex max-w-[424px] bottom-0 left-1/2 -translate-x-1/2 z-30 lg:left-auto lg:translate-x-0 lg:max-w-[600px] lg:-bottom-5 lg:-right-8 xl:max-w-[662px] xl:right-5 2xl:hidden"
        src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers-8-12-2.webp"
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
