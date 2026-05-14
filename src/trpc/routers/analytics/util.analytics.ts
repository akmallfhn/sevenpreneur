export type GA4DailyMetric = {
  date: string;
  sessions: number;
  users: number;
  new_users: number;
  bounce_rate: number;
  avg_session_duration: number;
  conversions: number;
};

export type TrafficSourceMetric = {
  source: string;
  sessions: number;
};

export type GA4DailyMetricsResult = {
  code: string;
  message: string;
  list: GA4DailyMetric[];
  traffic_sources: TrafficSourceMetric[];
  is_configured: boolean;
  error?: string;
};

export type MetaAdsDailyMetric = {
  date: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
};

export type MetaAdsDailyMetricsResult = {
  code: string;
  message: string;
  list: MetaAdsDailyMetric[];
  is_configured: boolean;
  error?: string;
};

export async function getGoogleAccessToken(
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
