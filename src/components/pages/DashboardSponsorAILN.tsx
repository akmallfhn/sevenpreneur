"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import { setSessionToken } from "@/trpc/client";
import { ArrowRight, Download, Megaphone } from "lucide-react";
import { useEffect, useState } from "react";

const BLUE_DARK = "#00359D";
const BLUE_MID = "#5b7bc4";
const BLUE_SOFT = "#dde4f3";
const BLUE_MUTED = "#9eb0d3";
const BLUE_PALE = "#eef2fb";

// ---------- Mock data ----------

const PERIODS = ["7H", "30H", "Cohort", "YTD"] as const;
type Period = (typeof PERIODS)[number];

type Delta = { dir: "up" | "down" | "neutral"; text: string };

const KPI_CARDS: {
  label: string;
  value: string;
  unit: string;
  delta: Delta;
  spark: number[];
  cta: string;
}[] = [
  {
    label: "AVG LEVEL ORGANISASI",
    value: "2.1",
    unit: "/ 4",
    delta: { dir: "up", text: "+0.3% vs bulan lalu" },
    spark: [1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.1],
    cta: "Distribusi Level",
  },
  {
    label: "JAM DIHEMAT (KUMULATIF)",
    value: "4,820",
    unit: "jam",
    delta: { dir: "up", text: "+24.5% vs Apr" },
    spark: [400, 800, 1200, 1700, 2400, 3500, 4820],
    cta: "Lihat ROI",
  },
  {
    label: "ROI (COHORT-TO-DATE)",
    value: "1.84",
    unit: "Mly Rp",
    delta: { dir: "up", text: "+38% vs target" },
    spark: [0.2, 0.4, 0.7, 0.9, 1.2, 1.5, 1.84],
    cta: "Breakdown",
  },
  {
    label: "STAFF AKTIF MINGGUAN",
    value: "87",
    unit: "%",
    delta: { dir: "down", text: "-2.1% vs minggu lalu" },
    spark: [82, 85, 88, 91, 90, 89, 87],
    cta: "Drill departemen",
  },
];

const TREND_WEEKS = [
  { label: "W1 Jun", value: 0.1 },
  { label: "W2 Jun", value: 0.2 },
  { label: "W3 Jun", value: 0.3 },
  { label: "W4 Jun", value: 0.4 },
  { label: "W1 Jul", value: 0.6 },
  { label: "W2 Jul", value: 0.9 },
  { label: "W3 Jul", value: 1.3 },
  { label: "W4 Jul", value: 1.8 },
  { label: "W1 Agu", value: 2.4 },
  { label: "W2 Agu", value: 3.1 },
  { label: "W3 Agu", value: 3.9 },
  { label: "W4 Agu", value: 4.8, highlight: true },
];

const LEVELS: {
  code: string;
  name: string;
  count: number;
  percent: number;
  color: string;
}[] = [
  { code: "L0", name: "Belum mulai", count: 43, percent: 18, color: BLUE_PALE },
  { code: "L1", name: "Explorer", count: 84, percent: 35, color: BLUE_MUTED },
  { code: "L2", name: "Practitioner", count: 67, percent: 28, color: BLUE_MID },
  { code: "L3", name: "Builder", count: 36, percent: 15, color: BLUE_DARK },
  { code: "L4", name: "Architect", count: 10, percent: 4, color: "#001f5d" },
];

const TOP_DEPARTMENTS = [
  { rank: 1, name: "Operations", hours: 412 },
  { rank: 2, name: "Customer Support", hours: 318 },
  { rank: 3, name: "Product", hours: 286 },
  { rank: 4, name: "Engineering", hours: 244 },
  { rank: 5, name: "Marketing", hours: 121 },
];

const HEALTH_CARDS: {
  label: string;
  value: string;
  target: string;
  hint: string;
  tone: "good" | "warn";
}[] = [
  {
    label: "LULUS L1",
    value: "84%",
    target: "vs 80%",
    hint: "Di atas target",
    tone: "good",
  },
  {
    label: "LULUS L2",
    value: "61%",
    target: "vs 65%",
    hint: "Slight gap",
    tone: "warn",
  },
  {
    label: "SUBMISSION ACCEPTED",
    value: "92%",
    target: "vs 85%",
    hint: "Comment loop sehat",
    tone: "good",
  },
  {
    label: "NPS CHAMPION",
    value: "+48",
    target: "vs +30",
    hint: "11 dari 12 respond",
    tone: "good",
  },
];

const ACTIVITY: {
  actor: string;
  action: string;
  meta: string;
  time: string;
}[] = [
  {
    actor: "Champion Adi P.",
    action: "submit report bulanan",
    meta: "Product · Mei 2026",
    time: "12 mnt",
  },
  {
    actor: "Sistem",
    action: "auto-promote 4 staff ke L2",
    meta: "Operations, CS, Eng",
    time: "1j",
  },
  {
    actor: "Champion Bunga S.",
    action: "accept 6 use case",
    meta: "Marketing · ROI +84j",
    time: "2j",
  },
  {
    actor: "Indah Maharani",
    action: "selesai pre-assessment",
    meta: "Joined cohort · Research",
    time: "3j",
  },
];

