import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import z from "zod";
import type {
  MetaAdsDailyMetric,
  MetaAdsDailyMetricsResult,
} from "./util.analytics";

export const listAnalytics = {
  metaAdsDailyMetrics: administratorProcedure
    .input(
      z.object({
        days: z.number().int().positive().max(90).default(7),
      })
    )
    .query(async (opts): Promise<MetaAdsDailyMetricsResult> => {
      const accessToken = process.env.META_ACCESS_TOKEN;
      const adAccountId = process.env.META_AD_ACCOUNT_ID;

      if (!accessToken || !adAccountId) {
        return {
          code: STATUS_OK,
          message: "Meta Ads credentials not configured",
          list: [],
          is_configured: false,
        };
      }

      // Calculate date range
      const today = new Date();
      const since = new Date(today);
      since.setDate(today.getDate() - opts.input.days);
      const sinceStr = since.toISOString().split("T")[0];
      const untilStr = today.toISOString().split("T")[0];

      const fields = [
        "spend",
        "impressions",
        "reach",
        "clicks",
        "ctr",
        "cpc",
        "cpm",
        "actions",
        "action_values",
      ].join(",");

      const url = new URL(
        `https://graph.facebook.com/v19.0/act_${adAccountId}/insights`
      );
      url.searchParams.set("access_token", accessToken);
      url.searchParams.set("fields", fields);
      url.searchParams.set(
        "time_range",
        JSON.stringify({ since: sinceStr, until: untilStr })
      );
      url.searchParams.set("time_increment", "1");
      url.searchParams.set("level", "account");

      const response = await fetch(url.toString(), {
        next: { revalidate: 300 }, // Cache 5 minutes
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[MetaAds] API error:", response.status, errorText);
        return {
          code: STATUS_OK,
          message: `Meta Ads API error: ${response.status}`,
          list: [],
          is_configured: true,
          error: `HTTP ${response.status}`,
        };
      }

      type MetaAdsInsightEntry = {
        date_start: string;
        spend?: string;
        impressions?: string;
        reach?: string;
        clicks?: string;
        ctr?: string;
        cpc?: string;
        cpm?: string;
        action_values?: { action_type: string; value: string }[];
      };

      const json = await response.json();
      const data: MetaAdsDailyMetric[] = (json.data ?? []).map(
        (entry: MetaAdsInsightEntry) => {
          // ROAS = total conversion value / spend
          const purchaseValue =
            (entry.action_values ?? []).find(
              (av) => av.action_type === "purchase"
            )?.value ?? "0";

          const spend = parseFloat(entry.spend ?? "0");
          const roas = spend > 0 ? parseFloat(purchaseValue) / spend : 0;

          return {
            date: entry.date_start,
            spend,
            impressions: parseInt(entry.impressions ?? "0", 10),
            reach: parseInt(entry.reach ?? "0", 10),
            clicks: parseInt(entry.clicks ?? "0", 10),
            ctr: parseFloat(entry.ctr ?? "0"),
            cpc: parseFloat(entry.cpc ?? "0"),
            cpm: parseFloat(entry.cpm ?? "0"),
            roas: parseFloat(roas.toFixed(2)),
          };
        }
      );

      return {
        code: STATUS_OK,
        message: "Success",
        list: data,
        is_configured: true,
      };
    }),
};
