import { STATUS_OK } from "@/lib/status_code";
import { aileneProcedure, administratorProcedure } from "@/trpc/init";
import { numberIsID } from "@/trpc/utils/validation";
import { AiLearnLessonStatus } from "@prisma/client";
import z from "zod";

export const listAilene = {
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
        orderBy: [{ level: "asc" }, { order_index: "asc" }, { created_at: "asc" }],
      });
      return { code: STATUS_OK, message: "Success", list: lessons };
    }),

  lessonsWithProgress: aileneProcedure.query(async (opts) => {
    const user_id = opts.ctx.user.id;

    const lessons = await opts.ctx.prisma.aiLearnLesson.findMany({
      where: { status: AiLearnLessonStatus.PUBLISHED },
      include: {
        _count: { select: { quiz_questions: true } },
        user_progress: {
          where: { user_id },
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
        orderBy: [{ order_index: "asc" }],
      });
      return { code: STATUS_OK, message: "Success", list: questions };
    }),

  quizQuestionsForUser: aileneProcedure
    .input(z.object({ lesson_id: numberIsID() }))
    .query(async (opts) => {
      const lesson = await opts.ctx.prisma.aiLearnLesson.findUnique({
        where: { id: opts.input.lesson_id, status: AiLearnLessonStatus.PUBLISHED },
      });
      if (!lesson) throw new Error("Lesson not found");

      const questions = await opts.ctx.prisma.aiLearnQuizQuestion.findMany({
        where: { lesson_id: opts.input.lesson_id },
        orderBy: [{ order_index: "asc" }],
      });
      return { code: STATUS_OK, message: "Success", list: questions };
    }),

  myProgress: aileneProcedure.query(async (opts) => {
    const user_id = opts.ctx.user.id;
    const progress = await opts.ctx.prisma.aiLearnUserProgress.findMany({
      where: { user_id },
      include: {
        lesson: { select: { id: true, title: true, level: true, xp_reward: true } },
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
};
