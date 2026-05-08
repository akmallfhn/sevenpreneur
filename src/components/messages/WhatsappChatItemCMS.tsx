"use client";
import { useState } from "react";
import { WhatsappChatDirection, WhatsappChatStatus } from "@/lib/app-types";
import { resolveWhatsappChatStatus } from "@/lib/whatsapp-utils";
import { WhatsAppTypeAttachmentPairUnion } from "@/lib/whatsapp-types";
import WhatsappChatBubbleCMS from "./WhatsappChatBubbleCMS";
import WhatsappAudioPlayerCMS from "./WhatsappAudioPlayerCMS";
import WhatsappImagePreviewCMS from "../modals/WhatsappImagePreviewCMS";
import Image from "next/image";
import { FileText, Download, FileQuestion } from "lucide-react";

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
              {!videoLoaded && (
                <MediaLoadingSkeleton label="Loading video..." />
              )}
              <video
                className={`max-w-full max-h-[320px] mx-auto rounded-sm object-contain ${videoLoaded ? "block" : "hidden"}`}
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

  if (props.chat.type === "DOCUMENT") {
    const docSrc =
      props.chat.attachment.storage_url || props.chat.attachment.url;
    const fileName = props.chat.attachment.filename || "Document";
    const ext = fileName.split(".").pop()?.toUpperCase() ?? "FILE";

    const handleDownload = async () => {
      if (!docSrc) return;
      try {
        const response = await fetch(docSrc);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
      } catch (err) {
        console.error("Download failed:", err);
        window.open(docSrc, "_blank", "noopener,noreferrer");
      }
    };

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
            <p className="text-xs text-muted-foreground font-bodycopy">{ext}</p>
          </div>

          {/* Download button */}
          {docSrc ? (
            <button
              type="button"
              onClick={handleDownload}
              className="flex-shrink-0 flex items-center justify-center size-8 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer"
              aria-label={`Download ${fileName}`}
            >
              <Download className="size-4 text-primary" />
            </button>
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

  if (props.chat.type === "AUDIO") {
    const audioSrc =
      props.chat.attachment.storage_url || props.chat.attachment.url;
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
            <WhatsappAudioPlayerCMS
              src={audioSrc}
              onError={() => setAudioError(true)}
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

  return (
    <WhatsappChatBubbleCMS
      chatDirection={props.chatDirection}
      chatStatus={props.chatStatus}
      iconStatus={iconStatus}
      timestampStatus={timestampStatus}
      createdAt={props.createdAt}
    >
      <p className="px-2 italic text-muted-foreground">Format unsupported</p>
    </WhatsappChatBubbleCMS>
  );
}
