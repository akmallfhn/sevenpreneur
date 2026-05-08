"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { Play, Pause } from "lucide-react";
import AppButton from "../buttons/AppButton";

interface WhatsappAudioPlayerCMSProps {
  src: string;
  onError?: () => void;
}

const BAR_COUNT = 40;

function generateBarHeights(seed: string): number[] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  let s = Math.abs(hash) || 1;
  const heights: number[] = [];
  for (let i = 0; i < BAR_COUNT; i++) {
    s = (s * 9301 + 49297) % 233280;
    heights.push(0.3 + (s / 233280) * 0.7);
  }
  return heights;
}

export default function WhatsappAudioPlayerCMS({
  src,
  onError,
}: WhatsappAudioPlayerCMSProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const barHeights = useMemo(() => generateBarHeights(src), [src]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const waveform = waveformRef.current;
    if (!audio || !waveform || !duration) return;
    const rect = waveform.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width)
    );
    const newTime = ratio * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? currentTime / duration : 0;
  const displayTime = currentTime > 0 ? currentTime : duration;

  return (
    <div className="audio-player flex items-center gap-2 px-1 py-1 w-[280px]">
      <audio ref={audioRef} src={src} preload="metadata" onError={onError} />

      {/* Play / Pause button */}
      <AppButton
        onClick={togglePlay}
        disabled={isLoading}
        variant="primary"
        size="iconRounded"
        className="flex-shrink-0"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="size-4" fill="#ffffff" />
        ) : (
          <Play className="size-4" fill="#ffffff" />
        )}
      </AppButton>

      {/* Waveform spectrum */}
      <div
        ref={waveformRef}
        onClick={handleSeek}
        className="relative flex-1 h-8 flex items-center cursor-pointer"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={currentTime}
        aria-label="Audio progress"
      >
        {/* Inactive (gray) layer */}
        <div className="absolute inset-0 flex items-center justify-between gap-px">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-full bg-gray-300 dark:bg-gray-600"
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>
        {/* Active (blue) layer — clipped to progress, transitions smoothly */}
        <div
          className="absolute inset-0 flex items-center justify-between gap-px transition-[clip-path] duration-150 ease-linear"
          style={{ clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }}
        >
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-full bg-primary-background"
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>
        {/* Playhead dot */}
        {duration > 0 && (
          <div
            className="absolute top-0 size-2 rounded-full bg-primary-background -translate-x-1/2 pointer-events-none transition-[left] duration-150 ease-linear"
            style={{ left: `${progress * 100}%` }}
          />
        )}
      </div>

      {/* Timestamp pill */}
      <div className="flex shrink-0 px-1.5 py-1 items-center justify-center rounded-full bg-primary-soft-background">
        <span className="text-[10px] font-medium text-primary-soft-foreground font-bodycopy leading-none">
          {isLoading ? "--:--" : formatTime(displayTime)}
        </span>
      </div>
    </div>
  );
}
