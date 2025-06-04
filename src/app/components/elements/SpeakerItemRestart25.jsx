"use client"
import Image from "next/image"

export default function SpeakerItemRestart25({ speakerName, speakerImage, speakerTitle }) {
    return(
        <div className="speaker-container flex flex-col items-center max-w-[160px] gap-2 px-1 lg:max-w-[212px] lg:gap-3">
            <div className="flex aspect-frame-speaker-restart w-full overflow-hidden">
                <Image
                className="object-cover w-full h-full"
                src={speakerImage}
                alt={`${speakerName} - RE:START Conference 2025`}
                width={300}
                height={300}/>

            </div>
            <div className="speaker-name-title flex flex-col gap-1 text-center text-white">
                <p className="speaker-name font-brand font-bold text-lg leading-[1] lg:text-xl">
                    {speakerName}
                </p>
                <p className="speaker-title font-bodycopy text-sm lg:text-base">
                    {speakerTitle}
                </p>
            </div>
        </div>
    )
}