"use client";

import AppButton from "../buttons/AppButton";
import {
  ArrowBigUpDash,
  ChevronDown,
  ChevronUp,
  Languages,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import SectionTitleSVP from "../titles/SectionTitleSVP";
import OfferHighlightVideoCourseSVP from "../templates/OfferHighlightVideoCourseSVP";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en";
import VideoCoursePlaylistSVP, {
  VideoItem,
} from "../indexes/VideoCoursePlaylistSVP";
import HeroVideoCourseSVP, {
  EducatorItem,
} from "../templates/HeroVideoCourseSVP";

dayjs.extend(localizedFormat);

interface PlaylistDetailsSVPProps {
  playlistId: number;
  playlistName: string;
  playlistTagline: string;
  playlistDescription: string;
  playlistPrice: number;
  playlistPublishedAt: string;
  playlistEducators: EducatorItem[];
  playlistVideos: VideoItem[];
}

export default function PlaylistDetailsSVP({
  playlistId,
  playlistName,
  playlistTagline,
  playlistDescription,
  playlistPrice,
  playlistPublishedAt,
  playlistEducators,
  playlistVideos,
}: PlaylistDetailsSVPProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

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

  return (
    <div className="flex flex-col w-full">
      <HeroVideoCourseSVP
        playlistName={playlistName}
        playlistTagline={playlistTagline}
        educators={playlistEducators}
      />
      <div className="root flex flex-col px-5 py-5 w-full gap-8 bg-white md:flex-row lg:gap-14 lg:px-0 lg:py-10 lg:pb-20 lg:mx-auto lg:max-w-[960px] xl:max-w-[1208px]">
        {/* Main */}
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
              sectionDescription="10 episodes ● 20 instrutors"
            />
            <VideoCoursePlaylistSVP playlistVideos={playlistVideos} />
          </div>
        </main>
        {/* Aside */}
        <aside className="aside flex flex-col gap-8 md:flex-1 lg:gap-10">
          <OfferHighlightVideoCourseSVP playlistPrice={playlistPrice} />
        </aside>
      </div>
    </div>
  );
}
