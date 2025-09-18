"use client";
import React, { useEffect, useRef, useState } from "react";
import AppButton from "../buttons/AppButton";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import {
  ArrowBigUpDash,
  CalendarFold,
  ChevronDown,
  ChevronUp,
  Gauge,
  Languages,
  Laptop,
  LayoutDashboard,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Wine,
} from "lucide-react";
import SectionTitleSVP from "../titles/SectionTitleSVP";
import OfferHighlightVideoCourseSVP from "../templates/OfferHighlightVideoCourseSVP";
import VideoCoursePlaylistSVP, {
  VideoItem,
} from "../indexes/VideoCoursePlaylistSVP";
import HeroVideoCourseSVP, {
  EducatorItem,
} from "../templates/HeroVideoCourseSVP";
import { rupiahCurrency } from "@/lib/rupiah-currency";
import Link from "next/link";
import { useTheme } from "next-themes";
import { toSnakeCase } from "@/lib/snake-case";
import Image from "next/image";

dayjs.extend(localizedFormat);

interface EventPrice {
  id: number;
  name: string;
  amount: number;
}

interface EventDetailsSVPProps {
  eventId: number;
  eventName: string;
  eventDescription: string;
  eventImage: string;
  eventSlug: string;
  eventPublishedAt?: string;
  eventPrice: EventPrice[];
}

