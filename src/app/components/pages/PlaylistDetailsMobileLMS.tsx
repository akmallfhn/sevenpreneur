"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppVideoPlayer from "../elements/AppVideoPlayer";
import HeaderMobileLMS from "../navigations/HeaderMobileLMS";
import AppButton from "../buttons/AppButton";
import { ChevronDown } from "lucide-react";
import { VideoItem } from "./PlaylistDetailsLMS";
import VideoListItemMobileLMS from "../items/VideoListItemMobileLMS";

interface PlaylistDetailsMobileLMSProps {
  playlistId: number;
  playlistName: string;
  playlistDescription: string;
  playlistVideos: VideoItem[];
}

export default function PlaylistDetailsMobileLMS(
  props: PlaylistDetailsMobileLMSProps
) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoIdParams = searchParams.get("videoId");
  const [loadingVideoId, setLoadingVideoId] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  const activeVideos = props.playlistVideos;

  // Handle Sync URL param to selectedVideoId
  const selectedVideoId = useMemo(() => {
    if (!videoIdParams) return null;

    const videoId = parseInt(videoIdParams);
    if (isNaN(videoId)) return null;

    const exists = activeVideos.some((video) => video.id === videoId);
    return exists ? videoId : null;
  }, [videoIdParams, activeVideos]);

  // Get Data from selected Video ID
  const selectedVideoData = useMemo(() => {
    return activeVideos.find(
      (item) => Number(item.id) === Number(selectedVideoId)
    );
  }, [selectedVideoId, activeVideos]);

  // Handle Query Params Video ID
  const handleParamsQuery = (videoId: number) => {
    if (videoId !== selectedVideoId) {
      setLoadingVideoId(videoId);
      const params = new URLSearchParams(searchParams);
      params.set("videoId", videoId.toString());
      router.replace(`/playlists/${props.playlistId}?${params.toString()}`, {
        scroll: false,
      });
    }
  };

  // State Loading
  useEffect(() => {
    queueMicrotask(() => setLoadingVideoId(null));
  }, [selectedVideoId]);

  // Checking overflow for show more button
  useEffect(() => {
    const checkOverflow = () => {
      if (divRef.current) {
        const el = divRef.current;
        const isOverflow = el.scrollHeight > el.clientHeight;
        setIsOverflowing(isOverflow);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div className="root-page relative flex flex-col w-full items-center justify-center pb-24 lg:hidden">
      <HeaderMobileLMS headerTitle={props.playlistName} headerBackURL="/" />
      <div className="video-player-attributes relative flex flex-col w-full gap-4">
        <div className="video-player w-full bg-black overflow-hidden">
          {selectedVideoData ? (
            <div className="video-item relative w-full h-auto overflow-hidden">
              <AppVideoPlayer videoId={selectedVideoData.external_video_id} />
            </div>
          ) : (
            <div className="video-teaser relative w-full aspect-video overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/lw0Txg5_Dz4?si=s-l3xMWgaVnhWYoI&amp;controls=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
        <h1 className="video-title font-bodycopy font-bold w-full px-5 text-lg">
          {selectedVideoData ? selectedVideoData.name : props.playlistName}
        </h1>
        <div
          ref={divRef}
          className={`video-description flex flex-col w-full px-5 gap-3 transition-all overflow-hidden ${
            isExpanded ? "max-h-[4000px]" : "max-h-24"
          }`}
        >
          <p className="font-bodycopy font-medium text-sm text-[#333333] whitespace-pre-line">
            {selectedVideoData
              ? selectedVideoData.description
              : props.playlistDescription}
          </p>
        </div>
        <div className="show-more-less flex w-full px-5 justify-center transition-all transform z-10">
          <AppButton
            variant={"primaryLight"}
            size="small"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            <p>{isExpanded ? "Show less" : "Show more"}</p>
            <ChevronDown
              className={`size-4 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </AppButton>
        </div>
        {!isExpanded && isOverflowing && (
          <div className="overlay absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-40% from-section-background to-100% to-transparent pointer-events-none" />
        )}
      </div>
      <div className="other-videos flex flex-col gap-3 p-5 pt-8">
        <h3 className="section-title font-bodycopy font-bold">
          Other Episodes
        </h3>
        <div className="video-list flex flex-col gap-4">
          {props.playlistVideos.map((post, index) => (
            <VideoListItemMobileLMS
              key={index}
              index={index + 1}
              videoName={post.name}
              videoImage={post.image_url}
              videoDuration={post.duration}
              onClick={() => handleParamsQuery(post.id)}
              isLoading={loadingVideoId === post.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
