"use client";
import { trpc } from "@/trpc/client";
import { useSidebar } from "@/contexts/SidebarContext";
import { LineChart } from "@mui/x-charts";
import Image from "next/image";
import { useState } from "react";

// ---- Helpers ----
type DateRange = 7 | 14 | 30;

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}
function fmtCurrency(n: number) {
  return `$${n.toFixed(2)}`;
}
function fmtPct(n: number) {
  return `${(n * 100).toFixed(2)}%`;
}
const CHART_SX = {
  "& .MuiChartsAxis-tickLabel": {
    fill: "var(--color-foreground)",
    fontSize: 11,
  },
  "& .MuiChartsAxis-line": { stroke: "var(--color-border)" },
  "& .MuiChartsAxis-tick": { stroke: "var(--color-border)" },
  "& .MuiChartsGrid-line": { stroke: "var(--color-border)" },
};

// ---- Small components ----
function KpiCard({
  label,
  value,
  loading,
}: {
  label: string;
  value: string;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-1.5 p-4 bg-card-bg border border-dashboard-border rounded-lg animate-pulse">
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-6 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1 p-4 bg-card-bg border border-dashboard-border rounded-lg">
      <p className="font-bodycopy text-xs text-emphasis font-medium">{label}</p>
      <p className="font-bodycopy font-bold text-xl">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
  loading,
  height = 240,
}: {
  title: string;
  children: React.ReactNode;
  loading: boolean;
  height?: number;
}) {
  return (
    <div className="flex flex-col gap-2 p-4 bg-card-bg border border-dashboard-border rounded-lg">
      <p className="font-bodycopy font-bold text-sm">{title}</p>
      {loading ? (
        <div
          className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg"
          style={{ height }}
        />
      ) : (
        children
      )}
    </div>
  );
}

function InlineError({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm font-bodycopy text-destructive">
      ⚠️ {message}
    </div>
  );
}

function NotConfiguredBadge() {
  return (
    <span className="text-xs font-bodycopy text-emphasis bg-secondary-soft-background px-2 py-0.5 rounded-full">
      Not configured — set env vars
    </span>
  );
}

const DATE_RANGE_OPTIONS: { label: string; value: DateRange }[] = [
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
];

interface HomeCMSProps {
  sessionUserName: string;
  sessionToken: string;
}

