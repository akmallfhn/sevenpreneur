"use client"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import ButtonRestart25 from "../elements/ButtonRestart25"
import SectionTitleRestart25 from "../elements/SectionTitleRestart25"
import CountdownTimerRestart25 from "../elements/CountdownTimerRestart25"
import { Ticket, TicketPlus } from "lucide-react"
import Link from "next/link"

export default function ContentEventRestart25() {
    const ref = useRef(null)
    const viewedTickets = new Set() 
    const [hasBeenViewed, setHasBeenViewed] = useState(false)

    // Tracking View Ticket
    useEffect(() => {
        // Membuat "mata pengintai" yang memantau apakah elemen sudah muncul
        const observer = new IntersectionObserver( 
            (entries) => {
                entries.forEach((entry) => { // Looping semua elemen yang dipantau
                    if (entry.isIntersecting && !hasBeenViewed) { // elemen sedang terlihat di layar dan mengecek apakah tiket ini sudah pernah dilihat.
                        window.dataLayer.push({
                            event: "view",
                            feature_name: "ticket_checkout_view",
                        })
                        setHasBeenViewed(true) // Tandai tiket ini sebagai sudah dilihat
                    }
                })
            },
            {threshold: 0.5}
        )
        // Mulai memantau elemen yang ditandai dengan ref.
        if (ref.current) observer.observe(ref.current)
        // Saat komponen dibuang dari layar (unmount), kita hentikan pengawasan supaya tidak membuang resource.
        return () => {
            if (ref.current) observer.unobserve(ref.current)
        }
    }, [hasBeenViewed])
    
    return(
        <section id="content-event">
        <div className="content-event-root relative bg-black flex justify-center overflow-hidden">
            <div className="container flex flex-col py-8 px-8 gap-9 items-center z-20 lg:pt-24 lg:pb-[60px] lg:gap-[60px]">
                {/* Event Title */}
                <div className="title-event flex flex-col items-center gap-5 lg:gap-10">
                    <Image
                    className="w-full max-w-[320px] lg:max-w-[720px]"
                    src={"https://static.wixstatic.com/media/02a5b1_d927500efc3d47c0b8cf75a4435214be~mv2.webp"}
                    alt="Logo RE:START Conference 2025"
                    width={2440}
                    height={2440}
                    />
                    <div className="flex flex-col text-white items-center gap-1">
                        <p className="font-brand text-lg font-semibold lg:text-2xl">
                            July 26, 2025
                        </p>
                        <p className="font-bodycopy lg:text-2xl">
                            Kuningan City Ballroom, Jakarta
                        </p>
                    </div>
                    <Link ref={ref} href={"https://vesta.halofans.id/event/v2/re-start"} target="_blank" rel="noopener noreferrer">
                        <ButtonRestart25 
                        buttonTitle={"Get Your Ticket Now"} 
                        Icon={TicketPlus} 
                        addCSS={`lg:mx-3 lg:my-1`} 
                        addCSSIcon={`lg:size-8`}
                        feature_name={"ticket_checkout"}/>
                    </Link>
                </div>

                {/* Embed Youtube */}
                <section id="teaser">
                <div className="p-[1px] rounded-md bg-gradient-to-r from-0% from-[#727272] via-50% via-[#333333] to-100% to-[#727272]">
                    <div className="bg-black p-3 rounded-md lg:hidden">
                        <iframe 
                        width="315" 
                        height="180" 
                        src="https://www.youtube.com/embed/GsLjwsu9Jus?si=j2bVzojiiYmE0ltu&amp;controls=0"
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen>
                        </iframe>
                    </div>
                    <div className="bg-black hidden p-3 rounded-md lg:flex lg:p-4">
                        <iframe 
                        width="780" 
                        height="478" 
                        src="https://www.youtube.com/embed/GsLjwsu9Jus?si=j2bVzojiiYmE0ltu&amp;controls=0"
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        referrerPolicy="strict-origin-when-cross-origin" 
                        allowFullScreen>
                        </iframe>
                    </div>
                </div>
                </section>

                {/* Countdown */}
                <div className="about-event flex flex-col gap-3 items-center lg:gap-5">
                    <SectionTitleRestart25 sectionTitle="RE:START on"/>
                    <CountdownTimerRestart25/>
                </div>

                {/* About Event */}
                <div className="about-event flex flex-col gap-3 items-center lg:gap-5">
                    <SectionTitleRestart25 sectionTitle="It’s Time to Lead!"/>
                    <p className="quotes font-bodycopy text-sm text-left text-white max-w-[500px] lg:text-xl lg:max-w-[760px]">
                        The global economy faces mounting pressure as geopolitical tensions reshape markets and disrupt stability — and we are not immune. 
                        <br/>
                        <br/>
                        As emerging economies like ours feel the impact, we recognize that this is more than a crisis; it is a call to reimagine the system we've inherited. 
                        <br/>
                        <br/>
                        We are not here to preserve the status quo. 
                        <br />
                        <br/>
                        We are here to challenge it — to build a new economy that reflects our values, our agility, and our readiness to lead. <b>RE:START 2025</b> is where we come together — not just to adapt to change, but to drive it.
                    </p>
                </div>            
            </div>

            {/* Overlay */}
            <div className="overlay-top absolute left-0 top-[400px] w-full h-[320px] bg-gradient-to-t from-10% from-black/10 via-50% via-black to-100% to-black/0 z-10 lg:top-[690px]"/>
            <div className="overlay absolute left-0 bottom-0 w-full h-[50px] bg-gradient-to-t from-10% from-black to-100% to-black/0 z-10 lg:hidden"/>

            {/* Background */}
            <div className="absolute flex flex-col -top-40 lg:top-20">
                <Image
                className="background flex opacity-22 object-cover h-[720px]"
                src={"https://static.wixstatic.com/media/02a5b1_96ca791fac7348acb572e5d9bd38c550~mv2.webp"}
                alt="Background Hero"
                width={2440}
                height={2440}/>
                <Image
                className="background flex opacity-70 object-cover h-[500px] lg:hidden"
                src={"https://static.wixstatic.com/media/02a5b1_40fba35c7e7f4271862138c4b509ac54~mv2.webp"}
                alt="Background Hero"
                width={2440}
                height={2440}/>
            </div>
        </div>
        </section>
    )
}