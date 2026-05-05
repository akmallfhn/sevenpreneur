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
  Clock,
  Eye,
  MessageSquare,
  PenTool,
  Star,
  TvMinimalPlay,
  UserCheck,
  Users,
  UserX,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AppButton from "../buttons/AppButton";
import AvatarBadgeCMS from "../buttons/AvatarBadgeCMS";
import SectionContainerCMS from "../cards/SectionContainerCMS";
import ParticipationFunnelCMS from "../charts/ParticipationFunnelCMS";
import RatingDetailsCMS from "../charts/RatingDetailsCMS";
import AppVideoPlayer from "../elements/AppVideoPlayer";
import EditLearningFormCMS from "../forms/EditLearningFormCMS";
import UpdateVideoRecordingFormCMS from "../forms/UpdateVideoRecordingForm";
import FeedbackQualitativeCMS from "../indexes/FeedbackQualitativeCMS";
import MaterialListCMS from "../indexes/MaterialListCMS";
import BooleanLabelCMS from "../labels/BooleanLabelCMS";
import LearningMethodLabelCMS from "../labels/LearningMethodLabelCMS";
import RatingDetailsSheetCMS from "../modals/RatingDetailsCMS";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";
import EmptyRecordingCMS from "../states/EmptyRecordingCMS";
import TableBodyCMS from "../tables/TableBodyCMS";
import TableCellCMS from "../tables/TableCellCMS";
import TableHeaderCMS from "../tables/TableHeaderCMS";
import TableRowCMS from "../tables/TableRowCMS";
import PageContainerCMS from "./PageContainerCMS";

dayjs.extend(localizedFormat);

interface LearningDetailsCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId: number;
  learningId: number;
}

