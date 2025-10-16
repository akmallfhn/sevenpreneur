import { STATUS_NO_CONTENT } from "@/lib/status_code";
import { roleBasedProcedure } from "@/trpc/init";
import { checkDeleteResult } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";

export const deleteEvent = {
  event: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      // $executeRaw is used for using the correct CURRENT_TIMESTAMP.
      const deletedEvent: number = await opts.ctx.prisma
        .$executeRaw`UPDATE events SET deleted_at = CURRENT_TIMESTAMP, deleted_by = ${opts.ctx.user.id} WHERE id = ${opts.input.id};`;
      if (deletedEvent > 1) {
        console.error(
          "delete.event: More-than-one events are deleted at once."
        );
      }
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  eventPrice: roleBasedProcedure(["Administrator", "Class Manager"])
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedEventPrice = await opts.ctx.prisma.eventPrice.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      checkDeleteResult(deletedEventPrice.count, "event prices", "eventPrice");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),
};
