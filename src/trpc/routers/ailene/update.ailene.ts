import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { numberIsID, numberIsNonNegInt, numberIsPosInt, stringNotBlank } from "@/trpc/utils/validation";
import { AiLearnLessonStatus, AiLearnRoleEnum, LearningMethodEnum, StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const updateAilene = {
  session: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        name: stringNotBlank().optional(),
        description: stringNotBlank().optional(),
        method: z.enum(LearningMethodEnum).optional(),
        meeting_date: z.iso.datetime({ offset: true, local: false }).optional(),
        meeting_url: z.string().optional(),
        location_name: z.string().optional(),
        location_url: z.string().optional(),
        speaker_id: z.string().nullable().optional(),
        recording_url: z.string().optional(),
        external_video_id: z.string().optional(),
        status: z.enum(StatusEnum).optional(),
        check_in: z.boolean().optional(),
        check_out: z.boolean().optional(),
        check_out_code: z.string().nullable().optional(),
        feedback_form: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const { id, meeting_date, ...rest } = opts.input;
      const session = await opts.ctx.prisma.aiLearnSession.update({
        where: { id },
        data: {
          ...rest,
          ...(meeting_date ? { meeting_date: new Date(meeting_date) } : {}),
        },
      });
      if (!session) throw new TRPCError({ code: "NOT_FOUND" });
      return { code: STATUS_OK, message: "Success", session };
    }),

  memberRole: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        role_name: z.enum(AiLearnRoleEnum),
      })
    )
    .mutation(async (opts) => {
      const member = await opts.ctx.prisma.aiLearnMember.update({
        where: { id: opts.input.id },
        data: { role_name: opts.input.role_name },
        include: {
          user: { select: { id: true, full_name: true, email: true } },
        },
      });
      if (!member) throw new TRPCError({ code: "NOT_FOUND" });
      return { code: STATUS_OK, message: "Success", member };
    }),


  lesson: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        title: stringNotBlank().optional(),
        description: z.string().optional(),
        content: z.string().optional(),
        level: z.int().min(1).max(4).optional(),
        xp_reward: numberIsPosInt().optional(),
        status: z.enum(AiLearnLessonStatus).optional(),
        order_index: numberIsNonNegInt().optional(),
        youtube_url: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const { id, ...data } = opts.input;
      const lesson = await opts.ctx.prisma.aiLearnLesson.update({
        where: { id },
        data,
      });
      return { code: STATUS_OK, message: "Success", lesson };
    }),

  quizQuestion: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        question: stringNotBlank().optional(),
        options: z
          .array(z.object({ id: stringNotBlank(), text: stringNotBlank() }))
          .min(2)
          .optional(),
        correct_option: stringNotBlank().optional(),
        explanation: z.string().optional(),
        order_index: numberIsNonNegInt().optional(),
      })
    )
    .mutation(async (opts) => {
      const { id, options, correct_option, ...rest } = opts.input;
      const question = await opts.ctx.prisma.aiLearnQuizQuestion.update({
        where: { id },
        data: {
          ...rest,
          ...(options != null
            ? {
                options: {
                  deleteMany: {},
                  create: options.map((opt, idx) => ({
                    option_id: opt.id,
                    text: opt.text,
                    is_correct: opt.id === correct_option,
                    order_index: idx,
                  })),
                },
              }
            : {}),
        },
        include: { options: { orderBy: { order_index: "asc" } } },
      });
      if (!question) throw new TRPCError({ code: "NOT_FOUND" });
      return { code: STATUS_OK, message: "Success", question };
    }),
};
