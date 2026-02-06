import { Optional } from "@/lib/optional-type";
import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { calculatePage } from "@/trpc/utils/paging";
import {
  numberIsID,
  numberIsPositive,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import z from "zod";

export const listBA = {
  categories: loggedInProcedure.query(async (opts) => {
    const categoryList = await opts.ctx.prisma.bACategory.findMany({
      select: { id: true, name: true, num_order: true },
      orderBy: [{ num_order: "asc" }, { created_at: "asc" }],
    });

    return {
      code: STATUS_OK,
      message: "Success",
      list: categoryList,
    };
  }),

  subcategories: loggedInProcedure
    .input(
      z.object({
        category_id: numberIsID().optional(),
      })
    )
    .query(async (opts) => {
      const subcategoryList = await opts.ctx.prisma.bASubcategory.findMany({
        select: {
          id: true,
          name: true,
          num_order: true,
          category: { select: { id: true, name: true } },
        },
        where: { category_id: opts.input.category_id },
        orderBy: [
          { category: { num_order: "asc" } },
          { num_order: "asc" },
          { created_at: "asc" },
        ],
      });
      const returnedList = subcategoryList.map((entry) => {
        return {
          id: entry.id,
          name: entry.name,
          num_order: entry.num_order,
          category_id: entry.category.id,
          category_name: entry.category.name,
        };
      });

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
      };
    }),

  questions: loggedInProcedure
    .input(
      z.object({
        page: numberIsPositive().optional(),
        page_size: numberIsPositive().optional(),
        keyword: stringNotBlank().optional(),
        category_id: numberIsID().optional(),
      })
    )
    .query(async (opts) => {
      const questionStatus = ["Administrator"].includes(opts.ctx.user.role.name)
        ? undefined
        : StatusEnum.ACTIVE;

      const whereClause = {
        status: questionStatus,
        question: undefined as Optional<{
          contains: string;
          mode: "insensitive";
        }>,
        subcategory: { category_id: opts.input.category_id },
      };

      if (opts.input.keyword !== undefined) {
        whereClause.question = {
          contains: opts.input.keyword,
          mode: "insensitive",
        };
      }

      const paging = calculatePage(
        opts.input,
        await opts.ctx.prisma.bAQuestion.aggregate({
          _count: true,
          where: whereClause,
        })
      );

      const questionList = await opts.ctx.prisma.bAQuestion.findMany({
        select: {
          id: true,
          question: true,
          hint: true,
          weight: true,
          status: true,
          num_order: true,
          subcategory: {
            select: {
              id: true,
              name: true,
              category: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: [
          { subcategory: { category: { num_order: "asc" } } },
          { subcategory: { num_order: "asc" } },
          { num_order: "asc" },
          { created_at: "asc" },
        ],
        where: whereClause,
        skip: paging.prisma.skip,
        take: paging.prisma.take,
      });

      const returnedList = questionList.map((entry) => {
        return {
          id: entry.id,
          question: entry.question,
          hint: entry.hint,
          weight: entry.weight,
          status: entry.status,
          num_order: entry.num_order,
          subcategory_id: entry.subcategory.id,
          subcategory_name: entry.subcategory.name,
          category_id: entry.subcategory.category.id,
          category_name: entry.subcategory.category.name,
        };
      });

      const returnedMetapaging = {
        ...paging.metapaging,
        keyword: opts.input.keyword,
      };

      return {
        code: STATUS_OK,
        message: "Success",
        list: returnedList,
        metapaging: returnedMetapaging,
      };
    }),
};
