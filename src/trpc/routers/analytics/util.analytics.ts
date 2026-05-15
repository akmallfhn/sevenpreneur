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
