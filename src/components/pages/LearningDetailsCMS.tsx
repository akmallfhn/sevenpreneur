"use client";
import AppScorecardDashboard from "@/components/cards/AppScorecardDashboard";
import { SessionMethod } from "@/lib/app-types";
import { extractEmbedPathFromYouTubeURL } from "@/lib/extract-youtube-id";
import { setSessionToken, trpc } from "@/trpc/client";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  CalendarFold,
  CheckCircle,
  ChevronRight,
  PenTool,
  Star,
  TvMinimalPlay,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AppButton from "../buttons/AppButton";
import AvatarBadgeCMS from "../buttons/AvatarBadgeCMS";
import AppVideoPlayer from "../elements/AppVideoPlayer";
import EditLearningFormCMS from "../forms/EditLearningFormCMS";
import UpdateVideoRecordingFormCMS from "../forms/UpdateVideoRecordingForm";
import MaterialListCMS from "../indexes/MaterialListCMS";
import ConferenceItemCMS from "../items/ConferenceItemCMS";
import LocationItemCMS from "../items/LocationItemCMS";
import LearningMethodLabelCMS from "../labels/LearningMethodLabelCMS";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";
import EmptyRecordingCMS from "../states/EmptyRecordingCMS";
import PageContainerCMS from "./PageContainerCMS";

dayjs.extend(localizedFormat);

interface LearningDetailsCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId: number;
  learningId: number;
}

const RATING_DIMENSIONS: {
  key: string;
  label: string;
  section: string;
}[] = [
  { key: "coach_clarity", label: "Kejelasan penjelasan", section: "Coach" },
  { key: "coach_mastery", label: "Penguasaan materi", section: "Coach" },
  { key: "coach_responsiveness", label: "Responsivitas", section: "Coach" },
  {
    key: "coach_engagement",
    label: "Engagement & interaktif",
    section: "Coach",
  },
  { key: "material_relevance", label: "Relevansi materi", section: "Materi" },
  { key: "material_flow", label: "Alur penyampaian", section: "Materi" },
  { key: "material_depth", label: "Kedalaman materi", section: "Materi" },
  {
    key: "learning_value",
    label: "Nilai keseluruhan sesi",
    section: "Keseluruhan",
  },
];

function StarBar({ value }: { value: number | null | undefined }) {
  const v = value ?? 0;
  const pct = (v / 5) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FFB21D] rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bodycopy font-semibold w-7 text-right">
        {v > 0 ? v.toFixed(1) : "—"}
      </span>
    </div>
  );
}

