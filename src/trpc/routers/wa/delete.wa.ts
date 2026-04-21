import { STATUS_NO_CONTENT } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { checkDeleteResult } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";

export const deleteWA = {
  asset: administratorProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedAsset = await opts.ctx.prisma.wAAsset.deleteMany({
        where: { id: opts.input.id },
      });
      checkDeleteResult(deletedAsset.count, "assets", "wa.asset");

      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  alert: administratorProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedAlert = await opts.ctx.prisma.wAAlert.deleteMany({
        where: { id: opts.input.id },
      });
      checkDeleteResult(deletedAlert.count, "alerts", "wa.alert");

      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),
};
