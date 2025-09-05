"use client";
import SectionTitleRestart25 from "./SectionTitleRestart25";
import TicketItemCardRestart25 from "./TicketItemCardRestart25";
import dayjs from "dayjs";
import { useRef } from "react";

const data = [
  // ACTIVE TICKET
  {
    id: "regular",
    name: "Regular",
    tagline: "A ticket to insight",
    base_price: 540000,
    discount_price: 370000,
    benefit: ["Main stage access", "Workshop", "Experience zone"],
    start_date: "2025-05-28T00:00:00+07:00",
    expire_date: "2025-07-25T23:59:00+07:00",
    is_premium: false,
    is_active: true,
    is_sold_out: false,
  },
  {
    id: "vip",
    name: "VIP",
    tagline: "Full experience. Half price",
    base_price: 5400000,
    discount_price: 3000000,
    benefit: [
      "Everything in Regular Ticket",
      "Front row seating",
      "Dinner & after party invite",
      "Community membership",
      "Exclusive merch set",
    ],
    start_date: "2025-05-28T00:00:00+07:00",
    expire_date: "2025-07-25T23:59:00+07:00",
    is_premium: true,
    is_active: true,
    is_sold_out: false,
  },

  // --- INACTIVE TICKET
  {
    id: "d_seven_regular",
    name: "D-Seven Regular",
    tagline: "Special Price on Today",
    base_price: 540000,
    discount_price: 277000,
    benefit: ["Main stage access", "Workshop", "Experience zone"],
    start_date: "2025-07-19T00:00:00+07:00",
    expire_date: "2025-07-19T23:59:00+07:00",
    is_premium: false,
    is_active: false,
    is_sold_out: true,
  },
  {
    id: "d_seven_vip",
    name: "D-Seven VIP",
    tagline: "Special Price on Today",
    base_price: 5400000,
    discount_price: 2700000,
    benefit: [
      "Everything in Regular Ticket",
      "Front row seating",
      "Dinner & after party invite",
      "Community membership",
      "Exclusive merch set",
    ],
    start_date: "2025-07-10T00:00:00+07:00",
    expire_date: "2025-07-19T23:59:00+07:00",
    is_premium: true,
    is_active: false,
    is_sold_out: true,
  },
  {
    id: "early_bird_yes",
    name: "Early Bird",
    tagline: "YES Conference Edition",
    base_price: 270000,
    discount_price: 70000,
    benefit: ["Main stage access", "Workshop", "Experience zone"],
    start_date: "2025-04-27T11:00:00+07:00",
    expire_date: "2025-04-27T22:00:00+07:00",
    is_premium: false,
    is_active: false,
    is_sold_out: true,
  },
  {
    id: "early_bird",
    name: "Early Bird",
    tagline: "Start smart. Pay less!",
    base_price: 270000,
    discount_price: 170000,
    benefit: ["Main stage access", "Workshop", "Experience zone"],
    start_date: "2025-04-28T00:00:00+07:00",
    expire_date: "2025-05-27T23:59:00+07:00",
    is_premium: false,
    is_active: false,
    is_sold_out: true,
  },
  {
    id: "vip",
    name: "VIP",
    tagline: "Full experience. Half price",
    base_price: 5400000,
    discount_price: 2700000,
    benefit: [
      "Everything in Regular Ticket",
      "Front row seating",
      "Dinner & after party invite",
      "Community membership",
      "Exclusive merch set",
    ],
    start_date: "2025-04-27T11:00:00+07:00",
    expire_date: "2025-05-14T23:59:00+07:00",
    is_premium: true,
    is_active: false,
    is_sold_out: true,
  },
];

export default function TicketCarouselRestart25() {
  // --- Avoid sending event view repeatedly
  const viewedTickets = useRef<Set<string>>(new Set());

  const now = dayjs();
  const filteredTickets = data
    .filter((ticket) => {
      const startDate = dayjs(ticket.start_date);
      const isCurrentlyAvailable = ticket.is_active && now.isAfter(startDate);
      return isCurrentlyAvailable;
    })
    .map((ticket) => {
      const expireDate = dayjs(ticket.expire_date);
      const isSoldOut = ticket.is_sold_out || now.isAfter(expireDate);
      return {
        ...ticket,
        isSoldOut,
      };
    });

  return (
    <section id="ticket-id">
      <div className="ticket-carousel pb-8 flex flex-col items-center lg:pb-[60px]">
        <div className="section-name flex flex-col items-center">
          <SectionTitleRestart25 sectionTitle="Get Your Ticket" />
        </div>
        <div className="ticket-container px-8 w-full overflow-x-auto lg:overflow-x-hidden">
          <div className="group-ticket flex items-start lg:justify-center lg:gap-5">
            {filteredTickets.map((ticket, index) => (
              <TicketItemCardRestart25
                key={index}
                index={index}
                ticketId={ticket.id}
                ticketName={ticket.name}
                ticketTagline={ticket.tagline}
                ticketExpireDate={ticket.expire_date}
                ticketBasePrice={ticket.base_price}
                ticketDiscountPrice={ticket.discount_price}
                ticketBenefit={ticket.benefit}
                isPremium={ticket.is_premium}
                isSoldOut={ticket.isSoldOut}
                viewedTickets={viewedTickets.current}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
