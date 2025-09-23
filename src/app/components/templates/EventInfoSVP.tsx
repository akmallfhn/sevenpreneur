"use client";
import { getRupiahCurrency } from "@/lib/currency";
import { CalendarFold, LockKeyhole, MapPin, Wine } from "lucide-react";
import Link from "next/link";
import AppButton from "../buttons/AppButton";
import { EventPrice } from "../pages/EventDetailsSVP";
import { getDateTimeRange } from "@/lib/date-time-manipulation";

interface EventInfoSVP {
  eventId: number;
  eventName: string;
  eventSlug: string;
  eventStartDate: string;
  eventEndDate: string;
  eventPrice: EventPrice[];
}

export default function EventInfoSVP({
  eventId,
  eventName,
  eventStartDate,
  eventEndDate,
  eventPrice,
  eventSlug,
}: EventInfoSVP) {
  const { dateString, timeString } = getDateTimeRange({
    startDate: eventStartDate,
    endDate: eventEndDate,
  });
  return (
    <div className="container-info flex flex-col gap-3 bg-white  rounded-md dark:bg-coal-black lg:dark:bg-surface-black lg:border lg:border-outline lg:p-5 lg:sticky lg:top-24 lg:dark:border-outline-dark">
      <h1 className="event-title font-brand font-bold text-2xl leading-tight">
        {eventName}
      </h1>
      <div className="list-info flex flex-col gap-1">
        <div className="event-date flex gap-1 items-center font-bodycopy">
          <div className="flex w-8 h-8 items-center justify-center shrink-0 overflow-hidden">
            <CalendarFold className="size-5 text-alternative" />
          </div>
          <p className="text-[15px] font-medium">{dateString}</p>
        </div>
        <div className="event-time flex gap-1 items-center font-bodycopy">
          <div className="flex w-8 h-8 items-center justify-center shrink-0 overflow-hidden">
            <CalendarFold className="size-5 text-alternative" />
          </div>
          <p className="text-[15px] font-medium">{timeString}</p>
        </div>
        <div className="event-place flex gap-1 items-center font-bodycopy">
          <div className="flex w-8 h-8 items-center justify-center shrink-0 overflow-hidden">
            <MapPin className="size-5 text-alternative" />
          </div>
          <a
            href="https://share.google/0bmF735Lzrx86jgq4"
            className="text-[15px] font-medium"
            target="_blank"
            rel="noopenner noreferrer"
          >
            Connext Space, Cyber 2 Tower, Kuningan
          </a>
        </div>
        <div className="event-facility flex gap-1 items-center font-bodycopy">
          <div className="flex w-8 h-8 items-center justify-center shrink-0 overflow-hidden">
            <Wine className="size-5 text-alternative" />
          </div>
          <p className="text-[15px] font-medium">Include Snacks & Drinks</p>
        </div>
      </div>
      <hr className="divider hidden border-t-1 border-outline dark:border-outline-dark lg:flex" />
      <div className="add-to-cart hidden flex-col gap-3 lg:flex">
        <div className="price-info flex flex-col font-bodycopy">
          <h3 className="font-bold text-black text-xl dark:text-white">
            {getRupiahCurrency(eventPrice[0].amount)}
          </h3>
        </div>
        <div className="flex flex-col items-center gap-3 font-bodycopy">
          {eventPrice[0].status === "ACTIVE" ? (
            <Link
              href={`/events/${eventSlug}/${eventId}/checkout?ticketId=${eventPrice[0].id}`}
              className="add-to-cart-button w-full"
            >
              <AppButton
                size="defaultRounded"
                className="w-full"
                // GTM
                featureName="add_to_cart_event"
                featureId={String(eventId)}
                featureProductCategory="EVENT"
                featureProductName={eventName}
                featureProductAmount={eventPrice[0].id}
                featurePagePoint="Product Detail Page"
                featurePlacement="aside-panel-desktop"
                // Meta Pixel
                metaEventName="AddToCart"
                metaContentIds={[String(eventId)]}
                metaContentType="event"
                metaContentName={`${eventName} - ${eventPrice[0].name}`}
                metaContentCategory="Business Event"
                metaCurrency="IDR"
                metaValue={eventPrice[0].amount}
              >
                Pay & Get Access
              </AppButton>
            </Link>
          ) : (
            <AppButton size="defaultRounded" className="w-full" disabled>
              Sold Out
            </AppButton>
          )}
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
