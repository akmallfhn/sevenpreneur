"use client"
import Image from "next/image"

export default function SocialMediaButtonRestart25({ imageButton, altTitle }) {
    return(
        <div className="size-9 transition transform active:scale-95 lg:size-10">
            <Image
            src={imageButton}
            alt={altTitle}
            width={200}
            height={200}
            />
        </div>
    )
}