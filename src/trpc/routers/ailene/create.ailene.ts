import { STATUS_CREATED } from "@/lib/status_code";
import { administratorProcedure, aileneProcedure } from "@/trpc/init";
import { createSlugFromTitle } from "@/trpc/utils/slug";
import {
  numberIsID,
  numberIsNonNegInt,
  numberIsPosInt,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { AiLearnLessonStatus, AiLearnRoleEnum, LearningMethodEnum, StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const createAilene = {
  session: administratorProcedure
    .input(
      z.object({
        name: stringNotBlank(),
        description: stringNotBlank(),
        method: z.enum(LearningMethodEnum),
        meeting_date: z.iso.datetime({ offset: true, local: false }),
        meeting_url: z.string().optional(),
        location_name: z.string().optional(),
        location_url: z.string().optional(),
        speaker_id: z.string().optional(),
        recording_url: z.string().optional(),
        external_video_id: z.string().optional(),
        status: z.enum(StatusEnum).optional(),
        feedback_form: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const session = await opts.ctx.prisma.aiLearnSession.create({
        data: {
          ...opts.input,
          status: opts.input.status ?? StatusEnum.ACTIVE,
          meeting_date: new Date(opts.input.meeting_date),
        },
      });
      return { code: STATUS_CREATED, message: "Success", session };
    }),

  addMemberByEmail: administratorProcedure
    .input(
      z.object({
        email: z.email(),
        role_name: z.enum(AiLearnRoleEnum),
      })
    )
    .mutation(async (opts) => {
      const user = await opts.ctx.prisma.user.findUnique({
        where: { email: opts.input.email },
      });
      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User dengan email ini tidak ditemukan",
        });

      const existing = await opts.ctx.prisma.aiLearnMember.findUnique({
        where: { user_id: user.id },
      });
      if (existing)
        throw new TRPCError({
          code: "CONFLICT",
          message: "User sudah terdaftar sebagai member Ailene",
        });

      const member = await opts.ctx.prisma.aiLearnMember.create({
        data: { user_id: user.id, role_name: opts.input.role_name },
        include: {
          user: { select: { id: true, full_name: true, email: true } },
        },
      });
      return { code: STATUS_CREATED, message: "Success", member };
    }),

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
        youtube_url: z.string().optional(),
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
          youtube_url: opts.input.youtube_url ?? "",
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
          explanation: opts.input.explanation,
          order_index: opts.input.order_index ?? 0,
          options: {
            create: opts.input.options.map((opt, idx) => ({
              option_id: opt.id,
              text: opt.text,
              is_correct: opt.id === opts.input.correct_option,
              order_index: idx,
            })),
          },
        },
        include: { options: { orderBy: { order_index: "asc" } } },
      });
      return { code: STATUS_CREATED, message: "Success", question };
    }),

  submitQuiz: aileneProcedure
    .input(
      z.object({
        lesson_id: numberIsID(),
        score: z.int().min(0).max(100),
        answers: z.record(z.string(), z.string().nullable()),
      })
    )
    .mutation(async (opts) => {
      const { lesson_id, score, answers } = opts.input;
      const user_id = opts.ctx.user.id;
      const PASS_THRESHOLD = 70;

      const member = await opts.ctx.prisma.aiLearnMember.findUnique({ where: { user_id } });
      if (!member) throw new Error("Not an Ailene member");

      const lesson = await opts.ctx.prisma.aiLearnLesson.findUnique({ where: { id: lesson_id } });
      if (!lesson) throw new Error("Lesson not found");

      const existing = await opts.ctx.prisma.aiLearnUserProgress.findUnique({
        where: { member_id_lesson_id: { member_id: member.id, lesson_id } },
      });
      if (existing?.completed_at) throw new Error("Quiz already completed");

      const passed = score >= PASS_THRESHOLD;
      const xpToAward = passed ? lesson.xp_reward : 0;

      await opts.ctx.prisma.aiLearnUserProgress.upsert({
        where: { member_id_lesson_id: { member_id: member.id, lesson_id } },
        create: { member_id: member.id, lesson_id, score, xp_earned: xpToAward, completed_at: new Date(), answers },
        update: { score, xp_earned: xpToAward, completed_at: new Date(), answers, submitted_at: new Date() },
      });

      return { code: STATUS_CREATED, message: "Success", passed, xp_awarded: xpToAward, score };
    }),
};
