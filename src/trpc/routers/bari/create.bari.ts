import { BARI_QUESTION_MAP } from "@/lib/bari-questions";
import {
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { numberIsID, stringNotBlank } from "@/trpc/utils/validation";
import {
  BariAssessmentStatusEnum,
  BariRevenueModelEnum,
  NumEmployeeEnum,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

const answerInput = z.object({
  question_code: stringNotBlank(),
  option_codes: z.array(stringNotBlank()).optional(),
  likert_value: z.int().min(1).max(5).nullable().optional(),
  text_answer: z.string().trim().max(2000).nullable().optional(),
});

export const createBari = {
  assessment: loggedInProcedure
    .input(
      z.object({
        industry_id: numberIsID().nullable().optional(),
        team_size: z.enum(NumEmployeeEnum).nullable().optional(),
        revenue_model: z.enum(BariRevenueModelEnum).nullable().optional(),
        website_url: stringNotBlank().max(500).nullable().optional(),
        linkedin_url: stringNotBlank().max(500).nullable().optional(),
        primary_ai_tool: stringNotBlank().max(200).nullable().optional(),
        status: z.enum(BariAssessmentStatusEnum).optional(),
        answers: z.array(answerInput).min(1),
      })
    )
    .mutation(async (opts) => {
      const seen = new Set<string>();
      for (const a of opts.input.answers) {
        const q = BARI_QUESTION_MAP.get(a.question_code);
        if (!q) {
          throw new TRPCError({
            code: STATUS_BAD_REQUEST,
            message: `Unknown question_code: ${a.question_code}`,
          });
        }
        if (seen.has(a.question_code)) {
          throw new TRPCError({
            code: STATUS_BAD_REQUEST,
            message: `Duplicate answer for question_code: ${a.question_code}`,
          });
        }
        seen.add(a.question_code);

        // Validate that the answer shape matches the question format.
        const opts_count = a.option_codes?.length ?? 0;
        switch (q.format) {
          case "mc_single":
            if (opts_count !== 1) {
              throw new TRPCError({
                code: STATUS_BAD_REQUEST,
                message: `${q.code} requires exactly one option_code.`,
              });
            }
            break;
          case "mc_multi":
            if (opts_count < 1) {
              throw new TRPCError({
                code: STATUS_BAD_REQUEST,
                message: `${q.code} requires at least one option_code.`,
              });
            }
            if (q.max_select && opts_count > q.max_select) {
              throw new TRPCError({
                code: STATUS_BAD_REQUEST,
                message: `${q.code} accepts at most ${q.max_select} options.`,
              });
            }
            break;
          case "likert":
            if (a.likert_value == null) {
              throw new TRPCError({
                code: STATUS_BAD_REQUEST,
                message: `${q.code} requires a likert_value (1..5).`,
              });
            }
            break;
          case "open_text":
          case "url":
            if (!a.text_answer || a.text_answer.length === 0) {
              throw new TRPCError({
                code: STATUS_BAD_REQUEST,
                message: `${q.code} requires text_answer.`,
              });
            }
            if (q.char_limit && a.text_answer.length > q.char_limit) {
              throw new TRPCError({
                code: STATUS_BAD_REQUEST,
                message: `${q.code} text_answer exceeds the ${q.char_limit} char limit.`,
              });
            }
            break;
        }

        // Verify option_codes refer to known options.
        if (a.option_codes && q.options) {
          const known = new Set(q.options.map((o) => o.code));
          for (const code of a.option_codes) {
            if (!known.has(code)) {
              throw new TRPCError({
                code: STATUS_BAD_REQUEST,
                message: `${q.code} has no option_code "${code}".`,
              });
            }
          }
        }
      }

      const completedAt =
        opts.input.status === BariAssessmentStatusEnum.COMPLETED
          ? new Date()
          : null;

      const created = await opts.ctx.prisma.bariAssessment.create({
        data: {
          user_id: opts.ctx.user.id,
          industry_id: opts.input.industry_id ?? null,
          team_size: opts.input.team_size ?? null,
          revenue_model: opts.input.revenue_model ?? null,
          website_url: opts.input.website_url ?? null,
          linkedin_url: opts.input.linkedin_url ?? null,
          primary_ai_tool: opts.input.primary_ai_tool ?? null,
          status: opts.input.status ?? BariAssessmentStatusEnum.IN_PROGRESS,
          completed_at: completedAt,
          answers: {
            create: opts.input.answers.map((a) => ({
              question_code: a.question_code,
              option_codes: a.option_codes ?? [],
              likert_value: a.likert_value ?? null,
              text_answer: a.text_answer ?? null,
            })),
          },
        },
        select: { id: true, status: true, created_at: true },
      });

      if (!created) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create BARI assessment.",
        });
      }

      return {
        code: STATUS_CREATED,
        message: "Success",
        assessment: created,
      };
    }),
};
