"use client"
import dayjs from "dayjs"
import TicketCardItemRestart25 from "./TicketCardItemRestart25"

export default function TicketCardRestart25({ ticketListItem }) {
    const viewedTickets = new Set() // Supaya event "view" tidak dikirim dua kali untuk tiket yang sama

    const filteredTickets = ticketListItem.filter(post => {
        const now = dayjs()
        const start = dayjs(post.startDate)
        return post.isActive === true && !start.isAfter(now)
    })

    return(
        <div className="group-ticket flex items-start lg:justify-center lg:gap-5">
            {filteredTickets.map((post, index) => (
                <TicketCardItemRestart25 key={index} post={post} index={index} viewedTickets={viewedTickets}/>         
            ))}
        </div>
    )
}