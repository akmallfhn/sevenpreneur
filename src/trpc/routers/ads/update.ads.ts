import { STATUS_OK } from "@/lib/status_code";
import { roleBasedProcedure } from "@/trpc/init";
import { checkUpdateResult } from "@/trpc/utils/errors";
import {
  numberIsID,
  stringIsTimestampTz,
  stringNotBlank,
} from "@/trpc/utils/validation";
import { StatusEnum } from "@prisma/client";
import z from "zod";

export const updateAdv = {
  interstitial: roleBasedProcedure(["Administrator", "Marketer"])
    .input(
      z.object({
        id: numberIsID(),
        title: stringNotBlank().optional(),
        call_to_action: stringNotBlank().nullable().optional(),
        target_url: stringNotBlank().optional(),
        image_desktop: stringNotBlank().nullable().optional(),
        image_mobile: stringNotBlank().nullable().optional(),
        status: z.enum(StatusEnum).optional(),
        start_date: stringIsTimestampTz().optional(),
        end_date: stringIsTimestampTz().optional(),
      })
    )
    .mutation(async (opts) => {
      const updatedInterstitialAd =
        await opts.ctx.prisma.interstitialAd.updateManyAndReturn({
          data: {
            title: opts.input.title,
            call_to_action: opts.input.call_to_action,
            target_url: opts.input.target_url,
            image_desktop: opts.input.image_desktop,
            image_mobile: opts.input.image_mobile,
            status: opts.input.status,
            start_date: opts.input.start_date,
            end_date: opts.input.end_date,
          },
          where: {
            id: opts.input.id,
          },
        });
      checkUpdateResult(
        updatedInterstitialAd.length,
        "interstitial ad",
        "interstitial ads"
      );
      return {
        code: STATUS_OK,
        message: "Success",
        interstitial: updatedInterstitialAd[0],
      };
    }),
};
