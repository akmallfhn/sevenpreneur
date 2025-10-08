"use client";
import { useEffect, useState } from "react";
import { Stream } from "@cloudflare/stream-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!videoId) return;

      if (isMounted) {
        setIsLoading(true);
        setHasError(false);
        setSignedToken(null);
      }

      try {
        const response = await fetch(`/api/stream/url/${videoId}`);
        const data = await response.json();
        const url = new URL(data.signed_url);
        const tokenFromURL = url.searchParams.get("token");
        if (isMounted && tokenFromURL) {
          setSignedToken(tokenFromURL);
        }
      } catch (error) {
        console.error("Failed to fetch signed token:", error);
        if (isMounted) {
          setSignedToken(null);
          setHasError(true);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(() => {
      fetchData();
      if (isMounted) setRefreshKey((prev) => prev + 1);
    }, 1000 * 60 * 30);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [videoId]);

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-black">
        <DotLottieReact
          src="/animation/loading-spinner.lottie"
          loop
          autoplay
          speed={1}
          style={{ width: 240 }}
        />
      </div>
    );
  }

  if (!signedToken || hasError) {
    return (
      <div className="flex w-full h-full items-center justify-center bg-black">
        <p className="font-bodycopy text-white">
          Video unavailable. Please refresh the page.
        </p>
      </div>
    );
  }

  return (
    <div key={refreshKey}>
      <Stream
        src={signedToken}
        controls
        width="100%"
        height="100%"
        autoplay={false}
        preload="metadata"
      />
    </div>
  );
}
