import { STATUS_OK } from "@/lib/status_code";
import { aileneProcedure, administratorProcedure } from "@/trpc/init";
import { numberIsID } from "@/trpc/utils/validation";
import { AiLearnLessonStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import z from "zod";

export const readAilene = {
  session: aileneProcedure
    .input(z.object({ id: numberIsID() }))
    .query(async (opts) => {
      const session = await opts.ctx.prisma.aiLearnSession.findUnique({
        where: { id: opts.input.id },
        include: {
          speaker: { select: { id: true, full_name: true, avatar: true } },
          _count: { select: { attendances: true } },
        },
      });
      if (!session) throw new TRPCError({ code: "NOT_FOUND" });
      return { code: STATUS_OK, message: "Success", session };
    }),

  lesson: administratorProcedure
    .input(z.object({ id: numberIsID() }))
    .query(async (opts) => {
      const lesson = await opts.ctx.prisma.aiLearnLesson.findUnique({
        where: { id: opts.input.id },
        include: {
          quiz_questions: {
            orderBy: [{ order_index: "asc" }],
            include: { options: { orderBy: { order_index: "asc" } } },
          },
          _count: { select: { quiz_questions: true } },
        },
      });
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });
      return { code: STATUS_OK, message: "Success", lesson };
    }),

  lessonForUser: aileneProcedure
    .input(z.object({ id: numberIsID() }))
    .query(async (opts) => {
      const user_id = opts.ctx.user.id;
      const lesson = await opts.ctx.prisma.aiLearnLesson.findUnique({
        where: { id: opts.input.id, status: AiLearnLessonStatus.PUBLISHED },
        include: {
          _count: { select: { quiz_questions: true } },
          progress: {
            where: { member: { user_id } },
            select: { completed_at: true, score: true, xp_earned: true },
          },
        },
      });
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });
      return { code: STATUS_OK, message: "Success", lesson };
    }),

  myProfile: aileneProcedure.query(async (opts) => {
    const user_id = opts.ctx.user.id;
    const member = await opts.ctx.prisma.aiLearnMember.findUnique({
      where: { user_id },
      include: {
        user: {
          select: {
            full_name: true,
            avatar: true,
            email: true,
            role: { select: { name: true } },
          },
        },
        session_attendances: {
          include: {
            session: {
              select: { id: true, name: true, meeting_date: true, method: true },
            },
          },
          orderBy: { session: { meeting_date: "desc" } },
        },
        progress: {
          where: { completed_at: { not: null } },
          include: {
            lesson: {
              select: { id: true, title: true, level: true, xp_reward: true },
            },
          },
          orderBy: { completed_at: "desc" },
        },
      },
    });
    if (!member) throw new TRPCError({ code: "NOT_FOUND" });

    const total_xp = member.progress.reduce((sum, p) => sum + p.xp_earned, 0);
    const completedAttendances = member.session_attendances.filter(
      (a) => a.check_in_at && a.check_out_at
    );
    const sessions_attended = completedAttendances.length;
    const lessons_completed = member.progress.length;
    const scores = member.progress
      .map((p) => p.score)
      .filter((s): s is number => s !== null);
    const avg_score =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : null;

    const firstWeek = dayjs(member.created_at).add(7, "day");
    const badges = [
      {
        id: "fast_learner",
        name: "Fast Learner",
        tagline: "Belajar cepat, maju lebih cepat",
        emoji: "⚡",
        unlocked:
          member.progress.filter((p) =>
            dayjs(p.completed_at).isBefore(firstWeek)
          ).length >= 5,
      },
      {
        id: "session_warrior",
        name: "Session Warrior",
        tagline: "Hadir, bukan sekadar hadir",
        emoji: "🏅",
        unlocked: sessions_attended >= 5,
      },
      {
        id: "quiz_master",
        name: "Quiz Master",
        tagline: "Paham dalam, bukan cuma hafal",
        emoji: "🧠",
        unlocked: scores.length > 0 && avg_score !== null && avg_score >= 90,
      },
      {
        id: "perfect_score",
        name: "Perfect Score",
        tagline: "100 bukan keberuntungan",
        emoji: "🌟",
        unlocked: member.progress.some((p) => p.score === 100),
      },
      {
        id: "xp_hunter",
        name: "XP Hunter",
        tagline: "Poin demi poin membangun segalanya",
        emoji: "🚀",
        unlocked: total_xp >= 500,
      },
      {
        id: "lesson_completer",
        name: "Lesson Completer",
        tagline: "Satu bab selesai, satu langkah maju",
        emoji: "📚",
        unlocked: lessons_completed >= 10,
      },
      {
        id: "all_rounder",
        name: "All-Rounder",
        tagline: "Session hadir, lesson selesai",
        emoji: "🔧",
        unlocked:
          member.session_attendances.filter((a) => a.check_in_at).length >= 3 &&
          lessons_completed >= 5,
      },
    ];

    return {
      code: STATUS_OK,
      message: "Success",
      user: {
        full_name: member.user.full_name,
        avatar: member.user.avatar,
        email: member.user.email,
        role_name: member.user.role.name,
        member_role: member.role_name,
        member_since: member.created_at,
      },
      stats: { total_xp, sessions_attended, lessons_completed, avg_score },
      session_attendances: member.session_attendances,
      lesson_progress: member.progress,
      badges,
    };
  }),
};
