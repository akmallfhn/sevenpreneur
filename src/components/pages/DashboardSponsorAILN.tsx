"use client";
import ButtonAILN from "@/components/buttons/ButtonAILN";
import PageContainerAILN from "@/components/pages/PageContainerAILN";
import { setSessionToken } from "@/trpc/client";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Download,
  Info,
  Settings2,
} from "lucide-react";
import { useEffect } from "react";

const BLUE_DARK = "#00359D";
const BLUE_MID = "#5b7bc4";
const BLUE_SOFT = "#dde4f3";
const BLUE_MUTED = "#9eb0d3";
const GRAY_DARK = "#3f3f3f";

// ---------- Mock data ----------

const HERO_SERIES = [12, 18, 24, 30, 38, 46, 55, 63, 70, 76, 80, 82];

const DISTRIBUTION = {
  active: { label: "Active · L3+", count: 440, percent: 22, color: BLUE_DARK },
  learning: {
    label: "Learning · L1–2",
    count: 1200,
    percent: 60,
    color: GRAY_DARK,
  },
  inactive: {
    label: "Inactive · L0",
    count: 360,
    percent: 18,
    color: BLUE_MUTED,
  },
};

const MOVEMENTS = [
  { from: "Inactive", to: "Learning", net: 84, color: GRAY_DARK },
  { from: "Learning", to: "Active", net: 146, color: BLUE_DARK },
  {
    from: "Inactive",
    to: "Active (jalur cepat)",
    net: 12,
    color: BLUE_DARK,
  },
];

const SPRINT_ACTUAL = [
  { month: "M1", value: 1.2 },
  { month: "M2", value: 1.6 },
  { month: "M3", value: 2.0 },
  { month: "M4", value: 2.4 },
];
const SPRINT_PROJECTED = [
  { month: "M4", value: 2.4 },
  { month: "M5", value: 2.7 },
  { month: "M6", value: 3.0 },
];

type Trend = "up" | "down";

