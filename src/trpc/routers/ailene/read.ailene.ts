import { STATUS_OK } from "@/lib/status_code";
import { aileneProcedure, administratorProcedure } from "@/trpc/init";
import { numberIsID } from "@/trpc/utils/validation";
import { AiLearnLessonStatus } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const readAilene = {
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
};
