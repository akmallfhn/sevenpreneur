import { STATUS_CREATED } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { checkUpdateResult } from "@/trpc/utils/errors";
import {
  numberIsID,
  numberIsPositive,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import z from "zod";

export const updateBA = {
  category: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        name: stringNotBlank().optional(),
        weight: numberIsPositive().optional(),
        num_order: numberIsPositive().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedCategory =
        await opts.ctx.prisma.bACategory.updateManyAndReturn({
          data: {
            name: opts.input.name,
            weight: opts.input.weight,
            num_order: opts.input.num_order,
          },
          where: {
            id: opts.input.id,
          },
        });

      checkUpdateResult(updatedCategory.length, "BA category", "BA categories");

      return {
        code: STATUS_CREATED,
        message: "Success",
        category: updatedCategory[0],
      };
    }),

  subcategory: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        category_id: numberIsID().optional(),
        name: stringNotBlank().optional(),
        num_order: numberIsPositive().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedSubcategory =
        await opts.ctx.prisma.bASubcategory.updateManyAndReturn({
          data: {
            category_id: opts.input.category_id,
            name: opts.input.name,
            num_order: opts.input.num_order,
          },
          where: {
            id: opts.input.id,
          },
        });

      checkUpdateResult(
        updatedSubcategory.length,
        "BA subcategory",
        "BA subcategories"
      );

      return {
        code: STATUS_CREATED,
        message: "Success",
        subcategory: updatedSubcategory[0],
      };
    }),

  question: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        subcategory_id: numberIsID().optional(),
        question: stringNotBlank().optional(),
        hint: stringNotBlank().optional(),
        weight: numberIsPositive().optional(),
        status: z.enum(StatusEnum).optional(),
        num_order: numberIsPositive().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedQuestion =
        await opts.ctx.prisma.bAQuestion.updateManyAndReturn({
          data: {
            subcategory_id: opts.input.subcategory_id,
            question: opts.input.question,
            hint: opts.input.hint,
            weight: opts.input.weight,
            status: opts.input.status,
            num_order: opts.input.num_order,
          },
          where: {
            id: opts.input.id,
          },
        });

      checkUpdateResult(updatedQuestion.length, "BA question", "BA questions");

      return {
        code: STATUS_CREATED,
        message: "Success",
        question: updatedQuestion[0],
      };
    }),
};
