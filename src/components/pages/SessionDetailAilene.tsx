"use client";
import AppButton from "@/components/buttons/AppButton";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  getConferenceAttributes,
  getConferenceVariantFromURL,
} from "@/lib/conference-variant";
import { trpc } from "@/trpc/client";
import { LearningMethodEnum } from "@prisma/client";
import dayjs from "dayjs";
import "dayjs/locale/id";
import {
  CalendarDays,
  ChevronLeft,
  ClipboardList,
  MapPinned,
  Users,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

dayjs.locale("id");

const DEFAULT_AVATAR =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";

const METHOD_BADGE: Record<LearningMethodEnum, { label: string; cls: string }> =
  {
    ONLINE: { label: "Online", cls: "bg-primary/10 text-primary" },
    ONSITE: {
      label: "Onsite",
      cls: "bg-success-background text-success-foreground",
    },
    HYBRID: {
      label: "Hybrid",
      cls: "bg-warning-background text-warning-foreground",
    },
  };

function getVideoEmbed(
  url: string
): { type: "iframe" | "video"; src: string } | null {
  if (!url) return null;
  try {
    if (
      url.includes("youtube.com/embed/") ||
      url.includes("player.vimeo.com/video/") ||
      url.includes("loom.com/embed/")
    )
      return { type: "iframe", src: url };
    const ytMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch)
      return {
        type: "iframe",
        src: `https://www.youtube.com/embed/${ytMatch[1]}`,
      };
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch)
      return {
        type: "iframe",
        src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      };
    const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);
    if (loomMatch)
      return {
        type: "iframe",
        src: `https://www.loom.com/embed/${loomMatch[1]}`,
      };
    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url))
      return { type: "video", src: url };
    return null;
  } catch {
    return null;
  }
}

interface SessionDetailAileneProps {
  sessionId: number;
}

