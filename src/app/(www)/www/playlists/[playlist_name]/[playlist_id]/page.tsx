import PlaylistDetailsSVP from "@/app/components/pages/PlaylistDetailsSVP";
import { setSecretKey, setSessionToken, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import React from "react";

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
  const { playlist_id, playlist_name } = await params;
  const playlistId = parseInt(playlist_id);

  // Get Data
  setSessionToken(sessionToken!);
  let playlistDataRaw;
  try {
    playlistDataRaw = await trpc.read.playlist({ id: playlistId });
  } catch (error) {
    return notFound();
  }

  return {
    title: `${playlistDataRaw.playlist.name} | Video Course`,
    description: playlistDataRaw.playlist.description,
    keywords:
      "Sevenpreneur, Business Blueprint, Raymond Chin, Video On Demand Bisnis",
    authors: [{ name: "Sevenpreneur" }],
    publisher: "Sevenpreneur",
    referrer: "origin-when-cross-origin",
    alternates: {
      canonical: `/cohorts/${playlistDataRaw.playlist.slug_url}/${playlistDataRaw.playlist.id}`,
    },
    openGraph: {
      title: `${playlistDataRaw.playlist.name} | Video Course`,
      description: playlistDataRaw.playlist.description,
      url: `https://sevenpreneur.com/cohorts/${playlistDataRaw.playlist.slug_url}/${playlistDataRaw.playlist.id}`,
      siteName: "Sevenpreneur",
      images: [
        {
          url: playlistDataRaw.playlist.image_url,
          width: 800,
          height: 600,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${playlistDataRaw.playlist.name} | Video Course`,
      description: playlistDataRaw.playlist.description,
      images: playlistDataRaw.playlist.image_url,
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
      playlistImage={playlistData.image_url}
      playlistDescription={playlistData.description}
      playlistSlug={playlistData.slug_url}
      playlistPrice={playlistData.price}
      playlistPublishedAt={playlistData.published_at}
      playlistEducators={playlistData.educators}
      playlistVideos={playlistData.videos}
    />
  );
}
