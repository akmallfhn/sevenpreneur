import { STATUS_CREATED } from "@/lib/status_code";
import { administratorProcedure, loggedInProcedure } from "@/trpc/init";
import { checkUpdateResult } from "@/trpc/utils/errors";
import {
  numberIsID,
  numberIsPosInt,
  numberIsPositive,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { BAPeriodEnum, StatusEnum } from "@prisma/client";
import z from "zod";
import { calculateBAScore } from "./util.ba";

export const updateBA = {
  category: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        name: stringNotBlank().optional(),
        weight: numberIsPositive().optional(),
        num_order: numberIsPosInt().nullable().optional(),
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
        num_order: numberIsPosInt().nullable().optional(),
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
        num_order: numberIsPosInt().nullable().optional(),
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

  answerSheet: loggedInProcedure
    .input(
      z.object({
        id: numberIsID(),
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

      let updatedAnswerSheet = [{}];
      await opts.ctx.prisma.$transaction(async (tx) => {
        updatedAnswerSheet = await tx.bAAnswerSheet.updateManyAndReturn({
          data: {
            user_id: opts.ctx.user.id,
            period: opts.input.period,
            score: totalScore,
          },
          where: {
            id: opts.input.id,
            user_id: opts.ctx.user.id,
          },
        });

        checkUpdateResult(
          updatedAnswerSheet.length,
          "BA answer sheet",
          "BA answer sheets"
        );

        for (const answer of opts.input.answers) {
          const updatedAnswerItem = await tx.bAAnswerItem.updateManyAndReturn({
            data: {
              score: answer.score,
            },
            where: {
              sheet_id: opts.input.id,
              question_id: answer.question_id,
            },
          });

          checkUpdateResult(
            updatedAnswerItem.length,
            "BA answer item",
            "BA answer items"
          );
        }
      });

      return {
        code: STATUS_CREATED,
        message: "Success",
        sheet: updatedAnswerSheet[0],
      };
    }),
};
