"use client";
import { StatusType } from "@/lib/app-types";
import { trpc } from "@/trpc/client";
import { BarChart, PieChart } from "@mui/x-charts";
import dayjs from "dayjs";
import "dayjs/locale/en";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  PenTool,
  Plus,
  Star,
  TrendingUp,
  Upload,
  UserCog,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import AppButton from "../buttons/AppButton";
import SectionContainerCMS from "../containers/SectionContainerCMS";
import CreateLearningFormCMS from "../forms/CreateLearningFormCMS";
import CreateModuleFormCMS from "../forms/CreateModuleFormCMS";
import CreateProjectFormCMS from "../forms/CreateProjectFormCMS";
import EditCohortFormCMS from "../forms/EditCohortFormCMS";
import FileItemCMS from "../items/FileItemCMS";
import LearningSessionItemCMS from "../items/LearningSessionItemCMS";
import ProjectItemCMS from "../items/ProjectItemCMS";
import StatusLabelCMS from "../labels/StatusLabelCMS";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import AppErrorComponents from "../states/AppErrorComponents";
import AppLoadingComponents from "../states/AppLoadingComponents";
import PageContainerCMS from "./PageContainerCMS";
import { useTheme } from "next-themes";

dayjs.extend(localizedFormat);

interface CohortDetailsCMSProps {
  sessionToken: string;
  sessionUserRole: number;
  cohortId: number;
}

function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2.5 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded-md bg-dashboard-border"
          style={{ width: `${[72, 50, 62][i % 3]}%` }}
        />
      ))}
    </div>
  );
}

