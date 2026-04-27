import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { numberIsID, numberIsNonNegInt, numberIsPosInt, stringNotBlank } from "@/trpc/utils/validation";
import { AiLearnLessonStatus, AiLearnRoleEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const updateAilene = {
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