// ---------- Component ----------

export default function DashboardSponsorAILN({
  sessionToken,
}: {
  sessionToken: string;
}) {
  useEffect(() => {
    setSessionToken(sessionToken);
  }, [sessionToken]);

  const [period, setPeriod] = useState<Period>("Cohort");

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold tracking-widest text-gray-500">
              SPONSOR · EXECUTIVE VIEW
            </div>
            <h1 className="mt-1 text-3xl font-bold leading-tight text-gray-900">
              Hutama Karya
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              240 staff aktif · 18 departemen · cohort Q2-2026 berjalan
              ke-bulan-2.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PeriodToggle period={period} onChange={setPeriod} />
            <ButtonAILN variant="light" size="medium">
              <Download className="size-4" />
              Export PDF
            </ButtonAILN>
            <ButtonAILN variant="primary" size="medium">
              <Megaphone className="size-4" />
              Kirim pengumuman
            </ButtonAILN>
          </div>
        </div>

        {/* 4 KPI cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {KPI_CARDS.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </div>

        {/* Trend + Distribusi Level + Top Departemen */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          {/* Trend mingguan */}
          <div className="rounded-lg border border-dashboard-border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="text-base font-bold text-gray-900">
                  Trend mingguan · Jam dihemat × Adopsi
                </div>
                <p className="mt-0.5 text-xs text-gray-500">
                  W1 Jun – W4 Agu · sumber log workplace use case
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{ backgroundColor: BLUE_DARK }}
                  />
                  Jam dihemat
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{ backgroundColor: BLUE_MUTED }}
                  />
                  Adopsi %
                </span>
              </div>
            </div>

            <div className="mt-5">
              <TrendBarChart data={TREND_WEEKS} />
            </div>

            <div
              className="mt-5 rounded-md px-4 py-3 text-sm"
              style={{ backgroundColor: BLUE_PALE, color: BLUE_DARK }}
            >
              <span className="font-semibold">Insight:</span>{" "}
              <span className="text-gray-700">
                akselerasi 24% minggu ini didorong departemen{" "}
                <span className="font-semibold text-gray-900">
                  Operations (+412j)
                </span>{" "}
                dan{" "}
                <span className="font-semibold text-gray-900">
                  Customer Support (+318j)
                </span>
                .
              </span>
            </div>
          </div>

          {/* Right column: stacked */}
          <div className="flex flex-col gap-4">
            {/* Distribusi Level Organisasi */}
            <div className="rounded-lg border border-dashboard-border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="text-base font-bold text-gray-900">
                  Distribusi Level Organisasi
                </div>
                <button
                  className="inline-flex items-center gap-1 text-xs font-semibold"
                  style={{ color: BLUE_DARK }}
                >
                  Drill <ArrowRight className="size-3" />
                </button>
              </div>

              {/* Stacked bar */}
              <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full">
                {LEVELS.map((l) => (
                  <div
                    key={l.code}
                    style={{
                      width: `${l.percent}%`,
                      backgroundColor: l.color,
                    }}
                  />
                ))}
              </div>

              {/* Legend */}
              <ul className="mt-4 flex flex-col gap-2 text-sm">
                {LEVELS.map((l) => (
                  <li
                    key={l.code}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="inline-block size-2.5 rounded-sm"
                        style={{ backgroundColor: l.color }}
                      />
                      <span className="font-semibold text-gray-900">
                        {l.code}
                      </span>
                      <span className="text-gray-600">{l.name}</span>
                    </div>
                    <div className="flex items-baseline gap-3 text-xs">
                      <span className="font-semibold text-gray-900">
                        {l.count}
                      </span>
                      <span
                        className="w-8 text-right font-medium"
                        style={{ color: BLUE_DARK }}
                      >
                        {l.percent}%
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Departemen */}
            <div className="rounded-lg border border-dashboard-border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-base font-bold text-gray-900">
                    Top Departemen
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    by jam dihemat bulan ini
                  </p>
                </div>
                <button
                  className="inline-flex items-center gap-1 text-xs font-semibold"
                  style={{ color: BLUE_DARK }}
                >
                  Semua <ArrowRight className="size-3" />
                </button>
              </div>

              <ul className="mt-3 flex flex-col gap-2.5 text-sm">
                {TOP_DEPARTMENTS.map((d) => {
                  const maxHours = TOP_DEPARTMENTS[0].hours;
                  const widthPct = (d.hours / maxHours) * 100;
                  return (
                    <li
                      key={d.name}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-3"
                    >
                      <span className="text-xs font-semibold text-gray-400">
                        #{d.rank}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate text-gray-900">{d.name}</div>
                        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${widthPct}%`,
                              backgroundColor: BLUE_DARK,
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {d.hours}j
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Kesehatan Program + Aktivitas terkini */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* Kesehatan Program */}
          <div className="rounded-lg border border-dashboard-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div className="text-base font-bold text-gray-900">
                Kesehatan Program
              </div>
              <span className="text-xs text-gray-500">Update real-time</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
              {HEALTH_CARDS.map((h) => (
                <HealthCard key={h.label} {...h} />
              ))}
            </div>
          </div>

          {/* Aktivitas terkini */}
          <div className="rounded-lg border border-dashboard-border bg-white p-5 shadow-sm">
            <div className="text-base font-bold text-gray-900">
              Aktivitas terkini
            </div>
            <ul className="mt-3 flex flex-col gap-3 text-sm">
              {ACTIVITY.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 inline-block size-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: BLUE_DARK }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-gray-900">
                      <span className="font-semibold">{a.actor}</span>{" "}
                      <span className="text-gray-700">{a.action}</span>
                    </div>
                    <div className="text-xs text-gray-500">{a.meta}</div>
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">
                    {a.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageContainerAILN>
  );
}

// ---------- Sub-components ----------

function PeriodToggle({
  period,
  onChange,
}: {
  period: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <div className="inline-flex h-9 items-center rounded-md border border-dashboard-border bg-white p-0.5 text-sm">
      {PERIODS.map((p) => {
        const active = p === period;
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`h-full rounded px-3 text-xs font-semibold transition-colors ${
              active
                ? "bg-black text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {p}
          </button>
        );
      })}
    </div>
  );
}

function KpiCard({
  label,
  value,
  unit,
  delta,
  spark,
  cta,
}: {
  label: string;
  value: string;
  unit: string;
  delta: Delta;
  spark: number[];
  cta: string;
}) {
  const arrow = delta.dir === "up" ? "↑" : delta.dir === "down" ? "↓" : "•";
  const deltaColor = delta.dir === "down" ? BLUE_MUTED : BLUE_DARK;

  return (
    <div className="relative flex flex-col rounded-lg border border-dashboard-border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold tracking-widest text-gray-500">
        <span className="truncate">{label}</span>
        <ArrowRight className="size-3.5 shrink-0 text-gray-400" />
      </div>

      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold leading-none text-gray-900">
          {value}
        </span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>

      <div className="mt-2 text-xs font-medium" style={{ color: deltaColor }}>
        {arrow} {delta.text}
      </div>

      <div className="mt-3 -mb-1 -mx-1">
        <Sparkline data={spark} color={BLUE_DARK} />
      </div>

      <button
        className="mt-2 self-end text-xs font-semibold"
        style={{ color: BLUE_DARK }}
      >
        {cta} →
      </button>
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const W = 200;
  const H = 44;
  const PAD = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stepX = (W - PAD * 2) / (data.length - 1);

  const points = data.map((v, i) => {
    const x = PAD + i * stepX;
    const y = PAD + (1 - (v - min) / range) * (H - PAD * 2);
    return [x, y] as const;
  });

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L${points[points.length - 1][0].toFixed(1)},${H} L${points[0][0].toFixed(1)},${H} Z`;

  const gradId = `sparkGrad-${color.replace("#", "")}`;
  const last = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-11 w-full"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />
    </svg>
  );
}

function TrendBarChart({
  data,
}: {
  data: { label: string; value: number; highlight?: boolean }[];
}) {
  const W = 720;
  const H = 240;
  const PAD_L = 8;
  const PAD_R = 8;
  const PAD_T = 28;
  const PAD_B = 28;

  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  const slot = chartW / data.length;
  const barW = slot * 0.6;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-64 w-full"
    >
      {data.map((d, i) => {
        const barH = (d.value / max) * chartH;
        const x = PAD_L + i * slot + (slot - barW) / 2;
        const y = PAD_T + (chartH - barH);
        const color = d.highlight ? BLUE_DARK : BLUE_SOFT;
        const labelColor = d.highlight ? BLUE_DARK : "#6b7280";
        return (
          <g key={i}>
            <text
              x={x + barW / 2}
              y={y - 6}
              textAnchor="middle"
              fontSize="11"
              fontWeight={d.highlight ? 700 : 500}
              fill={labelColor}
            >
              {d.value.toFixed(1)}k
            </text>
            <rect x={x} y={y} width={barW} height={barH} rx={3} fill={color} />
            <text
              x={x + barW / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize="11"
              fontWeight={d.highlight ? 700 : 400}
              fill={d.highlight ? "#111827" : "#6b7280"}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function HealthCard({
  label,
  value,
  target,
  hint,
  tone,
}: {
  label: string;
  value: string;
  target: string;
  hint: string;
  tone: "good" | "warn";
}) {
  const dotColor = tone === "good" ? "#10b981" : "#f59e0b";
  const pillBg = tone === "good" ? "#ecfdf5" : "#fffbeb";
  const pillText = tone === "good" ? "#047857" : "#b45309";

  return (
    <div className="flex flex-col rounded-md border border-dashboard-border bg-white p-3">
      <div className="text-[10px] font-semibold tracking-widest text-gray-500">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-xs text-gray-500">{target}</span>
      </div>
      <span
        className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium"
        style={{ backgroundColor: pillBg, color: pillText }}
      >
        <span
          className="inline-block size-1.5 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
        {hint}
      </span>
    </div>
  );
}
