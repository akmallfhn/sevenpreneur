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
import HeroVideoCourseSVP, { EducatorItem } from "../heroes/HeroVideoCourseSVP";
import Link from "next/link";
import { useTheme } from "next-themes";
import { getRupiahCurrency } from "@/lib/currency";

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
  playlistTotalEpisodes: number;
  playlistTotalDuration: number | null;
  playlistTotalUserEnrolled: number;
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
  playlistTotalEpisodes,
  playlistTotalDuration,
  playlistTotalUserEnrolled,
  playlistEducators,
  playlistVideos,
}: PlaylistDetailsSVPProps) {
  const [showCTA, setShowCTA] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const { theme } = useTheme();
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

  // Show floating button when sentinel was gone
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
      <div className="flex flex-col w-full bg-white dark:bg-coal-black">
        {/* --- Hero */}
        <HeroVideoCourseSVP
          playlistId={playlistId}
          playlistName={playlistName}
          playlistTagline={playlistTagline}
          playlistVideoPreview={playlistVideoPreview}
          playlistSlug={playlistSlug}
          playlistPrice={playlistPrice}
          playlistTotalUserEnrolled={playlistTotalUserEnrolled}
          playlistEducators={playlistEducators}
        />
        <div ref={sentinelRef} className="h-0" />

        {/* --- Content */}
        <div className="content flex flex-col px-5 py-5 w-full gap-8 md:flex-row lg:gap-14 lg:px-0 lg:py-10 lg:pb-20 lg:mx-auto lg:max-w-[960px] xl:max-w-[1208px]">
          {/* -- Main */}
          <main className="flex flex-col gap-8 md:flex-[1.7] lg:gap-10">
            {/* Description */}
            <div className="video-description relative flex flex-col gap-4">
              <SectionTitleSVP sectionTitle={`About ${playlistName}`} />
              <div className="flex flex-col gap-2 items-center md:items-start">
                <div>
                  <p
                    className={`ratings text-sm text-black font-ui dark:text-white/80 ${
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
                      variant={
                        theme === "dark" ? "surfaceDark" : "primaryLight"
                      }
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
                  <div className="overlay absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-30% from-white to-transparent pointer-events-none dark:from-coal-black" />
                )}
              </div>
            </div>
            {/* Playlist */}
            <div className="video-course flex flex-col gap-4">
              <SectionTitleSVP
                sectionTitle="Course Playlist"
                sectionDescription={`${playlistTotalEpisodes} episodes of course video`}
              />
              <VideoCoursePlaylistSVP playlistVideos={playlistVideos} />
            </div>
          </main>
          {/* -- Aside */}
          <aside className="aside flex flex-col gap-8 md:flex-1 lg:gap-10">
            <OfferHighlightVideoCourseSVP
              playlistId={playlistId}
              playlistName={playlistName}
              playlistSlug={playlistSlug}
              playlistPrice={playlistPrice}
              playlistTotalDuration={playlistTotalDuration}
            />
          </aside>
        </div>
      </div>

      {/* --- Floating CTA */}
      <div
        className={`floating-cta fixed flex flex-col bg-white bottom-0 left-0 w-full gap-2 p-5 border-t border-outline transition-all duration-300 z-40 dark:bg-surface-black dark:border-outline-dark md:hidden ${
          showCTA ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        <div className="flex  items-center justify-between">
          <div className="flex flex-col font-ui">
            <p className="text-sm">Total Amount</p>
            <p className="font-bold">{getRupiahCurrency(playlistPrice)}</p>
          </div>
          <Link href={`/playlists/${playlistSlug}/${playlistId}/checkout`}>
            <AppButton
              size="defaultRounded"
              featureName="add_to_cart_playlist"
              featureId={String(playlistId)}
              featureProductCategory="PLAYLIST"
              featureProductName={playlistName}
              featureProductAmount={playlistPrice}
              featurePagePoint="Product Detail Page"
              featurePlacement="floating-panel-mobile"
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
