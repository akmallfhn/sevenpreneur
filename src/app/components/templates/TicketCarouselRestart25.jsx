"use client"
import TicketCardRestart25 from "../elements/TicketCardRestart25"
import SectionTitleRestart25 from "../elements/SectionTitleRestart25"
import dayjs from "dayjs"

const data = [
    {
        "id": "early_bird_yes",
        "type": "Early Bird",
        "tagline": "YES Conference Edition",
        "basePrice": 270000,
        "discountPrice": 70000,
        "benefit": ["Main stage access", "Workshop", "Experience zone"],
        "startDate": "2025-04-27T11:00:00+07:00",
        "expiredDate": "2025-04-27T22:00:00+07:00",
        "isPremium": false,
        "isActive": true
    },
    {
        "id": "early_bird",
        "type": "Early Bird",
        "tagline": "Start smart. Pay less!",
        "basePrice": 270000,
        "discountPrice": 170000,
        "benefit": ["Main stage access","Workshop", "Experience zone" ],
        "startDate": "2025-04-28T00:00:00+07:00",
        "expiredDate": "2025-05-27T23:59:00+07:00",
        "isPremium": false,
        "isActive": true
    },
    {
        "id": "regular",
        "type": "Regular",
        "tagline": "A ticket to insight",
        "basePrice": 540000,
        "discountPrice": 370000,
        "benefit": ["Main stage access", "Workshop", "Experience zone"],
        "startDate": "2025-05-28T00:00:00+07:00",
        "expiredDate": "2025-07-26T23:59:00+07:00",
        "isPremium": false,
        "isActive": true
    },
    {
        "id": "vip",
        "type": "VIP",
        "tagline": "Full experience. Half price",
        "basePrice": 5400000,
        "discountPrice": 3000000,
        "benefit": ["Everything in Regular Ticket", "Front row seating", "Dinner & after party invite", "Community membership", "Exclusive merch set"],
        "startDate": "2025-04-27T11:00:00+07:00",
        "expiredDate": "2025-07-25T23:59:00+07:00",
        "isPremium": true,
        "isActive": true
    }
]

export default function TicketCarouselRestart25() {

    const Now = dayjs()
    const ticketData = data.filter(ticket => dayjs(ticket.expiredDate).isAfter(Now) && ticket.isActive)

    return(
        <section id="ticket-id">
        <div className="ticket-carousel pb-8 flex flex-col items-center lg:pb-[60px]">
            <div className="flex flex-col items-center">
                <SectionTitleRestart25 sectionTitle="Get Your Ticket"/>
            </div>
            <div className="px-8 w-full overflow-x-auto lg:overflow-x-hidden">
                <TicketCardRestart25 ticketListItem={ticketData}/>
            </div>
        </div>
        </section>
    )
}