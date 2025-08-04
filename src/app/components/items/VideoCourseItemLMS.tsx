"use client";
import Image from "next/image";
import { durationFromSeconds } from "@/lib/duration-from-seconds";
import { Loader2 } from "lucide-react";

interface VideoCourseItemLMSProps {
  index: number;
  videoName: string;
  videoImage: string;
  videoDuration: number;
  onClick: () => void;
  isLoading: boolean;
}

export default function VideoCourseItemLMS({
  index,
  videoName,
  videoImage,
  videoDuration,
  onClick,
  isLoading,
}: VideoCourseItemLMSProps) {
  return (
    <div
      className="flex w-full items-center gap-3 hover:cursor-pointer lg:flex-col"
      onClick={onClick}
    >
      <div className="video-image-thumbnail relative flex aspect-video w-[152px] flex-shrink-0 rounded-md overflow-hidden lg:w-full">
        <Image
          className="object-cover w-full h-full"
          src={videoImage}
          alt="Image Thumbnail"
          width={500}
          height={500}
        />
        <p className="absolute bottom-1 right-1 p-1 bg-black/60 text-white text-[10px] font-ui rounded-sm z-20">
          {durationFromSeconds(videoDuration)}
        </p>
        {isLoading && (
          <>
            <div className="absolute inset-0 bg-black/60 z-30" />
            <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin size-5 z-40" />
          </>
        )}
      </div>
      <div className="flex flex-col font-ui lg:max-w-[440px] lg:gap-1">
        <p className="font-medium text-xs text-alternative">EPISODE {index}</p>
        <h3 className="video-title font-bold text-black line-clamp-2 text-sm md:line-clamp-3 dark:text-white lg:text-base">
          {videoName}
        </h3>
      </div>
    </div>
  );
}
