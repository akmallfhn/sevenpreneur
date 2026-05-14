import { STATUS_CREATED } from "@/lib/status_code";
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
import z from "zod";

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
        stage: z.enum(B2BStageEnum),
        probability: z.number().int().min(1).max(100),
        project_value: z.number().nonnegative(),
        owner_id: stringIsUUID(),
      })
    )
    .mutation(async (opts) => {
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
