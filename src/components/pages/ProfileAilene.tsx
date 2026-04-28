"use client";
import AppLoadingComponents from "@/components/states/AppLoadingComponents";
import { trpc } from "@/trpc/client";
import { AiLearnRoleEnum, LearningMethodEnum } from "@prisma/client";
import dayjs from "dayjs";
import "dayjs/locale/id";
import {
  BookCheck,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  CheckCircle,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AppScorecardDashboard from "../cards/AppScorecardDashboard";
import PageContainerCMS from "./PageContainerCMS";

dayjs.locale("id");

const ROLE_BADGE: Record<AiLearnRoleEnum, { label: string; cls: string }> = {
  MARKETING: { label: "Marketing", cls: "bg-primary/10 text-primary" },
  OPERATIONAL: { label: "Operational", cls: "bg-success-background text-success-foreground" },
  CEO: { label: "CEO", cls: "bg-warning-background text-warning-foreground" },
  FINANCE: { label: "Finance", cls: "bg-tertiary/10 text-tertiary" },
  HR: { label: "HR", cls: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
};

const LEVEL_BADGE: Record<number, { label: string; cls: string }> = {
  1: { label: "Level 1", cls: "bg-primary/10 text-primary" },
  2: { label: "Level 2", cls: "bg-success-background text-success-foreground" },
  3: { label: "Level 3", cls: "bg-warning-background text-warning-foreground" },
  4: { label: "Level 4", cls: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" },
};

const METHOD_BADGE: Record<LearningMethodEnum, { label: string; cls: string }> = {
  ONLINE: { label: "Online", cls: "bg-primary/10 text-primary" },
  ONSITE: { label: "Onsite", cls: "bg-success-background text-success-foreground" },
  HYBRID: { label: "Hybrid", cls: "bg-warning-background text-warning-foreground" },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function ProfileAilene() {
  const { data, isLoading } = trpc.ailene.myProfile.useQuery();

  if (isLoading) {
    return (
      <PageContainerCMS className="overflow-y-auto">
        <AppLoadingComponents />
      </PageContainerCMS>
    );
  }

  if (!data) {
    return (
      <PageContainerCMS className="overflow-y-auto">
        <p className="text-center text-emphasis font-bodycopy py-16">
          Gagal memuat profil. Silakan coba lagi.
        </p>
      </PageContainerCMS>
    );
  }

  const { user, stats, session_attendances, lesson_progress, badges } = data;
  const roleBadge = ROLE_BADGE[user.member_role];

  return (
    <PageContainerCMS className="overflow-y-auto">
      <div className="w-full flex flex-col gap-6 pb-8">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
            Profile
          </h1>
          <p className="font-bodycopy text-sm text-emphasis">
            Ringkasan aktivitas dan pencapaian belajarmu di Ailene.
          </p>
        </div>

        {/* Profile Card */}
        <div className="flex items-center gap-5 px-6 py-5 rounded-lg border border-dashboard-border bg-card-bg">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.full_name}
              width={72}
              height={72}
              className="rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="flex items-center justify-center size-[72px] rounded-full bg-gradient-to-br from-primary/70 to-primary shrink-0">
              <span className="font-brand font-bold text-xl text-white">
                {getInitials(user.full_name)}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <p className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
              {user.full_name}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-semibold font-bodycopy px-2 py-0.5 rounded-full ${roleBadge.cls}`}
              >
                {roleBadge.label}
              </span>
              <span className="font-bodycopy text-xs text-emphasis">
                Bergabung {dayjs(user.member_since).format("D MMMM YYYY")}
              </span>
            </div>
            <p className="font-bodycopy text-xs text-emphasis">{user.email}</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <AppScorecardDashboard
            title="Total XP"
            icon={<Trophy className="size-4 text-white" />}
            iconClassName="bg-gradient-to-br from-tertiary/70 to-tertiary"
            value={
              <>
                {stats.total_xp.toLocaleString()}{" "}
                <span className="font-normal text-emphasis text-sm">XP</span>
              </>
            }
          />
          <AppScorecardDashboard
            title="Sessions Dihadiri"
            icon={<CalendarCheck className="size-4 text-white" />}
            iconClassName="bg-gradient-to-br from-success-foreground/70 to-success-foreground"
            value={stats.sessions_attended}
          />
          <AppScorecardDashboard
            title="Lessons Selesai"
            icon={<BookCheck className="size-4 text-white" />}
            iconClassName="bg-gradient-to-br from-primary/70 to-primary"
            value={stats.lessons_completed}
          />
          <AppScorecardDashboard
            title="Avg Quiz Score"
            icon={<TrendingUp className="size-4 text-white" />}
            iconClassName="bg-gradient-to-br from-warning-foreground/70 to-warning-foreground"
            value={
              stats.avg_score !== null ? (
                <>{stats.avg_score}%</>
              ) : (
                <span className="text-emphasis font-normal text-sm">—</span>
              )
            }
          />
        </div>

        {/* Achievement Badges */}
        <div className="flex flex-col gap-3">
          <h2 className="font-brand font-semibold text-base text-sevenpreneur-coal dark:text-white">
            Achievement Badges
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex items-start gap-3 px-4 py-3 rounded-lg border transition-colors ${
                  badge.unlocked
                    ? "border-dashboard-border bg-card-bg"
                    : "border-dashboard-border bg-card-bg opacity-30 grayscale"
                }`}
              >
                <span className="text-2xl shrink-0 mt-0.5">{badge.emoji}</span>
                <div className="flex flex-col gap-0.5">
                  <p className="font-bodycopy font-bold text-sm text-sevenpreneur-coal dark:text-white">
                    {badge.name}
                  </p>
                  <p className="font-bodycopy text-[11px] text-emphasis leading-snug">
                    {badge.tagline}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Session Report */}
        <div className="flex flex-col gap-3">
          <h2 className="font-brand font-semibold text-base text-sevenpreneur-coal dark:text-white">
            Session Report
          </h2>
          {session_attendances.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 rounded-lg border border-dashboard-border bg-card-bg">
              <CalendarDays className="size-8 text-emphasis opacity-40" />
              <p className="font-bodycopy text-sm text-emphasis">
                Belum ada session yang dihadiri.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-dashboard-border bg-card-bg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dashboard-border bg-sb-item-hover">
                    <th className="text-left px-4 py-3 font-bodycopy font-semibold text-xs text-emphasis">
                      Nama Session
                    </th>
                    <th className="text-left px-4 py-3 font-bodycopy font-semibold text-xs text-emphasis">
                      Tanggal
                    </th>
                    <th className="text-left px-4 py-3 font-bodycopy font-semibold text-xs text-emphasis">
                      Metode
                    </th>
                    <th className="text-center px-4 py-3 font-bodycopy font-semibold text-xs text-emphasis">
                      Check-in
                    </th>
                    <th className="text-center px-4 py-3 font-bodycopy font-semibold text-xs text-emphasis">
                      Check-out
                    </th>
                    <th className="text-left px-4 py-3 font-bodycopy font-semibold text-xs text-emphasis">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {session_attendances.map((att, i) => {
                    const isComplete = att.check_in_at && att.check_out_at;
                    const isPartial = att.check_in_at && !att.check_out_at;
                    const methodBadge = METHOD_BADGE[att.session.method];
                    return (
                      <tr
                        key={att.session.id}
                        className={`border-b border-dashboard-border last:border-0 ${i % 2 === 1 ? "bg-sb-item-hover/40" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/sessions/${att.session.id}`}
                            className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal dark:text-white hover:text-primary transition-colors"
                          >
                            {att.session.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 font-bodycopy text-xs text-emphasis whitespace-nowrap">
                          {dayjs(att.session.meeting_date).format(
                            "dddd, D MMM YYYY · HH:mm"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-semibold font-bodycopy px-2 py-0.5 rounded-full ${methodBadge.cls}`}
                          >
                            {methodBadge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {att.check_in_at ? (
                            <CheckCircle className="size-4 text-success-foreground mx-auto" />
                          ) : (
                            <span className="text-emphasis text-sm">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {att.check_out_at ? (
                            <CheckCircle className="size-4 text-success-foreground mx-auto" />
                          ) : (
                            <span className="text-emphasis text-sm">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isComplete ? (
                            <span className="text-[10px] font-semibold font-bodycopy px-2 py-0.5 rounded-full bg-success-background text-success-foreground">
                              Selesai
                            </span>
                          ) : isPartial ? (
                            <span className="text-[10px] font-semibold font-bodycopy px-2 py-0.5 rounded-full bg-warning-background text-warning-foreground">
                              Sebagian
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold font-bodycopy px-2 py-0.5 rounded-full bg-dashboard-border text-emphasis">
                              Tidak Hadir
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Lesson Report */}
        <div className="flex flex-col gap-3">
          <h2 className="font-brand font-semibold text-base text-sevenpreneur-coal dark:text-white">
            Lesson Report
          </h2>
          {lesson_progress.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 rounded-lg border border-dashboard-border bg-card-bg">
              <BookOpen className="size-8 text-emphasis opacity-40" />
              <p className="font-bodycopy text-sm text-emphasis">
                Belum ada lesson yang diselesaikan.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-dashboard-border bg-card-bg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dashboard-border bg-sb-item-hover">
                    <th className="text-left px-4 py-3 font-bodycopy font-semibold text-xs text-emphasis">
                      Nama Lesson
                    </th>
                    <th className="text-left px-4 py-3 font-bodycopy font-semibold text-xs text-emphasis">
                      Level
                    </th>
                    <th className="text-left px-4 py-3 font-bodycopy font-semibold text-xs text-emphasis">
                      XP Diperoleh
                    </th>
                    <th className="text-left px-4 py-3 font-bodycopy font-semibold text-xs text-emphasis">
                      Score Quiz
                    </th>
                    <th className="text-left px-4 py-3 font-bodycopy font-semibold text-xs text-emphasis">
                      Tanggal Selesai
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lesson_progress.map((prog, i) => {
                    const levelBadge = LEVEL_BADGE[prog.lesson.level] ?? LEVEL_BADGE[1];
                    return (
                      <tr
                        key={prog.lesson.id}
                        className={`border-b border-dashboard-border last:border-0 ${i % 2 === 1 ? "bg-sb-item-hover/40" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/lessons/${prog.lesson.id}`}
                            className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal dark:text-white hover:text-primary transition-colors"
                          >
                            {prog.lesson.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-[10px] font-semibold font-bodycopy px-2 py-0.5 rounded-full ${levelBadge.cls}`}
                          >
                            {levelBadge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bodycopy font-semibold text-sm text-tertiary">
                            +{prog.xp_earned} XP
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {prog.score !== null ? (
                            <span
                              className={`font-bodycopy font-semibold text-sm ${prog.score >= 70 ? "text-success-foreground" : "text-red-500"}`}
                            >
                              {prog.score}%
                            </span>
                          ) : (
                            <span className="text-emphasis text-sm">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-bodycopy text-xs text-emphasis">
                          {prog.completed_at
                            ? dayjs(prog.completed_at).format("D MMM YYYY")
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </PageContainerCMS>
  );
}
