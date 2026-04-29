"use client";
import { Progress } from "@/components/ui/progress";
import dayjs from "dayjs";
import { CalendarFold } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AvatarBadgeLMSProps } from "../buttons/AvatarBadgeLMS";
import BottomNavLMS from "../navigations/BottomNavLMS";

export interface UpcomingSessionMobile {
  cohortId: number;
  learningId: number;
  name: string;
  meeting_date: string;
}

export interface MobileCourseSummary {
  id: number;
  name: string;
  image_url: string;
  category: "COHORT" | "PLAYLIST";
  slug_category: "cohorts" | "playlists";
  totalSessions: number;
  attendedSessions: number;
}

interface HomeMobileLMSProps extends AvatarBadgeLMSProps {
  courses: MobileCourseSummary[];
  upcomingSessions: UpcomingSessionMobile[];
  totalAttendanceCount: number;
  totalSessionCount: number;
}

export default function HomeMobileLMS(props: HomeMobileLMSProps) {
  const nickName = props.sessionUserName.split(" ")[0];

  const attendanceRate =
    props.totalSessionCount > 0
      ? Math.round((props.totalAttendanceCount / props.totalSessionCount) * 100)
      : 0;

  return (
    <div className="root-page relative flex flex-col w-full min-h-screen pb-20 lg:hidden">
      {/* Header */}
      <div className="header flex items-center justify-between w-full px-5 pt-12 pb-8 bg-tertiary text-white">
        <div className="greeting flex flex-col gap-0.5">
          <p className="font-bodycopy font-bold text-xl">Hi, {nickName}! 👋</p>
          <p className="font-bodycopy font-medium text-sm text-white/70">
            Let&apos;s drive your business forward
          </p>
        </div>
        <div className="avatar aspect-square size-12 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
          <Image
            src={props.sessionUserAvatar}
            alt={props.sessionUserName}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="content flex flex-col gap-6 p-5">
        {/* Upcoming Sessions */}
        <div className="section flex flex-col gap-3">
          <div className="section-header flex items-center justify-between">
            <h2 className="text-base font-bodycopy font-bold">
              Upcoming Sessions
            </h2>
            <Link
              href="/cohorts"
              className="text-sm text-tertiary font-bodycopy font-semibold"
            >
              See all
            </Link>
          </div>
          {props.upcomingSessions.length > 0 ? (
            <div className="upcoming-list flex flex-col gap-2">
              {props.upcomingSessions.map((session) => (
                <Link
                  key={session.learningId}
                  href={`/cohorts/${session.cohortId}/learnings/${session.learningId}`}
                  className="session-item flex items-center gap-3 p-3 bg-card-bg border border-dashboard-border rounded-lg transition active:scale-95"
                >
                  <div className="date-block flex flex-col items-center justify-center bg-tertiary text-white rounded-md px-3 py-2 shrink-0 min-w-[52px]">
                    <p className="text-[10px] font-bold font-bodycopy uppercase leading-none">
                      {dayjs(session.meeting_date).format("MMM")}
                    </p>
                    <p className="text-2xl font-bold font-bodycopy leading-tight">
                      {dayjs(session.meeting_date).format("D")}
                    </p>
                  </div>
                  <div className="session-info flex flex-col flex-1 min-w-0 gap-0.5">
                    <h3 className="font-bodycopy font-bold text-sm line-clamp-1">
                      {session.name}
                    </h3>
                    <div className="flex items-center gap-1 text-emphasis">
                      <CalendarFold className="size-3 shrink-0" />
                      <p className="text-xs font-bodycopy font-medium">
                        {dayjs(session.meeting_date).format(
                          "ddd, D MMM YYYY · HH:mm"
                        )}{" "}
                        WIB
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-emphasis font-bodycopy font-medium py-2">
              No upcoming sessions
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="section flex flex-col gap-3">
          <h2 className="text-base font-bodycopy font-bold">
            Your Learning Overview
          </h2>
          <div className="stats-grid grid grid-cols-2 gap-3">
            <div className="stat-card flex flex-col gap-1 bg-card-bg p-4 border border-dashboard-border rounded-lg">
              <p className="text-2xl font-bold font-bodycopy text-tertiary">
                {props.courses.length}
              </p>
              <p className="text-sm font-bodycopy font-medium text-emphasis">
                Courses Enrolled
              </p>
            </div>
            <div className="stat-card flex flex-col gap-1 bg-card-bg p-4 border border-dashboard-border rounded-lg">
              <p className="text-2xl font-bold font-bodycopy text-tertiary">
                {props.totalAttendanceCount}
              </p>
              <p className="text-sm font-bodycopy font-medium text-emphasis">
                Sessions Attended
              </p>
            </div>
          </div>
          {props.totalSessionCount > 0 && (
            <div className="attendance-stat flex flex-col gap-2 bg-card-bg p-4 border border-dashboard-border rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bodycopy font-bold">
                  Overall Attendance
                </p>
                <p className="text-sm font-bodycopy font-bold text-tertiary">
                  {attendanceRate}%
                </p>
              </div>
              <Progress value={attendanceRate} />
              <p className="text-xs text-emphasis font-bodycopy">
                {props.totalAttendanceCount} of {props.totalSessionCount}{" "}
                sessions
              </p>
            </div>
          )}
        </div>

        {/* My Learning */}
        <div className="section flex flex-col gap-3">
          <div className="section-header flex items-center justify-between">
            <h2 className="text-base font-bodycopy font-bold">My Learning</h2>
            <Link
              href="/library"
              className="text-sm text-tertiary font-bodycopy font-semibold"
            >
              See all
            </Link>
          </div>
          {props.courses.length > 0 ? (
            <div className="course-list flex flex-col gap-2">
              {props.courses.map((course) => {
                const progressRate =
                  course.category === "COHORT" && course.totalSessions > 0
                    ? Math.round(
                        (course.attendedSessions / course.totalSessions) * 100
                      )
                    : null;
                return (
                  <Link
                    key={course.id}
                    href={`/${course.slug_category}/${course.id}`}
                    className="course-item flex items-center gap-3 p-3 bg-card-bg border border-dashboard-border rounded-lg transition active:scale-95"
                  >
                    <div className="course-image relative flex w-16 aspect-square rounded-md shrink-0 overflow-hidden">
                      <Image
                        src={course.image_url}
                        alt={course.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="course-info flex flex-col flex-1 min-w-0 gap-0.5">
                      <p className="text-[11px] font-bodycopy font-semibold text-tertiary uppercase tracking-wide">
                        {course.category === "COHORT"
                          ? "Bootcamp"
                          : "Video Series"}
                      </p>
                      <h3 className="font-bodycopy font-bold text-sm line-clamp-2">
                        {course.name}
                      </h3>
                      {progressRate !== null && (
                        <div className="progress-section flex flex-col gap-1 mt-1">
                          <Progress value={progressRate} />
                          <p className="text-xs text-emphasis font-bodycopy">
                            {progressRate}% completed
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-emphasis font-bodycopy font-medium py-2">
              No active courses
            </p>
          )}
        </div>
      </div>

      <BottomNavLMS />
    </div>
  );
}
