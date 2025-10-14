"use client";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface PlaylistItemLMSProps {
  playlistId: number;
  playlistName: string;
  playlistTagline: string;
  playlistImage: string;
}

export default function PlaylistItemLMS({
  playlistId,
  playlistName,
  playlistTagline,
  playlistImage,
}: PlaylistItemLMSProps) {
  return (
    <React.Fragment>
      <Link
        href={`/playlists/${playlistId}`}
        className="card-container flex flex-col w-full rounded-lg overflow-hidden transition transform active:scale-95"
      >
        <div className="playlist-image relative flex w-full aspect-video overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={playlistImage}
            alt={playlistName}
            width={600}
            height={600}
          />
          <div className="overlay absolute inset-0 bg-gradient-to-t from-10% from-surface-black to-80% to-surface-black/0 z-10" />
          <FontAwesomeIcon
            className="play-button absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 aspect-square p-4 bg-white/10 backdrop-blur-xs border border-white/[0.08] rounded-full z-20"
            icon={faPlay}
            size="xl"
            color="#FFFFFF"
          />
          <div className="playlist-duration absolute flex top-3 right-3 w-fit px-2 py-1 items-center gap-1 bg-white text-black text-xs font-bodycopy font-semibold rounded-full z-20">
            <FontAwesomeIcon icon={faPlay} />
            6h 43m
          </div>
        </div>
        <div className="metadata relative flex flex-col gap-2 h-[112px] bg-surface-black px-4">
          <div className="">
            <h3 className="playlist-title text-white font-bodycopy font-bold line-clamp-2 lg:text-base xl:text-lg">
              {playlistName}
            </h3>
            <p className="playlist-title text-sm text-white/50 font-bodycopy font-medium line-clamp-2">
              {playlistTagline}
            </p>
          </div>
        </div>
      </Link>
    </React.Fragment>
  );
}
