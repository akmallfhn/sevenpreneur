"use client";
import React, { useEffect, useRef, useState } from "react";
import AppButton from "../buttons/AppButton";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import {
  ArrowBigUpDash,
  ChevronDown,
  ChevronUp,
  Languages,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import SectionTitleSVP from "../titles/SectionTitleSVP";
import OfferHighlightVideoCourseSVP from "../templates/OfferHighlightVideoCourseSVP";
import VideoCoursePlaylistSVP, {
  VideoItem,
} from "../indexes/VideoCoursePlaylistSVP";
import HeroVideoCourseSVP, {
  EducatorItem,
} from "../templates/HeroVideoCourseSVP";
import { rupiahCurrency } from "@/lib/rupiah-currency";
import Link from "next/link";

dayjs.extend(localizedFormat);

interface PlaylistDetailsSVPProps {
  playlistId: number;
  playlistName: string;
  playlistTagline: string;
  playlistVideoPreview: string;
  playlistDescription: string;
  playlistSlug: string;
  playlistPrice: number;
  playlistPublishedAt: string;
  playlistEducators: EducatorItem[];
  playlistVideos: VideoItem[];
}

export default function PlaylistDetailsSVP({
  playlistId,
  playlistName,
  playlistTagline,
  playlistVideoPreview,
  playlistDescription,
  playlistSlug,
  playlistPrice,
  playlistPublishedAt,
  playlistEducators,
  playlistVideos,
}: PlaylistDetailsSVPProps) {
  const [showCTA, setShowCTA] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Checking height content description
  useEffect(() => {
    const checkOverflow = () => {
      if (paragraphRef.current) {
        const el = paragraphRef.current;
        const isOverflow = el.scrollHeight > el.clientHeight;
        setIsOverflowing(isOverflow);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowCTA(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "0px 0px 0px 0px",
      }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <React.Fragment>
      <div className="flex flex-col w-full">
        {/* --- Hero */}
        <HeroVideoCourseSVP
          playlistId={playlistId}
          playlistName={playlistName}
          playlistTagline={playlistTagline}
          playlistVideoPreview={playlistVideoPreview}
          playlistSlug={playlistSlug}
          playlistEducators={playlistEducators}
        />
        <div ref={sentinelRef} className="h-0" />

        {/* --- Content */}
        <div className="content flex flex-col px-5 py-5 w-full gap-8 bg-white md:flex-row lg:gap-14 lg:px-0 lg:py-10 lg:pb-20 lg:mx-auto lg:max-w-[960px] xl:max-w-[1208px]">
          {/* -- Main */}
          <main className="flex flex-col gap-8 md:flex-[1.7] lg:gap-10">
            {/* Description */}
            <div className="video-description relative flex flex-col gap-4">
              <SectionTitleSVP sectionTitle={`About ${playlistName}`} />
              <div className="flex flex-col gap-2 items-center md:items-start">
                <div>
                  <p
                    className={`ratings text-sm text-black/90 font-ui ${
                      !isExpanded && "line-clamp-5"
                    }`}
                    ref={paragraphRef}
                  >
                    {playlistDescription}
                    <br />
                    <br />
                    <span className="inline-flex items-center gap-1 text-alternative">
                      <Languages className="size-4" />
                      <b>Language:</b> Bahasa Indonesia
                    </span>
                    <br />
                    <span className="inline-flex items-center gap-1 text-alternative">
                      <ArrowBigUpDash className="size-4" />
                      <b>Published at:</b>{" "}
                      {dayjs(playlistPublishedAt).format("LLL")}
                    </span>
                    <br />
                  </p>
                </div>
                {isOverflowing && (
                  <div className="flex transition-all transform z-10">
                    <AppButton
                      variant="primaryLight"
                      size="small"
                      onClick={() => setIsExpanded((prev) => !prev)}
                    >
                      {isExpanded ? (
                        <>
                          <p>Show Less</p>
                          <ChevronUp className="size-4" />
                        </>
                      ) : (
                        <>
                          <p>Show more</p>
                          <ChevronDown className="size-4" />
                        </>
                      )}
                    </AppButton>
                  </div>
                )}
                {!isExpanded && isOverflowing && (
                  <div className="overlay absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-30% from-white to-transparent pointer-events-none" />
                )}
              </div>
            </div>
            {/* Playlist */}
            <div className="video-course flex flex-col gap-4">
              <SectionTitleSVP
                sectionTitle="Course Playlist"
                sectionDescription="10 episodes ● 20 instructors"
              />
              <VideoCoursePlaylistSVP playlistVideos={playlistVideos} />
            </div>
          </main>
          {/* -- Aside */}
          <aside className="aside flex flex-col gap-8 md:flex-1 lg:gap-10">
            <OfferHighlightVideoCourseSVP
              playlistId={playlistId}
              playlistSlug={playlistSlug}
              playlistPrice={playlistPrice}
            />
          </aside>
        </div>
      </div>

      {/* --- Floating CTA */}
      <div
        className={`floating-cta fixed flex flex-col bg-white bottom-0 left-0 w-full gap-2 p-5 border-t border-outline/50 transition-all duration-300 z-40 md:hidden ${
          showCTA ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="flex  items-center justify-between">
          <div className="flex flex-col font-ui text-black">
            <p className="text-sm">Total Amount</p>
            <p className="font-bold">{rupiahCurrency(playlistPrice)}</p>
          </div>
          <Link href={`/playlists/${playlistSlug}/${playlistId}/checkout`}>
            <AppButton
              size="defaultRounded"
              featureName={`vod_checkout_${playlistSlug}`}
            >
              <ShieldCheck className="size-5" />
              Pay & Get Access
            </AppButton>
          </Link>
        </div>
        <div className="flex w-full text-center justify-center items-center gap-1 text-alternative">
          <LockKeyhole className="size-3" />
          <p className="text-xs text-center">
            Secure payment processed by Xendit
          </p>
        </div>
      </div>
    </React.Fragment>
  );
}
