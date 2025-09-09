"use client";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import Link from "next/link";
import { Star, Volume2, VolumeOff } from "lucide-react";
import { toSnakeCase } from "@/lib/snake-case";
import { useRef, useState } from "react";

export type EducatorItem = {
  full_name: string;
  avatar: string | null;
};

interface HeroVideoCourseSVPProps {
  playlistId: number;
  playlistName: string;
  playlistTagline: string;
  playlistVideoPreview: string;
  playlistSlug: string;
  playlistPrice: number;
  playlistTotalUserEnrolled: number;
  playlistEducators: EducatorItem[];
}

export default function HeroVideoCourseSVP({
  playlistId,
  playlistName,
  playlistTagline,
  playlistVideoPreview,
  playlistSlug,
  playlistPrice,
  playlistTotalUserEnrolled,
  playlistEducators,
}: HeroVideoCourseSVPProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Formatting Educators List Name
  const formatEducatorNames = (educators: EducatorItem[]): string => {
    const names = educators.map((e) => e.full_name);
    const total = names.length;

    if (total === 0) return "";
    if (total === 1) return names[0];
    if (total === 2) return `${names[0]} & ${names[1]}`;
    if (total === 3) return `${names[0]}, ${names[1]}, and ${names[2]}`;
    if (total > 3)
      return `${names[0]}, ${names[1]}, ${names[2]}, and ${total - 3} more`;

    return "";
  };
  return (
    <div className="hero-video-course relative flex flex-col w-full h-full bg-black items-center lg:flex-row-reverse lg:max-h-[504px] overflow-hidden">
      {/* Video Thumbnail */}
      <div className="video-thumbnail relative flex aspect-thumbnail w-full h-full overflow-hidden md:flex-[1.6] md:min-h-full md:aspect-auto lg:flex-2">
        <video
          ref={videoRef}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          className="object-cover w-full h-full"
        >
          <source src={playlistVideoPreview} />
          Your browser does not support the video tag.
        </video>
        {/* Overlay Mobile */}
        <div
          className={`overlay flex absolute inset-0 bg-linear-to-t from-5% from-black to-60% to-black/0 pointer-events-none z-10 lg:hidden`}
        />
        {/* Overlay Desktop */}
        <div
          className={`overlay hidden absolute inset-0 bg-linear-to-r from-5% from-black to-45% to-black/0 pointer-events-none z-10 md:flex`}
        />
        {/* Button Mute Unmute */}
        <button
          onClick={toggleMute}
          className="button-mute-unmute flex absolute right-2 bottom-2 p-2 bg-black rounded-full z-40 xl:hidden"
        >
          {isMuted ? (
            <VolumeOff className="size-5 text-white/60" />
          ) : (
            <Volume2 className="size-5 text-white/60" />
          )}
        </button>
      </div>
      <button
        onClick={toggleMute}
        className="button-mute-unmute hidden absolute right-3 bottom-3 p-2 bg-black rounded-full z-30 hover:cursor-pointer xl:flex"
      >
        {isMuted ? (
          <VolumeOff className="size-4 text-white/60" />
        ) : (
          <Volume2 className="size-4 text-white/60" />
        )}
      </button>
      {/* Canvas */}
      <div className="white-area relative w-full bg-black h-[360px] -mt-[1px] z-[21] md:flex-1 md:h-auto md:mt-auto" />

      {/* Headline */}
      <div className="absolute flex flex-col w-full bottom-0 left-1/2 -translate-x-1/2 items-center font-ui p-5 pb-10 gap-4 z-30 sm:bottom-[100px] md:bottom-auto md:pb-5 md:items-start md:top-1/2 md:-translate-y-1/2 lg:p-0 lg:max-w-[960px] xl:max-w-[1208px]">
        <div className="title-tagline flex flex-col items-center max-w-[420px] gap-3 md:items-start lg:gap-4">
          <div className="flex max-w-[280px] max-h-[72px] overflow-hidden xl:max-w-[320px] xl:max-h-[86px]">
            <Image
              className="object-contain"
              src={
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/playlists/RESTART-CONFERENCE-2025-LOGO.svg"
              }
              alt={playlistName}
              width={800}
              height={800}
            />
          </div>
          {/* <h1 className="title font-bold text-3xl line-clamp-2 text-center text-transparent bg-clip-text bg-linear-to-br from-white to-[#999999] md:text-left lg:text-4xl">
            {playlistName}
          </h1> */}
          <p className="tagline text-sm text-white text-center line-clamp-3 md:text-left lg:text-base">
            {playlistTagline}
          </p>
        </div>
        <div className="instructor flex flex-col items-center gap-1 md:items-start max-w-[420px]">
          <p className="text-white/80 text-sm">With Speakers & Panelist</p>
          <div className="user-avatar-stack flex items-center gap-3 text-white">
            <div className="avatar-stack flex items-center">
              {playlistEducators.slice(0, 3).map((post, index) => (
                <div
                  className={`avatar-item flex aspect-square w-7 border border-white rounded-full overflow-hidden lg:w-8 ${
                    index > 0 ? "-ml-2" : ""
                  }`}
                  key={index}
                >
                  <Image
                    className="object-cover w-full h-full"
                    src={
                      post.avatar ||
                      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
                    }
                    alt={post.full_name}
                    width={150}
                    height={150}
                  />
                </div>
              ))}
            </div>
            <p className="max-w-[220px] text-sm font-semibold lg:text-base md:max-w-[420px]">
              {formatEducatorNames(playlistEducators)}
            </p>
          </div>
        </div>
        <Link
          href={`/playlists/${playlistSlug}/${playlistId}/checkout`}
          className="checkout-button w-full max-w-[420px]"
        >
          <AppButton
            size="defaultRounded"
            className="w-full md:w-fit"
            featureName="add_to_cart_playlist"
            featureId={String(playlistId)}
            featureProductCategory="PLAYLIST"
            featureProductName={playlistName}
            featureProductAmount={playlistPrice}
            featurePagePoint="Product Detail Page"
            featurePlacement="hero-banner"
          >
            <p className="px-2">Start Learning for Only 127K</p>
          </AppButton>
        </Link>
        <div className="ratings flex items-center gap-1 text-sm">
          <div className="flex items-center">
            <Star fill="#FBBC15" className="size-5" stroke="none" />
            <p className="text-white/90">4.6 ratings</p>
          </div>
          <p className="text-white/45">●</p>
          <p className="text-white/90">
            {playlistTotalUserEnrolled + 227} learners joined
          </p>
        </div>
      </div>
    </div>
  );
}
