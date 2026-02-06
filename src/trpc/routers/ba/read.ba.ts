import { STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";

export const readBA = {
  category: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
    const theCategory = await opts.ctx.prisma.bACategory.findFirst({
      where: { id: opts.input.id },
    });

    if (!theCategory) {
      throw readFailedNotFound("category");
    }

    return {
      code: STATUS_OK,
      message: "Success",
      category: theCategory,
    };
  }),

  subcategory: loggedInProcedure
    .input(objectHasOnlyID())
    .query(async (opts) => {
      const theSubcategory = await opts.ctx.prisma.bASubcategory.findFirst({
        include: { category: { select: { name: true } } },
        where: { id: opts.input.id },
      });

      if (!theSubcategory) {
        throw readFailedNotFound("subcategory");
      }

      const returnedSubcategory = {
        ...theSubcategory,
        category: undefined,
        category_name: theSubcategory.category.name,
      };

      return {
        code: STATUS_OK,
        message: "Success",
        subcategory: returnedSubcategory,
      };
    }),

  question: loggedInProcedure.input(objectHasOnlyID()).query(async (opts) => {
    const questionStatus = ["Administrator"].includes(opts.ctx.user.role.name)
      ? undefined
      : StatusEnum.ACTIVE;

    const theQuestion = await opts.ctx.prisma.bAQuestion.findFirst({
      include: {
        subcategory: {
          select: {
            name: true,
            category: { select: { id: true, name: true } },
          },
        },
      },
      where: {
        id: opts.input.id,
        status: questionStatus,
      },
    });

    if (!theQuestion) {
      throw readFailedNotFound("question");
    }

    const returnedQuestion = {
      ...theQuestion,
      subcategory: undefined,
      subcategory_name: theQuestion.subcategory.name,
      category_id: theQuestion.subcategory.category.id,
      category_name: theQuestion.subcategory.category.name,
    };

    return {
      code: STATUS_OK,
      message: "Success",
      question: returnedQuestion,
    };
  }),

  sheet: loggedInProcedure.query(async (opts) => {
    const completeList = await opts.ctx.prisma.bACategory.findMany({
      select: {
        id: true,
        name: true,
        weight: true,
        num_order: true,
        subcategories: {
          select: {
            id: true,
            name: true,
            num_order: true,
            questions: {
              select: {
                id: true,
                question: true,
                hint: true,
                weight: true,
                num_order: true,
              },
              where: {
                status: StatusEnum.ACTIVE,
              },
            },
          },
        },
      },
    });

    return {
      code: STATUS_OK,
      message: "Success",
      sheet: {
        categories: completeList,
      },
    };
  }),
};