export default function LearningDetailsCMS(props: LearningDetailsCMSProps) {
  const [editLearning, setEditLearning] = useState(false);
  const [updateRecording, setUpdateRecording] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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
  const attendanceCount = statsData?.attendees?.length ?? 0;

  const pct = (count: number, total: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <React.Fragment>
      <PageContainerCMS>
        <div className="container w-full flex flex-col gap-5">
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
              <div className="grid grid-cols-4 gap-3">
                <AppScorecardDashboard
                  title="Attendance"
                  value={isLoadingStats ? "—" : attendanceCount}
                  icon={<Users className="size-6 text-white" />}
                  iconClassName="bg-[#6366f1]"
                >
                  {!isLoadingStats && (
                    <div className="flex flex-col gap-1.5">
                      <div className="h-1 rounded-full overflow-hidden bg-muted-background/20">
                        <div
                          className="h-full bg-[#6366f1] rounded-full"
                          style={{
                            width: `${pct(attendanceCount, registeredCount)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs font-bodycopy text-emphasis">
                        {pct(attendanceCount, registeredCount)}% of{" "}
                        {registeredCount} registered
                      </p>
                    </div>
                  )}
                </AppScorecardDashboard>

                <AppScorecardDashboard
                  title="Check-in"
                  value={isLoadingStats ? "—" : checkInCount}
                  icon={<UserCheck className="size-6 text-white" />}
                  iconClassName="bg-success"
                >
                  {!isLoadingStats && (
                    <div className="flex flex-col gap-1.5">
                      <div className="h-1 rounded-full overflow-hidden bg-muted-background/20">
                        <div
                          className="h-full bg-success rounded-full"
                          style={{
                            width: `${pct(checkInCount, attendanceCount)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs font-bodycopy text-emphasis">
                        {pct(checkInCount, attendanceCount)}% of{" "}
                        {attendanceCount} present
                      </p>
                    </div>
                  )}
                </AppScorecardDashboard>

                <AppScorecardDashboard
                  title="Check-out"
                  value={isLoadingStats ? "—" : checkOutCount}
                  icon={<UserX className="size-6 text-white" />}
                  iconClassName="bg-primary"
                >
                  {!isLoadingStats && (
                    <div className="flex flex-col gap-1.5">
                      <div className="h-1 rounded-full overflow-hidden bg-muted-background/20">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{
                            width: `${pct(checkOutCount, checkInCount)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs font-bodycopy text-emphasis">
                        {pct(checkOutCount, checkInCount)}% of {checkInCount}{" "}
                        checked in
                      </p>
                    </div>
                  )}
                </AppScorecardDashboard>

                <AppScorecardDashboard
                  title="Feedback Masuk"
                  value={isLoadingStats ? "—" : ratingCount}
                  icon={<MessageSquare className="size-6 text-white" />}
                  iconClassName="bg-warning"
                >
                  {!isLoadingStats && (
                    <div className="flex flex-col gap-1.5">
                      <div className="h-1 rounded-full overflow-hidden bg-muted-background/20">
                        <div
                          className="h-full bg-warning rounded-full"
                          style={{
                            width: `${pct(ratingCount, checkInCount)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs font-bodycopy text-emphasis">
                        {pct(ratingCount, checkInCount)}% response rate
                      </p>
                    </div>
                  )}
                </AppScorecardDashboard>
              </div>

              {/* Row 3: Rating Details + Participation Funnel */}
              <div className="grid grid-cols-[1fr_2fr_1.5fr] gap-4">
                <RatingDetailsCMS
                  overallAvg={overallAvg}
                  ratingCount={ratingCount}
                  avgScores={avgScores}
                  isLoading={isLoadingStats}
                />
                <ParticipationFunnelCMS
                  registeredCount={registeredCount}
                  checkInCount={checkInCount}
                  checkOutCount={checkOutCount}
                  ratingCount={ratingCount}
                />
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
              <FeedbackQualitativeCMS
                feedbackData={feedbackData}
                isLoading={isLoadingFeedback}
              />

              {/* Row 6: Attendance Details */}
              <SectionContainerCMS title="Attendance Details">
                {!statsData || statsData.attendees.length === 0 ? (
                  <p className="text-sm font-bodycopy text-emphasis">
                    No attendees have checked in yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-md border border-dashboard-border">
                    <table className="w-full text-sm font-bodycopy">
                      <TableHeaderCMS>
                        <tr>
                          <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
                            Attendee
                          </th>
                          <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
                            Check-in
                          </th>
                          <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
                            Check-out
                          </th>
                          <th className="text-center px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
                            Feedback
                          </th>
                          <th className="text-center px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
                            Score
                          </th>
                          <th className="text-center px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
                            Details
                          </th>
                        </tr>
                      </TableHeaderCMS>
                      <TableBodyCMS>
                        {statsData.attendees.map((a) => (
                          <TableRowCMS
                            key={a.user_id}
                            className="last:border-0"
                          >
                            <TableCellCMS className="px-3 py-2.5">
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
                            </TableCellCMS>
                            <TableCellCMS className="px-3 py-2.5 text-foreground">
                              {a.check_in_at ? (
                                dayjs(a.check_in_at).format("HH:mm")
                              ) : (
                                <span className="text-emphasis">—</span>
                              )}
                            </TableCellCMS>
                            <TableCellCMS className="px-3 py-2.5 text-foreground">
                              {a.check_out_at ? (
                                dayjs(a.check_out_at).format("HH:mm")
                              ) : (
                                <span className="text-emphasis">—</span>
                              )}
                            </TableCellCMS>
                            <TableCellCMS className="px-3 py-2.5 text-center">
                              <BooleanLabelCMS
                                label={a.rating ? "Submitted" : "No Rating"}
                                value={!!a.rating}
                              />
                            </TableCellCMS>
                            <TableCellCMS className="px-3 py-2.5 text-center">
                              {a.rating ? (
                                <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                                  {(
                                    (a.rating.coach_clarity +
                                      a.rating.coach_mastery +
                                      a.rating.coach_responsiveness +
                                      a.rating.coach_engagement +
                                      a.rating.material_relevance +
                                      a.rating.material_flow +
                                      a.rating.material_depth +
                                      a.rating.learning_value) /
                                    8
                                  ).toFixed(2)}
                                  <Star
                                    className="size-3"
                                    fill="#FFB21D"
                                    stroke="#FFB21D"
                                  />
                                </span>
                              ) : (
                                <span className="text-emphasis">—</span>
                              )}
                            </TableCellCMS>
                            <TableCellCMS className="px-3 py-2.5 text-center">
                              {a.rating ? (
                                <AppButton
                                  variant="light"
                                  size="icon"
                                  onClick={() => setSelectedUserId(a.user_id)}
                                >
                                  <Eye className="size-4" />
                                </AppButton>
                              ) : (
                                <span className="text-emphasis">—</span>
                              )}
                            </TableCellCMS>
                          </TableRowCMS>
                        ))}
                      </TableBodyCMS>
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

      {selectedUserId && (
        <RatingDetailsSheetCMS
          sessionToken={props.sessionToken}
          learningId={props.learningId}
          userId={selectedUserId}
          isOpen={true}
          onClose={() => setSelectedUserId(null)}
        />
      )}
    </React.Fragment>
  );
}
