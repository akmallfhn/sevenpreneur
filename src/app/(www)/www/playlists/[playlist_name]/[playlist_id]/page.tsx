import PlaylistDetailsSVP from "@/app/components/pages/PlaylistDetailsSVP";
import { setSecretKey, trpc } from "@/trpc/server";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

interface PlaylistDetailsPageProps {
  params: Promise<{ playlist_name: string; playlist_id: string }>;
}

export async function generateMetadata({
  params,
}: PlaylistDetailsPageProps): Promise<Metadata> {
  const { playlist_id } = await params;
  const playlistId = parseInt(playlist_id);
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;

  setSecretKey(secretKey!);

  const playlistData = (await trpc.read.playlist({ id: playlistId })).playlist;

  if (playlistData.status !== "ACTIVE") {
    return {
      title: `404 Not Found`,
      description:
        "Sorry, the page you’re looking for doesn’t exist or may have been moved.",
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    };
  }

  return {
    title: `${playlistData.name} - Learning Series | Sevenpreneur`,
    description: playlistData.description,
    keywords:
      "Sevenpreneur, Business Blueprint, Raymond Chin, Video On Demand Bisnis, Learning Series",
    authors: [{ name: "Sevenpreneur" }],
    publisher: "Sevenpreneur",
    referrer: "origin-when-cross-origin",
    alternates: {
      canonical: `/playlists/${playlistData.slug_url}/${playlistData.id}`,
    },
    openGraph: {
      title: `${playlistData.name} - Learning Series | Sevenpreneur`,
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
      title: `${playlistData.name} - Learning Series | Sevenpreneur`,
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
  const { playlist_id, playlist_name } = await params;
  const playlistId = parseInt(playlist_id);
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;

  setSecretKey(secretKey!);

  let playlistDataRaw;
  try {
    playlistDataRaw = (await trpc.read.playlist({ id: playlistId })).playlist;
  } catch {
    return notFound();
  }

  // Return 404 if INACTIVE status
  if (playlistDataRaw.status !== "ACTIVE") {
    return notFound();
  }

  // Sanitize Data from not supported format
  const playlistData = {
    ...playlistDataRaw,
    price: Number(playlistDataRaw.price),
    published_at: playlistDataRaw.published_at.toISOString(),
    educators: playlistDataRaw.educators.map((educator) => ({
      full_name: educator.user.full_name,
      avatar: educator.user.avatar,
    })),
  };

  // Auto Correction Slug
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
      playlistTotalEpisodes={playlistData.total_video}
      playlistTotalDuration={playlistData.total_duration}
      playlistTotalUserEnrolled={playlistData.total_user_enrolled}
      playlistEducators={playlistData.educators}
      playlistVideos={playlistData.videos}
    />
  );
}
