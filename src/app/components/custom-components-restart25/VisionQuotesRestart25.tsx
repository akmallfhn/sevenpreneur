"use client"
import Image from "next/image"

export default function VisionQuotesRestart25() {
    return(
        <section id="vision">
        <div className="vision-quotes relative flex bg-primary justify-center overflow-hidden">
            {/* Content */}
            <div className="content flex flex-col gap-5 items-center py-10 z-20 max-w-[420px] lg:max-w-[960px]">
                <div className="title flex flex-col gap-3 text-white px-8">
                    <h2 className="title-content font-bold text-2xl font-brand text-center lg:text-[42px]">
                        Why we exist
                    </h2>
                    <p className="quotes font-bodycopy italic text-sm text-center lg:text-2xl lg:max-w-[840px]">
                        Sevenpreneur stand to create the future <b>global founders</b> from Indonesia who can lead companies and create massive economic impact at home and abroad. We prepare  not only to entrepreneur—but to become <b>the economic leaders of the future</b>
                    </p>
                </div>
                <div className="author flex flex-col items-center text-white">
                    <div className="author-avatar aspect-square size-10 rounded-full overflow-hidden lg:size-12">
                        <Image
                        className="flex object-cover w-full h-full"
                        src={"https://yt3.googleusercontent.com/ytc/AIdro_ntGsTLsO00am6tqOc6VXKZ3tgemmCnTDJI6DT2_BZUhxmI=s900-c-k-c0x00ffffff-no-rj"}
                        alt="Avatar Raymond Chin"
                        width={100}
                        height={100}
                        />
                    </div>
                    <p className="author-name font-bold text-sm font-brand text-center lg:text-xl">
                        Raymond Chin
                    </p>
                    <p className="author-role font-bodycopy text-center text-xs lg:text-lg">
                        Founder Sevenpreneur
                    </p>
                </div>
            </div>

            {/* Ornamen */}
            <Image
            className="ornament-1 absolute flex max-w-16 right-4 bottom-20 z-10 lg:max-w-24 lg:right-[120px]"
            src={"https://static.wixstatic.com/media/02a5b1_82f940c8973146258de0c4a9a6c7eabb~mv2.webp"}
            alt="Ornament Logo Sevenpreneur"
            width={200}
            height={200}/>
            <div className="ornament-3 absolute bg-secondary size-32 blur-xl rounded-full -left-12 -top-12 z-10"/>

            {/* Background Image */}
            <Image
            className="background absolute flex opacity-30 object-cover bottom-0 left-0 mix-blend-overlay"
            src={"https://static.wixstatic.com/media/02a5b1_7828bf5e373348e7bd757ad71122fe71~mv2.webp"}
            alt="Background Hero"
            width={2440}
            height={2440}/>
        </div>
        </section>
    )
}