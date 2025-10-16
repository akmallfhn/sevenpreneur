import {
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import {
  numberIsID,
  stringIsTimestampTz,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { CategoryEnum, StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const createTransaction = {
  discount: administratorProcedure
    .input(
      z.object({
        name: stringNotBlank(),
        code: stringNotBlank(),
        category: z.nativeEnum(CategoryEnum),
        item_id: numberIsID(),
        calc_percent: z.number(),
        status: z.nativeEnum(StatusEnum),
        start_date: stringIsTimestampTz(),
        end_date: stringIsTimestampTz(),
      })
    )
    .mutation(async (opts) => {
      const createdDiscount = await opts.ctx.prisma.discount.create({
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
      });
      const theDiscount = await opts.ctx.prisma.discount.findFirst({
        where: {
          id: createdDiscount.id,
          // deleted_at: null,
        },
      });
      if (!theDiscount) {
        throw new TRPCError({
          code: STATUS_INTERNAL_SERVER_ERROR,
          message: "Failed to create a new discount.",
        });
      }
      return {
        code: STATUS_CREATED,
        message: "Success",
        discount: theDiscount,
      };
    }),
};
