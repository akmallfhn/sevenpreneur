import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import z from "zod";
import { getGoogleAccessToken } from "./util.analytics";
import type {
  GA4DailyMetric,
  GA4DailyMetricsResult,
  MetaAdsDailyMetric,
  MetaAdsDailyMetricsResult,
  TrafficSourceMetric,
} from "./util.analytics";

export const listAnalytics = {
  ga4DailyMetrics: administratorProcedure
    .input(
      z.object({
        days: z.number().int().positive().max(90).default(7),
      })
    )
    .query(async (opts): Promise<GA4DailyMetricsResult> => {
      const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;
      const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

      if (!propertyId || !serviceAccountJson) {
        return {
          code: STATUS_OK,
          message: "GA4 credentials not configured",
          list: [],
          traffic_sources: [],
          is_configured: false,
        };
      }

      // Parse service account and get access token via JWT
      let serviceAccount: Record<string, string>;
      try {
        serviceAccount = JSON.parse(serviceAccountJson);
      } catch {
        return {
          code: STATUS_OK,
          message: "Invalid GOOGLE_SERVICE_ACCOUNT_JSON",
          list: [],
          traffic_sources: [],
          is_configured: true,
          error: "Invalid service account JSON",
        };
      }

      // Build JWT for Google OAuth2
      const accessToken = await getGoogleAccessToken(serviceAccount);
      if (!accessToken) {
        return {
          code: STATUS_OK,
          message: "Failed to obtain Google access token",
          list: [],
          traffic_sources: [],
          is_configured: true,
          error: "OAuth token error",
        };
      }

      const days = opts.input.days;
      const dateRange = { startDate: `${days}daysAgo`, endDate: "today" };

      // Request 1: Daily metrics
      const dailyPayload = {
        dateRanges: [dateRange],
        dimensions: [{ name: "date" }],
        metrics: [
          { name: "sessions" },
          { name: "totalUsers" },
          { name: "newUsers" },
          { name: "bounceRate" },
          { name: "averageSessionDuration" },
          { name: "conversions" },
        ],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      };

      // Request 2: Traffic source breakdown
      const sourcePayload = {
        dateRanges: [dateRange],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      };

      const [dailyRes, sourceRes] = await Promise.all([
        fetch(
          `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dailyPayload),
            next: { revalidate: 300 },
          }
        ),
        fetch(
          `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(sourcePayload),
            next: { revalidate: 300 },
          }
        ),
      ]);

      if (!dailyRes.ok || !sourceRes.ok) {
        const errText = !dailyRes.ok
          ? await dailyRes.text()
          : await sourceRes.text();
        console.error("[GA4] API error:", errText);
        return {
          code: STATUS_OK,
          message: "GA4 API error",
          list: [],
          traffic_sources: [],
          is_configured: true,
          error: errText.slice(0, 200),
        };
      }

      const dailyJson = await dailyRes.json();
      const sourceJson = await sourceRes.json();

      const dailyList: GA4DailyMetric[] = (dailyJson.rows ?? []).map(
        (row: {
          dimensionValues: { value: string }[];
          metricValues: { value: string }[];
        }) => {
          const rawDate = row.dimensionValues[0].value; // YYYYMMDD
          const date = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
          const mv = row.metricValues;
          return {
            date,
            sessions: parseInt(mv[0]?.value ?? "0", 10),
            users: parseInt(mv[1]?.value ?? "0", 10),
            new_users: parseInt(mv[2]?.value ?? "0", 10),
            bounce_rate: parseFloat(parseFloat(mv[3]?.value ?? "0").toFixed(4)),
            avg_session_duration: parseFloat(
              parseFloat(mv[4]?.value ?? "0").toFixed(1)
            ),
            conversions: parseInt(mv[5]?.value ?? "0", 10),
          };
        }
      );

      const trafficSources: TrafficSourceMetric[] = (sourceJson.rows ?? []).map(
        (row: {
          dimensionValues: { value: string }[];
          metricValues: { value: string }[];
        }) => ({
          source: row.dimensionValues[0].value,
          sessions: parseInt(row.metricValues[0]?.value ?? "0", 10),
        })
      );

      return {
        code: STATUS_OK,
        message: "Success",
        list: dailyList,
        traffic_sources: trafficSources,
        is_configured: true,
      };
    }),

  metaAdsDailyMetrics: administratorProcedure
    .input(
      z.object({
        days: z.number().int().positive().max(90).default(7),
      })
    )
    .query(async (): Promise<MetaAdsDailyMetricsResult> => {
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
      since.setDate(today.getDate() - 7);
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
