"use client"
import TicketCardRestart25 from "../elements/TicketCardRestart25"
import SectionTitleRestart25 from "../elements/SectionTitleRestart25"

export default function TicketCarouselRestart25() {
    return(
        <div className="ticket-carousel pb-8 flex flex-col items-center">
            <div className="flex flex-col items-center">
                <SectionTitleRestart25 sectionTitle="Get Your Ticket"/>
            </div>
            <div className="px-8 w-full overflow-x-auto">
                <div className="group-ticket flex items-start lg:justify-center">
                    <TicketCardRestart25 variant={"earlyBird"}/>
                    <TicketCardRestart25 variant={"regular"}/>
                    <TicketCardRestart25 variant={"vip"}/>
                </div>
            </div>
        </div>
    )
}