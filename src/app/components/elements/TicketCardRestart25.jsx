"use client"
import { ArrowUpRight, Check, LockOpen } from "lucide-react"
import Image from "next/image"
import ButtonRestart25 from "./ButtonRestart25"
import Link from "next/link"

const variantStyles = {
    earlyBird: {
        type: "Early Bird",
        tagline: "YES Conference Edition",
        basePrice: 400000,
        discountPrice: 150000,
        benefit: ["Main stage access", "Workshop & experience zone"],
        expired: "27 Apr 25"
    },
    regular: {
        type: "Regular",
        tagline: "A ticket to insight",
        basePrice: 0,
        discountPrice: 400000,
        benefit: ["Main stage access", "Workshop & experience zone"],
        expired: "30 May 25"
    },
    vip: {
        type: "VIP",
        tagline: "Full experience. Half price",
        basePrice: 3000000,
        discountPrice: 1500000,
        benefit: ["Main stage access", "Workshop & experience zone", "Front row seating", "Dinner & after party invite", "Community membership", "Exclusive merch set"],
        expired: "26 June 25"
    }
}

export default function TicketCardRestart25({ variant }) {

    // Mengatur variants
    const { type, tagline, basePrice, discountPrice, benefit, expired } = variantStyles[variant]

    // Membuat persentase diskon
    const discountPercent = 100 - (discountPrice / basePrice) * 100
    const rounded = Math.round(discountPercent)

    return(
        <div className="root py-3 pr-3 z-50">
            <div className="ticket-container relative flex">
                <Image
                className="background max-w-[220px] overflow-hidden"
                src={"https://static.wixstatic.com/shapes/02a5b1_b7845db27f51481a90a3d886c55ff75b.svg"}
                alt="Ticket RE:START"
                width={2000}
                height={2000}/>

                <div className="container absolute flex flex-col top-4 left-1/2 -translate-x-1/2 gap-2 z-20">
                    {/* Tiket Metadata */}
                    <div className="metadata-ticket text-black flex flex-col items-center">
                        <div className="type-ticket flex items-center gap-1.5">
                            <h3 className="font-brand font-bold text-2xl">
                                {type}
                            </h3>
                            {variant === "vip" && (
                                <Image
                                className="aspect-square size-4 object-cover"
                                src={"https://static.wixstatic.com/media/02a5b1_3696221a75eb4da28584f0df3a8a1e7a~mv2.png"}
                                alt="VIP Icon"
                                width={40}
                                height={40}
                            />
                            )}
                        </div>
                        <p className="tagline-ticket font-bodycopy font-semibold text-sm">
                            {tagline}
                        </p>
                        {variant === "vip" && (
                            <p className="marketing-ticke font-bodycopy text-xs font-medium text-[#7E7E7E]">
                                Limited to 150 early movers
                            </p>
                        )}
                    </div>

                    {/* Pricing */}
                    <div className="pricing flex flex-col gap-1 items-center font-bodycopy text-black">
                        {basePrice !== 0 && (
                            <div className="discount flex items-center gap-2">
                                <p className="bg-secondary font-bold text-white text-[10px] px-1 py-0.5 rounded-sm">
                                    {rounded}% OFF
                                </p>
                                <div className="flex items-center relative">
                                    <p className="text-[10px] font-medium">
                                        Rp
                                    </p>
                                    <p className="font-semibold text-sm">
                                        {basePrice.toLocaleString("en-US")}
                                    </p>
                                    <span className="absolute left-0 top-1/2 w-full h-[1px] bg-secondary rotate-[345deg] -translate-y-1/2"/>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <p className="text-sm font-bold">
                                Rp
                            </p>
                            <p className="font-black text-2xl">
                                {discountPrice.toLocaleString("en-US")}
                            </p>
                        </div>
                    </div>

                    {/* Benefit */}
                    <div className="benefit flex flex-col pl-6 font-bodycopy text-xs text-black     gap-1">
                        <p className="font-bold">
                            What You’ll Enjoy
                        </p>
                        <div className="benefit-items flex flex-col gap-0.5">
                            {benefit.map((post, index) => (
                                <div className="item flex gap-1 items-center" key={index}>
                                    <Check color="#AFEB29" size={14} className="p-0.5 bg-[#018D44] rounded-sm"/>
                                    <p>{post}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <Link href={"https://vesta.halofans.id/event/v2/re-start"} className="cta-button absolute bottom-4 left-1/2 -translate-x-1/2" target="_blank" rel="noopener noreferrer">
                    <ButtonRestart25 variant={"two liner"} buttonTitle={"Unlock Access"} buttonAltTitle={`before it's gone – ${expired}`} Icon={LockOpen}/>
                </Link>
            </div>
        </div>
    )
}