export default function CohortDetailsCMS(props: CohortDetailsCMSProps) {
  const utils = trpc.useUtils();
  const { resolvedTheme } = useTheme();

  const [editCohort, setEditCohort] = useState(false);
  const [createLearning, setCreateLearning] = useState(false);
  const [createProject, setCreateProject] = useState(false);
  const [createModule, setCreateModule] = useState(false);
  const [showAllSessions, setShowAllSessions] = useState(false);

  const isAllowedUpdate = [0, 2].includes(props.sessionUserRole);
  const isAllowedCreate = [0, 2].includes(props.sessionUserRole);
  const isAllowedManageUser = props.sessionUserRole === 0;

  const {
    data: cohortDetailsData,
    isLoading,
    isError,
  } = trpc.read.cohort.useQuery(
    { id: props.cohortId },
    { enabled: !!props.sessionToken }
  );

  const { data: enrolledUser, isLoading: isLoadingEnrolled } =
    trpc.list.cohortMembers.useQuery(
      { cohort_id: props.cohortId },
      { enabled: !!props.sessionToken }
    );

  const { data: attendanceCount, isLoading: isLoadingAttendance } =
    trpc.list.attendance_counts.useQuery(
      { cohort_id: props.cohortId },
      { enabled: !!props.sessionToken }
    );

  const { data: learningListData, isLoading: isLoadingLearnings } =
    trpc.list.learnings.useQuery(
      { cohort_id: props.cohortId },
      { enabled: !!props.sessionToken }
    );

  const { data: moduleListData, isLoading: isLoadingModules } =
    trpc.list.modules.useQuery(
      { cohort_id: props.cohortId },
      { enabled: !!props.sessionToken }
    );

  const { data: projectListData, isLoading: isLoadingProjects } =
    trpc.list.projects.useQuery(
      { cohort_id: props.cohortId },
      { enabled: !!props.sessionToken }
    );

  const { data: ratingStats, isLoading: isLoadingRating } =
    trpc.read.cohortRatingStats.useQuery(
      { id: props.cohortId },
      { enabled: !!props.sessionToken }
    );

  const cohort = cohortDetailsData?.cohort;

  const enrolledStudents = (enrolledUser?.list ?? []).filter(
    (m) => m.role_id === 3
  );
  const enrolledEducators = (enrolledUser?.list ?? []).filter(
    (m) => m.role_id === 1
  );
  const enrolledManagers = (enrolledUser?.list ?? []).filter(
    (m) => m.role_id === 2
  );

  const now = dayjs();
  const allLearnings = [...(learningListData?.list ?? [])].sort((a, b) =>
    dayjs(a.meeting_date).diff(dayjs(b.meeting_date))
  );
  const pastLearnings = allLearnings.filter((l) =>
    dayjs(l.meeting_date).isBefore(now)
  );
  const pastLearningIds = new Set(pastLearnings.map((l) => l.id));

  const totalStudents = enrolledStudents.length;
  const maxCapacity = 350;
  const studentCapacityPct = Math.min(
    Math.round((totalStudents / maxCapacity) * 100),
    100
  );

  const pastAttendanceCounts = (attendanceCount?.list ?? []).filter((a) =>
    pastLearningIds.has(a.learning_id)
  );
  const avgAttendanceRate =
    pastAttendanceCounts.length > 0 && totalStudents > 0
      ? pastAttendanceCounts.reduce(
          (sum, a) => sum + a.check_in_count / totalStudents,
          0
        ) / pastAttendanceCounts.length
      : 0;

  const totalSessions = cohort?.total_learning_session ?? 0;
  const completionRate =
    totalSessions > 0
      ? Math.round((pastLearnings.length / totalSessions) * 100)
      : 0;

  const durationDays = cohort
    ? dayjs(cohort.end_date).diff(dayjs(cohort.start_date), "day")
    : 0;
  const durationText =
    durationDays >= 7
      ? `${Math.round(durationDays / 7)} Week${Math.round(durationDays / 7) !== 1 ? "s" : ""}`
      : `${durationDays} Day${durationDays !== 1 ? "s" : ""}`;

  const pastSessionsCount = pastLearnings.length;
  const performanceBands = enrolledStudents.reduce(
    (acc, s) => {
      const rate =
        pastSessionsCount > 0
          ? s.attended_learning_count / pastSessionsCount
          : 0;
      if (rate >= 1.0) acc.excellent++;
      else if (rate >= 0.8) acc.good++;
      else if (rate >= 0.6) acc.average++;
      else acc.poor++;
      return acc;
    },
    { excellent: 0, good: 0, average: 0, poor: 0 }
  );

  const sessionsToShow = showAllSessions
    ? allLearnings
    : allLearnings.slice(0, 3);
  const chartData = attendanceCount?.list ?? [];

  return (
    <React.Fragment>
      <PageContainerCMS>
        <div className="container w-full flex flex-col gap-5">
          <AppBreadcrumb>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href="/cohorts">Cohorts</AppBreadcrumbItem>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem isCurrentPage>
              {cohortDetailsData?.cohort.name}
            </AppBreadcrumbItem>
          </AppBreadcrumb>

          {isLoading && <AppLoadingComponents />}
          {isError && <AppErrorComponents />}

          {cohort && !isLoading && !isError && (
            <div className="body-container flex gap-4 items-start">
              {/* ── LEFT / MAIN ── */}
              <main className="main-contents flex flex-col flex-[2] min-w-0 gap-4">
                <div className="relative flex overflow-hidden rounded-2xl bg-gray-950 min-h-[210px]">
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                      className="object-cover w-full h-full opacity-15 scale-110 blur-sm"
                      src={cohort.image}
                      alt={cohort.name}
                      width={1200}
                      height={600}
                      aria-hidden
                    />
                  </div>
                  <div className="absolute inset-0 z-[1] bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent" />

                  <div className="absolute right-0 top-0 bottom-0 w-[42%] z-[1]">
                    <Image
                      className="object-cover w-full h-full"
                      src={cohort.image}
                      alt={cohort.name}
                      width={800}
                      height={600}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/30 to-transparent" />
                  </div>

                  <div className="relative z-[2] flex flex-col justify-between p-6 w-[62%] gap-4 min-h-[210px]">
                    <StatusLabelCMS variants={cohort.status as StatusType} />
                    <div className="flex flex-col gap-2">
                      <h1 className="font-bodycopy font-bold text-[22px] text-white leading-snug line-clamp-2">
                        {cohort.name}
                      </h1>
                      <div className="flex items-center gap-2 text-white/55 text-[13px] font-bodycopy">
                        <CalendarDays className="size-3.5 shrink-0" />
                        <span>
                          {dayjs(cohort.start_date).format("D MMM YYYY")} –{" "}
                          {dayjs(cohort.end_date).format("D MMM YYYY")}
                        </span>
                      </div>
                      {cohort.description && (
                        <p className="text-white/45 text-[12px] font-bodycopy line-clamp-2 leading-relaxed">
                          {cohort.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {isAllowedUpdate && (
                    <div className="absolute top-4 right-4 z-[3]">
                      <AppButton
                        variant="dark"
                        size="small"
                        onClick={() => setEditCohort(true)}
                      >
                        <PenTool className="size-3.5" />
                        Edit
                      </AppButton>
                    </div>
                  )}
                </div>

                {/* STATS — individual cards, no outer section */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="flex flex-col gap-2.5 p-3.5 rounded-xl border bg-card-bg border-dashboard-border">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center size-8 rounded-lg bg-primary/10">
                        <Users className="size-4 text-primary" />
                      </div>
                      <p className="text-[11px] font-semibold text-emphasis font-bodycopy leading-tight">
                        Total Students
                      </p>
                    </div>
                    <p className="font-bodycopy font-bold text-2xl leading-none">
                      {totalStudents}
                    </p>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] text-emphasis font-bodycopy">
                        <span>of {maxCapacity} max</span>
                        <span>{studentCapacityPct}%</span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-outline">
                        <div
                          className="h-full rounded-full bg-primary/100 transition-all"
                          style={{ width: `${studentCapacityPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5 p-3.5 rounded-xl border bg-card-bg border-dashboard-border">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center size-8 rounded-lg bg-success/10">
                        <TrendingUp className="size-4 text-success-foreground" />
                      </div>
                      <p className="text-[11px] font-semibold text-emphasis font-bodycopy leading-tight">
                        Attendance Rate
                      </p>
                    </div>
                    <p className="font-bodycopy font-bold text-2xl leading-none">
                      {Math.round(avgAttendanceRate * 100)}%
                    </p>
                    <p className="text-[10px] text-emphasis font-bodycopy">
                      Avg. over {pastLearnings.length} session
                      {pastLearnings.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 p-3.5 rounded-xl border bg-card-bg border-dashboard-border">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center size-8 rounded-lg bg-warning/10">
                        <BookOpen className="size-4 text-warning" />
                      </div>
                      <p className="text-[11px] font-semibold text-emphasis font-bodycopy leading-tight">
                        Completion Rate
                      </p>
                    </div>
                    <p className="font-bodycopy font-bold text-2xl leading-none">
                      {completionRate}%
                    </p>
                    <p className="text-[10px] text-emphasis font-bodycopy">
                      Session {pastLearnings.length}/{totalSessions}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 p-3.5 rounded-xl border bg-card-bg border-dashboard-border">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center size-8 rounded-lg bg-warning/10">
                        <Star className="size-4 text-warning" />
                      </div>
                      <p className="text-[11px] font-semibold text-emphasis font-bodycopy leading-tight">
                        Avg. Rating
                      </p>
                    </div>
                    {isLoadingRating ? (
                      <div className="h-3 w-10 rounded-md bg-dashboard-border animate-pulse" />
                    ) : (
                      <p className="font-bodycopy font-bold text-2xl leading-none">
                        {ratingStats?.overall_avg != null ? (
                          <>
                            {ratingStats.overall_avg.toFixed(1)}
                            <span className="text-sm font-medium text-emphasis">
                              /5
                            </span>
                          </>
                        ) : (
                          "—"
                        )}
                      </p>
                    )}
                    <p className="text-[10px] text-emphasis font-bodycopy">
                      {isLoadingRating
                        ? "Loading..."
                        : ratingStats?.rating_count
                          ? `${ratingStats.rating_count} responses`
                          : "No ratings yet"}
                    </p>
                  </div>
                </div>

                {/* ATTENDANCE CHART */}
                <SectionContainerCMS
                  title="Participants Attendance"
                  headerAction={
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5 text-[11px] font-bodycopy text-emphasis">
                        <span className="inline-block size-2 rounded-sm bg-primary" />
                        Check-in
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-bodycopy text-emphasis">
                        <span className="inline-block size-2 rounded-sm bg-secondary" />
                        No Attendance
                      </span>
                    </div>
                  }
                >
                  {isLoadingAttendance ? (
                    <SectionSkeleton rows={4} />
                  ) : (
                    <div className="bg-card-inside-bg rounded-lg overflow-hidden">
                      {chartData.length > 0 ? (
                        <BarChart
                          height={240}
                          series={[
                            {
                              data: chartData.map((a) => a.check_in_count),
                              label: "Check-in",
                              color: "#0165fc",
                              stack: "total",
                            },
                            {
                              data: chartData.map((a) => a.has_no_attendance),
                              label: "No Attendance",
                              color: "#e74d79",
                              stack: "total",
                            },
                          ]}
                          xAxis={[
                            {
                              data: chartData.map((_, i) => `S${i + 1}`),
                              scaleType: "band",
                              tickLabelStyle: { fontSize: 10 },
                            },
                          ]}
                          yAxis={[{ tickLabelStyle: { fontSize: 10 } }]}
                          slots={{ legend: () => null }}
                          margin={{ top: 10, right: 16, bottom: 28, left: 36 }}
                          sx={{
                            "& .MuiChartsAxis-tickLabel": {
                              fill: "var(--color-foreground)",
                            },
                            "& .MuiChartsAxis-line": {
                              stroke: "var(--color-border)",
                            },
                            "& .MuiChartsAxis-tick": {
                              stroke: "var(--color-border)",
                            },
                            "& .MuiChartsGrid-line": {
                              stroke: "var(--color-border)",
                            },
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-[240px] text-sm text-emphasis font-bodycopy">
                          No session data yet
                        </div>
                      )}
                    </div>
                  )}
                </SectionContainerCMS>

                {/* LEARNING SESSIONS */}
                <SectionContainerCMS
                  title="Learning Sessions"
                  headerAction={
                    isAllowedCreate ? (
                      <AppButton
                        variant={resolvedTheme === "dark" ? "dark" : "light"}
                        size="small"
                        onClick={() => setCreateLearning(true)}
                      >
                        <Plus className="size-3.5" />
                        Add Session
                      </AppButton>
                    ) : undefined
                  }
                >
                  {isLoadingLearnings ? (
                    <SectionSkeleton rows={3} />
                  ) : allLearnings.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {sessionsToShow.map((post) => (
                        <LearningSessionItemCMS
                          key={post.id}
                          sessionToken={props.sessionToken}
                          sessionUserRole={props.sessionUserRole}
                          cohortId={props.cohortId}
                          learningSessionId={post.id}
                          learningSessionName={post.name}
                          learningSessionEducatorName={
                            post.speaker?.full_name || "Sevenpreneur Educator"
                          }
                          learningSessionEducatorAvatar={
                            post.speaker?.avatar ||
                            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/default-avatar.svg.png"
                          }
                          learningSessionMethod={post.method}
                          learningSessionDate={post.meeting_date}
                          learningSessionPlace={
                            post.location_name || "To Be Announced"
                          }
                          onDeleteSuccess={() =>
                            utils.list.learnings.invalidate()
                          }
                        />
                      ))}

                      {allLearnings.length > 3 && (
                        <button
                          className="flex items-center justify-center gap-1.5 w-full py-2 text-sm font-bodycopy font-medium text-emphasis hover:text-foreground hover:bg-card-inside-bg rounded-lg transition"
                          onClick={() => setShowAllSessions((p) => !p)}
                        >
                          {showAllSessions ? (
                            <>
                              <ChevronUp className="size-4" />
                              Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="size-4" />
                              Show all {allLearnings.length} sessions
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-center text-emphasis font-bodycopy py-4">
                      No sessions yet
                    </p>
                  )}
                </SectionContainerCMS>
              </main>

              {/* ── RIGHT / ASIDE ── */}
              <aside className="flex flex-col w-[280px] min-w-[260px] max-w-[300px] shrink-0 gap-4">
                {/* QUICK ACTIONS */}
                {(isAllowedCreate || isAllowedManageUser) && (
                  <SectionContainerCMS title="Quick Actions">
                    <div className="flex flex-col gap-2">
                      {isAllowedManageUser && (
                        <Link
                          href={`/cohorts/${props.cohortId}/members`}
                          className="flex items-center gap-3 p-3 bg-card-bg rounded-lg border border-dashboard-border hover:bg-card-inside-bg/50 transition"
                        >
                          <div className="flex items-center justify-center size-9 rounded-lg bg-tertiary/10 shrink-0">
                            <UserCog className="size-4 text-tertiary" />
                          </div>
                          <div className="flex flex-col gap-0.5 min-w-0">
                            <p className="text-sm font-bodycopy font-semibold leading-tight">
                              Manage Access
                            </p>
                            <p className="text-xs font-bodycopy text-emphasis leading-tight">
                              Atur akses instructor & student
                            </p>
                          </div>
                        </Link>
                      )}

                      <button
                        onClick={() => setCreateLearning(true)}
                        className="flex items-center gap-3 p-3 bg-card-bg rounded-lg border border-dashboard-border hover:bg-card-inside-bg/50 transition text-left"
                      >
                        <div className="flex items-center justify-center size-9 rounded-lg bg-primary/10 shrink-0">
                          <BookOpen className="size-4 text-primary" />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <p className="text-sm font-bodycopy font-semibold leading-tight">
                            Add Learning Session
                          </p>
                          <p className="text-xs font-bodycopy text-emphasis leading-tight">
                            Buat sesi pembelajaran baru
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => setCreateProject(true)}
                        className="flex items-center gap-3 p-3 bg-card-bg rounded-lg border border-dashboard-border hover:bg-card-inside-bg/50 transition text-left"
                      >
                        <div className="flex items-center justify-center size-9 rounded-lg bg-secondary/10 shrink-0">
                          <ClipboardList className="size-4 text-secondary" />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <p className="text-sm font-bodycopy font-semibold leading-tight">
                            Add Project / Assignment
                          </p>
                          <p className="text-xs font-bodycopy text-emphasis leading-tight">
                            Buat project atau tugas baru
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => setCreateModule(true)}
                        className="flex items-center gap-3 p-3 bg-card-bg rounded-lg border border-dashboard-border hover:bg-card-inside-bg/50 transition text-left"
                      >
                        <div className="flex items-center justify-center size-9 rounded-lg bg-success/10 shrink-0">
                          <Upload className="size-4 text-success-foreground" />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <p className="text-sm font-bodycopy font-semibold leading-tight">
                            Upload Module
                          </p>
                          <p className="text-xs font-bodycopy text-emphasis leading-tight">
                            Tambah materi atau file baru
                          </p>
                        </div>
                      </button>
                    </div>
                  </SectionContainerCMS>
                )}

                {/* COHORT INFO */}
                <SectionContainerCMS title="Cohort Info">
                  <div className="flex flex-col divide-y divide-dashboard-border">
                    {[
                      { label: "Program", value: cohort.name },
                      {
                        label: "Kickoff Date",
                        value: dayjs(cohort.start_date).format("D MMM YYYY"),
                      },
                      {
                        label: "Finish Date",
                        value: dayjs(cohort.end_date).format("D MMM YYYY"),
                      },
                      { label: "Duration", value: durationText },
                      {
                        label: "Status",
                        value: (
                          <StatusLabelCMS
                            variants={cohort.status as StatusType}
                          />
                        ),
                      },
                      {
                        label: "Total Sessions",
                        value: `${totalSessions} sessions`,
                      },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="flex items-center justify-between gap-3 py-2.5"
                      >
                        <p className="text-xs font-bodycopy text-emphasis font-medium shrink-0">
                          {label}
                        </p>
                        <div className="text-xs font-bodycopy font-semibold text-right">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionContainerCMS>

                {/* ENROLLED OVERVIEW */}
                <SectionContainerCMS title="Enrolled Overview">
                  {isLoadingEnrolled ? (
                    <SectionSkeleton rows={3} />
                  ) : (
                    <div className="flex flex-col gap-2">
                      {[
                        {
                          label: "Students",
                          count: enrolledStudents.length,
                          color: "bg-orange-400",
                        },
                        {
                          label: "Educators",
                          count: enrolledEducators.length,
                          color: "bg-emerald-400",
                        },
                        {
                          label: "Class Managers",
                          count: enrolledManagers.length,
                          color: "bg-violet-400",
                        },
                      ].map(({ label, count, color }) => (
                        <div
                          key={label}
                          className="flex items-center justify-between p-2.5 bg-card-inside-bg rounded-lg border border-dashboard-border"
                        >
                          <div className="flex items-center gap-2">
                            <div className={`size-2.5 rounded-full ${color}`} />
                            <p className="text-sm font-bodycopy font-medium">
                              {label}
                            </p>
                          </div>
                          <p className="font-bodycopy font-bold text-sm">
                            {count}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionContainerCMS>

                {/* PERFORMANCE SNAPSHOT */}
                <SectionContainerCMS title="Performance Snapshot">
                  {isLoadingEnrolled || isLoadingLearnings ? (
                    <SectionSkeleton rows={3} />
                  ) : pastSessionsCount > 0 && totalStudents > 0 ? (
                    <>
                      <div className="bg-card-inside-bg rounded-lg overflow-hidden">
                        <PieChart
                          series={[
                            {
                              data: [
                                {
                                  id: 0,
                                  value: performanceBands.excellent,
                                  label: "Excellent",
                                  color: "#22c55e",
                                },
                                {
                                  id: 1,
                                  value: performanceBands.good,
                                  label: "Good",
                                  color: "#60a5fa",
                                },
                                {
                                  id: 2,
                                  value: performanceBands.average,
                                  label: "Average",
                                  color: "#fbbf24",
                                },
                                {
                                  id: 3,
                                  value: performanceBands.poor,
                                  label: "Poor",
                                  color: "#f87171",
                                },
                              ].filter((d) => d.value > 0),
                              innerRadius: 42,
                              outerRadius: 68,
                              paddingAngle: 2,
                              cornerRadius: 3,
                            },
                          ]}
                          height={160}
                          slots={{ legend: () => null }}
                          margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                          sx={{
                            "& .MuiPieArc-root": {
                              stroke: "var(--color-card-inside-bg)",
                              strokeWidth: 2,
                            },
                          }}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {[
                          {
                            label: "Excellent (100%)",
                            value: performanceBands.excellent,
                            color: "bg-green-500",
                          },
                          {
                            label: "Good (≥80%)",
                            value: performanceBands.good,
                            color: "bg-blue-400",
                          },
                          {
                            label: "Average (≥60%)",
                            value: performanceBands.average,
                            color: "bg-amber-400",
                          },
                          {
                            label: "Poor (<60%)",
                            value: performanceBands.poor,
                            color: "bg-red-400",
                          },
                        ].map(({ label, value, color }) => (
                          <div
                            key={label}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <div className={`size-2 rounded-full ${color}`} />
                              <p className="text-xs font-bodycopy text-emphasis">
                                {label}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <p className="text-xs font-bodycopy font-bold">
                                {value}
                              </p>
                              {totalStudents > 0 && (
                                <p className="text-[10px] text-emphasis font-bodycopy">
                                  ({Math.round((value / totalStudents) * 100)}
                                  %)
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-emphasis font-bodycopy text-center py-3">
                      No sessions have run yet
                    </p>
                  )}
                </SectionContainerCMS>

                {/* MODULES */}
                <SectionContainerCMS
                  title="Modules"
                  headerAction={
                    isAllowedCreate ? (
                      <AppButton
                        variant={resolvedTheme === "dark" ? "dark" : "light"}
                        size="small"
                        onClick={() => setCreateModule(true)}
                      >
                        <Plus className="size-3.5" />
                        Add
                      </AppButton>
                    ) : undefined
                  }
                >
                  {isLoadingModules ? (
                    <SectionSkeleton rows={3} />
                  ) : (moduleListData?.list ?? []).length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {moduleListData?.list.map((post) => (
                        <FileItemCMS
                          key={post.id}
                          sessionToken={props.sessionToken}
                          sessionUserRole={props.sessionUserRole}
                          cohortId={props.cohortId}
                          fileId={post.id}
                          fileName={post.name}
                          fileURL={post.document_url}
                          onDeleteSuccess={() =>
                            utils.list.modules.invalidate()
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-center text-emphasis font-bodycopy py-2">
                      No modules yet
                    </p>
                  )}
                </SectionContainerCMS>

                {/* PROJECTS */}
                <SectionContainerCMS
                  title="Projects"
                  headerAction={
                    isAllowedCreate ? (
                      <AppButton
                        variant={resolvedTheme === "dark" ? "dark" : "light"}
                        size="small"
                        onClick={() => setCreateProject(true)}
                      >
                        <Plus className="size-3.5" />
                        Add
                      </AppButton>
                    ) : undefined
                  }
                >
                  {isLoadingProjects ? (
                    <SectionSkeleton rows={3} />
                  ) : (projectListData?.list ?? []).length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {projectListData?.list.map((post) => (
                        <ProjectItemCMS
                          key={post.id}
                          sessionUserRole={props.sessionUserRole}
                          cohortId={props.cohortId}
                          projectId={post.id}
                          projectName={post.name}
                          lastSubmission={post.deadline_at}
                          submissionPercentage={post.submission_percentage}
                          onDeleteSuccess={() =>
                            utils.list.projects.invalidate()
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-[13px] text-center text-emphasis font-bodycopy py-2">
                      No projects yet
                    </p>
                  )}
                </SectionContainerCMS>
              </aside>
            </div>
          )}
        </div>
      </PageContainerCMS>

      {/* ── FORMS ── */}
      {editCohort && (
        <EditCohortFormCMS
          sessionToken={props.sessionToken}
          cohortId={props.cohortId}
          isOpen={editCohort}
          onClose={() => setEditCohort(false)}
        />
      )}
      {createLearning && (
        <CreateLearningFormCMS
          sessionToken={props.sessionToken}
          cohortId={props.cohortId}
          isOpen={createLearning}
          onClose={() => {
            setCreateLearning(false);
            utils.list.learnings.invalidate();
          }}
        />
      )}
      {createProject && (
        <CreateProjectFormCMS
          cohortId={props.cohortId}
          isOpen={createProject}
          onClose={() => {
            setCreateProject(false);
            utils.list.projects.invalidate();
          }}
        />
      )}
      {createModule && (
        <CreateModuleFormCMS
          cohortId={props.cohortId}
          isOpen={createModule}
          onClose={() => {
            setCreateModule(false);
            utils.list.modules.invalidate();
          }}
        />
      )}
    </React.Fragment>
  );
}
