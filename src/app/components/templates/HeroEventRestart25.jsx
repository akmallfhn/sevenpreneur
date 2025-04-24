"use client"
import { ArrowDown, ArrowUpIcon } from "lucide-react"
import ButtonRestart25 from "../elements/ButtonRestart25"
import Image from "next/image"

export default function HeroEventRestart2025({ onClickCTA }) {
    return(
        <div className="relative pb-10 pt-64 gap-5 flex flex-col items-center w-full bg-black overflow-hidden">
            {/* Welcoming Back */}
            <div className="absolute flex flex-col items-center gap-4 top-9 left-1/2 -translate-x-1/2 z-20">
                <Image
                className="flex max-w-40"
                src={"https://static.wixstatic.com/media/02a5b1_f73718a961f344cd80016aa1f5522fb6~mv2.webp"}
                alt="Logo Sevenpreneur"
                width={500}
                height={500}
                />
                <Image
                className="flex max-w-72"
                src={"https://static.wixstatic.com/media/02a5b1_9dfd9d5882514c6c961540b6bc80390f~mv2.webp"}
                alt="Welcome Back"
                width={500}
                height={500}
                />
            </div>

            {/* Overlay */}
            <div className="overlay absolute left-0 bottom-0 w-full h-[320px] bg-gradient-to-t from-10% from-black/10 via-50% via-black to-100% to-black/0 z-40"/>

            {/* Brand Representative */}
            <Image
            className="brand-representative absolute flex max-w-80 top-[108px] left-1/2 -translate-x-1/2 z-30"
            src={"https://static.wixstatic.com/media/02a5b1_7c351ef782bf46d892aafe22ef15dfa8~mv2.png"}
            alt="Background Hero"
            width={2440}
            height={2440}/>

            {/* Ornament */}
            <Image
            className="ornament-1 absolute flex max-w-20 left-4 bottom-[180px] opacity-45 z-40 lg:hidden"
            src={"https://static.wixstatic.com/media/02a5b1_7a07d22a493348fc9b02b5f38ddc4cc8~mv2.png"}
            alt="Ornament Logo Sevenpreneur"
            width={200}
            height={200}/>
            <Image
            className="ornament-2 absolute flex max-w-48 -right-1/4 top-[80px] blur-sm z-10 lg:hidden"
            src={"https://static.wixstatic.com/media/02a5b1_1af73d835eff443c9b116c83a1fe7a34~mv2.png"}
            alt="Ornament Logo Sevenpreneur"
            width={200}
            height={200}/>
            <div className="ornament-3 absolute bg-primary size-8 blur-sm left-4 top-[140px] z-50 lg:hidden"/>

            {/* Background Image */}
            <Image
            className="background absolute flex opacity-70 object-cover inset-0 h-full"
            src={"https://static.wixstatic.com/media/02a5b1_7828bf5e373348e7bd757ad71122fe71~mv2.webp"}
            alt="Background Hero"
            width={2440}
            height={2440}/>

            {/* Heading */}
            <div className="title w-full flex flex-col gap-1 px-8 font-brand z-50">
                <h1 className="font-medium text-2xl text-white text-center leading-tight">
                This year, we want you <br/> to become
                </h1>
                <h1 className="text-2xl text-secondary font-bold text-center leading-tight">
                Indonesia’s Next <br/> Global Entrepreneur
                </h1>
            </div>

            {/* CTA */}
            <ButtonRestart25 
            buttonTitle={"Join RE:START Conference 2025"}
            Icon={ArrowDown}
            onClick={onClickCTA}/>
        </div>
    )
}