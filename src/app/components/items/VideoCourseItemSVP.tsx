"use client";
import Image from "next/image";

export default function VideoCourseItemSVP() {
  return (
    <div className="flex w-full items-center gap-3">
      <div className="video-image-thumbnail relative flex aspect-video w-[152px] flex-shrink-0 lg:w-[186px] rounded-md overflow-hidden">
        <Image
          className="object-cover w-full h-full"
          src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//session-zaki-angga%20(1).webp"
          alt="Image Thumbnail"
          width={500}
          height={500}
        />
        <p className="absolute bottom-1 right-1 p-1 bg-black/60 text-white text-[10px] font-ui rounded-sm z-20">
          10:32
        </p>
      </div>
      <h3 className="video-title font-ui font-bold line-clamp-3 text-sm lg:text-base">
        Spiritual Awakening of Indonesia Through Global Founder In Indonesia
      </h3>
    </div>
  );
}
