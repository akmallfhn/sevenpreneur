"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppVideoPlayer from "../elements/AppVideoPlayer";
import HeroPlaylistDetailsLMS from "../heroes/HeroPlaylistDetailsLMS";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import VideoListItemLMS from "../items/VideoListItemLMS";
import { StatusType } from "@/lib/app-types";

export interface VideoItem {
  id: number;
  name: string;
  description: string | null;
  image_url: string;
  duration: number;
  video_url?: string;
  external_video_id: string;
  status: StatusType;
}

interface PlaylistDetailsLMSProps extends AvatarBadgeLMSProps {
  sessionUserRole: number;
  playlistId: number;
  playlistName: string;
  playlistDescription: string;
  playlistVideos: VideoItem[];
}

export default function PlaylistDetailsLMS({
  sessionUserName,
  sessionUserAvatar,
  sessionUserRole,
  playlistId,
  playlistName,
  playlistDescription,
  playlistVideos,
}: PlaylistDetailsLMSProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoIdParams = searchParams.get("videoId");
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState<number | null>(null);

  const activeVideos = playlistVideos;

  // Handle Sync URL param to selectedVideoId
  useEffect(() => {
    if (videoIdParams) {
      const videoId = parseInt(videoIdParams);

      // if not number, then delete param
      if (isNaN(videoId)) {
        router.replace(`/playlists/${playlistId}`, { scroll: false });
        return;
      }

      // if id not exist, then delete param
      const exists = activeVideos.some((video) => Number(video.id) === videoId);
      if (!exists) {
        router.replace(`/playlists/${playlistId}`, { scroll: false });
        return;
      }

      // if valid, update to state
      setSelectedVideoId(videoId);
    } else {
      setSelectedVideoId(null);
    }
  }, [videoIdParams, activeVideos, playlistId, router]);

  // Get Data from selected Video ID
  const selectedVideoData = useMemo(() => {
    return activeVideos.find(
      (item) => Number(item.id) === Number(selectedVideoId)
    );
  }, [selectedVideoId, activeVideos]);

  // Handle Query Params Video ID
  const handleParamsQuery = (videoId: number) => {
    if (videoId !== selectedVideoId) {
      setSelectedVideoId(videoId);
      setIsLoadingVideo(videoId);

      const params = new URLSearchParams(searchParams);
      params.set("videoId", videoId.toString());
      router.replace(`/playlists/${playlistId}?${params.toString()}`, {
        scroll: false,
      });
    }
  };

  useEffect(() => {
    setIsLoadingVideo(null);
  }, [selectedVideoId]);

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full gap-7 items-center justify-center lg:flex">
      <HeroPlaylistDetailsLMS
        sessionUserName={sessionUserName}
        sessionUserAvatar={sessionUserAvatar}
        sessionUserRole={sessionUserRole}
        playlistName={playlistName}
      />
      <div className="body-playlist max-w-[calc(100%-4rem)] w-full flex justify-between gap-4">
        <main className="main flex flex-col flex-2 w-full gap-4">
          <div className="video-attributes flex flex-col w-full bg-white border gap-4 rounded-lg">
            <div className="video-player relative w-full aspect-video bg-[#E1E5EF] rounded-lg overflow-hidden">
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
            <div className="flex flex-col gap-4 px-4 pb-4">
              <h1 className="video-name font-bodycopy font-bold w-full text-xl">
                {selectedVideoData
                  ? selectedVideoData.name
                  : "Teaser RE:START Conference 2025"}
              </h1>
              <p className="video-description font-bodycopy text-[15px] text-[#333333] whitespace-pre-line">
                {selectedVideoData
                  ? selectedVideoData.description
                  : playlistDescription}
              </p>
            </div>
          </div>
        </main>
        <aside className="aside flex flex-col flex-1 w-full gap-3">
          <div className="flex flex-col bg-white border p-4 gap-3 rounded-lg">
            <h2 className="section-title font-bodycopy font-bold">
              Playlist Videos
            </h2>
            <div className="playlist-video flex flex-col w-full gap-3">
              {activeVideos.map((post, index) => (
                <VideoListItemLMS
                  key={index}
                  videoEpisode={index + 1}
                  videoName={post.name}
                  videoImage={post.image_url}
                  videoDuration={post.duration}
                  onClick={() => handleParamsQuery(post.id)}
                  isLoading={isLoadingVideo === post.id}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
