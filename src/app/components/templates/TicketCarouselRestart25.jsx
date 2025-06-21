"use client";
import SectionTitleRestart25 from "../titles/SectionTitleRestart25";
import TicketCardItemRestart25 from "../items/TicketCardItemRestart25";
import dayjs from "dayjs";

const data = [
  {
    id: "early_bird_yes",
    type: "Early Bird",
    tagline: "YES Conference Edition",
    basePrice: 270000,
    discountPrice: 70000,
    benefit: ["Main stage access", "Workshop", "Experience zone"],
    startDate: "2025-04-27T11:00:00+07:00",
    expiredDate: "2025-04-27T22:00:00+07:00",
    isPremium: false,
    isActive: false,
  },
  {
    id: "early_bird",
    type: "Early Bird",
    tagline: "Start smart. Pay less!",
    basePrice: 270000,
    discountPrice: 170000,
    benefit: ["Main stage access", "Workshop", "Experience zone"],
    startDate: "2025-04-28T00:00:00+07:00",
    expiredDate: "2025-05-27T23:59:00+07:00",
    isPremium: false,
    isActive: true,
  },
  {
    id: "regular",
    type: "Regular",
    tagline: "A ticket to insight",
    basePrice: 540000,
    discountPrice: 370000,
    benefit: ["Main stage access", "Workshop", "Experience zone"],
    startDate: "2025-05-28T00:00:00+07:00",
    expiredDate: "2025-07-26T23:59:00+07:00",
    isPremium: false,
    isActive: true,
  },
  {
    id: "vip",
    type: "VIP",
    tagline: "Full experience. Half price",
    basePrice: 5400000,
    discountPrice: 2700000,
    benefit: [
      "Everything in Regular Ticket",
      "Front row seating",
      "Dinner & after party invite",
      "Community membership",
      "Exclusive merch set",
    ],
    startDate: "2025-04-27T11:00:00+07:00",
    expiredDate: "2025-05-27T23:59:00+07:00",
    isPremium: true,
    isActive: true,
  },
  {
    id: "vip",
    type: "VIP",
    tagline: "Full experience. Half price",
    basePrice: 5400000,
    discountPrice: 3000000,
    benefit: [
      "Everything in Regular Ticket",
      "Front row seating",
      "Dinner & after party invite",
      "Community membership",
      "Exclusive merch set",
    ],
    startDate: "2025-05-28T00:00:00+07:00",
    expiredDate: "2025-07-25T23:59:00+07:00",
    isPremium: true,
    isActive: true,
  },
];

export default function TicketCarouselRestart25() {
  const Now = dayjs();
  const ticketListItem = data.filter(
    (ticket) => dayjs(ticket.expiredDate).isAfter(Now) && ticket.isActive
  );

  const viewedTickets = new Set(); // --- Supaya event "view" tidak dikirim dua kali untuk tiket yang sama

  const filteredTickets = ticketListItem.filter((post) => {
    const now = dayjs();
    const start = dayjs(post.startDate);
    return post.isActive === true && !start.isAfter(now);
  });

  return (
    <section id="ticket-id">
      <div className="ticket-carousel pb-8 flex flex-col items-center lg:pb-[60px]">
        <div className="section-name flex flex-col items-center">
          <SectionTitleRestart25 sectionTitle="Get Your Ticket" />
        </div>
        <div className="ticket-container px-8 w-full overflow-x-auto lg:overflow-x-hidden">
          <div className="group-ticket flex items-start lg:justify-center lg:gap-5">
            {filteredTickets.map((post, index) => (
              <TicketCardItemRestart25
                key={index}
                post={post}
                index={index}
                viewedTickets={viewedTickets}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
