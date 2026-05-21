import { STATUS_BAD_REQUEST, STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { checkUpdateResult } from "@/trpc/utils/errors";
import {
  numberIsID,
  numberIsPosInt,
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

export const updateB2B = {
  pipeline: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        name: stringNotBlank().optional(),
        industry_id: numberIsPosInt().optional(),
        pic_name: stringNotBlank().nullable().optional(),
        pic_job_title: stringNotBlank().nullable().optional(),
        pic_wa: stringNotBlank().nullable().optional(),
        pic_email: stringNotBlank().nullable().optional(),
        product: z.enum(B2BProductEnum).optional(),
        source: z.enum(B2BSourceEnum).optional(),
        stage: z.enum(B2BStageEnum).optional(),
        probability: z.number().int().min(0).max(100).optional(),
        project_value: z.number().nonnegative().optional(),
        project_start_month: monthDate.nullable().optional(),
        project_end_month: monthDate.nullable().optional(),
        owner_id: stringIsUUID().optional(),
      })
    )
    .mutation(async (opts) => {
      const {
        id,
        project_start_month,
        project_end_month,
        ...rest
      } = opts.input;

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

      const updated = await opts.ctx.prisma.b2BPipeline.updateMany({
        where: { id },
        data: {
          ...rest,
          ...(project_start_month !== undefined && {
            project_start_month: project_start_month
              ? new Date(project_start_month)
              : null,
          }),
          ...(project_end_month !== undefined && {
            project_end_month: project_end_month
              ? new Date(project_end_month)
              : null,
          }),
        },
      });
      await checkUpdateResult(updated.count, "pipeline", "pipelines");
      return {
        code: STATUS_OK,
        message: "Pipeline updated",
      };
    }),

  action: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        activity_type: z.enum(B2BActivityTypeEnum).optional(),
        summary: stringNotBlank().optional(),
      })
    )
    .mutation(async (opts) => {
      const { id, ...data } = opts.input;
      const updated = await opts.ctx.prisma.b2BAction.updateMany({
        where: { id },
        data,
      });
      await checkUpdateResult(updated.count, "action", "actions");
      return {
        code: STATUS_OK,
        message: "Action updated",
      };
    }),
};
