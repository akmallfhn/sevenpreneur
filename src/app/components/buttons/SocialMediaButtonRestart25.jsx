"use client"
import { faLinkedin, faLinkedinIn } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"

export default function SocialMediaButtonRestart25({ iconButton }) {
    return(
        <div className="button-socmed flex items-center justify-center size-9 bg-white text-black rounded-full transition transform border-4 border-[#646464] active:scale-95 lg:size-10">
            <FontAwesomeIcon
            icon={iconButton}
            />
        </div>
    )
}