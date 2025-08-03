"use client";
import VideoCourseItemSVP from "../items/VideoCourseItemSVP";

export type VideoItem = {
  id: number;
  name: string;
  image_url: string;
  duration: number;
};

interface VideoCoursePlaylistLMSProps {
  playlistVideos: VideoItem[];
}

export default function VideoCoursePlaylistLMS({
  playlistVideos,
}: VideoCoursePlaylistLMSProps) {
  return (
    <div className="flex flex-col gap-4">
      {playlistVideos.map((post, index) => (
        <VideoCourseItemSVP
          key={index}
          index={index + 1}
          videoName={post.name}
          videoImage={post.image_url}
          videoDuration={post.duration}
        />
      ))}
    </div>
  );
}
