"use client";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { getDurationFromSeconds } from "@/lib/date-time-manipulation";
import { HTMLAttributes } from "react";

interface VideoListItemLMSProps extends HTMLAttributes<HTMLDivElement> {
  videoEpisode: number;
  videoName: string;
  videoImage: string;
  videoDuration: number;
  isLoading: boolean;
}

export default function VideoListItemLMS(props: VideoListItemLMSProps) {
  return (
    <div
      className="video-container flex w-full items-center gap-3 hover:cursor-pointer"
      onClick={props.onClick}
    >
      <div className="video-image relative flex w-full max-w-[132px] shrink-0 aspect-video rounded-md overflow-hidden xl:max-w-[172px]">
        <Image
          className="object-cover w-full h-full"
          src={props.videoImage}
          alt="Image Thumbnail"
          width={500}
          height={500}
        />
        <p className="video-duration absolute bottom-1 right-1 py-0.5 px-1.5 bg-black/60 text-white text-[11px] font-medium font-brand rounded-sm z-20">
          {getDurationFromSeconds(props.videoDuration)}
        </p>
        {props.isLoading && (
          <div className="video-loading flex text-white">
            <div className="absolute inset-0 bg-black/60 z-30" />
            <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin size-5 z-40" />
          </div>
        )}
      </div>
      <div className="video-attributes flex flex-col font-bodycopy">
        <p className="video-episode font-medium text-xs text-[#333333]/70">
          EPISODE {props.videoEpisode}
        </p>
        <p className="video-title font-bold text-black text-sm line-clamp-3">
          {props.videoName}
        </p>
      </div>
    </div>
  );
}
