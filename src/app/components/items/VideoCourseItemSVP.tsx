"use client";
import Image from "next/image";
import { durationFromSeconds } from "@/lib/duration-from-seconds";

interface VideoCourseItemSVPProps {
  index: number;
  videoName: string;
  videoImage: string;
  videoDuration: number;
}

export default function VideoCourseItemSVP({
  index,
  videoName,
  videoImage,
  videoDuration,
}: VideoCourseItemSVPProps) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="video-image-thumbnail relative flex aspect-video w-[152px] flex-shrink-0 lg:w-[186px] rounded-md overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={videoImage}
          alt="Image Thumbnail"
          width={500}
          height={500}
        />
        <p className="absolute bottom-1 right-1 p-1 bg-black/60 text-white text-[10px] font-ui rounded-sm z-20">
          {durationFromSeconds(2400)}
        </p>
      </div>
      <div className="flex flex-col font-ui lg:max-w-[440px] lg:gap-1">
        <p className="font-medium text-xs text-alternative">EPISODE {index}</p>
        <h3 className="video-title font-bold line-clamp-2 text-sm md:line-clamp-3 lg:text-base">
          {videoName}
        </h3>
      </div>
    </div>
  );
}
