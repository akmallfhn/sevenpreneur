"use client";
import { useRef, useEffect } from "react";
import { ArrowDown, Ban, Check, LockOpen, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import AppButton from "../buttons/AppButton";
import CountdownTimerRestart25 from "./CountdownTimerRestart25";

interface TicketItemCardRestart25Props {
  index: number;
  ticketId: string;
  ticketName: string;
  ticketTagline: string;
  ticketExpireDate: string;
  ticketBasePrice: number;
  ticketDiscountPrice: number;
  ticketBenefit: string[];
  isPremium: boolean;
  isSoldOut: boolean;
  viewedTickets: Set<string>;
}

export default function TicketItemCardRestart25({
  index,
  ticketId,
  ticketName,
  ticketTagline,
  ticketExpireDate,
  ticketBasePrice,
  ticketDiscountPrice,
  ticketBenefit,
  isPremium,
  isSoldOut,
  viewedTickets,
}: TicketItemCardRestart25Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Tracking View Ticket
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !viewedTickets.has(ticketId)) {
            window.dataLayer?.push({
              event: "view",
              feature_name: `ticket_checkout_${ticketId}_view`,
              feature_position: index + 1,
            });
            viewedTickets.add(ticketId);
          }
        });
      },
      { threshold: 0.5 }
    );
    const current = ref.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [ticketId, index, viewedTickets]);

  return (
    <div className="root py-3 pr-3 z-50 lg:pr-0" ref={ref}>
      <div className="ticket-container relative flex">
        <Image
          className="background max-w-[220px] overflow-hidden lg:max-w-[252px]"
          src={
            "https://static.wixstatic.com/shapes/02a5b1_b7845db27f51481a90a3d886c55ff75b.svg"
          }
          alt="Ticket RE:START"
          width={2000}
          height={2000}
        />
        <div className="container absolute flex flex-col top-4 left-1/2 -translate-x-1/2 gap-2 z-20">
          {/* Tiket Metadata */}
          <div className="metadata-ticket text-black flex flex-col items-center gap-1 px-3">
            <div className="type-ticket flex items-center gap-1.5">
              <h3 className="font-brand font-bold text-center text-2xl lg:text-[28px]">
                {ticketName}
              </h3>
              {isPremium && (
                <Image
                  className="aspect-square size-4 object-cover"
                  src={
                    "https://static.wixstatic.com/media/02a5b1_3696221a75eb4da28584f0df3a8a1e7a~mv2.png"
                  }
                  alt="VIP Icon"
                  width={40}
                  height={40}
                />
              )}
            </div>
            <p className="tagline-ticket font-bodycopy font-semibold text-sm lg:text-base">
              {ticketTagline}
            </p>
            <CountdownTimerRestart25
              targetDateTime={ticketExpireDate}
              variant="extra_small"
              isIncludeDimension={false}
            />
          </div>

          {/* Pricing */}
          <div className="pricing flex flex-col gap-1 items-center font-bodycopy text-black">
            {ticketBasePrice !== 0 && (
              <div className="discount flex items-center gap-2">
                <p className="bg-primary font-bold text-white text-[10px] px-1 py-0.5 rounded-sm lg:text-xs">
                  {Math.round(
                    100 - (ticketDiscountPrice / ticketBasePrice) * 100
                  )}
                  % OFF
                </p>
                <div className="flex items-center relative">
                  <p className="text-[10px] font-medium lg:text-xs">Rp</p>
                  <p className="font-semibold text-sm lg:text-base">
                    {ticketBasePrice.toLocaleString("en-US")}
                  </p>
                  <span className="absolute left-0 top-1/2 w-full h-[1px] bg-secondary rotate-[345deg] -translate-y-1/2" />
                </div>
              </div>
            )}
            <div className="flex items-center gap-1">
              <p className="text-sm font-bold lg:text-base">Rp</p>
              <p className="font-black text-2xl lg:text-[28px]">
                {ticketDiscountPrice.toLocaleString("en-US")}
              </p>
            </div>
          </div>

          {/* Benefit */}
          <div className="benefit flex flex-col pl-6 font-bodycopy text-xs text-black gap-1 lg:text-sm">
            <p className="font-bold">What You’ll Enjoy</p>
            <div className="benefit-items flex flex-col gap-0.5">
              {ticketBenefit.map((post, index) => (
                <div className="item flex gap-1 items-center" key={index}>
                  <Check
                    color="#AFEB29"
                    size={14}
                    className="p-0.5 bg-[#018D44] rounded-sm"
                  />
                  <p>{post}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={"https://vesta.halofans.id/event/v2/re-start"}
          className="cta-button absolute bottom-4 left-1/2 -translate-x-1/2 lg:bottom-5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AppButton
            size="defaultRounded"
            featureName={`ticket_checkout_${ticketId}`}
            featurePosition={index + 1}
            disabled={isSoldOut}
            className="w-[198px]"
          >
            {isSoldOut ? (
              <div className="flex w-full items-center justify-between">
                <p className="font-bold text-sm">Sold Out</p>
                <div className="aspect-square p-1 bg-secondary rounded-full">
                  <Ban className="text-white size-4" />
                </div>
              </div>
            ) : (
              <div className="flex w-full items-center justify-between">
                <div className="flex flex-col items-start">
                  <p className="font-bold text-xs">Buy Ticket Now</p>
                  <p className="font-medium text-[10px]">{`before it's gone - ${dayjs(
                    ticketExpireDate
                  ).format("D MMM")}`}</p>
                </div>
                <div className="aspect-square p-1 bg-secondary rounded-full">
                  <ShieldCheck className="text-white size-4" />
                </div>
              </div>
            )}
          </AppButton>
        </Link>
      </div>
    </div>
  );
}
