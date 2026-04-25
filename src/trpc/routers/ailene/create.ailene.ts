import { STATUS_CREATED } from "@/lib/status_code";
import { administratorProcedure, aileneProcedure } from "@/trpc/init";
import { createSlugFromTitle } from "@/trpc/utils/slug";
import {
  numberIsID,
  numberIsNonNegInt,
  numberIsPosInt,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { AiLearnLessonStatus } from "@prisma/client";
import z from "zod";

export const createAilene = {
  lesson: administratorProcedure
    .input(
      z.object({
        title: stringNotBlank(),
        description: z.string().optional(),
        content: z.string(),
        level: z.int().min(1).max(4),
        xp_reward: numberIsPosInt(),
        status: z.enum(AiLearnLessonStatus),
        order_index: numberIsNonNegInt().optional(),
        slug: stringNotBlank().optional(),
      })
    )
    .mutation(async (opts) => {
      const slug = opts.input.slug ?? createSlugFromTitle(opts.input.title);
      const lesson = await opts.ctx.prisma.aiLearnLesson.create({
        data: {
          title: opts.input.title,
          slug,
          description: opts.input.description,
          content: opts.input.content,
          level: opts.input.level,
          xp_reward: opts.input.xp_reward,
          status: opts.input.status,
          order_index: opts.input.order_index ?? 0,
        },
      });
      return { code: STATUS_CREATED, message: "Success", lesson };
    }),

  quizQuestion: administratorProcedure
    .input(
      z.object({
        lesson_id: numberIsID(),
        question: stringNotBlank(),
        options: z
          .array(z.object({ id: stringNotBlank(), text: stringNotBlank() }))
          .min(2),
        correct_option: stringNotBlank(),
        explanation: z.string().optional(),
        order_index: numberIsNonNegInt().optional(),
      })
    )
    .mutation(async (opts) => {
      const question = await opts.ctx.prisma.aiLearnQuizQuestion.create({
        data: {
          lesson_id: opts.input.lesson_id,
          question: opts.input.question,
          options: opts.input.options,
          correct_option: opts.input.correct_option,
          explanation: opts.input.explanation,
          order_index: opts.input.order_index ?? 0,
        },
      });
      return { code: STATUS_CREATED, message: "Success", question };
    }),

  submitQuiz: aileneProcedure
    .input(
      z.object({
        lesson_id: numberIsID(),
        score: z.int().min(0).max(100),
      })
    )
    .mutation(async (opts) => {
      const { lesson_id, score } = opts.input;
      const user_id = opts.ctx.user.id;
      const PASS_THRESHOLD = 70;

      const lesson = await opts.ctx.prisma.aiLearnLesson.findUnique({
        where: { id: lesson_id },
      });
      if (!lesson) throw new Error("Lesson not found");

      const existing = await opts.ctx.prisma.aiLearnUserProgress.findUnique({
        where: { user_id_lesson_id: { user_id, lesson_id } },
      });

      const passed = score >= PASS_THRESHOLD;
      const alreadyCompleted = !!existing?.completed_at;
      const xpToAward = passed && !alreadyCompleted ? lesson.xp_reward : 0;

      await opts.ctx.prisma.aiLearnUserProgress.upsert({
        where: { user_id_lesson_id: { user_id, lesson_id } },
        create: {
          user_id,
          lesson_id,
          score,
          xp_earned: xpToAward,
          attempts: 1,
          last_attempt_at: new Date(),
          completed_at: passed ? new Date() : null,
        },
        update: {
          score: existing?.score ? Math.max(existing.score, score) : score,
          xp_earned: { increment: xpToAward },
          attempts: { increment: 1 },
          last_attempt_at: new Date(),
          completed_at: passed && !alreadyCompleted ? new Date() : existing?.completed_at,
        },
      });

      return {
        code: STATUS_CREATED,
        message: "Success",
        passed,
        xp_awarded: xpToAward,
        score,
      };
    }),
};
