"use client"
import Image from "next/image"
import ButtonRestart25 from "../elements/ButtonRestart25"
import { Handshake, LayoutList } from "lucide-react"

export default function BannerEventRestart25() {
    return(
        <div className="p-[1px] rounded-md bg-gradient-to-br from-[#B4B4B4] to-[#373737]">
            <div className="banner-event relative flex bg-primary aspect-mobile-banner max-w-[400px] rounded-md overflow-hidden">
                {/* Content */}
                <div className="flex flex-col gap-4 p-5 items-start justify-center z-20">
                    <div className="flex flex-col text-white gap-1">
                        <h3 className="font-bold font-brand text-xl">
                            Become Our Partner
                        </h3>
                        <p className="font-bodycopy text-sm">
                            Interested in joining RE:START 2025 as a sponsor or media partner? Our team would love to connect with you.
                        </p>
                    </div>
                    <ButtonRestart25
                    buttonTitle={"Partnership Form"}
                    Icon={LayoutList}/>
                </div>
                
                {/* Ornamen */}
                <Image
                className="ornament-1 absolute flex max-w-24 right-4 bottom-4 opacity-30 z-10"
                src={"https://static.wixstatic.com/media/02a5b1_5f19d31a39824eae8f4393ce4466aee6~mv2.png"}
                alt="Ornament Logo Sevenpreneur"
                width={200}
                height={200}/>

                {/* Background Image */}
                <Image
                className="background absolute flex opacity-90 object-cover inset-0 h-full mix-blend-multiply"
                src={"https://static.wixstatic.com/media/02a5b1_22c064430b6d43cd9a76d3b2c3c43541~mv2.webp"}
                alt="Background Sponsorship"
                width={1440}
                height={1440}/>
            </div>
        </div>
    )
}