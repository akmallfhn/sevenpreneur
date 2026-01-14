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
};
