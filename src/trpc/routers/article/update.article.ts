import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure, roleBasedProcedure } from "@/trpc/init";
import { checkUpdateResult } from "@/trpc/utils/errors";
import {
  numberIsID,
  stringIsTimestampTz,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { AStatusEnum, StatusEnum } from "@prisma/client";
import z from "zod";

export const updateArticle = {
  articleCategory: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        name: stringNotBlank().optional(),
        status: z.enum(StatusEnum).optional(),
        slug: stringNotBlank().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedCategory =
        await opts.ctx.prisma.articleCategory.updateManyAndReturn({
          data: {
            name: opts.input.name,
            status: opts.input.status,
            slug: opts.input.slug,
          },
          where: {
            id: opts.input.id,
          },
        });
      checkUpdateResult(
        updatedCategory.length,
        "article category",
        "article categories"
      );
      return {
        code: STATUS_OK,
        message: "Success",
        category: updatedCategory[0],
      };
    }),

  article: roleBasedProcedure(["Administrator", "Marketer"])
    .input(
      z.object({
        id: numberIsID(),
        title: stringNotBlank().optional(),
        insight: stringNotBlank().optional(),
        image_url: stringNotBlank().optional(),
        body_content: stringNotBlank().optional(),
        status: z.enum(AStatusEnum).optional(),
        category_id: numberIsID().optional(),
        keywords: z.string().optional(),
        author_id: stringIsUUID().optional(),
        reviewer_id: stringIsUUID().optional(),
        slug_url: stringNotBlank().optional(),
        published_at: stringIsTimestampTz().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedArticle = await opts.ctx.prisma.article.updateManyAndReturn({
        data: {
          title: opts.input.title,
          insight: opts.input.insight,
          image_url: opts.input.image_url,
          body_content: opts.input.body_content,
          status: opts.input.status,
          category_id: opts.input.category_id,
          keywords: opts.input.keywords,
          author_id: opts.input.author_id,
          reviewer_id: opts.input.reviewer_id,
          slug_url: opts.input.slug_url,
          published_at: opts.input.published_at,
        },
        where: {
          id: opts.input.id,
        },
      });
      checkUpdateResult(updatedArticle.length, "article", "articles");
      return {
        code: STATUS_OK,
        message: "Success",
        article: updatedArticle[0],
      };
    }),
};
