"use client";
import Image from "next/image";

export default function EventExperienceCardItemRestart25({
  experienceName,
  experienceDescription,
  experienceImage,
  isexperienceVIP = false,
}) {
  return (
    <div className="card-container flex flex-col w-full gap-3 lg:max-w-[300px]">
      <div className="experience-image relative">
        <div className="flex aspect-card-restart rounded-sm overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={experienceImage}
            alt="Image"
            width={500}
            height={500}
          />
        </div>
        {isexperienceVIP && (
          <div className="vip-badge absolute flex top-3 left-3 gap-2 items-center bg-[#FEF2D0] p-2 py-1 rounded-full z-40">
            <Image
              className="aspect-square size-6 object-cover"
              src={
                "https://static.wixstatic.com/media/02a5b1_3696221a75eb4da28584f0df3a8a1e7a~mv2.png"
              }
              alt="VIP Icon"
              width={40}
              height={40}
            />
            <p className="font-bodycopy font-bold text-sm text-[#D99E00]">
              VIP ONLY
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col text-white gap-1">
        <h2 className="font-brand font-bold leading-[1] text-lg lg:text-xl">
          {experienceName}
        </h2>
        <p className="font-bodycopy text-sm lg:text-base">
          {experienceDescription}
        </p>
      </div>
    </div>
  );
}
