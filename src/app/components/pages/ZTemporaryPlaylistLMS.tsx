"use client";
import { useEffect, useMemo, useState } from "react";
import VideoCoursePlaylistLMS from "../indexes/VideoCoursePlaylistLMS";
import { VideoItem } from "../indexes/VideoCoursePlaylistSVP";
import SectionTitleSVP from "../titles/SectionTitleSVP";
import { useRouter, useSearchParams } from "next/navigation";
import { extractEmbedPathFromYouTubeURL } from "@/lib/extract-youtube-id";

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

  let embedYoutube = extractEmbedPathFromYouTubeURL(
    "https://youtu.be/lw0Txg5_Dz4?feature=shared"
  );
  if (selectedVideoData) {
    embedYoutube = extractEmbedPathFromYouTubeURL(selectedVideoData.video_url!);
  }

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-24 lg:px-0 lg:mx-auto lg:max-w-[960px] xl:max-w-[1208px]">
      <div className="flex flex-col gap-4">
        <div className="relative w-full aspect-video rounded-md overflow-hidden lg:max-w-[768px]">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${embedYoutube}&amp;controls=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
        <h1 className="font-brand font-bold text-sm lg:text-lg">
          {selectedVideoData
            ? selectedVideoData.name
            : "RE:START Conference 2025"}
        </h1>
      </div>
      <div className="other-video flex flex-col gap-3">
        <SectionTitleSVP sectionTitle="Other Video" />
        <VideoCoursePlaylistLMS
          playlistVideos={playlistVideos}
          onClick={handleParamsQuery}
          isLoading={isLoadingVideo}
        />
      </div>
    </div>
  );
}
