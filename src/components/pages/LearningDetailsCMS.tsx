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
  Clock,
  Lightbulb,
  MessageSquare,
  PenTool,
  Star,
  ThumbsDown,
  ThumbsUp,
  TvMinimalPlay,
  UserCheck,
  UserX,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AppButton from "../buttons/AppButton";
import AvatarBadgeCMS from "../buttons/AvatarBadgeCMS";
import SectionContainerCMS from "../cards/SectionContainerCMS";
import AppVideoPlayer from "../elements/AppVideoPlayer";
import EditLearningFormCMS from "../forms/EditLearningFormCMS";
import UpdateVideoRecordingFormCMS from "../forms/UpdateVideoRecordingForm";
import MaterialListCMS from "../indexes/MaterialListCMS";
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

const RATING_DIMENSIONS_LEFT = [
  { key: "coach_clarity", label: "Kejelasan Penyampaian" },
  { key: "coach_mastery", label: "Penguasaan Materi" },
  { key: "coach_responsiveness", label: "Responsivitas" },
  { key: "coach_engagement", label: "Engagement & Interaktif" },
];

const RATING_DIMENSIONS_RIGHT = [
  { key: "material_relevance", label: "Relevansi Materi" },
  { key: "material_flow", label: "Alur Penyampaian" },
  { key: "material_depth", label: "Kedalaman Materi" },
  { key: "learning_value", label: "Nilai Pembelajaran" },
];

function RatingBar({ value }: { value: number | null | undefined }) {
  const v = value ?? 0;
  const pct = (v / 5) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted-background/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#FFB21D] rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-bodycopy font-semibold w-7 text-right text-foreground">
        {v.toFixed(1)}
      </span>
    </div>
  );
}

