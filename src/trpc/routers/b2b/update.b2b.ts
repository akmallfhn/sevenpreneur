import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { checkUpdateResult } from "@/trpc/utils/errors";
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

export const updateB2B = {
  pipeline: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        name: stringNotBlank().optional(),
        pic_name: stringNotBlank().nullable().optional(),
        pic_job_title: stringNotBlank().nullable().optional(),
        pic_wa: stringNotBlank().nullable().optional(),
        pic_email: stringNotBlank().nullable().optional(),
        product: z.enum(B2BProductEnum).optional(),
        source: z.enum(B2BSourceEnum).optional(),
        stage: z.enum(B2BStageEnum).optional(),
        probability: z.number().int().min(1).max(100).optional(),
        project_value: z.number().nonnegative().optional(),
        owner_id: stringIsUUID().optional(),
      })
    )
    .mutation(async (opts) => {
      const { id, ...data } = opts.input;
      const updated = await opts.ctx.prisma.b2BPipeline.updateMany({
        where: { id },
        data,
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