const DEPARTMENTS: {
  name: string;
  headcount: number;
  score: number;
  pctTarget: number;
  topUseCase: string;
  hoursSaved: number;
  trend: { dir: Trend; value: number };
  pctColor: string;
}[] = [
  {
    name: "Customer Service",
    headcount: 250,
    score: 2.9,
    pctTarget: 81,
    topUseCase: "Tier-1 ticket auto-classify",
    hoursSaved: 2410,
    trend: { dir: "up", value: 31 },
    pctColor: BLUE_DARK,
  },
  {
    name: "Operations",
    headcount: 380,
    score: 2.3,
    pctTarget: 58,
    topUseCase: "SOP drafting & translation",
    hoursSaved: 1980,
    trend: { dir: "up", value: 16 },
    pctColor: GRAY_DARK,
  },
  {
    name: "Sales",
    headcount: 220,
    score: 2.6,
    pctTarget: 68,
    topUseCase: "WhatsApp lead qualification",
    hoursSaved: 1820,
    trend: { dir: "up", value: 22 },
    pctColor: GRAY_DARK,
  },
  {
    name: "Engineering",
    headcount: 120,
    score: 3.1,
    pctTarget: 88,
    topUseCase: "Code review & test scaffolding",
    hoursSaved: 1450,
    trend: { dir: "up", value: 27 },
    pctColor: BLUE_DARK,
  },
  {
    name: "Marketing",
    headcount: 140,
    score: 2.8,
    pctTarget: 72,
    topUseCase: "Auto-generate kampanye Instagram",
    hoursSaved: 1240,
    trend: { dir: "up", value: 18 },
    pctColor: BLUE_DARK,
  },
  {
    name: "Field Operations",
    headcount: 700,
    score: 1.9,
    pctTarget: 48,
    topUseCase: "Photo-based equipment QC",
    hoursSaved: 720,
    trend: { dir: "up", value: 8 },
    pctColor: BLUE_MUTED,
  },
  {
    name: "Finance",
    headcount: 80,
    score: 2.5,
    pctTarget: 65,
    topUseCase: "Variance analysis auto-draft",
    hoursSaved: 612,
    trend: { dir: "up", value: 9 },
    pctColor: GRAY_DARK,
  },
  {
    name: "Human Resources",
    headcount: 60,
    score: 2.7,
    pctTarget: 75,
    topUseCase: "CV screening role-fit matrix",
    hoursSaved: 480,
    trend: { dir: "up", value: 14 },
    pctColor: BLUE_DARK,
  },
  {
    name: "Product",
    headcount: 40,
    score: 3.0,
    pctTarget: 85,
    topUseCase: "Riset user wawancara summary",
    hoursSaved: 460,
    trend: { dir: "up", value: 21 },
    pctColor: BLUE_DARK,
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

  return (
    <PageContainerAILN>
      <div className="flex w-full flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold leading-tight">
              Executive Overview
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Snapshot produktivitas tenaga kerja Anda — diperbarui 6 menit lalu
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ButtonAILN variant="light" size="medium">
              <Settings2 className="size-4" />
              Konfigurasi rubrik
            </ButtonAILN>
            <ButtonAILN variant="primary" size="medium">
              <Download className="size-4" />
              Laporan dewan
            </ButtonAILN>
          </div>
        </div>

        {/* Hero card */}
        <div className="relative overflow-hidden rounded-lg border border-dashboard-border bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_minmax(0,420px)]">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-widest text-gray-500">
                <span
                  className="inline-block size-2 rounded-full"
                  style={{ backgroundColor: BLUE_DARK }}
                />
                LIVE · BULAN INI
              </div>

              <div className="mt-3 flex items-baseline gap-4">
                <span className="text-7xl font-bold leading-none tracking-tight">
                  82%
                </span>
                <span className="text-2xl font-medium text-gray-900">
                  tenaga kerja produktif dengan AI
                </span>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600">
                Menghemat{" "}
                <span className="font-semibold text-gray-900">2.847 jam</span>{" "}
                minggu lalu — setara{" "}
                <span className="font-semibold text-gray-900">
                  Rp 4.2 miliar/tahun
                </span>{" "}
                annualized. Naik{" "}
                <span className="font-semibold" style={{ color: BLUE_DARK }}>
                  +23%
                </span>{" "}
                month-over-month.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <Check
                    className="size-3.5"
                    style={{ color: BLUE_DARK }}
                    strokeWidth={3}
                  />
                  Manager-validated
                </span>
                <span className="text-gray-300">•</span>
                <span>Auditable</span>
                <span className="text-gray-300">•</span>
                <span>Sumber: HRIS + use case ledger</span>
              </div>
            </div>

            {/* Hero chart */}
            <div className="relative flex items-center justify-center">
              <HeroAreaChart data={HERO_SERIES} />
            </div>
          </div>
        </div>

        {/* 4 KPI cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Skor Kompetensi AI"
            value="2.4"
            unit="/ 5.0"
            delta={{ dir: "up", text: "+0.6 vs kuartal lalu" }}
            sparkColor={BLUE_DARK}
            sparkData={[1.0, 1.2, 1.6, 1.9, 2.1, 2.3, 2.4]}
          />
          <KpiCard
            label="Jam Produktivitas Dihemat"
            value="11.388"
            unit="jam"
            delta={{ dir: "up", text: "+23% vs MoM" }}
            sparkColor={BLUE_DARK}
            sparkData={[3, 4, 5, 6.5, 8, 9.5, 11.4]}
          />
          <KpiCard
            label="Champions Aktif"
            value="47"
            unit="/ 50"
            delta={{ dir: "neutral", text: "94% dari target" }}
            sparkColor={BLUE_DARK}
            sparkData={[18, 24, 30, 36, 41, 45, 47]}
          />
          <KpiCard
            label="Use Case Terdokumentasi"
            value="312"
            unit="total"
            delta={{ dir: "up", text: "+47 minggu ini" }}
            sparkColor={GRAY_DARK}
            sparkData={[80, 120, 160, 200, 240, 280, 312]}
          />
        </div>

        {/* Distribusi + Skor Kompetensi 6-Month Sprint */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          {/* Distribusi Tenaga Kerja */}
          <div className="rounded-lg border border-dashboard-border bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-semibold tracking-widest text-gray-500">
                  DISTRIBUSI TENAGA KERJA
                </div>
                <div className="mt-1 text-base font-bold">
                  Active · Learning · Inactive
                </div>
              </div>
              <Info className="size-4 shrink-0 text-gray-400" />
            </div>

            {/* Stacked bar */}
            <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full">
              <div
                style={{
                  width: `${DISTRIBUTION.active.percent}%`,
                  backgroundColor: DISTRIBUTION.active.color,
                }}
              />
              <div
                style={{
                  width: `${DISTRIBUTION.learning.percent}%`,
                  backgroundColor: DISTRIBUTION.learning.color,
                }}
              />
              <div
                style={{
                  width: `${DISTRIBUTION.inactive.percent}%`,
                  backgroundColor: DISTRIBUTION.inactive.color,
                }}
              />
            </div>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              {(["active", "learning", "inactive"] as const).map((k) => {
                const d = DISTRIBUTION[k];
                return (
                  <div key={k} className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="inline-block size-2 rounded-sm"
                        style={{ backgroundColor: d.color }}
                      />
                      <span className="text-gray-600">{d.label}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold">
                        {d.count.toLocaleString("id-ID")}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-500">{d.percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Movement */}
            <div className="mt-5 border-t border-dashboard-border pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-gray-700">
                  Pergerakan kuartal ini
                </span>
                <span className="font-semibold tracking-widest text-gray-400">
                  NET
                </span>
              </div>
              <ul className="mt-3 flex flex-col gap-2.5">
                {MOVEMENTS.map((m, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="inline-block h-4 w-0.5 shrink-0"
                        style={{ backgroundColor: m.color }}
                      />
                      <span className="truncate text-gray-700">
                        {m.from} → {m.to}
                      </span>
                    </div>
                    <span
                      className="shrink-0 font-bold"
                      style={{ color: BLUE_DARK }}
                    >
                      +{m.net}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Skor Kompetensi 6-Month Sprint */}
          <div className="rounded-lg border border-dashboard-border bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold tracking-widest text-gray-500">
                  SKOR KOMPETENSI · 6-MONTH SPRINT
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <div className="text-base">
                    <span className="font-bold">2.4</span>{" "}
                    <span className="text-gray-500">per akhir bulan 4</span>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
                    style={{
                      backgroundColor: BLUE_SOFT,
                      color: BLUE_DARK,
                    }}
                  >
                    <ArrowUpRight className="size-3" />
                    +1.2 sejak M1
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-0.5 w-5"
                    style={{ backgroundColor: BLUE_DARK }}
                  />
                  Aktual
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className="inline-block h-0.5 w-5"
                    style={{
                      backgroundImage: `repeating-linear-gradient(90deg, ${BLUE_MID} 0 4px, transparent 4px 8px)`,
                    }}
                  />
                  Proyeksi
                </span>
              </div>
            </div>

            <div className="mt-4">
              <SprintLineChart
                actual={SPRINT_ACTUAL}
                projected={SPRINT_PROJECTED}
              />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-dashboard-border pt-4">
              <SprintStat
                label="PROYEKSI M6"
                value="3.0"
                unit="/ 5.0"
                hint="On-track ke 3.0"
                hintColor={BLUE_DARK}
              />
              <SprintStat
                label="TARGET SPRINT"
                value="2.8"
                unit="/ 5.0"
                hint="Target dewan Phase 1"
                hintColor="#6b7280"
              />
              <SprintStat
                label="GAP"
                value="+0.2"
                unit=""
                hint="Di atas target"
                hintColor={BLUE_DARK}
              />
            </div>
          </div>
        </div>

        {/* Performa Departemen table */}
        <div className="rounded-lg border border-dashboard-border bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-base font-bold">Performa Departemen</div>
              <p className="mt-0.5 text-sm text-gray-500">
                Diurutkan berdasarkan jam dihemat · klik kolom untuk sortir
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ButtonAILN variant="light" size="small">
                Bandingkan
              </ButtonAILN>
              <ButtonAILN variant="light" size="small">
                Lihat semua <ArrowRight className="size-3.5" />
              </ButtonAILN>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dashboard-border text-left text-[11px] font-semibold tracking-widest text-gray-500">
                  <th className="px-3 py-2">DEPARTEMEN ↑</th>
                  <th className="px-3 py-2">HEADCOUNT ↑</th>
                  <th className="px-3 py-2">SKOR ↑</th>
                  <th className="px-3 py-2">% TARGET</th>
                  <th className="px-3 py-2">TOP USE CASE</th>
                  <th className="px-3 py-2 text-right">JAM DIHEMAT ↓</th>
                  <th className="px-3 py-2 text-right">TREND</th>
                </tr>
              </thead>
              <tbody>
                {DEPARTMENTS.map((d) => (
                  <tr
                    key={d.name}
                    className="border-b border-dashboard-border last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-3 py-3 font-semibold text-gray-900">
                      {d.name}
                    </td>
                    <td className="px-3 py-3 text-gray-700">
                      {d.headcount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-3 py-3 font-medium text-gray-900">
                      {d.score.toFixed(1)}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="absolute inset-y-0 left-0 rounded-full"
                            style={{
                              width: `${d.pctTarget}%`,
                              backgroundColor: d.pctColor,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-700">
                          {d.pctTarget}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-700">{d.topUseCase}</td>
                    <td className="px-3 py-3 text-right font-bold text-gray-900">
                      {d.hoursSaved.toLocaleString("id-ID")}
                    </td>
                    <td
                      className="px-3 py-3 text-right text-xs font-semibold"
                      style={{ color: BLUE_DARK }}
                    >
                      ↑ {d.trend.value}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageContainerAILN>
  );
}

// ---------- Sub-components ----------

function KpiCard({
  label,
  value,
  unit,
  delta,
  sparkColor,
  sparkData,
}: {
  label: string;
  value: string;
  unit: string;
  delta: { dir: "up" | "down" | "neutral"; text: string };
  sparkColor: string;
  sparkData: number[];
}) {
  const arrow = delta.dir === "up" ? "↑" : delta.dir === "down" ? "↓" : "";
  const deltaColor =
    delta.dir === "up"
      ? BLUE_DARK
      : delta.dir === "down"
        ? BLUE_MUTED
        : BLUE_DARK;

  return (
    <div className="flex flex-col rounded-lg border border-dashboard-border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-1 text-sm text-gray-500">
        {label}
        <Info className="size-3.5 text-gray-400" />
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className="text-3xl font-bold leading-none text-gray-900">
          {value}
        </span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
      <div className="mt-2 text-xs font-medium" style={{ color: deltaColor }}>
        {arrow} {delta.text}
      </div>
      <div className="mt-3 -mb-1 -mx-1">
        <Sparkline data={sparkData} color={sparkColor} />
      </div>
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const W = 180;
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

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-12 w-full"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
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
    </svg>
  );
}

function HeroAreaChart({ data }: { data: number[] }) {
  const W = 420;
  const H = 200;
  const PAD = 8;
  const min = 0;
  const max = Math.max(...data) * 1.05;
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

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="h-44 w-full"
    >
      <defs>
        <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BLUE_MID} stopOpacity="0.5" />
          <stop offset="100%" stopColor={BLUE_MID} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#heroGrad)" />
      <path
        d={linePath}
        fill="none"
        stroke={BLUE_MID}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SprintLineChart({
  actual,
  projected,
}: {
  actual: { month: string; value: number }[];
  projected: { month: string; value: number }[];
}) {
  const W = 640;
  const H = 220;
  const PAD_L = 36;
  const PAD_R = 24;
  const PAD_T = 16;
  const PAD_B = 28;

  const months = ["M1", "M2", "M3", "M4", "M5", "M6"];
  const stepX = (W - PAD_L - PAD_R) / (months.length - 1);

  const yMin = 1;
  const yMax = 4;
  const yRange = yMax - yMin;
  const yTicks = [1, 2, 3, 4];

  const xFor = (m: string) => PAD_L + months.indexOf(m) * stepX;
  const yFor = (v: number) =>
    PAD_T + (1 - (v - yMin) / yRange) * (H - PAD_T - PAD_B);

  const actualPoints = actual.map(
    (p) => [xFor(p.month), yFor(p.value)] as const
  );
  const projectedPoints = projected.map(
    (p) => [xFor(p.month), yFor(p.value)] as const
  );

  const actualLine = actualPoints
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const actualArea = `${actualLine} L${actualPoints[actualPoints.length - 1][0].toFixed(1)},${H - PAD_B} L${actualPoints[0][0].toFixed(1)},${H - PAD_B} Z`;

  const projLine = projectedPoints
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  // "SEKARANG" divider at M4
  const sekarangX = xFor("M4");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-56 w-full"
    >
      <defs>
        <linearGradient id="sprintGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BLUE_MID} stopOpacity="0.35" />
          <stop offset="100%" stopColor={BLUE_MID} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Y grid + labels */}
      {yTicks.map((t) => (
        <g key={t}>
          <line
            x1={PAD_L}
            x2={W - PAD_R}
            y1={yFor(t)}
            y2={yFor(t)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
          <text
            x={PAD_L - 8}
            y={yFor(t) + 4}
            textAnchor="end"
            fontSize="11"
            fill="#9ca3af"
          >
            {t.toFixed(1)}
          </text>
        </g>
      ))}

      {/* SEKARANG marker */}
      <line
        x1={sekarangX}
        x2={sekarangX}
        y1={PAD_T - 4}
        y2={H - PAD_B}
        stroke="#9ca3af"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <text
        x={sekarangX}
        y={PAD_T - 8}
        textAnchor="middle"
        fontSize="9"
        fontWeight="600"
        fill="#6b7280"
        letterSpacing="1.5"
      >
        SEKARANG
      </text>

      {/* X labels */}
      {months.map((m, i) => (
        <text
          key={m}
          x={PAD_L + i * stepX}
          y={H - PAD_B + 18}
          textAnchor="middle"
          fontSize="11"
          fill="#6b7280"
        >
          {m}
        </text>
      ))}

      {/* Actual area + line */}
      <path d={actualArea} fill="url(#sprintGrad)" />
      <path
        d={actualLine}
        fill="none"
        stroke={BLUE_DARK}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {actualPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill={BLUE_DARK} />
      ))}

      {/* Projected dashed line */}
      <path
        d={projLine}
        fill="none"
        stroke={BLUE_MID}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        strokeDasharray="5 4"
      />
      {projectedPoints.slice(1).map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="3.5"
          fill="white"
          stroke={BLUE_MID}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

function SprintStat({
  label,
  value,
  unit,
  hint,
  hintColor,
}: {
  label: string;
  value: string;
  unit: string;
  hint: string;
  hintColor: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="text-[10px] font-semibold tracking-widest text-gray-400">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-xl font-bold text-gray-900">{value}</span>
        {unit && <span className="text-xs text-gray-500">{unit}</span>}
      </div>
      <div className="mt-1 text-xs" style={{ color: hintColor }}>
        {hint}
      </div>
    </div>
  );
}
