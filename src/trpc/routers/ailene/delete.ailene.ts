import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { numberIsID } from "@/trpc/utils/validation";
import z from "zod";

export const deleteAilene = {
  member: administratorProcedure
    .input(z.object({ id: numberIsID() }))
    .mutation(async (opts) => {
      await opts.ctx.prisma.aiLearnMember.delete({
        where: { id: opts.input.id },
      });
      return { code: STATUS_OK, message: "Success" };
    }),


  lesson: administratorProcedure
    .input(z.object({ id: numberIsID() }))
    .mutation(async (opts) => {
      await opts.ctx.prisma.aiLearnLesson.delete({
        where: { id: opts.input.id },
      });
      return { code: STATUS_OK, message: "Success" };
    }),

  quizQuestion: administratorProcedure
    .input(z.object({ id: numberIsID() }))
    .mutation(async (opts) => {
      await opts.ctx.prisma.aiLearnQuizQuestion.delete({
        where: { id: opts.input.id },
      });
      return { code: STATUS_OK, message: "Success" };
    }),
};
