"use client";
import Image from "next/image";
import { getDurationFromSeconds } from "@/lib/date-time-manipulation";

interface VideoSeriesItemSVPProps {
  index: number;
  videoName: string;
  videoImage: string;
  videoDuration: number;
}

export default function VideoSeriesItemSVP(props: VideoSeriesItemSVPProps) {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="video-image-thumbnail relative flex aspect-video w-[152px] flex-shrink-0 rounded-md overflow-hidden lg:w-[186px]">
        <Image
          className="object-cover w-full h-full"
          src={props.videoImage}
          alt="Image Thumbnail"
          width={500}
          height={500}
        />
        <p className="absolute bottom-1 right-1 p-1 bg-sevenpreneur-coal/60 text-sevenpreneur-white text-[10px] font-bodycopy rounded-sm z-20">
          {getDurationFromSeconds(props.videoDuration)}
        </p>
      </div>
      <div className="flex flex-col font-bodycopy lg:max-w-[440px] lg:gap-1">
        <p className="font-medium text-xs text-emphasis">
          EPISODE {props.index}
        </p>
        <h3 className="video-title font-bold line-clamp-2 text-sm md:line-clamp-3 dark:text-sevenpreneur-white lg:text-base">
          {props.videoName}
        </h3>
      </div>
    </div>
  );
}
