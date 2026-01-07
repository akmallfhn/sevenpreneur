"use client";
import Image from "next/image";
import Link from "next/link";
import AppButton from "../buttons/AppButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function HeroHomeSVP() {
  return (
    <div className="hero-root relative gap-5 flex flex-col items-center w-full bg-tertiary overflow-hidden">
      <div className="hero-container relative flex flex-col w-full items-center gap-8 py-10 px-4 z-[70] lg:flex-row lg:gap-8 lg:px-0 lg:py-32 lg:justify-between lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        <div className="hero-content flex flex-col w-full items-center gap-[28px] lg:items-start">
          <div className="flex flex-col gap-3 items-center text-white lg:items-start ">
            <div className="hero-title flex flex-col items-center text-center font-brand font-bold text-2xl max-w-[380px] sm:text-3xl lg:items-start lg:text-[40px] lg:text-left lg:max-w-[472px] xl:text-[52px] xl:max-w-[720px]">
              <h1 className="w-full text-transparent bg-clip-text bg-gradient-to-r from-10% from-white to-90% to-secondary">
                Build your profitable business. <br /> Scale your next one.
              </h1>
            </div>
            <p className="hero-description w-[317px] text-sm text-center text-white font-bodycopy lg:w-[460px] lg:text-lg lg:text-left xl:w-[518px] xl:text-xl">
              Bantu kamu wujudkan bisnismu dari nol, lalu naik level dengan
              strategi yang tepat
            </p>
          </div>
          <div className="flex flex-col w-[300px] items-center gap-3 lg:w-fit lg:flex-row">
            <Link
              href={"/cohorts/sevenpreneur-business-blueprint-program"}
              className="w-full p-[1px] rounded-full"
            >
              <div className="flex lg:hidden">
                <AppButton
                  size="defaultRounded"
                  variant="whatsapp"
                  className="w-full lg:w-fit"
                  featureName="explore_product"
                  featurePagePoint="Home Page"
                  featurePlacement="hero-banner"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  <p className="text-base lg:text-lg">Konsultasikan Bisnismu</p>
                </AppButton>
              </div>
              <div className="hidden lg:flex">
                <AppButton
                  size="largeRounded"
                  variant="hollowWhatsapp"
                  className="w-full lg:w-fit"
                  featureName="explore_product"
                  featurePagePoint="Home Page"
                  featurePlacement="hero-banner"
                >
                  <FontAwesomeIcon icon={faWhatsapp} />
                  <p className="text-base lg:text-lg">Konsultasikan Bisnismu</p>
                </AppButton>
              </div>
            </Link>
          </div>
        </div>
        {/* Image Mobile and > Desktop 2XL*/}
        <Image
          className="hero-image flex max-w-[360px] pb-16 lg:hidden 2xl:absolute 2xl:flex 2xl:right-0 2xl:max-w-[668px]"
          src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/image-homepage.webp"
          alt="Sevenpreneur Activities"
          width={2440}
          height={2440}
        />
      </div>

      {/* Absolute Decoration */}
      {/* Image Desktop LG to XL */}
      <Image
        className="hero-image absolute hidden z-30 lg:flex lg:left-auto lg:pb-16 lg:translate-x-0 lg:max-w-[520px] lg:top-1/2 lg:-translate-y-1/2 lg:right-5 xl:max-w-[662px] xl:right-10 2xl:hidden"
        src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/image-homepage.webp"
        alt="Sevenpreneur Activities"
        width={2440}
        height={2440}
      />

      {/* Side Decoration */}
      <Image
        className="side-decoration-left absolute flex w-full max-w-[180px] top-0 left-0 z-10 lg:max-w-[260px]"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/side-decoration.svg"
        }
        alt="Side Decoration"
        width={400}
        height={400}
      />
      <Image
        className="side-decoration-right absolute flex w-full max-w-[180px] top-0 right-0 z-10 scale-x-[-1] lg:max-w-[260px]"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/side-decoration.svg"
        }
        alt="Side Decoration"
        width={400}
        height={400}
      />

      {/* Buildings */}
      <Image
        className="buildings absolute flex w-full bottom-0 z-10 sm:-bottom-16 lg:-bottom-24 xl:-bottom-36 2xl:-bottom-48 3xl:-bottom-64 4xl:-bottom-[380px] 5xl:-bottom-[520px]"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/building-images.webp"
        }
        alt="Buildings"
        width={1000}
        height={1000}
      />

      {/* Hero Background */}
      <Image
        className="hero-background absolute flex w-full -bottom-40 opacity-20 mix-blend-darken 2xl:-bottom-64 3xl:-bottom-96"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/skyscraper-background%20(1).webp"
        }
        alt="Main Background"
        width={1000}
        height={1000}
      />
    </div>
  );
}
