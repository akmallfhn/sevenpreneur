"use client";
import AppButton from "@/components/buttons/AppButton";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import { trpc } from "@/trpc/client";
import { LearningMethodEnum } from "@prisma/client";
import dayjs from "dayjs";
import "dayjs/locale/id";
import {
  CalendarDays,
  ChevronLeft,
  ClipboardList,
  ExternalLink,
  MapPin,
  Users,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

dayjs.locale("id");

const DEFAULT_AVATAR =
  "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png";

const METHOD_CONFIG: Record<
  LearningMethodEnum,
  { label: string; cls: string }
> = {
  ONLINE: { label: "Online", cls: "bg-primary/10 text-primary" },
  ONSITE: { label: "Onsite", cls: "bg-success-background text-success-foreground" },
  HYBRID: { label: "Hybrid", cls: "bg-warning-background text-warning-foreground" },
};

interface SessionDetailAileneProps {
  sessionId: number;
}

export default function SessionDetailAilene({
  sessionId,
}: SessionDetailAileneProps) {
  const { isCollapsed } = useSidebar();
  const { data, isLoading } = trpc.ailene.readSession.useQuery({ id: sessionId });

  const session = data?.session;
  const now = new Date();
  const isUpcoming = session ? new Date(session.meeting_date) >= now : false;
  const method = session ? METHOD_CONFIG[session.method] : null;

  return (
    <div
      className={`root hidden w-full min-h-screen py-8 overflow-y-auto lg:flex lg:flex-col ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      <div className="container max-w-[880px] mx-auto w-full flex flex-col gap-6">
        {isLoading && <AppLoadingComponents />}

        {!isLoading && session && (
          <>
            {/* Back */}
            <Link
              href="/sessions"
              className="inline-flex items-center gap-1 text-sm text-emphasis font-bodycopy hover:text-sevenpreneur-coal dark:hover:text-white transition-colors w-fit"
            >
              <ChevronLeft className="size-4" />
              Semua Sessions
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {method && (
                  <span
                    className={`text-[11px] font-semibold font-bodycopy px-2.5 py-0.5 rounded-full ${method.cls}`}
                  >
                    {method.label}
                  </span>
                )}
                <span
                  className={`text-[11px] font-semibold font-bodycopy px-2.5 py-0.5 rounded-full ${isUpcoming ? "bg-tertiary/10 text-tertiary" : "bg-sevenpreneur-ash text-emphasis"}`}
                >
                  {isUpcoming ? "Upcoming" : "Selesai"}
                </span>
              </div>
              <h1 className="font-fraunces text-4xl font-medium leading-tight text-sevenpreneur-coal dark:text-white" style={{ letterSpacing: "-0.025em" }}>
                {session.name}
              </h1>
              <p className="font-fraunces text-lg text-emphasis leading-relaxed">
                {session.description}
              </p>
            </div>

            {/* Info strip */}
            <div className="grid grid-cols-3 border-t border-b border-dashboard-border py-5 gap-2">
              {/* Date */}
              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center gap-1 self-start font-bodycopy text-[10px] font-semibold uppercase tracking-widest text-emphasis bg-card-bg border border-dashboard-border px-2 py-0.5 rounded-full">
                  <CalendarDays className="size-2.5" />
                  Tanggal
                </span>
                <span className="font-fraunces text-xl font-medium text-sevenpreneur-coal dark:text-white" style={{ letterSpacing: "-0.02em" }}>
                  {dayjs(session.meeting_date).format("D MMM YYYY")}
                </span>
                <span className="font-bodycopy text-xs text-emphasis">
                  {dayjs(session.meeting_date).format("HH:mm")} WIB
                </span>
              </div>

              {/* Speaker */}
              <div className="flex flex-col gap-2 border-l border-dashboard-border px-4">
                <span className="inline-flex items-center gap-1 self-start font-bodycopy text-[10px] font-semibold uppercase tracking-widest text-emphasis bg-card-bg border border-dashboard-border px-2 py-0.5 rounded-full">
                  Speaker
                </span>
                {session.speaker ? (
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={session.speaker.avatar || DEFAULT_AVATAR}
                        alt={session.speaker.full_name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <span className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal dark:text-white leading-tight">
                      {session.speaker.full_name}
                    </span>
                  </div>
                ) : (
                  <span className="font-bodycopy text-sm text-emphasis">—</span>
                )}
              </div>

              {/* Attendees */}
              <div className="flex flex-col gap-2 border-l border-dashboard-border pl-4">
                <span className="inline-flex items-center gap-1 self-start font-bodycopy text-[10px] font-semibold uppercase tracking-widest text-emphasis bg-card-bg border border-dashboard-border px-2 py-0.5 rounded-full">
                  <Users className="size-2.5" />
                  Hadir
                </span>
                <span className="font-fraunces text-xl font-medium text-sevenpreneur-coal dark:text-white" style={{ letterSpacing: "-0.02em" }}>
                  {session._count.attendances}
                </span>
                <span className="font-bodycopy text-xs text-emphasis">member</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              {session.meeting_url && isUpcoming && (
                <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                  <AppButton variant="primary" size="medium">
                    <Video className="size-4" />
                    Join Session
                  </AppButton>
                </a>
              )}
              {session.recording_url && !isUpcoming && (
                <a href={session.recording_url} target="_blank" rel="noopener noreferrer">
                  <AppButton variant="primary" size="medium">
                    <Video className="size-4" />
                    Tonton Recording
                  </AppButton>
                </a>
              )}
              {session.feedback_form && !isUpcoming && (
                <a href={session.feedback_form} target="_blank" rel="noopener noreferrer">
                  <AppButton variant="light" size="medium">
                    <ClipboardList className="size-4" />
                    Isi Feedback
                  </AppButton>
                </a>
              )}
              {session.location_name && (
                session.location_url ? (
                  <a href={session.location_url} target="_blank" rel="noopener noreferrer">
                    <AppButton variant="light" size="medium">
                      <MapPin className="size-4" />
                      {session.location_name}
                      <ExternalLink className="size-3.5 ml-1" />
                    </AppButton>
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-dashboard-border text-sm font-bodycopy text-emphasis">
                    <MapPin className="size-4" />
                    {session.location_name}
                  </div>
                )
              )}
            </div>

            {/* Detail cards */}
            <div className="flex flex-col gap-3">
              {/* Meeting URL */}
              {session.meeting_url && (
                <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-lg border border-dashboard-border bg-card-bg">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bodycopy text-xs text-emphasis uppercase tracking-widest font-semibold">
                      Link Meeting
                    </span>
                    <span className="font-bodycopy text-sm text-sevenpreneur-coal dark:text-white truncate max-w-[480px]">
                      {session.meeting_url}
                    </span>
                  </div>
                  <a href={session.meeting_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <AppButton variant="light" size="small">
                      <ExternalLink className="size-3.5" />
                      Buka
                    </AppButton>
                  </a>
                </div>
              )}

              {/* Recording */}
              {session.recording_url && (
                <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-lg border border-dashboard-border bg-card-bg">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bodycopy text-xs text-emphasis uppercase tracking-widest font-semibold">
                      Recording
                    </span>
                    <span className="font-bodycopy text-sm text-sevenpreneur-coal dark:text-white truncate max-w-[480px]">
                      {session.recording_url}
                    </span>
                  </div>
                  <a href={session.recording_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <AppButton variant="light" size="small">
                      <ExternalLink className="size-3.5" />
                      Tonton
                    </AppButton>
                  </a>
                </div>
              )}

              {/* Feedback form */}
              {session.feedback_form && (
                <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-lg border border-dashboard-border bg-card-bg">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bodycopy text-xs text-emphasis uppercase tracking-widest font-semibold">
                      Feedback Form
                    </span>
                    <span className="font-bodycopy text-sm text-sevenpreneur-coal dark:text-white truncate max-w-[480px]">
                      {session.feedback_form}
                    </span>
                  </div>
                  <a href={session.feedback_form} target="_blank" rel="noopener noreferrer" className="shrink-0">
                    <AppButton variant="light" size="small">
                      <ExternalLink className="size-3.5" />
                      Isi Form
                    </AppButton>
                  </a>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
