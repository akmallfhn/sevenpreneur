import PlaylistDetailsSVP from "@/app/components/pages/PlaylistDetailsSVP";
import { setSecretKey, setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

interface PlaylistDetailsPageProps {
  params: Promise<{ playlist_name: string; playlist_id: string }>;
}

export default async function PlaylistDetailsPage({
  params,
}: PlaylistDetailsPageProps) {
  // Temporary
  const cookiesStore = await cookies();
  const sessionToken = cookiesStore.get("session_token")?.value;
  if (!sessionToken) {
    return null;
  }

  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  const { playlist_id } = await params;
  const playlistId = parseInt(playlist_id);

  // Get Data
  setSecretKey(sessionToken);
  const playlistDataRaw = await trpc.read.playlist({ id: playlistId });
  const playlistData = {
    ...playlistDataRaw.playlist,
    price: Number(playlistDataRaw.playlist.price),
    published_at: playlistDataRaw.playlist.published_at.toISOString(),
    educators: playlistDataRaw.playlist.educators.map((educator) => ({
      id: educator.user.id,
      full_name: educator.user.full_name,
      avatar: educator.user.avatar,
    })),
  };

  return (
    <PlaylistDetailsSVP
      playlistId={playlistData.id}
      playlistName={playlistData.name}
      playlistTagline={playlistData.tagline}
      playlistDescription={playlistData.description}
      playlistPrice={playlistData.price}
      playlistPublishedAt={playlistData.published_at}
      playlistEducators={playlistData.educators}
      playlistVideos={playlistData.videos}
    />
  );
}
