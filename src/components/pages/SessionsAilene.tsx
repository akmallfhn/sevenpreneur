"use client";
import AppButton from "@/components/buttons/AppButton";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { useSidebar } from "@/contexts/SidebarContextCMS";
import { trpc } from "@/trpc/client";
import { LearningMethodEnum, StatusEnum } from "@prisma/client";
import dayjs from "dayjs";
import "dayjs/locale/id";
import {
  CalendarDays,
  ExternalLink,
  MapPin,
  Video,
} from "lucide-react";
import Link from "next/link";

dayjs.locale("id");

const METHOD_BADGE: Record<LearningMethodEnum, { label: string; cls: string }> = {
  ONLINE: { label: "Online", cls: "bg-primary/10 text-primary" },
  ONSITE: { label: "Onsite", cls: "bg-success-background text-success-foreground" },
  HYBRID: { label: "Hybrid", cls: "bg-warning-background text-warning-foreground" },
};

export default function SessionsAilene() {
  const { isCollapsed } = useSidebar();
  const { data, isLoading } = trpc.ailene.listSessions.useQuery();

  const now = new Date();
  const sessions = data?.list ?? [];
  const upcoming = sessions.filter(
    (s) => new Date(s.meeting_date) >= now && s.status === StatusEnum.ACTIVE
  );
  const past = sessions.filter(
    (s) => new Date(s.meeting_date) < now && s.status === StatusEnum.ACTIVE
  );

  const renderCard = (session: (typeof sessions)[number]) => {
    const isUpcoming = new Date(session.meeting_date) >= now;
    const badge = METHOD_BADGE[session.method];

    return (
      <Link key={session.id} href={`/sessions/${session.id}`}>
        <div className="flex items-start gap-4 px-5 py-4 rounded-lg border border-dashboard-border bg-card-bg hover:border-primary/40 transition-colors cursor-pointer">
          <div
            className={`flex items-center justify-center size-11 rounded-lg shrink-0 mt-0.5 ${isUpcoming ? "bg-gradient-to-br from-tertiary/70 to-tertiary" : "bg-sevenpreneur-ash dark:bg-sevenpreneur-smoke"}`}
          >
            <CalendarDays
              className={`size-5 ${isUpcoming ? "text-white" : "text-emphasis"}`}
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bodycopy font-bold text-sm text-sevenpreneur-coal dark:text-white">
                {session.name}
              </span>
              <span
                className={`text-[10px] font-semibold font-bodycopy px-2 py-0.5 rounded-full ${badge.cls}`}
              >
                {badge.label}
              </span>
            </div>
            <p className="font-bodycopy text-xs text-emphasis line-clamp-2">
              {session.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-emphasis font-bodycopy flex-wrap">
              <span>
                {dayjs(session.meeting_date).format("dddd, D MMMM YYYY · HH:mm")}
              </span>
              {session.speaker && <span>🎤 {session.speaker.full_name}</span>}
              {session.location_name && (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {session.location_name}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-center">
            {session.meeting_url && isUpcoming && (
              <AppButton
                variant="tertiary"
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(session.meeting_url!, "_blank");
                }}
              >
                <Video className="size-3.5" />
                Join
              </AppButton>
            )}
            {session.recording_url && !isUpcoming && (
              <AppButton
                variant="light"
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(session.recording_url!, "_blank");
                }}
              >
                <ExternalLink className="size-3.5" />
                Recording
              </AppButton>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div
      className={`root hidden w-full min-h-screen py-8 overflow-y-auto lg:flex lg:flex-col ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
      <div className="container max-w-[calc(100%-4rem)] mx-auto w-full flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
            Sessions
          </h1>
          <p className="font-bodycopy text-sm text-emphasis">
            Jadwal sesi pembelajaran live untuk kamu dan tim.
          </p>
        </div>

        {isLoading && <AppLoadingComponents />}

        {!isLoading && sessions.length === 0 && (
          <p className="text-center text-emphasis font-bodycopy py-16">
            Belum ada session yang dijadwalkan.
          </p>
        )}

        {!isLoading && upcoming.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="font-brand font-semibold text-base text-sevenpreneur-coal dark:text-white">
              Upcoming
            </h2>
            {upcoming.map(renderCard)}
          </div>
        )}

        {!isLoading && past.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="font-brand font-semibold text-base text-sevenpreneur-coal dark:text-white">
              Past Sessions
            </h2>
            {past.slice().reverse().map(renderCard)}
          </div>
        )}
      </div>
    </div>
  );
}
