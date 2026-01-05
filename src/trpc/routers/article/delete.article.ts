import { STATUS_NO_CONTENT } from "@/lib/status_code";
import { administratorProcedure, roleBasedProcedure } from "@/trpc/init";
import { checkDeleteResult } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";

export const deleteArticle = {
  articleCategory: administratorProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedCategory = await opts.ctx.prisma.articleCategory.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      checkDeleteResult(
        deletedCategory.count,
        "article category",
        "articleCategory"
      );
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  article: roleBasedProcedure(["Administrator", "Marketer"])
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedArticle = await opts.ctx.prisma.article.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      checkDeleteResult(deletedArticle.count, "article", "article");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),
};
