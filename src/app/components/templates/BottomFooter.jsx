"use client"
import Image from "next/image"
import SocialMediaButtonRestart25 from "../elements/SocialMediaButtonRestart25"
import Link from "next/link"

export default function BottomFooter() {

    const socialMediaData = [
        {
            "name": "Linkedin",
            "url": "https://www.linkedin.com/company/sevenpreneur/",
            "icon": "https://static.wixstatic.com/shapes/02a5b1_9230cf57155442aa877488ab12c01bfe.svg",
        },
        {
            "name": "Facebook",
            "url": "https://web.facebook.com/sevenpreneur/",
            "icon": "https://static.wixstatic.com/shapes/02a5b1_f7489cd32bad48d9a162184cb886155a.svg",
        },
        {
            "name": "Instagram",
            "url": "https://www.instagram.com/7preneur/",
            "icon": "https://static.wixstatic.com/shapes/02a5b1_fb8c60cbea9b4cdd94f81e0df88aabca.svg",
        },
        {
            "name": "Threads",
            "url": "https://www.threads.com/@7preneur",
            "icon": "https://static.wixstatic.com/shapes/02a5b1_509c9e8a31d94df997de3bdfaaf79916.svg",
        },
    ]

    return(
        <div className="root-bottom-footer bg-[#171616] p-8 flex flex-col gap-5 lg:px-16 lg:py-10 lg:gap-8">
            <div className="company flex flex-col gap-5 lg:flex-row lg:justify-between lg:gap-0">
                <div className="company-part flex flex-col gap-5 max-w-[442px]">
                    {/* Company Info */}
                    <div className="company-info flex flex-col gap-1 text-white">
                            <Image
                            className="flex max-w-52 lg:max-w-72"
                            src={"https://static.wixstatic.com/media/02a5b1_f73718a961f344cd80016aa1f5522fb6~mv2.webp"}
                            alt="Logo Sevenpreneur"
                            width={500}
                            height={500}
                            />
                        <p className="font-bodycopy text-sm lg:text-base">
                            Sevenpreneur is a global launchpad empowering entrepreneurs to scale their ventures and thrive on the world stage.
                        </p>
                    </div>
                    {/* Company Legal */}
                    <div className="company-legal flex flex-col text-white gap-1">
                        <h4 className="text-lg font-brand font-bold lg:text-xl">
                            PT Pengusaha Muda Indonesia
                        </h4>
                        <p className="font-bodycopy text-sm lg:text-base">
                            Jakarta Barat, DKI Jakarta, Indonesia
                        </p>
                    </div>
                    {/* Company Socmed*/}
                    <div className="company-social-media flex flex-col text-white gap-1">
                        <h4 className="text-lg font-brand font-bold lg:text-xl">
                            Sevenpreneur on Social Media
                        </h4>
                        <div className="flex gap-2">
                            {socialMediaData.map((post, index) => (
                                <Link href={post.url} key={index} target="_blank" rel="noopener noreferrer">
                                    <SocialMediaButtonRestart25 
                                    altTitle={post.name}
                                    imageButton={post.icon}/>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Company Contact*/}
                <div className="contact-part flex flex-col gap-1 max-w-[420px]">
                    <h4 className="text-lg font-brand font-bold text-white lg:text-xl">
                        Contact Us
                    </h4>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-col">
                            <p className="text-sm font-bodycopy font-semibold text-[#787777] lg:text-base">
                                Got questions about RE:START Conference? We’re happy to help at
                            </p>
                            <p className="font-brand font-bold text-white lg:text-lg">
                                event@sevenpreneur.com
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-bodycopy font-semibold text-[#787777] lg:text-base">
                                For general inquiries, reach us anytime at
                            </p>
                            <p className="font-brand font-bold text-white lg:text-lg">
                                info@sevenpreneur.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="w-full border-t border-[#3A3A3A]" />
            <p className="copyright text-[#949191] font-bodycopy text-xs text-center lg:text-sm">
                Copyright © 2025 Sevenpreneur. All rights reserved.
            </p>
        </div>
    )
}