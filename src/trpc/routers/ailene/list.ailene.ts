import { AiLearnLessonStatus, StatusEnum } from "@/generated/prisma/client";
import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure, aileneProcedure } from "@/trpc/init";
import { numberIsID } from "@/trpc/utils/validation";
import z from "zod";

export const listAilene = {
  sessions: aileneProcedure.query(async (opts) => {
    const sessions = await opts.ctx.prisma.aiLearnSession.findMany({
      include: {
        speaker: { select: { id: true, full_name: true, avatar: true } },
        _count: { select: { attendances: true } },
      },
      orderBy: { meeting_date: "asc" },
    });
    return { code: STATUS_OK, message: "Success", list: sessions };
  }),

  journeys: administratorProcedure.query(async (opts) => {
    const journeys = await opts.ctx.prisma.aiLearnJourney.findMany({
      orderBy: { order_index: "asc" },
    });
    return { code: STATUS_OK, message: "Success", list: journeys };
  }),

  journeysForUser: aileneProcedure.query(async (opts) => {
    const user_id = opts.ctx.user.id;

    const member = await opts.ctx.prisma.aiLearnMember.findUnique({
      where: { user_id },
      select: { role_name: true },
    });

    const roleFilter = member?.role_name;

    const journeys = await opts.ctx.prisma.aiLearnJourney.findMany({
      where: {
        status: StatusEnum.ACTIVE,
        ...(roleFilter
          ? { OR: [{ role: roleFilter }, { role: null }] }
          : { role: null }),
      },
      include: {
        lessons: {
          where: { status: AiLearnLessonStatus.PUBLISHED },
          include: {
            _count: { select: { quiz_questions: true } },
            progress: {
              where: { member: { user_id } },
              select: { completed_at: true, score: true, xp_earned: true },
            },
          },
          orderBy: [{ level: "asc" }, { order_index: "asc" }],
        },
      },
      orderBy: { order_index: "asc" },
    });

    return { code: STATUS_OK, message: "Success", list: journeys };
  }),

  members: administratorProcedure.query(async (opts) => {
    const members = await opts.ctx.prisma.aiLearnMember.findMany({
      include: {
        user: {
          select: { id: true, full_name: true, email: true, avatar: true },
        },
        _count: { select: { progress: true } },
      },
      orderBy: { created_at: "desc" },
    });
    return { code: STATUS_OK, message: "Success", list: members };
  }),

  lessons: aileneProcedure
    .input(
      z.object({
        status: z.enum(AiLearnLessonStatus).optional(),
        level: z.int().min(1).max(4).optional(),
      })
    )
    .query(async (opts) => {
      const isAdmin = opts.ctx.user.role.name === "Administrator";

      const statusFilter = isAdmin
        ? opts.input.status
        : AiLearnLessonStatus.PUBLISHED;

      const lessons = await opts.ctx.prisma.aiLearnLesson.findMany({
        where: {
          status: statusFilter,
          level: opts.input.level,
        },
        include: {
          _count: { select: { quiz_questions: true } },
        },
        orderBy: [
          { level: "asc" },
          { order_index: "asc" },
          { created_at: "asc" },
        ],
      });
      return { code: STATUS_OK, message: "Success", list: lessons };
    }),

  lessonsWithProgress: aileneProcedure.query(async (opts) => {
    const user_id = opts.ctx.user.id;

    const lessons = await opts.ctx.prisma.aiLearnLesson.findMany({
      where: { status: AiLearnLessonStatus.PUBLISHED },
      include: {
        _count: { select: { quiz_questions: true } },
        progress: {
          where: { member: { user_id } },
          select: { completed_at: true, score: true, xp_earned: true },
        },
      },
      orderBy: [{ level: "asc" }, { order_index: "asc" }],
    });

    return { code: STATUS_OK, message: "Success", list: lessons };
  }),

  quizQuestions: administratorProcedure
    .input(z.object({ lesson_id: numberIsID() }))
    .query(async (opts) => {
      const questions = await opts.ctx.prisma.aiLearnQuizQuestion.findMany({
        where: { lesson_id: opts.input.lesson_id },
        include: { options: { orderBy: { order_index: "asc" } } },
        orderBy: [{ order_index: "asc" }],
      });
      return { code: STATUS_OK, message: "Success", list: questions };
    }),

  quizQuestionsForUser: aileneProcedure
    .input(z.object({ lesson_id: numberIsID() }))
    .query(async (opts) => {
      const user_id = opts.ctx.user.id;

      const lesson = await opts.ctx.prisma.aiLearnLesson.findUnique({
        where: {
          id: opts.input.lesson_id,
          status: AiLearnLessonStatus.PUBLISHED,
        },
      });
      if (!lesson) throw new Error("Lesson not found");

      const member = await opts.ctx.prisma.aiLearnMember.findUnique({
        where: { user_id },
      });

      const questions = await opts.ctx.prisma.aiLearnQuizQuestion.findMany({
        where: { lesson_id: opts.input.lesson_id },
        include: { options: { orderBy: { order_index: "asc" } } },
        orderBy: [{ order_index: "asc" }],
      });

      const progress = member
        ? await opts.ctx.prisma.aiLearnUserProgress.findUnique({
            where: {
              member_id_lesson_id: {
                member_id: member.id,
                lesson_id: opts.input.lesson_id,
              },
            },
            select: {
              completed_at: true,
              score: true,
              xp_earned: true,
              answers: true,
            },
          })
        : null;

      return {
        code: STATUS_OK,
        message: "Success",
        list: questions,
        progress,
        is_member: !!member,
      };
    }),

  myProgress: aileneProcedure.query(async (opts) => {
    const user_id = opts.ctx.user.id;
    const member = await opts.ctx.prisma.aiLearnMember.findUnique({
      where: { user_id },
    });
    if (!member) {
      return {
        code: STATUS_OK,
        message: "Success",
        list: [],
        total_xp: 0,
        completed_count: 0,
      };
    }
    const progress = await opts.ctx.prisma.aiLearnUserProgress.findMany({
      where: { member_id: member.id },
      include: {
        lesson: {
          select: { id: true, title: true, level: true, xp_reward: true },
        },
      },
    });
    const totalXp = progress.reduce((sum, p) => sum + p.xp_earned, 0);
    const completed = progress.filter((p) => !!p.completed_at).length;
    return {
      code: STATUS_OK,
      message: "Success",
      list: progress,
      total_xp: totalXp,
      completed_count: completed,
    };
  }),

  leaderboard: aileneProcedure.query(async (opts) => {
    const members = await opts.ctx.prisma.aiLearnMember.findMany({
      select: {
        user: { select: { id: true, full_name: true, avatar: true } },
        progress: {
          select: { xp_earned: true, completed_at: true, score: true },
        },
      },
    });

    const ranked = members
      .map((m) => {
        const prog = m.progress;
        const totalXp = prog.reduce((sum, p) => sum + p.xp_earned, 0);
        const completedCount = prog.filter((p) => !!p.completed_at).length;
        const scores = prog
          .map((p) => p.score)
          .filter((s): s is number => s != null);
        const avgScore =
          scores.length > 0
            ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
            : null;
        return {
          id: m.user.id,
          full_name: m.user.full_name,
          avatar: m.user.avatar,
          totalXp,
          completedCount,
          avgScore,
        };
      })
      .sort((a, b) => b.totalXp - a.totalXp);

    const teamTotalXp = ranked.reduce((sum, u) => sum + u.totalXp, 0);
    const teamTotalCompleted = ranked.reduce(
      (sum, u) => sum + u.completedCount,
      0
    );
    const teamScores = ranked.flatMap((u) =>
      u.avgScore != null ? [u.avgScore] : []
    );
    const teamAvgScore =
      teamScores.length > 0
        ? Math.round(teamScores.reduce((a, b) => a + b, 0) / teamScores.length)
        : null;

    return {
      code: STATUS_OK,
      message: "Success",
      list: ranked,
      teamInsights: {
        memberCount: ranked.length,
        totalXp: teamTotalXp,
        totalCompleted: teamTotalCompleted,
        avgScore: teamAvgScore,
      },
    };
  }),
};
