"use client";
import { getRupiahCurrency } from "@/lib/currency";
import { getDateTimeRange } from "@/lib/date-time-manipulation";
import dayjs from "dayjs";
import { CalendarFold, Clock3, LockKeyhole, MapPin } from "lucide-react";
import Link from "next/link";
import AppButton from "../buttons/AppButton";
import { EventPrice } from "../pages/EventDetailsSVP";
import SectionContainerSVP from "./SectionContainerSVP";

interface EventInfoSVP {
  eventId: number;
  eventName: string;
  eventSlug: string;
  eventStartDate: string;
  eventEndDate: string;
  eventPrice: EventPrice[];
  eventLocation: string;
  eventLocationURL: string;
}

export default function EventInfoSVP(props: EventInfoSVP) {
  const expiredEvent = dayjs().isAfter(props.eventEndDate);

  const { dateString, timeString } = getDateTimeRange({
    startDate: props.eventStartDate,
    endDate: props.eventEndDate,
  });

  const informations = [
    {
      icon: <CalendarFold className="size-5" />,
      label: "DATE",
      value: dateString,
    },
    {
      icon: <Clock3 className="size-5" />,
      label: "TIME",
      value: timeString,
    },
    {
      icon: <MapPin className="size-5" />,
      label: "LOCATION",
      value: props.eventLocation,
    },
  ];

  return (
    <div className="container-info flex md:sticky md:top-20 lg:top-24">
      <SectionContainerSVP sectionName={props.eventName} hasNoSign>
        <div className="list-info flex flex-col gap-3">
          {informations.map((post, index) => (
            <div
              className="event-item flex gap-3 items-center font-bodycopy"
              key={index}
            >
              <div className="flex aspect-square items-center justify-center shrink-0 p-2 bg-primary-soft-background text-primary-soft-foreground rounded-full overflow-hidden dark:bg-sevenpreneur-coal dark:text-foreground dark:border">
                {post.icon}
              </div>
              <div className="flex flex-col">
                <p className="text-[13px] text-primary font-bodycopy font-bold leading-snug tracking-widest dark:text-sevenpreneur-white">
                  {post.label}
                </p>
                <p className="text-[15px] font-medium leading-snug">
                  {post.value}
                </p>
              </div>
            </div>
          ))}
        </div>
        <hr className="divider hidden border-t lg:flex" />
        <div className="add-to-cart hidden flex-col gap-3 lg:flex">
          <div className="price-info flex flex-col font-bodycopy">
            <h3 className="font-bold text-xl dark:text-white">
              {getRupiahCurrency(props.eventPrice[0].amount)}
            </h3>
          </div>
          <div className="flex flex-col items-center gap-3 font-bodycopy">
            <Link
              href={`/events/${props.eventSlug}/${props.eventId}/checkout?ticketId=${props.eventPrice[0].id}`}
              className="add-to-cart-button w-full"
            >
              <AppButton
                size="defaultRounded"
                className="w-full"
                disabled={
                  props.eventPrice[0].status === "INACTIVE" || !!expiredEvent
                }
                // GTM
                featureName="add_to_cart_event"
                featureId={String(props.eventId)}
                featureProductCategory="EVENT"
                featureProductName={props.eventName}
                featureProductAmount={props.eventPrice[0].id}
                featurePagePoint="Product Detail Page"
                featurePlacement="aside-panel-desktop"
                // Meta Pixel
                metaEventName="AddToCart"
                metaContentIds={[String(props.eventId)]}
                metaContentType="event"
                metaContentName={`${props.eventName} - ${props.eventPrice[0].name}`}
                metaContentCategory="Business Event"
                metaCurrency="IDR"
                metaValue={props.eventPrice[0].amount}
              >
                {props.eventPrice[0].status === "INACTIVE" || !!expiredEvent
                  ? "Sold Out"
                  : "Pay & Get Access"}
              </AppButton>
            </Link>
            <div className="flex items-center font-bodycopy gap-1 text-emphasis">
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
