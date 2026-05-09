import { STATUS_OK } from "@/lib/status_code";
import { publicProcedure } from "@/trpc/init";
import { readFailedNotFound } from "@/trpc/utils/errors";
import { objectHasOnlyID } from "@/trpc/utils/validation";

export const readAdv = {
  interstitial: publicProcedure.input(objectHasOnlyID()).query(async (opts) => {
    const theInterstitialAd = await opts.ctx.prisma.interstitialAd.findUnique({
      where: {
        id: opts.input.id,
      },
    });
    if (!theInterstitialAd) {
      throw readFailedNotFound("interstitial ad");
    }
    return {
      code: STATUS_OK,
      message: "Success",
      interstitial: theInterstitialAd,
    };
  }),

  ticker: publicProcedure.input(objectHasOnlyID()).query(async (opts) => {
    const theTicker = await opts.ctx.prisma.ticker.findUnique({
      where: {
        id: opts.input.id,
      },
    });
    if (!theTicker) {
      throw readFailedNotFound("ticker");
    }
    return {
      code: STATUS_OK,
      message: "Success",
      ticker: theTicker,
    };
  }),
};