export default function EventDetailsSVP({
  eventId,
  eventName,
  eventDescription,
  eventImage,
  eventSlug,
  eventPublishedAt,
  eventPrice,
}: EventDetailsSVPProps) {
  const [showCTA, setShowCTA] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const { theme } = useTheme();
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Checking height content description
  useEffect(() => {
    const checkOverflow = () => {
      if (paragraphRef.current) {
        const el = paragraphRef.current;
        const isOverflow = el.scrollHeight > el.clientHeight;
        setIsOverflowing(isOverflow);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  // Show floating button when sentinel was gone
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowCTA(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "0px 0px 0px 0px",
      }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <React.Fragment>
      <div className="flex flex-col w-full bg-white dark:bg-coal-black">
        {/* --- Hero */}
        <div className="hero-video-course relative flex flex-col w-full h-full bg-black items-center lg:flex-row-reverse lg:max-h-[504px] overflow-hidden">
          {/* Video Thumbnail */}
          <div className="video-thumbnail relative flex aspect-thumbnail w-full h-full overflow-hidden md:flex-[1.6] md:min-h-full md:aspect-auto lg:flex-2">
            <Image
              src={eventImage}
              alt={eventName}
              width={1200}
              height={1200}
            />
            {/* Overlay Mobile */}
            <div
              className={`overlay flex absolute inset-0 bg-linear-to-t from-5% from-black to-60% to-black/0 pointer-events-none z-10 lg:hidden`}
            />
            {/* Overlay Desktop */}
            <div
              className={`overlay hidden absolute inset-0 bg-linear-to-r from-5% from-black to-45% to-black/0 pointer-events-none z-10 md:flex`}
            />
          </div>
          {/* Canvas */}
          <div className="white-area relative w-full bg-black h-[220px] -mt-[1px] z-[21] md:flex-1 md:h-auto md:mt-auto" />

          {/* Headline */}
          <div className="absolute flex flex-col w-full bottom-0 left-1/2 -translate-x-1/2 items-center font-brand p-5 pb-10 gap-4 z-30 sm:bottom-[100px] md:bottom-auto md:pb-5 md:items-start md:top-1/2 md:-translate-y-1/2 lg:p-0 lg:max-w-[960px] xl:max-w-[1208px]">
            <div className="title-tagline flex flex-col items-center max-w-[420px] gap-3 md:items-start lg:gap-4">
              <h1 className="title font-bold text-3xl line-clamp-2 text-center text-transparent bg-clip-text bg-linear-to-br from-white to-[#999999] md:text-left lg:text-4xl">
                {eventName}
              </h1>
              <p className="tagline text-sm text-white text-center font-bodycopy line-clamp-3 md:text-left lg:text-base">
                Creating Impactful Businesses in Uncertain Times
              </p>
            </div>

            <Link
              href={`/events/${eventSlug}/${eventId}/checkout?ticketId=${eventPrice[0].id}`}
              className="checkout-button w-full max-w-[420px]"
            >
              <AppButton
                size="defaultRounded"
                className="w-full md:w-fit"
                featureName="add_to_cart_event"
                featureId={String(eventId)}
                featureProductCategory="EVENT"
                featureProductName={eventName}
                featureProductAmount={eventPrice[0].amount}
                featurePagePoint="Product Detail Page"
                featurePlacement="hero-banner"
              >
                <p className="px-2">Join Event</p>
              </AppButton>
            </Link>
          </div>
        </div>
        <div ref={sentinelRef} className="h-0" />

        {/* --- Content */}
        <div className="content flex flex-col px-5 py-5 w-full gap-8 md:flex-row lg:gap-14 lg:px-0 lg:py-10 lg:pb-20 lg:mx-auto lg:max-w-[960px] xl:max-w-[1208px]">
          {/* -- Main */}
          <main className="flex flex-col gap-8 md:flex-[1.7] lg:gap-10">
            {/* Description */}
            <div className="video-description relative flex flex-col gap-4">
              <SectionTitleSVP sectionTitle={`About ${eventName}`} />
              <div className="flex flex-col gap-2 items-center md:items-start">
                <div>
                  <p
                    className={`ratings text-sm text-black font-ui dark:text-white/80 ${
                      !isExpanded && "line-clamp-5"
                    }`}
                    ref={paragraphRef}
                  >
                    {eventDescription}
                  </p>
                </div>
                {isOverflowing && (
                  <div className="flex transition-all transform z-10">
                    <AppButton
                      variant={
                        theme === "dark" ? "surfaceDark" : "primaryLight"
                      }
                      size="small"
                      onClick={() => setIsExpanded((prev) => !prev)}
                    >
                      {isExpanded ? (
                        <>
                          <p>Show Less</p>
                          <ChevronUp className="size-4" />
                        </>
                      ) : (
                        <>
                          <p>Show more</p>
                          <ChevronDown className="size-4" />
                        </>
                      )}
                    </AppButton>
                  </div>
                )}
                {!isExpanded && isOverflowing && (
                  <div className="overlay absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-30% from-white to-transparent pointer-events-none dark:from-coal-black" />
                )}
              </div>
            </div>
          </main>
          {/* -- Aside */}
          <aside className="aside flex flex-col gap-8 md:flex-1 lg:gap-10">
            <div className="benefit-offer-container flex flex-col gap-3 p-5 bg-white border border-outline rounded-md dark:bg-surface-black dark:border-outline-dark md:sticky md:top-24">
              <SectionTitleSVP sectionTitle="Event Details" />
              <div className="benefit-offer-list flex flex-col gap-1 text-black dark:text-white">
                <div className="benefit-offer-item flex gap-1 items-center font-ui">
                  <div className="flex w-8 h-8 items-center justify-center shrink-0 overflow-hidden">
                    <CalendarFold className="size-5 text-alternative" />
                  </div>
                  <p className="text-sm">
                    Jumat, 26 September 2025 Pukul 13.00 - 17.00
                  </p>
                </div>
                <div className="benefit-offer-item flex gap-1 items-center font-ui">
                  <div className="flex w-8 h-8 items-center justify-center shrink-0 overflow-hidden">
                    <MapPin className="size-5 text-alternative" />
                  </div>
                  <a
                    href="https://share.google/0bmF735Lzrx86jgq4"
                    className="text-sm"
                    target="_blank"
                    rel="noopenner noreferrer"
                  >
                    Connext Coworking Space, Cyber 2 Tower, Kuningan
                  </a>
                </div>
                <div className="benefit-offer-item flex gap-1 items-center font-ui">
                  <div className="flex w-8 h-8 items-center justify-center shrink-0 overflow-hidden">
                    <Wine className="size-5 text-alternative" />
                  </div>
                  <p className="text-sm">Include Snacks & Drinks</p>
                </div>
              </div>
              <hr className="hidden border-t-1 border-outline dark:border-outline-dark lg:flex" />
              <div className="hidden flex-col gap-3 lg:flex">
                <div className="price-information flex flex-col font-ui">
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold text-black text-2xl dark:text-white">
                      {rupiahCurrency(eventPrice[0].amount)}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3 font-ui">
                  <Link
                    href={`/events/${eventSlug}/${eventId}/checkout?ticketId=${eventPrice[0].id}`}
                    className="w-full"
                  >
                    <AppButton
                      size="defaultRounded"
                      className="w-full"
                      featureName="add_to_cart_event"
                      featureId={String(eventId)}
                      featureProductCategory="EVENT"
                      featureProductName={eventName}
                      featureProductAmount={eventPrice[0].id}
                      featurePagePoint="Product Detail Page"
                      featurePlacement="aside-panel-desktop"
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
          </aside>
        </div>
      </div>

      {/* --- Floating CTA */}
      <div
        className={`floating-cta fixed flex flex-col bg-white bottom-0 left-0 w-full gap-2 p-5 border-t border-outline transition-all duration-300 z-40 dark:bg-surface-black dark:border-outline-dark md:hidden ${
          showCTA ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="flex  items-center justify-between">
          <div className="flex flex-col font-ui">
            <p className="text-sm">Total Amount</p>
            <p className="font-bold">{rupiahCurrency(eventPrice[0].amount)}</p>
          </div>
          <Link
            href={`/events/${eventSlug}/${eventId}/checkout?ticketId=${eventPrice[0].id}`}
          >
            <AppButton
              size="defaultRounded"
              featureName="add_to_cart_event"
              featureId={String(eventId)}
              featureProductCategory="EVENT"
              featureProductName={eventName}
              featureProductAmount={eventPrice[0].amount}
              featurePagePoint="Product Detail Page"
              featurePlacement="floating-panel-mobile"
            >
              <ShieldCheck className="size-5" />
              Pay & Get Access
            </AppButton>
          </Link>
        </div>
        <div className="flex w-full text-center justify-center items-center gap-1 text-alternative">
          <LockKeyhole className="size-3" />
          <p className="text-xs text-center">
            Secure payment processed by Xendit
          </p>
        </div>
      </div>
    </React.Fragment>
  );
}
