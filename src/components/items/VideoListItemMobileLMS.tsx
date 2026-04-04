"use client";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { getDurationFromSeconds } from "@/lib/date-time-manipulation";

interface VideoListItemMobileLMSProps {
  index: number;
  videoName: string;
  videoImage: string;
  videoDuration: number;
  onClick: () => void;
  isLoading: boolean;
}

export default function VideoListItemMobileLMS(
  props: VideoListItemMobileLMSProps
) {
  return (
    <div
      className="video-container flex w-full items-center gap-3 hover:cursor-pointer"
      onClick={props.onClick}
    >
      <div className="video-image relative flex aspect-video w-[164px] flex-shrink-0 rounded-md overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src={props.videoImage}
          alt="Image Thumbnail"
          width={500}
          height={500}
        />
        <p className="video-duration absolute bottom-1 right-1 p-1 bg-black/60 text-white text-[10px] font-ui rounded-sm z-20">
          {getDurationFromSeconds(props.videoDuration)}
        </p>
        {props.isLoading && (
          <div className="video-loading flex text-primary">
            <div className="video-loading absolute inset-0 bg-black/60 z-30" />
            <Loader2 className="absolute text top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin size-5 z-40" />
          </div>
        )}
      </div>
      <div className="video-attributes flex flex-col font-ui">
        <p className="video-episode font-medium text-sm text-[#333333]/80">
          EPISODE {props.index}
        </p>
        <p className="video-title font-bold text-black line-clamp-2 text-[15px]">
          {props.videoName}
        </p>
      </div>
    </div>
  );
}
