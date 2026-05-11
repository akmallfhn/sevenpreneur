import { createTRPCRouter } from "@/trpc/init";
import { listAnalytics } from "./list.analytics";

export const analyticsRouter = createTRPCRouter({
  getDailyMetrics: listAnalytics.dailyMetrics,
});
