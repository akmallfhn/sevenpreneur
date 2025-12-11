"use client";
import React, { useEffect, useRef, useState } from "react";
import AppButton from "../buttons/AppButton";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import { ChevronDown, ChevronUp, LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import EventInfoSVP from "../templates/EventInfoSVP";
import { getRupiahCurrency } from "@/lib/currency";
import { StatusType } from "@/lib/app-types";

dayjs.extend(localizedFormat);

export interface EventPrice {
  id: number;
  name: string;
  amount: number;
  status: StatusType;
}

interface EventDetailsSVPProps {
  eventId: number;
  eventName: string;
  eventDescription: string;
  eventImage: string;
  eventSlug: string;
  eventStartDate: string;
  eventEndDate: string;
  eventPrice: EventPrice[];
}

export default function EventDetailsSVP({
  eventId,
  eventName,
  eventDescription,
  eventImage,
  eventSlug,
  eventStartDate,
  eventEndDate,
  eventPrice,
}: EventDetailsSVPProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const { theme } = useTheme();
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const expiredEvent = dayjs().isAfter(eventEndDate);

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

  return (
    <React.Fragment>
      <div className="page-root relative flex flex-col items-center w-full bg-white dark:bg-coal-black">
        <div className="page-container flex flex-col px-5 py-5 w-full gap-8 z-10 lg:flex-row lg:px-0 lg:py-10 lg:pb-20 lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
          <main className="flex flex-col gap-8 md:flex-[2] lg:gap-10">
            <div className="event-image flex aspect-video w-full h-full rounded-lg overflow-hidden">
              <Image
                className="object-cover w-full h-full"
                src={
                  eventImage ||
                  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/empty-icon.svg"
                }
                alt={eventName}
                width={1200}
                height={1200}
              />
            </div>
            <div className="event-info flex lg:hidden">
              <EventInfoSVP
                eventId={eventId}
                eventName={eventName}
                eventStartDate={eventStartDate}
                eventEndDate={eventEndDate}
                eventSlug={eventSlug}
                eventPrice={eventPrice}
              />
            </div>

            <div className="section-description relative flex flex-col gap-4">
              <h2 className="section-title font-brand font-bold text-2xl leading-tight">
                Event Description
              </h2>
              <div className="event-description flex flex-col gap-4 items-center lg:items-start">
                <div>
                  <p
                    className={`ratings text-[15px] font-bodycopy dark:text-white/80 ${
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
          {/* Aside */}
          <aside className="event-info aside hidden flex-col gap-8 lg:flex lg:flex-1 lg:gap-10">
            <EventInfoSVP
              eventId={eventId}
              eventName={eventName}
              eventStartDate={eventStartDate}
              eventEndDate={eventEndDate}
              eventSlug={eventSlug}
              eventPrice={eventPrice}
            />
          </aside>
        </div>

        {/* Background */}
        <div className="background absolute flex w-full h-40 bg-primary-dark overflow-hidden lg:h-72">
          <Image
            className="object-cover w-full h-full blur-lg scale-105"
            src={eventImage}
            alt={eventName}
            width={800}
            height={800}
          />
        </div>
      </div>

      {/* Floating CTA */}
      <div
        className={`floating-cta fixed flex flex-col bg-white bottom-0 left-0 w-full gap-2 p-5 border-t border-outline transition-all duration-300 z-40 dark:bg-surface-black dark:border-outline-dark lg:hidden`}
      >
        <div className="flex  items-center justify-between">
          <div className="flex flex-col font-bodycopy">
            <p className="text-sm">Total Amount</p>
            <p className="font-bold">
              {getRupiahCurrency(eventPrice[0].amount)}
            </p>
          </div>
          {eventPrice[0].status === "INACTIVE" || expiredEvent ? (
            <AppButton size="defaultRounded" disabled>
              Tickets Sold Out
            </AppButton>
          ) : (
            <Link
              href={`/events/${eventSlug}/${eventId}/checkout?ticketId=${eventPrice[0].id}`}
            >
              <AppButton
                size="defaultRounded"
                // GTM
                featureName="add_to_cart_event"
                featureId={String(eventId)}
                featureProductCategory="EVENT"
                featureProductName={eventName}
                featureProductAmount={eventPrice[0].amount}
                featurePagePoint="Product Detail Page"
                featurePlacement="floating-panel-mobile"
                // Meta Pixel
                metaEventName="AddToCart"
                metaContentIds={[String(eventId)]}
                metaContentType="event"
                metaContentName={`${eventName} - ${eventPrice[0].name}`}
                metaContentCategory="Business Event"
                metaCurrency="IDR"
                metaValue={eventPrice[0].amount}
              >
                <ShieldCheck className="size-5" />
                Pay & Get Access
              </AppButton>
            </Link>
          )}
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
