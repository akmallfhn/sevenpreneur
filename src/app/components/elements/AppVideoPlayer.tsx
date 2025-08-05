"use client";
import { useEffect, useState } from "react";
import { Stream } from "@cloudflare/stream-react";

interface AppVideoPlayerProps {
  videoId: string;
  videoImage: string;
}

export default function AppVideoPlayer({
  videoId,
  videoImage,
}: AppVideoPlayerProps) {
  const [signedToken, setSignedToken] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`api/stream/url/${videoId}`);
        const data = await response.json();
        const url = new URL(data.signed_url);
        const tokenfromURL = url.searchParams.get("token");
        setSignedToken(tokenfromURL!);
      } catch (error) {
        console.error("Failed to fetch signed token:", error);
      }
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
      setRefreshKey((prev) => prev + 1);
    }, 1000 * 60 * 30);

    return () => clearInterval(interval);
  }, [videoId]);

  if (!signedToken) return <p>Video unavailable. Please refresh the page.</p>;

  return (
    <div key={refreshKey}>
      <Stream
        src={signedToken}
        controls
        poster={videoImage}
        width="100%"
        height="100%"
        autoplay={false}
        preload="metadata"
      />
    </div>
  );
}