function ThemeCard({
  theme,
  badgeClass,
  cardClass,
}: {
  theme: { theme: string; count: number; example_quotes: string[] };
  badgeClass: string;
  cardClass: string;
}) {
  return (
    <div className={`flex flex-col gap-1 p-2.5 rounded-md border ${cardClass}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-bodycopy font-semibold text-foreground capitalize leading-snug">
          {theme.theme}
        </span>
        <span
          className={`text-xs font-bodycopy font-bold px-1.5 py-0.5 rounded-full shrink-0 ${badgeClass}`}
        >
          {theme.count}×
        </span>
      </div>
      {theme.example_quotes[0] && (
        <p className="text-xs font-bodycopy text-emphasis italic line-clamp-2">
          &ldquo;{theme.example_quotes[0]}&rdquo;
        </p>
      )}
    </div>
  );
}

function EmptyTheme() {
  return (
    <p className="text-xs font-bodycopy text-emphasis">
      Tidak ada tema terdeteksi.
    </p>
  );
}

function StarDisplay({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className="size-5"
          fill={value >= i - 0.5 ? "#FFB21D" : "none"}
          stroke="#FFB21D"
        />
      ))}
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
    if (props.sessionToken) setSessionToken(props.sessionToken);
  }, [props.sessionToken]);

  const {
    data: learningDetailsData,
    isLoading: isLoadingLearningDetails,
    isError: isErrorLearningDetails,
  } = trpc.read.learning.useQuery(
    { id: props.learningId },
    { enabled: !!props.sessionToken }
  );

  const {
    data: statsData,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = trpc.read.learningStats.useQuery(
    { learning_id: props.learningId },
    { enabled: !!props.sessionToken }
  );

  const {
    data: feedbackData,
    isLoading: isLoadingFeedback,
    isError: isErrorFeedback,
  } = trpc.read.learningFeedbackAnalysis.useQuery(
    { learning_id: props.learningId },
    { enabled: !!props.sessionToken }
  );

  const isLoading =
    isLoadingLearningDetails || isLoadingStats || isLoadingFeedback;
  const isError = isErrorLearningDetails || isErrorStats || isErrorFeedback;

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

  const avgScores = statsData?.avg_scores;
  const overallAvg = statsData?.overall_avg;
  const checkInCount = statsData?.check_in_count ?? 0;
  const checkOutCount = statsData?.check_out_count ?? 0;
  const ratingCount = statsData?.rating_count ?? 0;
  const registeredCount = statsData?.registered_count ?? 0;

  const funnelSteps = [
    { label: "Terdaftar", count: registeredCount },
    { label: "Check-in", count: checkInCount },
    { label: "Check-out", count: checkOutCount },
    { label: "Feedback", count: ratingCount },
  ];
  const funnelMax = registeredCount > 0 ? registeredCount : checkInCount;

  const FUNNEL_BANDS = [
    { clip: "polygon(0% 0%, 100% 0%, 92% 100%, 8% 100%)", bg: "bg-primary" },
    {
      clip: "polygon(8% 0%, 92% 0%, 84% 100%, 16% 100%)",
      bg: "bg-primary/[.85]",
    },
    {
      clip: "polygon(16% 0%, 84% 0%, 76% 100%, 24% 100%)",
      bg: "bg-primary/[.75]",
    },
    {
      clip: "polygon(24% 0%, 76% 0%, 68% 100%, 32% 100%)",
      bg: "bg-primary/[.65]",
    },
  ];

  return (
    <React.Fragment>
      <PageContainerCMS>
        <div className="container w-full flex flex-col gap-5">
          {/* Breadcrumb */}
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
            <>
              {/* Row 1: Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h1 className="font-bodycopy font-bold text-xl text-foreground line-clamp-2 dark:text-sevenpreneur-white">
                    {learningDetailsData.learning.name}
                  </h1>
                  <div className="flex items-center flex-wrap gap-2.5">
                    <div className="flex items-center gap-1.5 text-sm font-bodycopy font-medium text-emphasis">
                      <CalendarFold className="size-3.5" />
                      {dayjs(learningDetailsData.learning.meeting_date).format(
                        "ddd, DD MMM YYYY"
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bodycopy font-medium text-emphasis">
                      <Clock className="size-3.5" />
                      {dayjs(learningDetailsData.learning.meeting_date).format(
                        "HH:mm"
                      )}{" "}
                      (WIB)
                    </div>
                    <LearningMethodLabelCMS
                      labelName={learningDetailsData.learning.method || ""}
                      variants={
                        learningDetailsData.learning.method as SessionMethod
                      }
                    />
                  </div>
                </div>
                {isAllowedUpdateLearning && (
                  <AppButton
                    variant="primary"
                    size="medium"
                    onClick={() => setEditLearning(true)}
                  >
                    <PenTool className="size-4" />
                    Edit Session
                  </AppButton>
                )}
              </div>

              {/* Row 2: Scorecards */}
              <div className="grid grid-cols-3 gap-3">
                <AppScorecardDashboard
                  title="Check-in"
                  value={isLoadingStats ? "—" : checkInCount}
                  icon={<UserCheck className="size-6 text-white" />}
                  iconClassName="bg-success"
                />
                <AppScorecardDashboard
                  title="Check-out"
                  value={isLoadingStats ? "—" : checkOutCount}
                  icon={<UserX className="size-6 text-white" />}
                  iconClassName="bg-primary"
                />
                <AppScorecardDashboard
                  title="Feedback Masuk"
                  value={isLoadingStats ? "—" : ratingCount}
                  icon={<MessageSquare className="size-6 text-white" />}
                  iconClassName="bg-warning"
                />
              </div>

              {/* Row 3: Rating Overview + Rating by Aspect + Participation Funnel */}
              <div className="grid grid-cols-[1fr_2fr_1.5fr] gap-4">
                <SectionContainerCMS title="Rating Overview">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-brand font-bold text-4xl text-foreground">
                        {overallAvg != null ? overallAvg.toFixed(2) : "0.00"}
                      </span>
                      <span className="font-bodycopy font-medium text-emphasis text-lg">
                        / 5
                      </span>
                    </div>
                    <StarDisplay value={overallAvg ?? 0} />
                    <p className="text-sm font-bodycopy text-emphasis mt-1">
                      Dari {ratingCount} feedback
                    </p>
                  </div>
                </SectionContainerCMS>

                <SectionContainerCMS title="Rating by Aspect">
                  {!isLoadingStats && (
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                      <div className="flex flex-col gap-3">
                        {RATING_DIMENSIONS_LEFT.map((d) => (
                          <div key={d.key} className="flex flex-col gap-1">
                            <span className="text-xs font-bodycopy text-emphasis">
                              {d.label}
                            </span>
                            <RatingBar
                              value={
                                avgScores?.[d.key as keyof typeof avgScores] as
                                  | number
                                  | null
                              }
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col gap-3">
                        {RATING_DIMENSIONS_RIGHT.map((d) => (
                          <div key={d.key} className="flex flex-col gap-1">
                            <span className="text-xs font-bodycopy text-emphasis">
                              {d.label}
                            </span>
                            <RatingBar
                              value={
                                avgScores?.[d.key as keyof typeof avgScores] as
                                  | number
                                  | null
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </SectionContainerCMS>

                <SectionContainerCMS title="Participation Funnel">
                  <div className="flex gap-4 items-center">
                    <div className="flex flex-col w-24 shrink-0">
                      {FUNNEL_BANDS.map((band, i) => (
                        <div
                          key={i}
                          className={`h-10 ${band.bg}`}
                          style={{ clipPath: band.clip }}
                        />
                      ))}
                    </div>
                    <div
                      className="flex flex-col justify-around flex-1"
                      style={{ height: 160 }}
                    >
                      {funnelSteps.map((step) => {
                        const pct =
                          funnelMax > 0 && step.count != null
                            ? Math.round((step.count / funnelMax) * 100)
                            : null;
                        return (
                          <div
                            key={step.label}
                            className="flex items-center justify-between font-bodycopy text-sm"
                          >
                            <span className="text-emphasis font-medium">
                              {step.label}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-foreground">
                                {step.count ?? "—"}
                              </span>
                              {pct !== null && (
                                <span className="text-emphasis text-xs">
                                  {pct}%
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </SectionContainerCMS>
              </div>

              {/* Row 4: Video Recording + Lectured by & Materials */}
              <div className="flex gap-4">
                <SectionContainerCMS
                  title="Video Recording"
                  className="flex-[1.5]"
                  headerAction={
                    learningVideoKey && isAllowedUpdateLearning ? (
                      <AppButton
                        variant="light"
                        size="small"
                        onClick={() => setUpdateRecording(true)}
                      >
                        <TvMinimalPlay className="size-4" />
                        Change Video
                      </AppButton>
                    ) : undefined
                  }
                >
                  {learningDetailsData.learning.external_video_id &&
                    learningVideoKey && (
                      <div className="relative w-full h-auto overflow-hidden rounded-md">
                        <AppVideoPlayer videoId={learningVideoKey} />
                      </div>
                    )}
                  {!learningDetailsData.learning.external_video_id &&
                    learningVideoKey && (
                      <div className="relative w-full aspect-video overflow-hidden rounded-md">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${learningVideoKey}&controls=1`}
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
                </SectionContainerCMS>

                <div className="flex flex-col gap-3 flex-1">
                  <SectionContainerCMS title="Lectured by">
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
                  </SectionContainerCMS>
                  <MaterialListCMS
                    sessionToken={props.sessionToken}
                    sessionUserRole={props.sessionUserRole}
                    learningId={props.learningId}
                  />
                </div>
              </div>

              {/* Row 5: Qualitative Feedback Analysis */}
              <SectionContainerCMS title="Analisis Feedback Kualitatif">
                {isLoadingFeedback ? (
                  <p className="text-sm font-bodycopy text-emphasis">
                    Memuat analisis...
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-success">
                        <div className="flex items-center justify-center size-7 bg-success-background rounded-full">
                          <ThumbsUp className="size-3.5" />
                        </div>
                        <span className="text-sm font-bodycopy font-semibold">
                          Positif
                        </span>
                        <span className="text-xs text-emphasis ml-auto font-bodycopy">
                          {feedbackData?.positive.length ?? 0} tema
                        </span>
                      </div>
                      {feedbackData?.positive.length ? (
                        feedbackData.positive.map((t) => (
                          <ThemeCard
                            key={t.theme}
                            theme={t}
                            badgeClass="bg-success/10 text-success"
                            cardClass="bg-success/5 border-success/20"
                          />
                        ))
                      ) : (
                        <EmptyTheme />
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-destructive">
                        <div className="flex items-center justify-center size-7 bg-destructive-soft-background rounded-full">
                          <ThumbsDown className="size-3.5" />
                        </div>
                        <span className="text-sm font-bodycopy font-semibold">
                          Negatif
                        </span>
                        <span className="text-xs text-emphasis ml-auto font-bodycopy">
                          {feedbackData?.negative.length ?? 0} tema
                        </span>
                      </div>
                      {feedbackData?.negative.length ? (
                        feedbackData.negative.map((t) => (
                          <ThemeCard
                            key={t.theme}
                            theme={t}
                            badgeClass="bg-destructive/10 text-destructive"
                            cardClass="bg-destructive/5 border-destructive/20"
                          />
                        ))
                      ) : (
                        <EmptyTheme />
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-warning">
                        <div className="flex items-center justify-center size-7 bg-warning-background rounded-full">
                          <Lightbulb className="size-3.5" />
                        </div>
                        <span className="text-sm font-bodycopy font-semibold">
                          Netral / Saran
                        </span>
                        <span className="text-xs text-emphasis ml-auto font-bodycopy">
                          {feedbackData?.neutral.length ?? 0} tema
                        </span>
                      </div>
                      {feedbackData?.neutral.length ? (
                        feedbackData.neutral.map((t) => (
                          <ThemeCard
                            key={t.theme}
                            theme={t}
                            badgeClass="bg-warning/10 text-warning"
                            cardClass="bg-warning/5 border-warning/20"
                          />
                        ))
                      ) : (
                        <EmptyTheme />
                      )}
                    </div>
                  </div>
                )}
              </SectionContainerCMS>

              {/* Row 6: Attendance Details */}
              <SectionContainerCMS title="Attendance Details">
                {!statsData || statsData.attendees.length === 0 ? (
                  <p className="text-sm font-bodycopy text-emphasis">
                    Belum ada peserta yang check-in.
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-md border border-dashboard-border">
                    <table className="w-full text-sm font-bodycopy">
                      <thead>
                        <tr className="border-b border-dashboard-border text-xs text-emphasis font-semibold uppercase tracking-wider bg-muted-background/10">
                          <th className="text-left px-3 py-2.5">Peserta</th>
                          <th className="text-left px-3 py-2.5">Check-in</th>
                          <th className="text-left px-3 py-2.5">Check-out</th>
                          <th className="text-center px-3 py-2.5">Feedback</th>
                          <th className="text-center px-3 py-2.5">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statsData.attendees.map((a) => (
                          <tr
                            key={a.user_id}
                            className="border-b border-dashboard-border last:border-0 hover:bg-muted-background/10 transition-colors"
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
                                <span className="font-medium text-foreground">
                                  {a.full_name}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2.5 text-foreground">
                              {a.check_in_at ? (
                                dayjs(a.check_in_at).format("HH:mm")
                              ) : (
                                <span className="text-emphasis">—</span>
                              )}
                            </td>
                            <td className="px-3 py-2.5 text-foreground">
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
                                <span className="inline-flex items-center gap-1 font-semibold text-foreground">
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
              </SectionContainerCMS>
            </>
          )}
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
