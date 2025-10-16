import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import { checkUpdateResult } from "@/trpc/utils/errors";
import {
  numberIsID,
  stringIsTimestampTz,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import z from "zod";

export const updateTicker = {
  ticker: administratorProcedure
    .input(
      z.object({
        id: numberIsID(),
        title: stringNotBlank().optional(),
        callout: stringNotBlank().nullable().optional(),
        target_url: stringNotBlank().optional(),
        status: z.nativeEnum(StatusEnum).optional(),
        start_date: stringIsTimestampTz().optional(),
        end_date: stringIsTimestampTz().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedTicker = await opts.ctx.prisma.ticker.updateManyAndReturn({
        data: {
          id: opts.input.id,
          title: opts.input.title,
          callout: opts.input.callout,
          target_url: opts.input.target_url,
          status: opts.input.status,
          start_date: opts.input.start_date,
          end_date: opts.input.end_date,
        },
        where: {
          id: opts.input.id,
        },
      });
      checkUpdateResult(updatedTicker.length, "ticker", "tickers");
      return {
        code: STATUS_OK,
        message: "Success",
        ticker: updatedTicker[0],
      };
    }),
};
