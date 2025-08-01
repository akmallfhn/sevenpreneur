"use client";
import HeroVideoCourseSVP from "../templates/HeroVideoCourseSVP";
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
import VideoCourseItemSVP from "../items/VideoCourseItemSVP";

dayjs.extend(localizedFormat);

interface PlaylistData {
  id: number;
  name: string;
  tagline: string;
  description: string;
  video_preview_url: string;
  image_url: string;
  price: number;
  slug_url: string;
  published_at: string;
  educators: EducatorItem[];
  videos: VideoItem[];
}
interface VideoItem {
  id: number;
  playlist_id: number;
  name: string;
  image_url: string;
  video_url: string;
}
interface EducatorItem {
  id: string;
  full_name: string;
  avatar: string | null;
}
type PlaylistDetailsSVPProps = {
  playlistData: PlaylistData;
};

export default function PlaylistDetailsSVP({
  playlistData,
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
        playlistName={playlistData.name}
        playlistTagline={playlistData.tagline}
        educators={playlistData.educators}
      />
      <div className="root flex flex-col px-5 py-5 w-full gap-8 bg-white md:flex-row lg:gap-14 lg:px-0 lg:py-10 lg:pb-20 lg:mx-auto lg:max-w-[960px] xl:max-w-[1208px]">
        {/* Main */}
        <main className="flex flex-col gap-8 md:flex-[1.7] lg:gap-10">
          {/* Description */}
          <div className="video-description relative flex flex-col gap-4">
            <SectionTitleSVP sectionTitle={`About ${playlistData.name}`} />
            <div className="flex flex-col gap-2 items-center md:items-start">
              <div>
                <p
                  className={`ratings text-sm text-black/90 font-ui ${
                    !isExpanded && "line-clamp-5"
                  }`}
                  ref={paragraphRef}
                >
                  {playlistData.description}
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
                    {dayjs(playlistData.published_at).format("LLL")}
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
            <div className="flex flex-col gap-3">
              {playlistData.videos.map((post, index) => (
                <VideoCourseItemSVP
                  key={index}
                  index={index + 1}
                  videoName={post.name}
                />
              ))}
            </div>
          </div>
        </main>
        {/* Aside */}
        <aside className="aside flex flex-col gap-8 md:flex-1 lg:gap-10">
          <OfferHighlightVideoCourseSVP playlistPrice={playlistData.price} />
        </aside>
      </div>
    </div>
  );
}
