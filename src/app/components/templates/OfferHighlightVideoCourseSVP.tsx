"use client";
import {
  Clock3,
  Gauge,
  Laptop,
  LayoutDashboard,
  LockKeyhole,
} from "lucide-react";
import SectionTitleSVP from "../titles/SectionTitleSVP";
import AppButton from "../buttons/AppButton";
import { rupiahCurrency } from "@/lib/rupiah-currency";
import Link from "next/link";
import { toSnakeCase } from "@/lib/snake-case";
import { getRoundedHourFromSeconds } from "@/lib/rounded-hour-from-second";

interface OfferHighlightVideoCourseSVPProps {
  playlistId: number;
  playlistSlug: string;
  playlistPrice: number;
  playlistTotalDuration: number | null;
}

export default function OfferHighlightVideoCourseSVP({
  playlistId,
  playlistSlug,
  playlistPrice,
  playlistTotalDuration,
}: OfferHighlightVideoCourseSVPProps) {
  const discountPrice = playlistPrice;
  const basePrice = 430000;
  const discountRate = Math.round(
    ((basePrice - discountPrice) / basePrice) * 100
  );

  return (
    <div className="benefit-offer-container flex flex-col gap-3 p-5 bg-white border border-outline rounded-md md:sticky md:top-24">
      <SectionTitleSVP sectionTitle="This Course Include" />
      <div className="benefit-offer-list flex flex-col gap-1">
        <div className="benefit-offer-item flex gap-1 items-center font-ui">
          <div className="flex w-8 h-8 items-center justify-center shrink-0 overflow-hidden">
            <Clock3 className="size-5 text-alternative" />
          </div>
          <p className="text-sm">
            <b>
              {getRoundedHourFromSeconds(playlistTotalDuration || 1)}+ hours
            </b>{" "}
            of on-demand video
          </p>
        </div>
        <div className="benefit-offer-item flex gap-1 items-center font-ui">
          <div className="flex w-8 h-8 items-center justify-center shrink-0 overflow-hidden">
            <LayoutDashboard className="size-5 text-alternative" />
          </div>
          <p className="text-sm">
            <b>Lifetime access</b> on Sevenpreneur LMS
          </p>
        </div>
        <div className="benefit-offer-item flex gap-1 items-center font-ui">
          <div className="flex w-8 h-8 items-center justify-center shrink-0 overflow-hidden">
            <Gauge className="size-5 text-alternative" />
          </div>
          <p className="text-sm">
            <b>Learn anytime, anywhere</b> at your own speed
          </p>
        </div>
        <div className="benefit-offer-item flex gap-1 items-center font-ui">
          <div className="flex w-8 h-8 items-center justify-center shrink-0 overflow-hidden">
            <Laptop className="size-5 text-alternative" />
          </div>
          <p className="text-sm">
            Accessible from <b>any device</b>
          </p>
        </div>
      </div>
      <hr className="hidden lg:flex" />
      <div className="hidden flex-col gap-3 lg:flex">
        <div className="price-information flex flex-col font-ui">
          <p className="text-alternative font-medium text-sm">
            <s>{rupiahCurrency(basePrice)}</s>
          </p>
          <div className="flex items-center gap-1">
            <h3 className="font-bold text-black text-2xl">
              {rupiahCurrency(discountPrice)}
            </h3>
            <p className="bg-secondary w-fit font-bold text-white text-[10px] px-1.5 py-0.5 rounded-sm lg:text-xs">
              {discountRate}% OFF
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 font-ui">
          <Link
            href={`/playlists/${playlistSlug}/${playlistId}/checkout`}
            className="w-full"
          >
            <AppButton
              size="defaultRounded"
              className="w-full"
              featureName={`vod_checkout_${toSnakeCase(playlistSlug)}`}
            >
              Pay & Get Access
            </AppButton>
          </Link>
          <div className="flex items-center gap-1 text-alternative">
            <LockKeyhole className="size-3" />
            <p className="text-xs text-center">
              Secure payment processed by Xendit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
