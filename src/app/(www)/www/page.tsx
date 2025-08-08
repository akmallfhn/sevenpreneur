import { Metadata } from "next";
import PlaylistDetailsSVP from "@/app/components/pages/PlaylistDetailsSVP";
import { notFound } from "next/navigation";
import { setSecretKey, trpc } from "@/trpc/server";

export async function generateMetadata(): Promise<Metadata> {
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;

  // --- Get Data
  setSecretKey(secretKey!);
  const playlistData = (await trpc.read.playlist({ id: 1 })).playlist;

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

export default async function HomePage() {
  const secretKey = process.env.SECRET_KEY_PUBLIC_API;

  // --- Get Data
  setSecretKey(secretKey!);
  let playlistDataRaw;
  try {
    playlistDataRaw = (await trpc.read.playlist({ id: 1 })).playlist;
  } catch (error) {
    return notFound();
  }

  // --- Sanitize Data from not supported format
  const playlistData = {
    ...playlistDataRaw,
    price: Number(playlistDataRaw.price),
    published_at: playlistDataRaw.published_at.toISOString(),
    educators: playlistDataRaw.educators.map((educator) => ({
      full_name: educator.user.full_name,
      avatar: educator.user.avatar,
    })),
  };

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
