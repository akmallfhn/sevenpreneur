import React from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { setSecretKey, setSessionToken, trpc } from "@/trpc/server";
import PlaylistDetailsSVP from "@/app/components/pages/PlaylistDetailsSVP";

interface PlaylistDetailsPageProps {
  params: Promise<{ playlist_name: string; playlist_id: string }>;
}

export async function generateMetadata({
  params,
}: PlaylistDetailsPageProps): Promise<Metadata> {
  /////// Temporary////////
  const cookiesStore = await cookies();
  const sessionToken = cookiesStore.get("session_token")?.value;
  ////////////

  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  const { playlist_id } = await params;
  const playlistId = parseInt(playlist_id);

  // --- Get Data
  setSessionToken(sessionToken!);
  setSecretKey(secretKey!);

  const playlistData = (await trpc.read.playlist({ id: playlistId })).playlist;

  return {
    title: `${playlistData.name} - Video Course | Sevenpreneur`,
    description: playlistData.description,
    keywords:
      "Sevenpreneur, Business Blueprint, Raymond Chin, Video On Demand Bisnis",
    authors: [{ name: "Sevenpreneur" }],
    publisher: "Sevenpreneur",
    referrer: "origin-when-cross-origin",
    alternates: {
      canonical: `/playlists/${playlistData.slug_url}/${playlistData.id}`,
    },
    openGraph: {
      title: `${playlistData.name} - Video Course | Sevenpreneur`,
      description: playlistData.description,
      url: `/playlists/${playlistData.slug_url}/${playlistData.id}`,
      siteName: "Sevenpreneur",
      images: [
        {
          url: playlistData.image_url,
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${playlistData.name} - Video Course | Sevenpreneur`,
      description: playlistData.description,
      images: playlistData.image_url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function PlaylistDetailsPage({
  params,
}: PlaylistDetailsPageProps) {
  /////// Temporary////////
  const cookiesStore = await cookies();
  const sessionToken = cookiesStore.get("session_token")?.value;
  if (!sessionToken) {
    return null;
  }
  ////////////

  const secretKey = process.env.SECRET_KEY_PUBLIC_API;
  const { playlist_id, playlist_name } = await params;
  const playlistId = parseInt(playlist_id);

  // --- Get Data
  setSessionToken(sessionToken);
  setSecretKey(secretKey!);
  let playlistDataRaw;
  try {
    playlistDataRaw = (await trpc.read.playlist({ id: playlistId })).playlist;
  } catch (error) {
    return notFound();
  }

  // --- Sanitize Data from not supported format
  const playlistData = {
    ...playlistDataRaw,
    price: Number(playlistDataRaw.price),
    published_at: playlistDataRaw.published_at.toISOString(),
    educators: playlistDataRaw.educators.map((educator) => ({
      id: educator.user.id,
      full_name: educator.user.full_name,
      avatar: educator.user.avatar,
    })),
  };

  // --- Auto Correction Slug
  const correctSlug = playlistData.slug_url;
  if (playlist_name !== correctSlug) {
    redirect(`/playlists/${correctSlug}/${playlistId}`);
  }

  return (
    <PlaylistDetailsSVP
      playlistId={playlistData.id}
      playlistName={playlistData.name}
      playlistTagline={playlistData.tagline}
      playlistVideoPreview={playlistData.video_preview_url}
      playlistDescription={playlistData.description}
      playlistSlug={playlistData.slug_url}
      playlistPrice={playlistData.price}
      playlistPublishedAt={playlistData.published_at}
      playlistEducators={playlistData.educators}
      playlistVideos={playlistData.videos}
    />
  );
}