export default function LearningDetailsCMS(props: LearningDetailsCMSProps) {
  const [editLearning, setEditLearning] = useState(false);
  const [updateRecording, setUpdateRecording] = useState(false);

  const allowedRolesUpdateLearning = [0, 2];
  const isAllowedUpdateLearning = allowedRolesUpdateLearning.includes(
    props.sessionUserRole
  );

  useEffect(() => {
    if (props.sessionToken) {
      setSessionToken(props.sessionToken);
    }
  }, [props.sessionToken]);

  const {
    data: learningDetailsData,
    isLoading,
    isError,
  } = trpc.read.learning.useQuery(
    { id: props.learningId },
    { enabled: !!props.sessionToken }
  );

  const { data: statsData, isLoading: isLoadingStats } =
    trpc.read.learningStats.useQuery(
      { learning_id: props.learningId },
      { enabled: !!props.sessionToken }
    );

  const learningVideoKey = (() => {
    const learning = learningDetailsData?.learning;
    if (!learning) return null;
    if (learning.external_video_id) return learning.external_video_id;
    if (learning.recording_url) {
      const extracted = extractEmbedPathFromYouTubeURL(learning.recording_url);
      return extracted || null;
    }
    return null;
  })();

  const sections = ["Coach", "Materi", "Keseluruhan"];
  const avgScores = statsData?.avg_scores;

  return (
    <React.Fragment>
      <PageContainerCMS>
        <div className="container w-full flex flex-col gap-5">
          <div className="header-cms flex flex-col gap-3">
            <AppBreadcrumb>
              <ChevronRight className="size-3.5" />
              <AppBreadcrumbItem href="/cohorts">Cohorts</AppBreadcrumbItem>
              <ChevronRight className="size-3.5" />
              <AppBreadcrumbItem href={`/cohorts/${props.cohortId}`}>
                Details
              </AppBreadcrumbItem>
              <ChevronRight className="size-3.5" />
              <AppBreadcrumbItem isCurrentPage>
                {learningDetailsData?.learning.name}
              </AppBreadcrumbItem>
            </AppBreadcrumb>

            {isLoading && <AppLoadingComponents />}
            {isError && <AppErrorComponents />}

            {!isLoading && !isError && learningDetailsData && (
              <div className="body-learning flex flex-col w-full gap-4">
                {/* Hero */}
                <div className="hero-learning relative flex w-full items-center aspect-leaderboard-banner rounded-lg overflow-hidden">
                  <Image
                    className="hero-background object-cover w-full h-full inset-0 z-0"
                    src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//leaderboard-wallpaper.jpeg"
                    alt="Header Learnings"
                    width={800}
                    height={800}
                  />
                  <div className="learning-attributes absolute flex flex-col max-w-[528px] top-1/2 -translate-y-1/2 left-8 gap-3 z-10">
                    <div className="learning-method flex w-fit">
                      <LearningMethodLabelCMS
                        labelName={learningDetailsData.learning.method || ""}
                        variants={
                          learningDetailsData.learning.method as SessionMethod
                        }
                      />
                    </div>
                    <h1 className="learning-name font-brand font-bold text-2xl text-white">
                      {learningDetailsData.learning.name}
                    </h1>
                    <div className="learning-date flex w-fit gap-2 items-center bg-black/15 text-white rounded-md p-2">
                      <CalendarFold className="size-5" />
                      <p className="flex font-bodycopy font-medium text-sm">
                        {dayjs(
                          learningDetailsData.learning.meeting_date
                        ).format("ddd[,] DD MMM YYYY [-] HH:mm")}
                      </p>
                    </div>
                  </div>
                  {isAllowedUpdateLearning && (
                    <div className="edit-learning absolute flex top-4 right-4 z-10">
                      <AppButton
                        variant="light"
                        size="small"
                        onClick={() => setEditLearning(true)}
                      >
                        <PenTool className="size-4" />
                        Edit Learning Session
                      </AppButton>
                    </div>
                  )}
                </div>

                {/* Stats Scorecards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <AppScorecardDashboard
                    title="Check-in"
                    value={
                      isLoadingStats ? "—" : (statsData?.check_in_count ?? 0)
                    }
                    icon={<UserCheck className="size-4 text-white" />}
                    iconClassName="bg-success"
                  />
                  <AppScorecardDashboard
                    title="Check-out"
                    value={
                      isLoadingStats ? "—" : (statsData?.check_out_count ?? 0)
                    }
                    icon={<UserX className="size-4 text-white" />}
                    iconClassName="bg-primary"
                  />
                  <AppScorecardDashboard
                    title="Feedback Masuk"
                    value={
                      isLoadingStats ? "—" : (statsData?.rating_count ?? 0)
                    }
                    icon={<Star className="size-4 text-white" />}
                    iconClassName="bg-tertiary"
                  />
                  <AppScorecardDashboard
                    title="Avg Rating"
                    value={
                      isLoadingStats
                        ? "—"
                        : statsData?.overall_avg != null
                          ? `${statsData.overall_avg.toFixed(2)} / 5`
                          : "—"
                    }
                    icon={<Star className="size-4 text-white" />}
                    iconClassName="bg-warning"
                  />
                </div>

                {/* Main + Aside */}
                <div className="body-contents flex w-full justify-between gap-4">
                  <main className="flex flex-col flex-2 min-w-0 shrink-0 gap-4">
                    {/* Description */}
                    <div className="learning-description flex flex-col gap-3 p-3 bg-section-background rounded-md">
                      <h2 className="section-name font-brand font-bold text-black">
                        What&apos;s on this sessions?
                      </h2>
                      <p className="font-bodycopy font-medium text-[15px] text-[#333333] bg-white p-3 rounded-md whitespace-pre-line">
                        {learningDetailsData.learning.description}
                      </p>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="rating-breakdown flex flex-col gap-3 p-3 bg-section-background rounded-md">
                      <h2 className="section-name font-brand font-bold text-black">
                        Rating Feedback
                      </h2>
                      {statsData?.rating_count === 0 ? (
                        <p className="text-sm font-bodycopy text-emphasis">
                          Belum ada feedback yang masuk.
                        </p>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {sections.map((section) => {
                            const dims = RATING_DIMENSIONS.filter(
                              (d) => d.section === section
                            );
                            return (
                              <div
                                key={section}
                                className="flex flex-col gap-2"
                              >
                                <p className="text-xs font-bodycopy font-bold uppercase tracking-widest text-emphasis">
                                  {section}
                                </p>
                                <div className="flex flex-col gap-2 bg-white rounded-md p-3">
                                  {dims.map((d) => (
                                    <div
                                      key={d.key}
                                      className="flex items-center gap-3"
                                    >
                                      <span className="text-sm font-bodycopy font-medium w-48 shrink-0 text-[#333333]">
                                        {d.label}
                                      </span>
                                      <div className="flex-1">
                                        <StarBar
                                          value={
                                            avgScores?.[
                                              d.key as keyof typeof avgScores
                                            ] as number | null
                                          }
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Attendee Table */}
                    <div className="attendee-list flex flex-col gap-3 p-3 bg-section-background rounded-md">
                      <h2 className="section-name font-brand font-bold text-black">
                        Daftar Absensi
                      </h2>
                      {!statsData || statsData.attendees.length === 0 ? (
                        <p className="text-sm font-bodycopy text-emphasis">
                          Belum ada peserta yang check-in.
                        </p>
                      ) : (
                        <div className="overflow-x-auto rounded-md">
                          <table className="w-full text-sm font-bodycopy bg-white rounded-md overflow-hidden">
                            <thead>
                              <tr className="border-b text-xs text-emphasis font-semibold uppercase tracking-wider">
                                <th className="text-left px-3 py-2.5">
                                  Peserta
                                </th>
                                <th className="text-left px-3 py-2.5">
                                  Check-in
                                </th>
                                <th className="text-left px-3 py-2.5">
                                  Check-out
                                </th>
                                <th className="text-center px-3 py-2.5">
                                  Feedback
                                </th>
                                <th className="text-center px-3 py-2.5">
                                  Score
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {statsData.attendees.map((a) => (
                                <tr
                                  key={a.user_id}
                                  className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                                >
                                  <td className="px-3 py-2.5">
                                    <div className="flex items-center gap-2">
                                      <Image
                                        src={
                                          a.avatar ||
                                          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                                        }
                                        alt={a.full_name}
                                        width={28}
                                        height={28}
                                        className="rounded-full object-cover size-7 shrink-0"
                                      />
                                      <span className="font-medium text-[#111111]">
                                        {a.full_name}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-3 py-2.5 text-[#333333]">
                                    {a.check_in_at ? (
                                      dayjs(a.check_in_at).format("HH:mm")
                                    ) : (
                                      <span className="text-emphasis">—</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2.5 text-[#333333]">
                                    {a.check_out_at ? (
                                      dayjs(a.check_out_at).format("HH:mm")
                                    ) : (
                                      <span className="text-emphasis">—</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2.5 text-center">
                                    {a.rating ? (
                                      <CheckCircle className="size-4 text-success mx-auto" />
                                    ) : (
                                      <XCircle className="size-4 text-emphasis mx-auto" />
                                    )}
                                  </td>
                                  <td className="px-3 py-2.5 text-center">
                                    {a.rating ? (
                                      <span className="inline-flex items-center gap-1 font-semibold text-[#111111]">
                                        {a.rating.learning_value}
                                        <Star
                                          className="size-3"
                                          fill="#FFB21D"
                                          stroke="#FFB21D"
                                        />
                                      </span>
                                    ) : (
                                      <span className="text-emphasis">—</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </main>

                  <aside className="aside-contents flex flex-col flex-1 min-w-0 gap-4">
                    <div className="learning-educator flex flex-col gap-3 p-3 bg-section-background rounded-md">
                      <h2 className="section-name font-brand font-bold text-black">
                        Lectured by
                      </h2>
                      <AvatarBadgeCMS
                        userName={
                          learningDetailsData.learning.speaker?.full_name ||
                          "Sevenpreneur Educator"
                        }
                        userRole="EDUCATOR"
                        userAvatar={
                          learningDetailsData.learning.speaker?.avatar ||
                          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//default-avatar.svg.png"
                        }
                      />
                    </div>
                    <MaterialListCMS
                      sessionToken={props.sessionToken}
                      sessionUserRole={props.sessionUserRole}
                      learningId={props.learningId}
                    />
                    <div className="learning-location-conference flex flex-col gap-3 p-3 bg-section-background rounded-md">
                      <h2 className="section-name font-brand font-bold text-black">
                        Place and Access
                      </h2>
                      {learningDetailsData.learning.location_name &&
                        learningDetailsData.learning.location_url && (
                          <LocationItemCMS
                            locationName={
                              learningDetailsData.learning.location_name
                            }
                            locationURL={
                              learningDetailsData.learning.location_url
                            }
                          />
                        )}
                      {learningDetailsData.learning.meeting_url && (
                        <ConferenceItemCMS
                          conferenceURL={
                            learningDetailsData.learning.meeting_url || ""
                          }
                        />
                      )}
                    </div>
                    {/* Video Recording */}
                    <div className="video-recording flex flex-col gap-3 p-3 bg-section-background rounded-md">
                      <div className="section-name flex justify-between items-center">
                        <h2 className="font-brand font-bold text-black">
                          Video Recording
                        </h2>
                        {learningVideoKey && isAllowedUpdateLearning && (
                          <AppButton
                            variant="light"
                            size="small"
                            onClick={() => setUpdateRecording(true)}
                          >
                            <TvMinimalPlay className="size-4" />
                            Change Video
                          </AppButton>
                        )}
                      </div>
                      {learningDetailsData.learning.external_video_id &&
                        learningVideoKey && (
                          <div className="relative w-full h-auto aspect-video overflow-hidden rounded-md">
                            <AppVideoPlayer videoId={learningVideoKey} />
                          </div>
                        )}
                      {!learningDetailsData.learning.external_video_id &&
                        learningVideoKey && (
                          <div className="relative w-full aspect-video overflow-hidden rounded-md">
                            <iframe
                              width="100%"
                              height="100%"
                              src={`https://www.youtube.com/embed/${learningVideoKey}&amp;controls=1`}
                              title="YouTube video player"
                              frameBorder="0"
                              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          </div>
                        )}
                      {!learningVideoKey && (
                        <EmptyRecordingCMS
                          actionClick={() => setUpdateRecording(true)}
                          isAllowedUpdateRecording={isAllowedUpdateLearning}
                        />
                      )}
                    </div>
                  </aside>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageContainerCMS>

      {editLearning && (
        <EditLearningFormCMS
          sessionToken={props.sessionToken}
          learningId={props.learningId}
          isOpen={editLearning}
          onClose={() => setEditLearning(false)}
        />
      )}

      {updateRecording && (
        <UpdateVideoRecordingFormCMS
          sessionToken={props.sessionToken}
          learningId={props.learningId}
          isOpen={updateRecording}
          onClose={() => setUpdateRecording(false)}
        />
      )}
    </React.Fragment>
  );
}
