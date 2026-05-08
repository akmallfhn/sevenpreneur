"use client";
import { useState, useRef, useEffect } from "react";
import { WhatsappChatDirection, WhatsappChatStatus } from "@/lib/app-types";
import { resolveWhatsappChatStatus } from "@/lib/whatsapp-utils";
import { WhatsAppTypeAttachmentPairUnion } from "@/lib/whatsapp-types";
import WhatsappChatBubbleCMS from "./WhatsappChatBubbleCMS";
import WhatsappImagePreviewCMS from "../modals/WhatsappImagePreviewCMS";
import Image from "next/image";
import {
  FileText,
  Download,
  Play,
  Pause,
  FileQuestion,
} from "lucide-react";

interface WhatsappChatItemCMSProps {
  chat: WhatsAppTypeAttachmentPairUnion;
  chatDirection: WhatsappChatDirection;
  chatStatus: WhatsappChatStatus | null;
  chatMessage: string;
  createdAt: string;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
}

// ─── Audio Player Sub-component ───────────────────────────────────────────────
interface AudioPlayerProps {
  src: string;
}

function WhatsappAudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player flex items-center gap-2 px-1 py-0.5 w-[220px]">
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Play / Pause button */}
      <button
        onClick={togglePlay}
        disabled={isLoading}
        className="flex-shrink-0 flex items-center justify-center size-8 rounded-full bg-primary/10 hover:bg-primary/20 disabled:opacity-40 transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="size-4 text-primary" />
        ) : (
          <Play className="size-4 text-primary" />
        )}
      </button>

      {/* Progress bar + timestamps */}
      <div className="flex flex-col flex-1 gap-0.5">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          disabled={isLoading}
          style={{
            background: `linear-gradient(to right, var(--primary) ${progress}%, #d1d5db ${progress}%)`,
          }}
          className="w-full h-1 rounded-full appearance-none cursor-pointer disabled:opacity-40 accent-primary"
          aria-label="Audio progress"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground font-bodycopy leading-none">
          <span>{formatTime(currentTime)}</span>
          <span>{isLoading ? "--:--" : formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────
function MediaLoadingSkeleton({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-1 py-1 animate-pulse">
      <div className="size-8 rounded-full bg-muted" />
      <div className="flex flex-col gap-1 flex-1">
        <div className="h-2 rounded bg-muted w-3/4" />
        <div className="h-2 rounded bg-muted w-1/2" />
      </div>
      <span className="text-xs text-muted-foreground italic">{label}</span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function WhatsappChatItemCMS(props: WhatsappChatItemCMSProps) {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const { iconStatus, timestampStatus } = resolveWhatsappChatStatus(
    props.chatStatus,
    {
      readAt: props.readAt,
      deliveredAt: props.deliveredAt,
      sentAt: props.sentAt,
      failedAt: props.failedAt,
    }
  );

  // ── TEXT ─────────────────────────────────────────────────────────────────
  if (props.chat.type === "TEXT") {
    return (
      <WhatsappChatBubbleCMS
        chatDirection={props.chatDirection}
        chatStatus={props.chatStatus}
        iconStatus={iconStatus}
        timestampStatus={timestampStatus}
        createdAt={props.createdAt}
      >
        <p className="px-1">{props.chatMessage}</p>
      </WhatsappChatBubbleCMS>
    );
  }

  // ── IMAGE ────────────────────────────────────────────────────────────────
  if (props.chat.type === "IMAGE") {
    return (
      <>
        <WhatsappChatBubbleCMS
          chatDirection={props.chatDirection}
          chatStatus={props.chatStatus}
          iconStatus={iconStatus}
          timestampStatus={timestampStatus}
          createdAt={props.createdAt}
        >
          <div className="image flex flex-col w-full">
            {props.chat.attachment.storage_url ? (
              <Image
                className="w-full h-full rounded-sm cursor-pointer"
                src={props.chat.attachment.storage_url}
                alt={props.chat.attachment.caption || "Image Whatsapp"}
                width={300}
                height={300}
                onClick={() => setIsImagePreviewOpen(true)}
              />
            ) : (
              <p className="px-2 italic text-muted-foreground">
                Image not found
              </p>
            )}
            {!!props.chat.attachment.caption && (
              <p className="p-1">{props.chat.attachment.caption}</p>
            )}
          </div>
        </WhatsappChatBubbleCMS>

        {isImagePreviewOpen && props.chat.attachment.storage_url && (
          <WhatsappImagePreviewCMS
            imageURL={props.chat.attachment.storage_url}
            imageCaption={props.chat.attachment.caption}
            isOpen={isImagePreviewOpen}
            onClose={() => setIsImagePreviewOpen(false)}
          />
        )}
      </>
    );
  }

  // ── VIDEO ────────────────────────────────────────────────────────────────
  if (props.chat.type === "VIDEO") {
    const videoSrc = props.chat.attachment.storage_url;
    return (
      <WhatsappChatBubbleCMS
        chatDirection={props.chatDirection}
        chatStatus={props.chatStatus}
        iconStatus={iconStatus}
        timestampStatus={timestampStatus}
        createdAt={props.createdAt}
      >
        <div className="video flex flex-col w-full gap-1">
          {videoSrc && !videoError ? (
            <>
              {/* Show skeleton until video metadata is loaded */}
              {!videoLoaded && <MediaLoadingSkeleton label="Loading video..." />}
              <video
                className={`w-full rounded-sm max-h-[320px] object-cover ${videoLoaded ? "block" : "hidden"}`}
                src={videoSrc}
                controls
                preload="metadata"
                onLoadedMetadata={() => setVideoLoaded(true)}
                onError={() => setVideoError(true)}
              />
            </>
          ) : videoError ? (
            <div className="flex items-center gap-2 px-2 py-1 text-muted-foreground">
              <FileQuestion className="size-4 flex-shrink-0" />
              <p className="text-sm italic">Format tidak didukung</p>
            </div>
          ) : (
            <p className="px-2 italic text-muted-foreground text-sm">
              Video not found
            </p>
          )}
          {!!props.chat.attachment.caption && (
            <p className="p-1 text-sm">{props.chat.attachment.caption}</p>
          )}
        </div>
      </WhatsappChatBubbleCMS>
    );
  }

  // ── DOCUMENT ─────────────────────────────────────────────────────────────
  if (props.chat.type === "DOCUMENT") {
    const docSrc = props.chat.attachment.storage_url || props.chat.attachment.url;
    const fileName = props.chat.attachment.filename || "Document";
    const ext = fileName.split(".").pop()?.toUpperCase() ?? "FILE";

    return (
      <WhatsappChatBubbleCMS
        chatDirection={props.chatDirection}
        chatStatus={props.chatStatus}
        iconStatus={iconStatus}
        timestampStatus={timestampStatus}
        createdAt={props.createdAt}
      >
        <div className="document flex items-center gap-2 px-1 py-1 w-[240px]">
          {/* File icon */}
          <div className="flex-shrink-0 flex items-center justify-center size-10 rounded-md bg-primary/10">
            <FileText className="size-5 text-primary" />
          </div>

          {/* File info */}
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-sm font-medium font-bodycopy truncate leading-snug">
              {fileName}
            </p>
            <p className="text-xs text-muted-foreground font-bodycopy">
              {ext}
            </p>
          </div>

          {/* Download button */}
          {docSrc ? (
            <a
              href={docSrc}
              download={fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 flex items-center justify-center size-8 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              aria-label={`Download ${fileName}`}
            >
              <Download className="size-4 text-primary" />
            </a>
          ) : (
            <div className="flex-shrink-0 size-8 flex items-center justify-center opacity-40">
              <Download className="size-4 text-muted-foreground" />
            </div>
          )}
        </div>
        {!!props.chat.attachment.caption && (
          <p className="px-1 pb-1 text-sm">{props.chat.attachment.caption}</p>
        )}
      </WhatsappChatBubbleCMS>
    );
  }

  // ── AUDIO ────────────────────────────────────────────────────────────────
  if (props.chat.type === "AUDIO") {
    const audioSrc = props.chat.attachment.storage_url || props.chat.attachment.url;
    const isVoice = props.chat.attachment.voice;

    return (
      <WhatsappChatBubbleCMS
        chatDirection={props.chatDirection}
        chatStatus={props.chatStatus}
        iconStatus={iconStatus}
        timestampStatus={timestampStatus}
        createdAt={props.createdAt}
      >
        <div className="audio flex flex-col w-full">
          {audioSrc && !audioError ? (
            <WhatsappAudioPlayer
              src={audioSrc}
            />
          ) : audioError ? (
            <div className="flex items-center gap-2 px-2 py-1 text-muted-foreground">
              <FileQuestion className="size-4 flex-shrink-0" />
              <p className="text-sm italic">Format tidak didukung</p>
            </div>
          ) : (
            <MediaLoadingSkeleton label={isVoice ? "Voice note" : "Audio"} />
          )}
        </div>
      </WhatsappChatBubbleCMS>
    );
  }

  // ── FALLBACK (unsupported / unknown types) ───────────────────────────────
  return (
    <WhatsappChatBubbleCMS
      chatDirection={props.chatDirection}
      chatStatus={props.chatStatus}
      iconStatus={iconStatus}
      timestampStatus={timestampStatus}
      createdAt={props.createdAt}
    >
      <div className="flex items-center gap-2 px-2 py-1 text-muted-foreground">
        <FileQuestion className="size-4 flex-shrink-0" />
        <p className="text-sm italic">Format tidak didukung</p>
      </div>
    </WhatsappChatBubbleCMS>
  );
}
