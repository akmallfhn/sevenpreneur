"use client";
import { getRupiahCurrency } from "@/lib/currency";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  ChevronDown,
  ChevronUp,
  Languages,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useRef, useState } from "react";
import AppButton from "../buttons/AppButton";
import OfferVideoSeriesSVP from "../cards/OfferVideoSeriesSVP";
import SectionContainerSVP from "../cards/SectionContainerSVP";
import HeroVideoCourseSVP, { EducatorItem } from "../heroes/HeroVideoCourseSVP";
import VideoSeriesItemSVP from "../items/VideoSeriesItemSVP";
import PageContainerSVP from "./PageContainerSVP";

dayjs.extend(localizedFormat);

export interface VideoItem {
  id: number;
  name: string;
  image_url: string;
  duration: number;
  video_url?: string;
  external_video_id?: string;
}

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

export default function PlaylistDetailsSVP(props: PlaylistDetailsSVPProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme } = useTheme();
  const paragraphRef = useRef<HTMLDivElement | null>(null);

  return (
    <React.Fragment>
      <div className="flex flex-col w-full bg-background">
        <HeroVideoCourseSVP
          playlistId={props.playlistId}
          playlistName={props.playlistName}
          playlistTagline={props.playlistTagline}
          playlistVideoPreview={props.playlistVideoPreview}
          playlistSlug={props.playlistSlug}
          playlistPrice={props.playlistPrice}
          playlistTotalUserEnrolled={props.playlistTotalUserEnrolled}
          playlistEducators={props.playlistEducators}
        />
        <PageContainerSVP className="relativ flex">
          <div className="flex flex-col w-full gap-5 z-10 py-5 pb-20 md:flex-row lg:gap-7 lg:py-10">
            <main className="flex flex-col gap-5 md:flex-2 lg:gap-7">
              <SectionContainerSVP
                sectionName={`Video Series ${props.playlistName}`}
              >
                <div className="description flex flex-col gap-4 items-center whitespace-pre-wrap md:items-start">
                  <div className="flex flex-col gap-2" ref={paragraphRef}>
                    <p
                      className={`description text-[15px] font-bodycopy ${
                        !isExpanded && "line-clamp-5"
                      }`}
                    >
                      {props.playlistDescription}
                    </p>
                    <div
                      className={`flex items-center gap-1 font-bodycopy ${!isExpanded && "hidden"}`}
                    >
                      <Languages className="size-4" />
                      <p className="text-[15px]">Language: Bahasa Indonesia</p>
                    </div>
                  </div>
                  <div className="flex transition-all transform z-10">
                    <AppButton
                      variant={theme === "dark" ? "dark" : "primarySoft"}
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
                  {!isExpanded && (
                    <div className="overlay absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-30% from-background to-transparent pointer-events-none" />
                  )}
                </div>
              </SectionContainerSVP>
              <SectionContainerSVP sectionName="Playlist Content">
                <div className="flex flex-col gap-4">
                  {props.playlistVideos.map((post, index) => (
                    <VideoSeriesItemSVP
                      key={index}
                      index={index + 1}
                      videoName={post.name}
                      videoImage={post.image_url}
                      videoDuration={post.duration}
                    />
                  ))}
                </div>
              </SectionContainerSVP>
            </main>
            <aside className="aside flex flex-col gap-5 md:flex-1 lg:gap-7">
              <OfferVideoSeriesSVP
                playlistId={props.playlistId}
                playlistName={props.playlistName}
                playlistSlug={props.playlistSlug}
                playlistPrice={props.playlistPrice}
                playlistTotalDuration={props.playlistTotalDuration}
              />
            </aside>
          </div>
        </PageContainerSVP>
      </div>
      <div className="floating-cta fixed flex flex-col bg-background bottom-0 left-0 w-full gap-2 p-5 border-t transition-all duration-300 z-40 dark:bg-sevenpreneur-surface-black md:hidden">
        <div className="flex  items-center justify-between">
          <div className="flex flex-col font-bodycopy dark:text-sevenpreneur-white">
            <p className="text-sm">Total Amount</p>
            <p className="font-bold">
              {getRupiahCurrency(props.playlistPrice)}
            </p>
          </div>
          <Link
            href={`/playlists/${props.playlistSlug}/${props.playlistId}/checkout`}
          >
            <AppButton
              size="defaultRounded"
              featureName="add_to_cart_playlist"
              featureId={String(props.playlistId)}
              featureProductCategory="PLAYLIST"
              featureProductName={props.playlistName}
              featureProductAmount={props.playlistPrice}
              featurePagePoint="Product Detail Page"
              featurePlacement="floating-panel-mobile"
            >
              <ShieldCheck className="size-5" />
              Pay & Get Access
            </AppButton>
          </Link>
        </div>
        <div className="flex w-full text-center font-bodycopy justify-center items-center gap-1 text-emphasis">
          <LockKeyhole className="size-3" />
          <p className="text-xs text-center">
            Secure payment processed by Xendit
          </p>
        </div>
      </div>
    </React.Fragment>
  );
}
