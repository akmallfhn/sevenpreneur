import {
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { administratorProcedure, roleBasedProcedure } from "@/trpc/init";
import { createSlugFromTitle } from "@/trpc/utils/slug";
import {
  arrayArticleBodyContent,
  numberIsID,
  stringIsTimestampTz,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { AStatusEnum, StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const createArticle = {
  articleCategory: administratorProcedure
    .input(
      z.object({
        name: stringNotBlank(),
        status: z.enum(StatusEnum),
        slug: stringNotBlank().optional(),
      })
    )
    .mutation(async (opts) => {
      const slug =
        typeof opts.input.slug !== "undefined"
          ? opts.input.slug
          : createSlugFromTitle(opts.input.name);

      const createdCategory = await opts.ctx.prisma.articleCategory.create({
        data: {
          name: opts.input.name,
          status: opts.input.status,
          slug: slug,
        },
      });

      const theCategory = await opts.ctx.prisma.articleCategory.findFirst({
        where: { id: createdCategory.id },
      });
      if (!theCategory) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new article category.",
        });
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        category: theCategory,
      };
    }),

  article: roleBasedProcedure(["Administrator", "Marketer"])
    .input(
      z.object({
        title: stringNotBlank(),
        insight: stringNotBlank(),
        image_url: stringNotBlank(),
        body_content: arrayArticleBodyContent(),
        status: z.enum(AStatusEnum),
        category_id: numberIsID(),
        keywords: z.string(),
        author_id: stringIsUUID(),
        reviewer_id: stringIsUUID(),
        slug_url: stringNotBlank().optional(),
        published_at: stringIsTimestampTz(),
      })
    )
    .mutation(async (opts) => {
      const slugUrl =
        typeof opts.input.slug_url !== "undefined"
          ? opts.input.slug_url
          : createSlugFromTitle(opts.input.title);

      const createdArticle = await opts.ctx.prisma.article.create({
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
          slug_url: slugUrl,
          published_at: opts.input.published_at,
        },
      });

      const theArticle = await opts.ctx.prisma.article.findFirst({
        where: { id: createdArticle.id },
      });
      if (!theArticle) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new article.",
        });
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        article: theArticle,
      };
    }),
};
