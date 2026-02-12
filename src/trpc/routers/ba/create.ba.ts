import {
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { administratorProcedure, loggedInProcedure } from "@/trpc/init";
import {
  numberIsID,
  numberIsPosInt,
  numberIsPositive,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { BAPeriodEnum, StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { calculateBAScore } from "./util.ba";

export const createBA = {
  category: administratorProcedure
    .input(
      z.object({
        name: stringNotBlank(),
        weight: numberIsPositive(),
        num_order: numberIsPosInt().nullable().optional(),
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
        num_order: numberIsPosInt().nullable().optional(),
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
        num_order: numberIsPosInt().nullable().optional(),
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

  answerSheet: loggedInProcedure
    .input(
      z.object({
        period: z.enum(BAPeriodEnum),
        answers: z.array(
          z.object({
            question_id: numberIsID(),
            score: z.int().min(0).max(5),
          })
        ),
      })
    )
    .mutation(async (opts) => {
      const totalScore = await calculateBAScore(
        opts.ctx.prisma,
        opts.input.answers
      );

      const createdAnswerSheet = await opts.ctx.prisma.bAAnswerSheet.create({
        data: {
          user_id: opts.ctx.user.id,
          period: opts.input.period,
          score: totalScore,
          answers: {
            create: opts.input.answers,
          },
        },
      });

      const theAnswerSheet = await opts.ctx.prisma.bAAnswerSheet.findFirst({
        where: { id: createdAnswerSheet.id },
      });
      if (!theAnswerSheet) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new BA answer sheet.",
        });
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        sheet: theAnswerSheet,
      };
    }),
};
