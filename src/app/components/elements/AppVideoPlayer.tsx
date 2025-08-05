"use client";
import { useEffect, useState } from "react";
import { Stream } from "@cloudflare/stream-react";

interface AppVideoPlayerProps {
  videoId: string;
}

export default function AppVideoPlayer({ videoId }: AppVideoPlayerProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  let domain = "sevenpreneur.com";
  if (process.env.NEXT_PUBLIC_DOMAIN_MODE === "local") {
    domain = "example.com:3000";
  }

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        const response = await fetch(`/api/stream/url/${videoId}`);
        const data = await response.json();
        setSignedUrl(data.signed_url);
      } catch (error) {
        console.error("Failed to fetch signed token:", error);
      }
    };

    fetchSignedUrl();

    // Set timer to refresh token before expired (4 mins)
    const interval = setInterval(() => {
      fetchSignedUrl();
      setRefreshKey((prev) => prev + 1); // force rerender if needed
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, [domain, videoId]);

  if (!signedUrl) return <p>Loading video…</p>;

  return (
    <div key={refreshKey}>
      <Stream
        src={signedUrl}
        controls
        width="100%"
        height="100%"
        autoplay={false}
        preload="metadata"
      />
    </div>
  );
}