export default function HomeCMS(props: HomeCMSProps) {
  const { isCollapsed } = useSidebar();
  const [dateRange, setDateRange] = useState<DateRange>(7);

  const {
    data: metaData,
    isLoading: metaLoading,
    isError: metaError,
  } = trpc.list.analytics.metaAdsDailyMetrics.useQuery(
    { days: dateRange },
    { enabled: !!props.sessionToken }
  );

  // ---- Aggregate Meta KPIs ----
  const metaKpis = (() => {
    const list = metaData?.list;
    if (!list?.length) return null;
    const n = list.length;
    const sum = list.reduce(
      (a, d) => ({
        spend: a.spend + d.spend,
        impressions: a.impressions + d.impressions,
        reach: a.reach + d.reach,
        clicks: a.clicks + d.clicks,
        ctr: a.ctr + d.ctr,
        cpc: a.cpc + d.cpc,
        cpm: a.cpm + d.cpm,
        roas: a.roas + d.roas,
      }),
      {
        spend: 0,
        impressions: 0,
        reach: 0,
        clicks: 0,
        ctr: 0,
        cpc: 0,
        cpm: 0,
        roas: 0,
      }
    );
    return { ...sum, n };
  })();

  // ---- Chart data ----
  const metaList = metaData?.list ?? [];
  const dateLabels = (list: { date: string }[]) =>
    list.map((d) => d.date.slice(5));

  return (
    <div
      className={`root hidden w-full h-full justify-center bg-white dark:bg-background py-8 overflow-y-auto lg:flex ${
        isCollapsed ? "pl-16" : "pl-64"
      }`}
    >
      <div className="container max-w-[calc(100%-4rem)] w-full flex flex-col gap-6">
        {/* Hero Banner */}
        <div className="relative flex w-full items-center aspect-panorama-leaderboard rounded-lg overflow-hidden">
          <div className="flex flex-col pl-8 gap-1 z-10">
            <h1 className="font-brand font-bold text-2xl text-white">
              Hello, {props.sessionUserName}
            </h1>
            <h1 className="font-bodycopy font-bold text-xl text-white">
              Welcome to Content Management System of Sevenpreneur
            </h1>
          </div>
          <Image
            className="object-cover w-full h-full"
            src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/hello-dashboard.webp"
            alt="Header"
            fill
          />
        </div>

        {/* ---- Marketing Dashboard Header ---- */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bodycopy font-bold text-xl">
              Marketing Overview
            </h2>
            <p className="font-bodycopy text-sm text-emphasis">
              Meta Ads &amp; Google Analytics metrics
            </p>
          </div>
          {/* Date range filter */}
          <div className="flex items-center gap-1 p-1 bg-card-bg border border-dashboard-border rounded-lg">
            {DATE_RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDateRange(opt.value)}
                className={`px-3 py-1.5 rounded-md text-sm font-bodycopy font-medium transition-colors ${
                  dateRange === opt.value
                    ? "bg-cms-primary text-white"
                    : "text-emphasis hover:bg-sb-item-hover"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ========== META ADS SECTION ========== */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-5 bg-blue-500 rounded-full shrink-0" />
            <h3 className="font-bodycopy font-bold text-[15px]">
              Meta Ads Performance
            </h3>
            {metaData && !metaData.is_configured && <NotConfiguredBadge />}
          </div>

          {metaError && (
            <InlineError message="Failed to load Meta Ads data. Check META_ACCESS_TOKEN and META_AD_ACCOUNT_ID." />
          )}
          {metaData?.error && (
            <InlineError message={`Meta Ads: ${metaData.error}`} />
          )}

          {/* Meta KPI grid */}
          <div className="grid grid-cols-4 gap-3">
            <KpiCard
              label="Total Spend"
              value={metaKpis ? fmtCurrency(metaKpis.spend) : "—"}
              loading={metaLoading}
            />
            <KpiCard
              label="Impressions"
              value={metaKpis ? fmt(metaKpis.impressions) : "—"}
              loading={metaLoading}
            />
            <KpiCard
              label="Reach"
              value={metaKpis ? fmt(metaKpis.reach) : "—"}
              loading={metaLoading}
            />
            <KpiCard
              label="Clicks"
              value={metaKpis ? fmt(metaKpis.clicks) : "—"}
              loading={metaLoading}
            />
            <KpiCard
              label="Avg CTR"
              value={metaKpis ? fmtPct(metaKpis.ctr / metaKpis.n / 100) : "—"}
              loading={metaLoading}
            />
            <KpiCard
              label="Avg CPC"
              value={metaKpis ? fmtCurrency(metaKpis.cpc / metaKpis.n) : "—"}
              loading={metaLoading}
            />
            <KpiCard
              label="Avg CPM"
              value={metaKpis ? fmtCurrency(metaKpis.cpm / metaKpis.n) : "—"}
              loading={metaLoading}
            />
            <KpiCard
              label="ROAS"
              value={
                metaKpis ? `${(metaKpis.roas / metaKpis.n).toFixed(2)}x` : "—"
              }
              loading={metaLoading}
            />
          </div>

          {/* Meta charts */}
          <div className="grid grid-cols-2 gap-4">
            <ChartCard title="Daily Spend & Clicks" loading={metaLoading}>
              <LineChart
                height={220}
                series={[
                  {
                    data: metaList.map((d) => d.spend),
                    label: "Spend ($)",
                    color: "#6366f1",
                    showMark: false,
                  },
                  {
                    data: metaList.map((d) => d.clicks),
                    label: "Clicks",
                    color: "#22c55e",
                    showMark: false,
                  },
                ]}
                xAxis={[
                  {
                    data: dateLabels(metaList),
                    scaleType: "band",
                    tickLabelStyle: { fontSize: 10 },
                  },
                ]}
                yAxis={[{ tickLabelStyle: { fontSize: 10 } }]}
                margin={{ top: 10, right: 16, bottom: 28, left: 48 }}
                sx={CHART_SX}
              />
            </ChartCard>

            <ChartCard title="Impressions & Reach" loading={metaLoading}>
              <LineChart
                height={220}
                series={[
                  {
                    data: metaList.map((d) => d.impressions),
                    label: "Impressions",
                    color: "#f97316",
                    showMark: false,
                  },
                  {
                    data: metaList.map((d) => d.reach),
                    label: "Reach",
                    color: "#06b6d4",
                    showMark: false,
                  },
                ]}
                xAxis={[
                  {
                    data: dateLabels(metaList),
                    scaleType: "band",
                    tickLabelStyle: { fontSize: 10 },
                  },
                ]}
                yAxis={[{ tickLabelStyle: { fontSize: 10 } }]}
                margin={{ top: 10, right: 16, bottom: 28, left: 48 }}
                sx={CHART_SX}
              />
            </ChartCard>
          </div>
        </div>

        {/* bottom spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}
