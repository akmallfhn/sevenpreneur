import { Optional } from "@/lib/optional-type";
import { STATUS_OK } from "@/lib/status_code";
import { publicProcedure } from "@/trpc/init";
import { calculatePage } from "@/trpc/utils/paging";
import {
  numberIsID,
  numberIsPosInt,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { AStatusEnum, StatusEnum } from "@prisma/client";
import z from "zod";

export const listArticle = {
  articleCategories: publicProcedure.query(async (opts) => {
    let categoryStatus = StatusEnum.ACTIVE as Optional<StatusEnum>;

    if (
      opts.ctx.user &&
      ["Administrator", "Marketer"].includes(opts.ctx.user.role.name)
    ) {
      categoryStatus = undefined;
    }

    const categoryList = await opts.ctx.prisma.articleCategory.findMany({
      where: {
        status: categoryStatus,
      },
      orderBy: [{ created_at: "asc" }],
    });

    return {
      code: STATUS_OK,
      message: "Success",
      list: categoryList,
    };
  }),

  articles: publicProcedure
    .input(
      z.object({
        page: numberIsPosInt().optional(),
        page_size: numberIsPosInt().optional(),
        keyword: stringNotBlank().optional(),
        status: z.enum(AStatusEnum).optional(),
        category_id: numberIsID().optional(),
      })
    )
    .query(async (opts) => {
      const whereClause = {
        title: undefined as Optional<{ contains: string; mode: "insensitive" }>,
        status: AStatusEnum.PUBLISHED as Optional<AStatusEnum>,
        category_id: opts.input.category_id,
      };

      if (
        opts.ctx.user &&
        ["Administrator", "Marketer"].includes(opts.ctx.user.role.name)
      ) {
        whereClause.status = opts.input.status;
      }

      if (opts.input.keyword !== undefined) {
        whereClause.title = {
          contains: opts.input.keyword,
          mode: "insensitive",
        };
      }

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.article.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const articleList = await opts.ctx.prisma.article.findMany({
        select: {
          id: true,
          title: true,
          image_url: true,
          status: true,
          category: { select: { id: true, name: true, slug: true } },
          keywords: true,
          author: { select: { full_name: true, avatar: true } },
          reviewer: { select: { full_name: true, avatar: true } },
          slug_url: true,
          published_at: true,
          updated_at: true,
        },
        orderBy: [{ published_at: "desc" }],
        where: whereClause,
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });

      const returnedMetapaging = {
        ...paging.metapaging,
        keyword: opts.input.keyword,
      };

      return {
        code: STATUS_OK,
        message: "Success",
        list: articleList,
        metapaging: returnedMetapaging,
      };
    }),
};
