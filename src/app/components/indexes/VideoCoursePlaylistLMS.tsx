"use client";
import VideoCourseItemLMS from "../items/VideoCourseItemLMS";
import { VideoItem } from "./VideoCoursePlaylistSVP";

interface VideoCoursePlaylistLMSProps {
  playlistVideos: VideoItem[];
  onClick: (id: number) => void;
  isLoading: number | null;
}

export default function VideoCoursePlaylistLMS({
  playlistVideos,
  onClick,
  isLoading,
}: VideoCoursePlaylistLMSProps) {
  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-5">
      {playlistVideos.map((post, index) => (
        <VideoCourseItemLMS
          key={index}
          index={index + 1}
          videoName={post.name}
          videoImage={post.image_url}
          videoDuration={post.duration}
          onClick={() => onClick(post.id)}
          isLoading={isLoading === post.id}
        />
      ))}
    </div>
  );
}
