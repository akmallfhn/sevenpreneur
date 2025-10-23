"use client";
import { useEffect, useMemo, useState } from "react";
import VideoCoursePlaylistLMS from "../indexes/VideoCoursePlaylistLMS";
import { VideoItem } from "../indexes/VideoCoursePlaylistSVP";
import SectionTitleSVP from "../titles/SectionTitleSVP";
import { useRouter, useSearchParams } from "next/navigation";
import AppVideoPlayer from "../elements/AppVideoPlayer";

interface ZTemporaryPlaylistLMSProps {
  playlistVideos: VideoItem[];
}

export default function ZTemporaryPlaylistLMS({
  playlistVideos,
}: ZTemporaryPlaylistLMSProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState<number | null>(null);
  const videoIdParams = searchParams.get("videoId");

  // --- Handle Sync URL param to selectedVideoId
  useEffect(() => {
    if (videoIdParams) {
      const parsed = parseInt(videoIdParams);
      if (!isNaN(parsed)) {
        setSelectedVideoId(parsed);
      }
    }
  }, [videoIdParams]);

  // --- Get Data from selected Video ID
  const selectedVideoData = useMemo(() => {
    return playlistVideos.find(
      (item) => Number(item.id) === Number(selectedVideoId)
    );
  }, [selectedVideoId, playlistVideos]);

  // --- Handle Query Params Video ID
  const handleParamsQuery = (videoId: number) => {
    if (videoId !== selectedVideoId) {
      setSelectedVideoId(videoId);
      setIsLoadingVideo(videoId);
      router.push(`?videoId=${videoId}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  useEffect(() => {
    setIsLoadingVideo(null);
  }, [searchParams]);

  return (
    <div className="flex w-full h-full items-center justify-center lg:hidden">
      <div className="flex flex-col gap-5 pb-24 lg:pt-8 lg:pl-64 lg:max-w-[calc(100%-4rem)] w-full">
        <div className="flex flex-col w-full gap-4 lg:mx-auto lg:max-w-[960px] xl:max-w-[1208px] lg:text-lg">
          <div className="relative w-full h-auto aspect-video overflow-hidden md:rounded-md lg:max-w-[768px]">
            {selectedVideoData ? (
              <AppVideoPlayer videoId={selectedVideoData.external_video_id} />
            ) : (
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
            )}
          </div>
          <h1 className="font-brand font-bold w-full text-sm px-5 lg:px-0 lg:mx-auto lg:max-w-[960px] xl:max-w-[1208px] lg:text-lg">
            {selectedVideoData
              ? selectedVideoData.name
              : "RE:START Conference 2025"}
          </h1>
        </div>
        <div className="other-video flex flex-col gap-3 px-5 lg:px-0 lg:mx-auto lg:max-w-[960px] xl:max-w-[1208px]">
          <SectionTitleSVP sectionTitle="Other Video" />
          <VideoCoursePlaylistLMS
            playlistVideos={playlistVideos}
            onClick={handleParamsQuery}
            isLoading={isLoadingVideo}
          />
        </div>
      </div>
    </div>
  );
}