export default function SessionDetailAilene({
  sessionId,
}: SessionDetailAileneProps) {
  const { isCollapsed } = useSidebar();
  const { data, isLoading } = trpc.ailene.readSession.useQuery({
    id: sessionId,
  });
  const session = data?.session;

  const now = new Date();
  const isUpcoming = session ? new Date(session.meeting_date) >= now : false;
  const isExpired = session
    ? dayjs().isAfter(dayjs(session.meeting_date).add(4, "hour"))
    : false;

  const conferencePlatform = useMemo(
    () =>
      session?.meeting_url
        ? getConferenceVariantFromURL(session.meeting_url)
        : "UNKNOWN",
    [session?.meeting_url]
  );
  const { conferenceIcon, conferenceName } =
    getConferenceAttributes(conferencePlatform);

  const videoEmbed = useMemo(
    () =>
      session?.recording_url ? getVideoEmbed(session.recording_url) : null,
    [session?.recording_url]
  );

  const locationDisplay = useMemo(() => {
    if (!session) return "";
    if (session.method === LearningMethodEnum.ONLINE) return conferenceName;
    if (session.method === LearningMethodEnum.ONSITE)
      return session.location_name ?? "";
    return "Hybrid Meeting";
  }, [session, conferenceName]);

  return (
    <div
      className={`root hidden w-full min-h-screen overflow-y-auto lg:flex lg:flex-col pb-10 ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      {/* Back nav */}
      <div className="sticky top-0 z-30 bg-dashboard-bg border-b border-dashboard-border px-8 py-3 flex items-center">
        <Link
          href="/sessions"
          className="inline-flex items-center gap-1.5 text-sm text-emphasis font-bodycopy hover:text-sevenpreneur-coal dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="size-4" />
          Sessions
        </Link>
      </div>

      {isLoading && (
        <div className="py-16">
          <AppLoadingComponents />
        </div>
      )}

      {!isLoading && session && (
        <>
          {/* Hero banner */}
          <div className="relative w-full aspect-[5208/702] overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/bg-learning.webp"
              alt={session.name}
              width={1600}
              height={216}
              priority
            />
            {/* overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Session info overlay */}
            <div className="absolute inset-y-0 left-8 flex items-center gap-4 z-10">
              {session.method !== LearningMethodEnum.ONSITE &&
                session.meeting_url && (
                  <div className="size-[50px] bg-white p-1 border shrink-0 rounded-lg overflow-hidden">
                    <Image
                      className="object-cover w-full h-full"
                      src={conferenceIcon}
                      alt={conferenceName}
                      width={100}
                      height={100}
                    />
                  </div>
                )}
              <div className="flex flex-col gap-0.5">
                <h1 className="font-bodycopy font-bold text-[22px] text-white drop-shadow">
                  {session.name}
                </h1>
                <p className="font-bodycopy font-medium text-[15px] text-white/90 drop-shadow">
                  {dayjs(session.meeting_date).format(
                    "ddd, DD MMM YYYY - HH:mm"
                  )}
                  {locationDisplay && ` @ ${locationDisplay}`}
                </p>
              </div>
            </div>

            {/* Action button on hero */}
            <div className="absolute inset-y-0 right-8 flex items-center z-10">
              {session.method !== LearningMethodEnum.ONSITE &&
                session.meeting_url &&
                isUpcoming && (
                  <a
                    href={session.meeting_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AppButton
                      variant="light"
                      size="medium"
                      disabled={isExpired}
                    >
                      <Video className="size-5" />
                      Launch Meeting
                    </AppButton>
                  </a>
                )}
              {session.method === LearningMethodEnum.ONSITE &&
                session.location_url && (
                  <a
                    href={session.location_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AppButton variant="light" size="medium">
                      <MapPinned className="size-5" />
                      Check Maps
                    </AppButton>
                  </a>
                )}
            </div>
          </div>

          {/* Body: 2-column */}
          <div className="max-w-[calc(100%-4rem)] mx-auto w-full flex gap-4 mt-5">
            {/* Main column */}
            <main className="flex flex-col flex-[2] gap-4 min-w-0">
              {/* Description */}
              <div className="flex flex-col gap-3 bg-card-bg border border-dashboard-border p-5 rounded-lg">
                <h3 className="font-brand font-bold text-base text-sevenpreneur-coal dark:text-white">
                  What&apos;s on this session?
                </h3>
                <p className="font-bodycopy text-sm text-sevenpreneur-coal dark:text-white/90 whitespace-pre-line leading-relaxed">
                  {session.description}
                </p>
              </div>

              {/* Recording */}
              <div className="flex flex-col gap-3 bg-card-bg border border-dashboard-border p-5 rounded-lg">
                <h3 className="font-brand font-bold text-base text-sevenpreneur-coal dark:text-white">
                  Session Recording
                </h3>
                {videoEmbed ? (
                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
                    {videoEmbed.type === "iframe" ? (
                      <iframe
                        src={videoEmbed.src}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={videoEmbed.src}
                        controls
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-10 rounded-lg border border-dashed border-dashboard-border">
                    <p className="font-bodycopy text-sm text-emphasis">
                      {isUpcoming
                        ? "Recording akan tersedia setelah session selesai."
                        : "Recording belum tersedia."}
                    </p>
                  </div>
                )}
              </div>
            </main>

            {/* Aside column */}
            <aside className="flex flex-col flex-1 gap-4 min-w-0">
              {/* Speaker */}
              <div className="flex flex-col gap-3 bg-card-bg border border-dashboard-border p-5 rounded-lg">
                <h3 className="font-brand font-bold text-base text-sevenpreneur-coal dark:text-white">
                  Lectured by
                </h3>
                <div className="flex items-center gap-3 p-3 bg-sb-item-hover rounded-lg">
                  <div className="size-10 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={session.speaker?.avatar || DEFAULT_AVATAR}
                      alt={session.speaker?.full_name ?? "Speaker"}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal dark:text-white line-clamp-1">
                      {session.speaker?.full_name ?? "Sevenpreneur Educator"}
                    </p>
                    <p className="font-bodycopy text-xs text-emphasis uppercase tracking-wide">
                      AI Educator
                    </p>
                  </div>
                </div>
              </div>

              {/* Session info */}
              <div className="flex flex-col gap-3 bg-card-bg border border-dashboard-border p-5 rounded-lg">
                <h3 className="font-brand font-bold text-base text-sevenpreneur-coal dark:text-white">
                  Session Info
                </h3>
                <div className="flex flex-col gap-2.5">
                  {/* Method badge */}
                  <div className="flex items-center justify-between">
                    <span className="font-bodycopy text-xs text-emphasis">
                      Metode
                    </span>
                    <span
                      className={`text-[11px] font-semibold font-bodycopy px-2.5 py-0.5 rounded-full ${METHOD_BADGE[session.method].cls}`}
                    >
                      {METHOD_BADGE[session.method].label}
                    </span>
                  </div>
                  {/* Date */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bodycopy text-xs text-emphasis shrink-0">
                      Tanggal
                    </span>
                    <span className="font-bodycopy text-xs font-medium text-sevenpreneur-coal dark:text-white text-right">
                      {dayjs(session.meeting_date).format(
                        "dddd, D MMM YYYY · HH:mm"
                      )}
                    </span>
                  </div>
                  {/* Location */}
                  {session.location_name && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bodycopy text-xs text-emphasis shrink-0">
                        Lokasi
                      </span>
                      <span className="font-bodycopy text-xs font-medium text-sevenpreneur-coal dark:text-white text-right line-clamp-1">
                        {session.location_name}
                      </span>
                    </div>
                  )}
                  {/* Attendees */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bodycopy text-xs text-emphasis shrink-0 flex items-center gap-1">
                      <Users className="size-3" /> Hadir
                    </span>
                    <span className="font-bodycopy text-xs font-medium text-sevenpreneur-coal dark:text-white">
                      {session._count.attendances} member
                    </span>
                  </div>
                  {/* Status */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bodycopy text-xs text-emphasis shrink-0">
                      Status
                    </span>
                    <span
                      className={`text-[11px] font-semibold font-bodycopy px-2.5 py-0.5 rounded-full ${isUpcoming ? "bg-tertiary/10 text-tertiary" : "bg-sevenpreneur-ash dark:bg-sevenpreneur-smoke text-emphasis"}`}
                    >
                      {isUpcoming ? "Upcoming" : "Selesai"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Join / Recording CTA */}
              {session.meeting_url && isUpcoming && (
                <a
                  href={session.meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center justify-between bg-card-bg border border-dashboard-border hover:border-primary/40 p-4 rounded-lg transition-colors cursor-pointer">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-brand font-bold text-sm text-sevenpreneur-coal dark:text-white">
                        Join Meeting
                      </h3>
                      <p className="font-bodycopy text-xs text-emphasis">
                        {conferenceName}
                      </p>
                    </div>
                    <Video className="size-5 text-primary" />
                  </div>
                </a>
              )}
              {session.recording_url && !isUpcoming && (
                <a
                  href={session.recording_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center justify-between bg-card-bg border border-dashboard-border hover:border-primary/40 p-4 rounded-lg transition-colors cursor-pointer">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-brand font-bold text-sm text-sevenpreneur-coal dark:text-white">
                        Tonton Recording
                      </h3>
                      <p className="font-bodycopy text-xs text-emphasis">
                        Buka di tab baru
                      </p>
                    </div>
                    <Video className="size-5 text-primary" />
                  </div>
                </a>
              )}

              {/* Feedback */}
              {session.feedback_form && !isUpcoming && (
                <a
                  href={session.feedback_form}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center justify-between bg-card-bg border border-dashboard-border hover:border-primary/40 p-4 rounded-lg transition-colors cursor-pointer">
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-brand font-bold text-sm text-sevenpreneur-coal dark:text-white">
                        Ratings &amp; Feedback
                      </h3>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg
                            key={s}
                            className="size-4"
                            viewBox="0 0 20 20"
                            fill="#FFB21D"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.538 1.118L10 14.347l-3.951 2.678c-.783.57-1.838-.197-1.538-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <ClipboardList className="size-5 text-emphasis" />
                  </div>
                </a>
              )}

              {/* Calendar reminder for upcoming */}
              {isUpcoming && (
                <div className="flex items-center gap-3 px-4 py-3 bg-tertiary/5 border border-tertiary/20 rounded-lg">
                  <CalendarDays className="size-5 text-tertiary shrink-0" />
                  <p className="font-bodycopy text-xs text-emphasis leading-relaxed">
                    Session dijadwalkan{" "}
                    <span className="font-semibold text-sevenpreneur-coal dark:text-white">
                      {dayjs(session.meeting_date).format("D MMMM YYYY, HH:mm")}
                    </span>
                  </p>
                </div>
              )}
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
