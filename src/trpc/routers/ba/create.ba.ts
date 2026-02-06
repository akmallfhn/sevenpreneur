import {
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import {
  numberIsID,
  numberIsPositive,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const createBA = {
  category: administratorProcedure
    .input(
      z.object({
        name: stringNotBlank(),
        weight: numberIsPositive(),
        num_order: numberIsPositive().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const createdCategory = await opts.ctx.prisma.bACategory.create({
        data: {
          name: opts.input.name,
          weight: opts.input.weight,
          num_order: opts.input.num_order,
        },
      });

      const theCategory = await opts.ctx.prisma.bACategory.findFirst({
        where: { id: createdCategory.id },
      });
      if (!theCategory) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new BA category.",
        });
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        category: theCategory,
      };
    }),

  subcategory: administratorProcedure
    .input(
      z.object({
        category_id: numberIsID(),
        name: stringNotBlank(),
        num_order: numberIsPositive().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const createdSubcategory = await opts.ctx.prisma.bASubcategory.create({
        data: {
          category_id: opts.input.category_id,
          name: opts.input.name,
          num_order: opts.input.num_order,
        },
      });

      const theSubcategory = await opts.ctx.prisma.bASubcategory.findFirst({
        where: { id: createdSubcategory.id },
      });
      if (!theSubcategory) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new BA subcategory.",
        });
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        subcategory: theSubcategory,
      };
    }),

  question: administratorProcedure
    .input(
      z.object({
        subcategory_id: numberIsID(),
        question: stringNotBlank(),
        hint: stringNotBlank(),
        weight: numberIsPositive(),
        status: z.enum(StatusEnum),
        num_order: numberIsPositive().nullable().optional(),
      })
    )
    .mutation(async (opts) => {
      const createdQuestion = await opts.ctx.prisma.bAQuestion.create({
        data: {
          subcategory_id: opts.input.subcategory_id,
          question: opts.input.question,
          hint: opts.input.hint,
          weight: opts.input.weight,
          status: opts.input.status,
          num_order: opts.input.num_order,
        },
      });

      const theQuestion = await opts.ctx.prisma.bAQuestion.findFirst({
        where: { id: createdQuestion.id },
      });
      if (!theQuestion) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new BA question.",
        });
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        question: theQuestion,
      };
    }),
};
