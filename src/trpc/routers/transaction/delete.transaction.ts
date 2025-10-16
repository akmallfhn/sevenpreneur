import { STATUS_NO_CONTENT } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { checkDeleteResult } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";

export const deleteTransaction = {
  discount: administratorProcedure
    .input(objectHasOnlyID())
    .mutation(async (opts) => {
      const deletedDiscount = await opts.ctx.prisma.discount.deleteMany({
        where: {
          id: opts.input.id,
        },
      });
      checkDeleteResult(deletedDiscount.count, "discounts", "discount");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),
};
