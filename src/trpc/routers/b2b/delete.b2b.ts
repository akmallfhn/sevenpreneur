import { STATUS_NO_CONTENT } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { checkDeleteResult } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";

export const deleteB2B = {
  pipeline: administratorProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deleted = await opts.ctx.prisma.b2BPipeline.deleteMany({
        where: { id: opts.input.id },
      });
      await checkDeleteResult(deleted.count, "pipelines", "pipeline");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  action: administratorProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deleted = await opts.ctx.prisma.b2BAction.deleteMany({
        where: { id: opts.input.id },
      });
      await checkDeleteResult(deleted.count, "actions", "action");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),
};
