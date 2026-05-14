import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";

export const readB2B = {
  pipeline: administratorProcedure
    .input(objectHasOnlyID())
    .query(async (opts) => {
      const thePipeline = await opts.ctx.prisma.b2BPipeline.findFirst({
        include: {
          owner: { select: { id: true, full_name: true, avatar: true } },
        },
        where: { id: opts.input.id },
      });
      if (!thePipeline) {
        throw readFailedNotFound("pipeline");
      }
      return {
        code: STATUS_OK,
        message: "Success",
        pipeline: {
          id: thePipeline.id,
          name: thePipeline.name,
          pic_name: thePipeline.pic_name,
          pic_job_title: thePipeline.pic_job_title,
          pic_wa: thePipeline.pic_wa,
          pic_email: thePipeline.pic_email,
          product: thePipeline.product,
          source: thePipeline.source,
          stage: thePipeline.stage,
          probability: thePipeline.probability,
          project_value: thePipeline.project_value,
          owner_id: thePipeline.owner.id,
          owner_name: thePipeline.owner.full_name,
          owner_avatar: thePipeline.owner.avatar,
          created_at: thePipeline.created_at,
          updated_at: thePipeline.updated_at,
        },
      };
    }),

  action: administratorProcedure
    .input(objectHasOnlyID())
    .query(async (opts) => {
      const theAction = await opts.ctx.prisma.b2BAction.findFirst({
        where: { id: opts.input.id },
      });
      if (!theAction) {
        throw readFailedNotFound("action");
      }
      return {
        code: STATUS_OK,
        message: "Success",
        action: theAction,
      };
    }),
};
