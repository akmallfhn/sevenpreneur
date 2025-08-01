"use client";
import VideoCourseItemSVP from "../items/VideoCourseItemSVP";

export type VideoItem = {
  id: number;
  playlist_id: number;
  name: string;
  image_url: string;
  video_url: string;
};

interface VideoCoursePlaylistSVPProps {
  playlistVideos: VideoItem[];
}

export default function VideoCoursePlaylistSVP({
  playlistVideos,
}: VideoCoursePlaylistSVPProps) {
  return (
    <div className="flex flex-col gap-3">
      {playlistVideos.map((post, index) => (
        <VideoCourseItemSVP
          key={index}
          index={index + 1}
          videoName={post.name}
        />
      ))}
    </div>
  );
}
