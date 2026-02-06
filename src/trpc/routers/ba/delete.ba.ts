import { STATUS_NO_CONTENT } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
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
};
