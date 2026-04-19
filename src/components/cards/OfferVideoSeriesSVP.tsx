"use client";
import { getRupiahCurrency } from "@/lib/currency";
import { getRoundedHourFromSeconds } from "@/lib/date-time-manipulation";
import {
  Clock3,
  Gauge,
  Laptop,
  LayoutDashboard,
  LockKeyhole,
} from "lucide-react";
import Link from "next/link";
import AppButton from "../buttons/AppButton";
import SectionContainerSVP from "./SectionContainerSVP";

interface OfferVideoSeriesSVPProps {
  playlistId: number;
  playlistName: string;
  playlistSlug: string;
  playlistPrice: number;
  playlistTotalDuration: number | null;
}

export default function OfferVideoSeriesSVP(props: OfferVideoSeriesSVPProps) {
  const discountPrice = props.playlistPrice;
  const priceAnchor = 430000;
  const discountRate = Math.round(
    ((priceAnchor - discountPrice) / priceAnchor) * 100
  );

  const benefits = [
    {
      icon: <Clock3 className="size-5" />,
      label: (
        <p>
          <b>
            {getRoundedHourFromSeconds(props.playlistTotalDuration || 1)}+
            hours{" "}
          </b>{" "}
          of on-demand video
        </p>
      ),
    },
    {
      icon: <LayoutDashboard className="size-5" />,
      label: (
        <p>
          <b>Lifetime access</b> on Sevenpreneur LMS
        </p>
      ),
    },
    {
      icon: <Gauge className="size-5" />,
      label: (
        <p>
          <b>Learn anytime, anywhere</b> at your own speed
        </p>
      ),
    },
    {
      icon: <Laptop className="size-5" />,
      label: (
        <p>
          Accessible from <b>any device</b>
        </p>
      ),
    },
  ];

  return (
    <div className="benefit-offer-container flex md:sticky md:top-20 lg:top-24">
      <SectionContainerSVP sectionName="What You'll Get">
        <div className="benefit-offer-list flex flex-col gap-3">
          {benefits.map((post, index) => (
            <div
              className="benefit-item flex gap-3 items-center font-bodycopy"
              key={index}
            >
              <div className="flex aspect-square items-center justify-center shrink-0 p-2 bg-primary-soft-background text-primary-soft-foreground rounded-full overflow-hidden dark:bg-sevenpreneur-coal dark:text-foreground dark:border">
                {post.icon}
              </div>
              <div className="text-[15px] leading-tight">{post.label}</div>
            </div>
          ))}
        </div>
        <hr className="hidden border-t md:flex" />
        <div className="hidden flex-col gap-3 md:flex">
          <div className="price-information flex flex-col font-bodycopy">
            <p className="text-emphasis font-medium text-sm">
              <s>{getRupiahCurrency(priceAnchor)}</s>
            </p>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-black text-2xl dark:text-white">
                {getRupiahCurrency(discountPrice)}
              </h3>
              <p className="bg-secondary w-fit font-bold text-white text-[10px] px-1.5 py-0.5 rounded-sm lg:text-xs">
                {discountRate}% OFF
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3 font-bodycopy">
            <Link
              href={`/playlists/${props.playlistSlug}/${props.playlistId}/checkout`}
              className="w-full"
            >
              <AppButton
                size="defaultRounded"
                className="w-full"
                featureName="add_to_cart_playlist"
                featureId={String(props.playlistId)}
                featureProductCategory="PLAYLIST"
                featureProductName={props.playlistName}
                featureProductAmount={props.playlistPrice}
                featurePagePoint="Product Detail Page"
                featurePlacement="aside-panel-desktop"
              >
                Pay & Get Access
              </AppButton>
            </Link>
            <div className="flex items-center gap-1 text-emphasis">
              <LockKeyhole className="size-3" />
              <p className="text-xs text-center">
                Secure payment processed by Xendit
              </p>
            </div>
          </div>
        </div>
      </SectionContainerSVP>
    </div>
  );
}
