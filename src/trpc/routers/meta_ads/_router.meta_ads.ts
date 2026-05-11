import { createTRPCRouter } from "@/trpc/init";
import { listMetaAds } from "./list.meta_ads";

export const metaAdsRouter = createTRPCRouter({
  getDailyMetrics: listMetaAds.dailyMetrics,
});
