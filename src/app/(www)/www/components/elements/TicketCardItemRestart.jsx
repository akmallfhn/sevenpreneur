"use client"
import { useRef, useEffect } from "react"
import { Check, LockOpen } from "lucide-react"
import Image from "next/image"
import ButtonRestart25 from "./ButtonRestart25"
import Link from "next/link"
import dayjs from "dayjs"

export default function TicketCardItemRestart25({ post, index, viewedTickets }) {
    const ref = useRef(null)

    // Tracking View Ticket
    useEffect(() => {
        // Membuat "mata pengintai" yang memantau apakah elemen sudah muncul
        const observer = new IntersectionObserver( 
            (entries) => {
                entries.forEach((entry) => { // Looping semua elemen yang dipantau
                    if (entry.isIntersecting && !viewedTickets.has(post.id)) { // elemen sedang terlihat di layar dan mengecek apakah tiket ini sudah pernah dilihat.
                        window.dataLayer.push({
                            event: "view",
                            feature_name: (`ticket_checkout_${post.id}_view`),
                            feature_position: index + 1
                        })
                        viewedTickets.add(post.id) // Tandai tiket ini sebagai sudah dilihat
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
    }, [post.id])

    return(
        <div className="root py-3 pr-3 z-50 lg:pr-0" key={index} ref={ref}>
            <div className="ticket-container relative flex">
                <Image
                className="background max-w-[220px] overflow-hidden lg:max-w-[252px]"
                src={"https://static.wixstatic.com/shapes/02a5b1_b7845db27f51481a90a3d886c55ff75b.svg"}
                alt="Ticket RE:START"
                width={2000}
                height={2000}/>
                <div className="container absolute flex flex-col top-4 left-1/2 -translate-x-1/2 gap-2 z-20">
                    {/* Tiket Metadata */}
                    <div className="metadata-ticket text-black flex flex-col items-center">
                        <div className="type-ticket flex items-center gap-1.5">
                            <h3 className="font-brand font-bold text-2xl lg:text-[28px]">
                                {post.type}
                            </h3>
                            {post.isPremium && (
                                <Image
                                className="aspect-square size-4 object-cover"
                                src={"https://static.wixstatic.com/media/02a5b1_3696221a75eb4da28584f0df3a8a1e7a~mv2.png"}
                                alt="VIP Icon"
                                width={40}
                                height={40}
                            />
                            )}
                        </div>
                        <p className="tagline-ticket font-bodycopy font-semibold text-sm lg:text-base">
                            {post.tagline}
                        </p>
                        {post.isPremium && (
                            <p className="marketing-ticke font-bodycopy text-xs font-medium text-[#7E7E7E] lg:text-sm">
                                Limited to 200 early movers
                            </p>
                        )}
                    </div>

                    {/* Pricing */}
                    <div className="pricing flex flex-col gap-1 items-center font-bodycopy text-black">
                        {post.basePrice !== 0 && (
                            <div className="discount flex items-center gap-2">
                                <p className="bg-secondary font-bold text-white text-[10px] px-1 py-0.5 rounded-sm lg:text-xs">
                                    {Math.round(100 - (post.discountPrice / post.basePrice) * 100)}% OFF
                                </p>
                                <div className="flex items-center relative">
                                    <p className="text-[10px] font-medium lg:text-xs">
                                        Rp
                                    </p>
                                    <p className="font-semibold text-sm lg:text-base">
                                        {post.basePrice.toLocaleString("en-US")}
                                    </p>
                                    <span className="absolute left-0 top-1/2 w-full h-[1px] bg-secondary rotate-[345deg] -translate-y-1/2"/>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <p className="text-sm font-bold lg:text-base">
                                Rp
                            </p>
                            <p className="font-black text-2xl lg:text-[28px]">
                                {post.discountPrice.toLocaleString("en-US")}
                            </p>
                        </div>
                    </div>

                    {/* Benefit */}
                    <div className="benefit flex flex-col pl-6 font-bodycopy text-xs text-black gap-1 lg:text-sm">
                        <p className="font-bold">
                            What You’ll Enjoy
                        </p>
                        <div className="benefit-items flex flex-col gap-0.5">
                            {post.benefit.map((post, index) => (
                                <div className="item flex gap-1 items-center" key={index}>
                                    <Check color="#AFEB29" size={14} className="p-0.5 bg-[#018D44] rounded-sm"/>
                                    <p>{post}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <Link href={"https://vesta.halofans.id/event/v2/re-start"} className="cta-button absolute bottom-4 left-1/2 -translate-x-1/2 lg:bottom-5" target="_blank" rel="noopener noreferrer">
                    <ButtonRestart25 
                    feature_name={`ticket_checkout_${post.id}`}
                    feature_position={index + 1}
                    // disabled={isDisabled}
                    variant={"two liner"} 
                    buttonTitle={"Unlock Access"} 
                    buttonAltTitle={`before it's gone - ${dayjs(post.expiredDate).format("D MMM")}`} 
                    Icon={LockOpen}
                    addCSSIcon={"lg:size-6"}/>
                </Link>
            </div>
        </div>
    )
}