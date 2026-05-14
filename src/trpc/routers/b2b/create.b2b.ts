import { STATUS_BAD_REQUEST, STATUS_CREATED } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import {
  numberIsID,
  stringIsUUID,
  stringNotBlank,
} from "@/trpc/utils/validation";
import {
  B2BActivityTypeEnum,
  B2BProductEnum,
  B2BSourceEnum,
  B2BStageEnum,
} from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

// "YYYY-MM-DD" string from frontend. Day expected to be 01 by convention.
const monthDate = z.iso.date();

export const createB2B = {
  pipeline: administratorProcedure
    .input(
      z.object({
        name: stringNotBlank(),
        pic_name: stringNotBlank().nullable().optional(),
        pic_job_title: stringNotBlank().nullable().optional(),
        pic_wa: stringNotBlank().nullable().optional(),
        pic_email: stringNotBlank().nullable().optional(),
        product: z.enum(B2BProductEnum),
        source: z.enum(B2BSourceEnum),
        stage: z.enum(B2BStageEnum).optional(),
        probability: z.number().int().min(0).max(100).optional(),
        project_value: z.number().nonnegative().optional(),
        project_start_month: monthDate.nullable().optional(),
        project_end_month: monthDate.nullable().optional(),
        owner_id: stringIsUUID(),
      })
    )
    .mutation(async (opts) => {
      const { project_start_month, project_end_month } = opts.input;
      if (
        project_start_month &&
        project_end_month &&
        new Date(project_end_month) < new Date(project_start_month)
      ) {
        throw new TRPCError({
          code: STATUS_BAD_REQUEST,
          message: "project_end_month must be on or after project_start_month.",
        });
      }

      const created = await opts.ctx.prisma.b2BPipeline.create({
        data: {
          name: opts.input.name,
          pic_name: opts.input.pic_name ?? null,
          pic_job_title: opts.input.pic_job_title ?? null,
          pic_wa: opts.input.pic_wa ?? null,
          pic_email: opts.input.pic_email ?? null,
          product: opts.input.product,
          source: opts.input.source,
          stage: opts.input.stage,
          probability: opts.input.probability,
          project_value: opts.input.project_value,
          project_start_month: project_start_month
            ? new Date(project_start_month)
            : null,
          project_end_month: project_end_month
            ? new Date(project_end_month)
            : null,
          owner_id: opts.input.owner_id,
        },
      });
      return {
        code: STATUS_CREATED,
        message: "Pipeline created",
        id: created.id,
      };
    }),

  action: administratorProcedure
    .input(
      z.object({
        company_id: numberIsID(),
        activity_type: z.enum(B2BActivityTypeEnum),
        summary: stringNotBlank(),
      })
    )
    .mutation(async (opts) => {
      const created = await opts.ctx.prisma.b2BAction.create({
        data: {
          company_id: opts.input.company_id,
          activity_type: opts.input.activity_type,
          summary: opts.input.summary,
        },
      });
      return {
        code: STATUS_CREATED,
        message: "Action created",
        id: created.id,
      };
    }),
};
