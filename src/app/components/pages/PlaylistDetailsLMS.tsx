"use client";
import { StatusType } from "@/lib/app-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import AppVideoPlayer from "../elements/AppVideoPlayer";
import HeroPlaylistDetailsLMS from "../heroes/HeroPlaylistDetailsLMS";
import VideoListItemLMS from "../items/VideoListItemLMS";
import PlaylistDetailsMobileLMS from "./PlaylistDetailsMobileLMS";

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

export default function PlaylistDetailsLMS(props: PlaylistDetailsLMSProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const videoIdParams = searchParams.get("videoId");
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [loadingVideoId, setLoadingVideoId] = useState<number | null>(null);

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

  // Dynamic mobile rendering
  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  // Render Mobile
  if (isMobile) {
    return (
      <PlaylistDetailsMobileLMS
        playlistId={props.playlistId}
        playlistName={props.playlistName}
        playlistDescription={props.playlistDescription}
        playlistVideos={props.playlistVideos}
      />
    );
  }

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full gap-7 items-center justify-center lg:flex">
      <HeroPlaylistDetailsLMS
        sessionUserName={props.sessionUserName}
        sessionUserAvatar={props.sessionUserAvatar}
        sessionUserRole={props.sessionUserRole}
        playlistName={props.playlistName}
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
                  : props.playlistDescription}
              </p>
            </div>
          </div>
        </main>
        <aside className="aside flex flex-col flex-1 w-full gap-3">
          <div className="flex flex-col bg-white border p-4 gap-3 rounded-lg overflow-hidden">
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
                  isLoading={loadingVideoId === post.id}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
