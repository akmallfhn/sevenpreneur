"use client";
import Image from "next/image";
import Link from "next/link";
import AppButton from "../buttons/AppButton";

interface HeroHomeSVPProps {
  imageHero: string;
}

export default function HeroHomeSVP(props: HeroHomeSVPProps) {
  return (
    <div className="relative gap-5 flex flex-col items-center w-full bg-white overflow-hidden dark:bg-black">
      {/* Hero Container */}
      <div className="hero-container relative flex flex-col-reverse w-full items-center gap-8 py-10 px-4 z-[70] lg:flex-row lg:px-0 lg:pt-20 lg:pb-24 lg:justify-between lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {/* Content */}
        <div className="hero-content flex flex-col w-full items-center gap-[28px] lg:items-start">
          <div className="flex flex-col gap-3 items-center text-white lg:items-start ">
            <div className="hero-title flex flex-col items-center text-center font-brand font-bold text-2xl max-w-[380px] sm:text-3xl lg:items-start lg:text-[32px] lg:text-left lg:max-w-[472px] xl:text-[52px] xl:max-w-[720px]">
              <h1 className="w-full text-transparent bg-clip-text bg-gradient-to-r from-[#212121] to-[#B89FE0] dark:from-[#FFFFFF]">
                Business Blueprint Program
              </h1>
            </div>
            <p className="hero-description w-[317px] text-sm text-center text-black font-bodycopy dark:text-white lg:w-[460px] lg:text-lg lg:text-left xl:w-[518px] xl:text-xl">
              Fast-Track Entrepreneurial Program with{" "}
              <b>End-to-End Frameworks</b> & <b>Top-Tier Coaching</b>
            </p>
          </div>
          <div className="flex flex-col w-[300px] items-center gap-3 lg:w-fit lg:flex-row">
            <Link
              href={"/cohorts/sevenpreneur-business-blueprint-program"}
              className="w-full p-[1px] rounded-full bg-gradient-to-b from-0% from-[#7B6FF0] to-69% to-[#4C3FEC]"
            >
              <div className="flex lg:hidden">
                <AppButton
                  size="defaultRounded"
                  variant="primaryGradient"
                  className="w-full lg:w-fit"
                  featureName="explore_product"
                  featurePagePoint="Home Page"
                  featurePlacement="hero-banner"
                >
                  <p className="text-base lg:text-lg">Learn More</p>
                </AppButton>
              </div>
              <div className="hidden lg:flex">
                <AppButton
                  size="largeRounded"
                  variant="primaryGradient"
                  className="w-full lg:w-fit"
                  featureName="explore_product"
                  featurePagePoint="Home Page"
                  featurePlacement="hero-banner"
                >
                  <p className="text-base lg:text-lg">Learn More</p>
                </AppButton>
              </div>
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="flex w-full max-w-[672px] aspect-thumbnail rounded-md overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={props.imageHero}
            alt="Sevenpreneur"
            width={2440}
            height={2440}
          />
        </div>
      </div>

      {/* Absolute Decoration */}
      {/* All Speakers */}
      {/* <Image
        className="all-speakers absolute flex max-w-[424px] bottom-0 left-1/2 -translate-x-1/2 z-30 lg:left-auto lg:translate-x-0 lg:max-w-[638px] lg:-bottom-5 lg:-right-20 xl:max-w-[662px] xl:right-5 2xl:hidden"
        src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers.webp"
        alt="Sevenpreneur Coach and Mentor"
        width={2440}
        height={2440}
      /> */}

      {/* Circle Blur */}
      {/* <div className="circle-blur-top-left absolute flex bg-[#3417E3] size-64 -top-32 -left-32 blur-[90px] rounded-full z-10 lg:size-80 lg:-top-20 lg:blur-[120px]" />
      <div className="circle-blur-right absolute flex bg-secondary size-64 bottom-20 -right-36 blur-[90px] rounded-full z-10 lg:size-80 lg:top-1/2 lg:-translate-y-1/2 lg:blur-[120px]" />
      <div className="circle-blur-center absolute flex bg-[#3417E3] w-[685px] h-[230px] -bottom-[115px] left-1/2 -translate-x-1/2 blur-[90px] rounded-full z-10" /> */}

      {/* Overlay Maps */}
      <Image
        className="maps absolute flex opacity-70 top-[200px] scale-150 z-10 dark:opacity-25 lg:scale-100 lg:top-1/2 lg:-translate-y-1/2"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/hero-maps.webp"
        }
        alt="Overlay Maps"
        width={1000}
        height={1000}
      />

      {/* Main Background */}
      {/* <Image
        className="main-background absolute flex inset-0 w-full h-full object-cover"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/hero-background-sbbp.webp"
        }
        alt="Main Background"
        width={1000}
        height={1000}
      /> */}
    </div>
  );
}
