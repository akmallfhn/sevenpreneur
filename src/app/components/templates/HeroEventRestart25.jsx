"use client"
import { ArrowDown, ArrowUpIcon } from "lucide-react"
import ButtonRestart25 from "../elements/ButtonRestart25"
import Image from "next/image"
import Link from "next/link"

export default function HeroEventRestart2025() {
    return(
        <div className="relative pb-10 pt-64 gap-5 flex flex-col items-center w-full bg-[#061E71] overflow-hidden lg:pt-[542px]">
            {/* Welcoming Back */}
            <div className="absolute flex flex-col items-center gap-4 top-9 left-1/2 -translate-x-1/2 z-20 lg:top-20">
                <Image
                className="flex max-w-40 lg:max-w-72"
                src={"https://static.wixstatic.com/media/02a5b1_f73718a961f344cd80016aa1f5522fb6~mv2.webp"}
                alt="Logo Sevenpreneur"
                width={500}
                height={500}
                />
                <Image
                className="flex max-w-72 lg:max-w-[908px]"
                src={"https://static.wixstatic.com/media/02a5b1_9dfd9d5882514c6c961540b6bc80390f~mv2.webp"}
                alt="Welcome Back"
                width={500}
                height={500}
                />
            </div>

            {/* Overlay */}
            <div className="overlay absolute left-0 bottom-0 w-full h-[320px] bg-gradient-to-t from-10% from-[#061E71]/80 via-50% via-[#061E71] to-100% to-[#061E71]/0 z-40"/>

            {/* Brand Representative */}
            <Image
            className="brand-representative absolute flex max-w-[420px] top-[108px] left-1/2 -translate-x-1/2 z-30 lg:max-w-[924px] lg:top-[186px]"
            src={"https://static.wixstatic.com/media/02a5b1_2889b7138d23455982c569c68701940f~mv2.webp"}
            alt="Sevenpreneur Brand Representative"
            width={2440}
            height={2440}/>

            {/* Ornament */}
            <Image
            className="ornament absolute flex max-w-8 left-6 bottom-[180px] opacity-80 z-60 lg:left-[120px] lg:max-w-10"
            src={"https://static.wixstatic.com/shapes/02a5b1_9616da59cbeb438fa0394a699d7f0955.svg"}
            alt="Ornament Square"
            width={200}
            height={200}/>
            <Image
            className="ornament absolute flex max-w-20 right-3 bottom-8 blur-sm scale-x-[-1] opacity-70 z-40 lg:bottom-[180px]"
            src={"https://static.wixstatic.com/shapes/02a5b1_9616da59cbeb438fa0394a699d7f0955.svg"}
            alt="Ornament Square"
            width={200}
            height={200}/>
            <Image
            className="ornament-2 absolute flex max-w-52 top-0 left-0 z-10 lg:max-w-[572px]"
            src={"https://static.wixstatic.com/shapes/02a5b1_36cd04ea04ef4d3d9a0a1f3fc0acd538.svg"}
            alt="Ornament Logo Sevenpreneur"
            width={200}
            height={200}/>

            {/* Background Image */}
            <Image
            className="background absolute flex opacity-55 -top-32 mix-blend-multiply object-cover h-full"
            src={"https://static.wixstatic.com/media/02a5b1_fd26f9061e30444ba46ab740e9e44d26~mv2.webp"}
            alt="Background Hero"
            width={2440}
            height={2440}/>

            {/* Heading */}
            <div className="title w-full flex flex-col gap-1 px-8 font-brand z-50">
                <h1 className="font-medium text-2xl text-white text-center leading-tight lg:text-[48px]">
                This year, we want <br className="block lg:hidden"/> you to become
                </h1>
                <h1 className="text-2xl text-secondary font-bold text-center leading-tight lg:text-[48px]">
                Indonesia’s Next <br className="block lg:hidden"/> Global Entrepreneur
                </h1>
            </div>

            {/* CTA */}
            <Link href={"#content-event"} className="z-60">
                <ButtonRestart25 buttonTitle={"Join RE:START Conference 2025"} Icon={ArrowDown}/>
            </Link>
        </div>
    )
}