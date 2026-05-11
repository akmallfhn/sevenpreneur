import { STATUS_OK } from "@/lib/status_code";
import { administratorProcedure } from "@/trpc/init";
import z from "zod";

type GA4DailyMetric = {
  date: string;
  sessions: number;
  users: number;
  new_users: number;
  bounce_rate: number;
  avg_session_duration: number;
  conversions: number;
};

type TrafficSourceMetric = {
  source: string;
  sessions: number;
};

type GA4DailyMetricsResult = {
  code: number;
  message: string;
  list: GA4DailyMetric[];
  traffic_sources: TrafficSourceMetric[];
  is_configured: boolean;
  error?: string;
};

export const listAnalytics = {
  /**
   * Fetch daily GA4 metrics from the Google Analytics Data API.
   * Requires env vars: GA4_PROPERTY_ID, GOOGLE_SERVICE_ACCOUNT_JSON
   */
  dailyMetrics: administratorProcedure
    .input(
      z.object({
        days: z.number().int().positive().max(90).default(7),
      })
    )
    .query(async (opts): Promise<GA4DailyMetricsResult> => {
      const propertyId = process.env.GA4_PROPERTY_ID;
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
        (row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => {
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

      const trafficSources: TrafficSourceMetric[] = (
        sourceJson.rows ?? []
      ).map(
        (row: { dimensionValues: { value: string }[]; metricValues: { value: string }[] }) => ({
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
};

/**
 * Exchange a Google service account JSON for a short-lived access token
 * using the JWT Bearer flow (no external libraries required).
 */
async function getGoogleAccessToken(
  serviceAccount: Record<string, string>
): Promise<string | null> {
  try {
    const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
    const now = Math.floor(Date.now() / 1000);

    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: serviceAccount.client_email,
      scope: SCOPE,
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    };

    const encode = (obj: object) =>
      Buffer.from(JSON.stringify(obj))
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const unsignedToken = `${encode(header)}.${encode(payload)}`;

    // Import private key using WebCrypto
    const pemBody = serviceAccount.private_key
      .replace(/-----BEGIN PRIVATE KEY-----/g, "")
      .replace(/-----END PRIVATE KEY-----/g, "")
      .replace(/\n/g, "");

    const binaryDer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      binaryDer.buffer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      new TextEncoder().encode(unsignedToken)
    );

    const sigBase64 = Buffer.from(signature)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const jwt = `${unsignedToken}.${sigBase64}`;

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });

    if (!tokenRes.ok) return null;
    const tokenJson = await tokenRes.json();
    return tokenJson.access_token ?? null;
  } catch (err) {
    console.error("[GA4] Token error:", err);
    return null;
  }
}
