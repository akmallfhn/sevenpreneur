"use client";
import Image from "next/image";
import { HeartHandshake, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import AppButton from "../buttons/AppButton";

export default function BannerEventRestart25() {
  return (
    <div className="container-banner flex items-center justify-center px-8 pb-20">
      <div className="banner-outline p-[1px] rounded-md bg-gradient-to-br from-[#B4B4B4]/50 to-[#373737]/60">
        <div className="banner-event relative flex flex-col justify-center gap-5 p-5 max-w-[520px] bg-primary aspect-mobile-banner rounded-md overflow-hidden lg:pl-8 lg:w-[840px] lg:aspect-desktop-banner lg:max-w-[840px]">
          {/* Content */}
          <div className="flex flex-col text-white gap-1 z-20">
            <h3 className="font-bold font-brand text-xl lg:text-2xl">
              Having trouble??
            </h3>
            <p className="font-bodycopy text-sm lg:text-xl">
              No worries — if you hit a snag while booking, we`re here to help!
            </p>
          </div>
          <Link
            href={
              "https://wa.me/6285353533844?text=I%27d%20love%20to%20explore%20partnership%20opportunities%20with%20you.%20Please%20share%20more%20details.%20Looking%20forward%20to%20collaborating%21"
            }
            className="z-20"
          >
            <AppButton size="defaultRounded" featureName="contact_us">
              Contact Us
              <div className="aspect-square p-1 bg-secondary rounded-full">
                <MessageCircleQuestion className="text-white size-4" />
              </div>
            </AppButton>
          </Link>

          {/* Ornamen */}
          <Image
            className="ornament-1 absolute flex max-w-24 right-4 bottom-4 opacity-30 z-10"
            src={
              "https://static.wixstatic.com/media/02a5b1_5f19d31a39824eae8f4393ce4466aee6~mv2.png"
            }
            alt="Ornament Logo Sevenpreneur"
            width={200}
            height={200}
          />

          {/* Background Image */}
          <Image
            className="background absolute flex opacity-90 object-cover inset-0 h-full mix-blend-multiply"
            src={
              "https://static.wixstatic.com/media/02a5b1_22c064430b6d43cd9a76d3b2c3c43541~mv2.webp"
            }
            alt="Background Sponsorship"
            width={1440}
            height={1440}
          />
        </div>
      </div>
    </div>
  );
}
