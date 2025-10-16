import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { checkUpdateResult } from "@/trpc/utils/errors";
import {
  numberIsID,
  stringIsTimestampTz,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { CategoryEnum, StatusEnum } from "@prisma/client";
import z from "zod";

export const updateTransaction = {
  discount: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        name: stringNotBlank().optional(),
        code: stringNotBlank().optional(),
        category: z.nativeEnum(CategoryEnum).optional(),
        item_id: numberIsID().optional(),
        calc_percent: z.number().optional(),
        status: z.nativeEnum(StatusEnum).optional(),
        start_date: stringIsTimestampTz().optional(),
        end_date: stringIsTimestampTz().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedDiscount =
        await opts.ctx.prisma.discount.updateManyAndReturn({
          data: {
            name: opts.input.name,
            code: opts.input.code,
            category: opts.input.category,
            item_id: opts.input.item_id,
            calc_percent: opts.input.calc_percent,
            status: opts.input.status,
            start_date: opts.input.start_date,
            end_date: opts.input.end_date,
          },
          where: {
            id: opts.input.id,
          },
        });
      checkUpdateResult(updatedDiscount.length, "discount", "discounts");
      return {
        code: STATUS_OK,
        message: "Success",
        discount: updatedDiscount[0],
      };
    }),
};
