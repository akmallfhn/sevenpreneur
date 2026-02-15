import { STATUS_NO_CONTENT } from "@/lib/status_code";
import { administratorProcedure, loggedInProcedure } from "@/trpc/init";
import { checkDeleteResult } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";

export const deleteBA = {
  category: administratorProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedCategory = await opts.ctx.prisma.bACategory.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      checkDeleteResult(deletedCategory.count, "BA category", "ba.category");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  subcategory: administratorProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedSubcategory = await opts.ctx.prisma.bASubcategory.deleteMany(
        {
          where: {
            id: opts.input.id,
          },
        }
      );
      checkDeleteResult(
        deletedSubcategory.count,
        "BA subcategory",
        "ba.subcategory"
      );
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  question: administratorProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedQuestion = await opts.ctx.prisma.bAQuestion.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      checkDeleteResult(deletedQuestion.count, "BA question", "ba.question");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  answerSheet: loggedInProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      await opts.ctx.prisma.$transaction(async (tx) => {
        await tx.bAAnswerItem.deleteMany({
          where: {
            sheet_id: opts.input.id,
          },
        });
        const deletedAnswerSheet = await tx.bAAnswerSheet.deleteMany({
          where: {
            id: opts.input.id,
            user_id: opts.ctx.user.id,
          },
        });
        checkDeleteResult(
          deletedAnswerSheet.count,
          "BA answer sheet",
          "ba.answer sheet"
        );
      });
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),
};
