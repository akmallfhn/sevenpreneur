"use client";

import AppButton from "@/components/buttons/AppButton";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock,
  Code,
  Download,
  Flame,
  Lightbulb,
  MessageSquare,
  PenTool,
  Plus,
  Send,
  Sliders,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Upload,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "sponsor" | "champion" | "student";
type ViewMode = "onboarding" | "dashboard";

// ─── Static data ─────────────────────────────────────────────────────────────

const DEPARTMENTS = [
  { name: "Marketing", pct: 78, count: 47 },
  { name: "Engineering", pct: 74, count: 62 },
  { name: "Sales", pct: 65, count: 38 },
  { name: "Finance", pct: 52, count: 29 },
  { name: "Operations", pct: 44, count: 21 },
  { name: "HR", pct: 38, count: 14 },
];

const TOP_USE_CASES = [
  {
    name: "Content & Copywriting",
    users: 124,
    hoursSaved: 28,
    icon: PenTool,
    color: "bg-primary/10 text-primary",
  },
  {
    name: "Data Analysis & Reports",
    users: 98,
    hoursSaved: 41,
    icon: BarChart3,
    color: "bg-success-background text-success-foreground",
  },
  {
    name: "Email & Communication",
    users: 87,
    hoursSaved: 19,
    icon: MessageSquare,
    color: "bg-warning-background text-warning-foreground",
  },
];

type MemberStatus = "active" | "lagging" | "ghosted";

const TEAM_MEMBERS: {
  name: string;
  role: string;
  status: MemberStatus;
  progress: number;
  lastActivity: string;
  xp: number;
}[] = [
  {
    name: "Andi Kusuma",
    role: "Senior Engineer",
    status: "active",
    progress: 82,
    lastActivity: "Claude code review — 1 jam lalu",
    xp: 1240,
  },
  {
    name: "Maya Putri",
    role: "Frontend Engineer",
    status: "active",
    progress: 76,
    lastActivity: "GPT test generator — 5 jam lalu",
    xp: 1020,
  },
  {
    name: "Rini Sari",
    role: "Backend Engineer",
    status: "active",
    progress: 70,
    lastActivity: "Copilot PR description — kemarin",
    xp: 980,
  },
  {
    name: "Farhan Rizky",
    role: "DevOps Engineer",
    status: "active",
    progress: 65,
    lastActivity: "Claude docs gen — 2 hari lalu",
    xp: 860,
  },
  {
    name: "Dewi Lestari",
    role: "QA Engineer",
    status: "active",
    progress: 60,
    lastActivity: "GPT bug analysis — 3 hari lalu",
    xp: 740,
  },
  {
    name: "Rizal Akbar",
    role: "Mobile Engineer",
    status: "active",
    progress: 55,
    lastActivity: "Copilot autocomplete — 4 hari lalu",
    xp: 620,
  },
  {
    name: "Bagas Setiawan",
    role: "Frontend Engineer",
    status: "active",
    progress: 48,
    lastActivity: "Claude brainstorm — 5 hari lalu",
    xp: 480,
  },
  {
    name: "Sinta Wulandari",
    role: "Backend Engineer",
    status: "active",
    progress: 42,
    lastActivity: "GPT code review — 6 hari lalu",
    xp: 380,
  },
  {
    name: "Taufik Hidayat",
    role: "Senior Backend",
    status: "active",
    progress: 38,
    lastActivity: "AI sandbox lab — 6 hari lalu",
    xp: 320,
  },
  {
    name: "Hendra Gunawan",
    role: "Mobile Engineer",
    status: "lagging",
    progress: 22,
    lastActivity: "Onboarding — 10 hari lalu",
    xp: 140,
  },
  {
    name: "Putri Cahyani",
    role: "QA Engineer",
    status: "lagging",
    progress: 18,
    lastActivity: "Welcome screen — 12 hari lalu",
    xp: 80,
  },
  {
    name: "Agung Prasetyo",
    role: "DevOps Engineer",
    status: "ghosted",
    progress: 0,
    lastActivity: "Belum mulai",
    xp: 0,
  },
];

const TEAM_DEMOS = [
  {
    member: "Andi Kusuma",
    content:
      "Pakai Claude buat summarize 50-page API doc jadi 1 halaman — hemat 2 jam kerja.",
    tool: "Claude",
    timeSaved: "2 jam",
    reactions: 7,
    time: "2 hari lalu",
  },
  {
    member: "Maya Putri",
    content:
      "GPT nge-generate 10 test scenario buat payment module dalam 5 menit.",
    tool: "GPT-4",
    timeSaved: "55 menit",
    reactions: 11,
    time: "1 hari lalu",
  },
  {
    member: "Rini Sari",
    content:
      "Copilot nulis PR description lengkap dari diff — langsung approve tech lead.",
    tool: "Copilot",
    timeSaved: "15 menit",
    reactions: 5,
    time: "3 jam lalu",
  },
];

const STUDENT_USE_CASES = [
  {
    title: "Code Review dengan AI",
    description: "Review PR lebih cepat, temukan bug sebelum merge.",
    tool: "Copilot / Claude",
    timeSaved: "45 menit/hari",
    icon: Code,
    iconBg: "bg-gradient-to-br from-primary/70 to-primary",
    tried: true,
  },
  {
    title: "Doc Generation Otomatis",
    description: "Generate README, API docs, dan inline comments.",
    tool: "Claude",
    timeSaved: "30 menit/hari",
    icon: BookOpen,
    iconBg: "bg-gradient-to-br from-tertiary/70 to-tertiary",
    tried: false,
  },
  {
    title: "Test Scenario Generator",
    description: "Buat edge cases dan unit test dari spec yang ada.",
    tool: "GPT-4",
    timeSaved: "60 menit/hari",
    icon: Target,
    iconBg: "bg-gradient-to-br from-success/70 to-success",
    tried: false,
  },
  {
    title: "Debug AI Pair Programmer",
    description: "Ceritain bug ke AI, dapatkan analisis root cause langsung.",
    tool: "Claude / GPT-4",
    timeSaved: "40 menit/hari",
    icon: Brain,
    iconBg: "bg-gradient-to-br from-warning/70 to-warning",
    tried: false,
  },
];

const QUICK_WINS = [
  {
    title: "Summarize meeting notes",
    description: "Paste catatan rapat → Claude buatkan ringkasan + action items.",
    tool: "Claude",
    time: "5 menit",
    icon: MessageSquare,
  },
  {
    title: "Generate commit messages",
    description: "Copilot tulis commit message deskriptif dari diff kamu.",
    tool: "Copilot",
    time: "2 menit",
    icon: Code,
  },
  {
    title: "PR description writer",
    description: "Paste diff → AI tulis PR description yang jelas dan lengkap.",
    tool: "Claude",
    time: "3 menit",
    icon: PenTool,
  },
];

const STUDENT_ROLES = [
  { id: "engineer", label: "Engineer", icon: Code, desc: "Code, review, debug" },
  { id: "sales", label: "Sales", icon: TrendingUp, desc: "Email, proposal, CRM" },
  { id: "marketing", label: "Marketing", icon: Sparkles, desc: "Copy, brief, content" },
  { id: "analyst", label: "Analyst", icon: BarChart3, desc: "Data, laporan, insight" },
  { id: "pm", label: "Product Manager", icon: Target, desc: "PRD, roadmap, user story" },
  { id: "ops", label: "Operations", icon: Sliders, desc: "Workflow, SOP, approval" },
];

const ROLE_USE_CASES: Record<string, { title: string; tool: string; timeSaved: string; icon: React.ElementType }[]> = {
  engineer: [
    { title: "Code Review otomatis", tool: "Claude / Copilot", timeSaved: "45 mnt/hari", icon: Code },
    { title: "Generate unit test", tool: "GPT-4", timeSaved: "60 mnt/hari", icon: Target },
    { title: "Docs & README gen", tool: "Claude", timeSaved: "30 mnt/hari", icon: BookOpen },
  ],
  sales: [
    { title: "Draft cold email", tool: "GPT-4", timeSaved: "30 mnt/hari", icon: MessageSquare },
    { title: "Summarize call recording", tool: "Claude", timeSaved: "20 mnt/hari", icon: Zap },
    { title: "Proposal outline", tool: "GPT-4", timeSaved: "40 mnt/hari", icon: PenTool },
  ],
  marketing: [
    { title: "Copywriting & tagline", tool: "GPT-4", timeSaved: "40 mnt/hari", icon: PenTool },
    { title: "Content brief generator", tool: "Claude", timeSaved: "25 mnt/hari", icon: Sparkles },
    { title: "Competitor analysis", tool: "Gemini", timeSaved: "50 mnt/hari", icon: BarChart3 },
  ],
  analyst: [
    { title: "Analisis data & narasi", tool: "Claude / Gemini", timeSaved: "60 mnt/hari", icon: BarChart3 },
    { title: "Ringkas dokumen panjang", tool: "Claude", timeSaved: "30 mnt/hari", icon: BookOpen },
    { title: "Dashboard insight writer", tool: "GPT-4", timeSaved: "25 mnt/hari", icon: TrendingUp },
  ],
  pm: [
    { title: "User story generator", tool: "Claude", timeSaved: "35 mnt/hari", icon: Target },
    { title: "PRD first draft", tool: "GPT-4 / Claude", timeSaved: "90 mnt/sprint", icon: PenTool },
    { title: "Meeting notes → action items", tool: "Claude", timeSaved: "20 mnt/rapat", icon: CheckCircle2 },
  ],
  ops: [
    { title: "SOP writer otomatis", tool: "Claude", timeSaved: "60 mnt/SOP", icon: BookOpen },
    { title: "Email approval template", tool: "GPT-4", timeSaved: "15 mnt/hari", icon: MessageSquare },
    { title: "Workflow automation ideas", tool: "Claude", timeSaved: "30 mnt/minggu", icon: Sliders },
  ],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pctColor(pct: number) {
  if (pct >= 65) return "bg-success";
  if (pct >= 45) return "bg-warning";
  return "bg-danger";
}

function statusConfig(status: MemberStatus) {
  if (status === "active")
    return { dot: "bg-success", label: "Aktif minggu ini", text: "text-success-foreground" };
  if (status === "lagging")
    return { dot: "bg-warning", label: "Tidak aktif 7–14 hari", text: "text-warning-foreground" };
  return { dot: "bg-danger", label: "Tidak aktif 14+ hari", text: "text-danger-foreground" };
}

// ─── Onboarding Progress Bar ──────────────────────────────────────────────────

function OnboardingProgress({
  steps,
  current,
  color,
}: {
  steps: string[];
  current: number;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-1">
            <div
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= current ? color : "bg-dashboard-border"
              }`}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="font-bodycopy text-xs text-emphasis">
          Step {current + 1} dari {steps.length}: {steps[current]}
        </span>
        <span className="font-bodycopy text-xs font-semibold text-emphasis">
          {Math.round(((current + 1) / steps.length) * 100)}%
        </span>
      </div>
    </div>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────

function TabButton({
  tab,
  active,
  icon: Icon,
  label,
  sublabel,
  mode,
  onClick,
}: {
  tab: Tab;
  active: boolean;
  icon: React.ElementType;
  label: string;
  sublabel: string;
  mode: ViewMode;
  onClick: () => void;
}) {
  const accentMap: Record<Tab, string> = {
    sponsor: "border-primary text-primary bg-primary/5",
    champion: "border-success text-success-foreground bg-success-background",
    student: "border-tertiary text-tertiary bg-tertiary/5",
  };
  const inactiveMap: Record<Tab, string> = {
    sponsor: "hover:bg-primary/5 hover:border-primary/30",
    champion: "hover:bg-success-background hover:border-success/30",
    student: "hover:bg-tertiary/5 hover:border-tertiary/30",
  };
  const iconBgActive: Record<Tab, string> = {
    sponsor: "bg-gradient-to-br from-primary/70 to-primary",
    champion: "bg-gradient-to-br from-success/70 to-success",
    student: "bg-gradient-to-br from-tertiary/70 to-tertiary",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border transition-all cursor-pointer ${
        active
          ? accentMap[tab]
          : `border-dashboard-border bg-card-bg text-emphasis ${inactiveMap[tab]}`
      }`}
    >
      <div
        className={`flex items-center justify-center size-9 rounded-lg shrink-0 ${
          active ? iconBgActive[tab] : "bg-dashboard-border"
        }`}
      >
        <Icon className={`size-4 ${active ? "text-white" : "text-emphasis"}`} />
      </div>
      <div className="flex flex-col items-start text-left">
        <span className="font-brand font-semibold text-sm leading-tight">{label}</span>
        <span className="font-bodycopy text-xs text-emphasis leading-tight">{sublabel}</span>
      </div>
      {active && (
        <span
          className={`ml-2 text-[10px] font-bodycopy font-semibold px-2 py-0.5 rounded-full ${
            mode === "onboarding"
              ? "bg-warning-background text-warning-foreground"
              : "bg-success-background text-success-foreground"
          }`}
        >
          {mode === "onboarding" ? "Setup" : "Live"}
        </span>
      )}
    </button>
  );
}

// ─── Scorecard ────────────────────────────────────────────────────────────────

function Scorecard({
  title,
  value,
  sub,
  trend,
  iconBg,
  icon: Icon,
}: {
  title: string;
  value: string;
  sub: string;
  trend?: string;
  iconBg: string;
  icon: React.ElementType;
}) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-dashboard-border bg-gradient-to-br from-card-bg from-50% to-sb-item-hover dark:to-card-bg">
      <div className="flex items-start justify-between gap-2">
        <div className={`flex items-center justify-center size-10 rounded-lg shrink-0 ${iconBg}`}>
          <Icon className="size-5 text-white" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-semibold font-bodycopy text-success-foreground bg-success-background px-2 py-0.5 rounded-full">
            <ArrowUpRight className="size-3" />
            {trend}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <p className="font-bodycopy text-xs text-emphasis">{title}</p>
        <p className="font-brand font-bold text-xl text-sevenpreneur-coal dark:text-white">{value}</p>
        <p className="font-bodycopy text-xs text-emphasis">{sub}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <h2 className="font-brand font-semibold text-base text-sevenpreneur-coal dark:text-white">{title}</h2>
      {sub && <p className="font-bodycopy text-xs text-emphasis">{sub}</p>}
    </div>
  );
}

// ─── SPONSOR ONBOARDING ───────────────────────────────────────────────────────

const SPONSOR_STEPS = ["Welcome", "Pilih KPI", "Set Target", "Departemen", "Konfirmasi"];
const NORTH_STAR_OPTIONS = [
  {
    id: "adoption",
    label: "AI Adoption Rate",
    desc: "% karyawan yang aktif pakai AI minimal 1x per minggu",
    benchmark: "Industri avg: 45–60%",
    icon: Users,
    color: "border-primary/40 bg-primary/5 text-primary",
  },
  {
    id: "hours",
    label: "Hours Saved",
    desc: "Estimasi total jam kerja yang dihemat dari AI tools",
    benchmark: "Rata-rata: 3–5 jam/orang/minggu",
    icon: Clock,
    color: "border-success/40 bg-success-background text-success-foreground",
  },
  {
    id: "maturity",
    label: "Skill Maturity",
    desc: "Level kompetensi AI tim dari Awareness hingga Transformation",
    benchmark: "Target awal: Level 3 (Integration)",
    icon: Award,
    color: "border-tertiary/40 bg-tertiary/5 text-tertiary",
  },
  {
    id: "custom",
    label: "Custom KPI",
    desc: "Definisikan metrik sendiri sesuai prioritas organisasi",
    benchmark: "Rekomendasi: align ke OKR existing",
    icon: Target,
    color: "border-warning/40 bg-warning-background text-warning-foreground",
  },
];

function SponsorOnboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [selectedKpi, setSelectedKpi] = useState("adoption");
  const [target, setTarget] = useState(70);
  const [selectedDepts, setSelectedDepts] = useState<string[]>(["Engineering", "Marketing", "Sales", "Finance"]);

  const toggleDept = (name: string) =>
    setSelectedDepts((p) => (p.includes(name) ? p.filter((d) => d !== name) : [...p, name]));

  const ALL_DEPTS = ["Engineering", "Marketing", "Sales", "Finance", "Operations", "HR", "Legal", "Product"];

  const selectedOption = NORTH_STAR_OPTIONS.find((o) => o.id === selectedKpi)!;

  return (
    <div className="flex flex-col gap-6">
      {/* Wizard header */}
      <div className="flex flex-col gap-4 p-6 rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card-bg to-card-bg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-primary/70 to-primary">
              <Building2 className="size-5 text-white" />
            </div>
            <div>
              <p className="font-brand font-bold text-base text-sevenpreneur-coal dark:text-white">
                KPI Setup Wizard
              </p>
              <p className="font-bodycopy text-xs text-emphasis">Sponsor · PT Graha Mandiri Tbk</p>
            </div>
          </div>
          <span className="font-bodycopy text-xs text-emphasis bg-dashboard-border px-3 py-1 rounded-full">
            ⏱ ~8 menit
          </span>
        </div>
        <OnboardingProgress steps={SPONSOR_STEPS} current={step} color="bg-primary" />
      </div>

      {/* Step content */}
      <div className="flex flex-col gap-4">

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="flex flex-col items-center gap-8 py-8 px-6 rounded-xl border border-dashboard-border bg-card-bg text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center size-20 rounded-2xl bg-gradient-to-br from-primary/70 to-primary shadow-lg">
                <Sparkles className="size-10 text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
                  Selamat datang, Bapak Santoso
                </h2>
                <p className="font-bodycopy text-sm text-emphasis max-w-md">
                  AILENE akan bantu Anda tracking dampak nyata AI di seluruh organisasi — dan menyiapkan
                  material board meeting dalam 1 klik.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
              {[
                { icon: Clock, label: "8 menit", sub: "untuk setup awal" },
                { icon: BarChart3, label: "Real-time", sub: "data tersedia dalam 14 hari" },
                { icon: Download, label: "1 klik", sub: "generate board report" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30">
                  <Icon className="size-5 text-primary" />
                  <span className="font-brand font-bold text-sm text-sevenpreneur-coal dark:text-white">{label}</span>
                  <span className="font-bodycopy text-xs text-emphasis">{sub}</span>
                </div>
              ))}
            </div>
            <p className="font-bodycopy text-xs text-emphasis italic">
              "Yang tanda tangan kontrak adalah Anda. Yang renew kontrak juga Anda — dan itu butuh data konkret."
            </p>
          </div>
        )}

        {/* Step 1: Pick North Star */}
        {step === 1 && (
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-dashboard-border bg-card-bg">
            <div className="flex flex-col gap-1">
              <h2 className="font-brand font-bold text-lg text-sevenpreneur-coal dark:text-white">
                Pilih North Star Metric
              </h2>
              <p className="font-bodycopy text-sm text-emphasis">
                Satu angka yang akan jadi headline di dashboard Anda. Bisa diubah kapan saja.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {NORTH_STAR_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedKpi(opt.id)}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    selectedKpi === opt.id
                      ? opt.color + " shadow-sm"
                      : "border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30 hover:border-primary/20"
                  }`}
                >
                  <div className={`flex items-center justify-center size-10 rounded-lg shrink-0 ${selectedKpi === opt.id ? "bg-white/40" : "bg-dashboard-border"}`}>
                    <opt.icon className={`size-5 ${selectedKpi === opt.id ? "" : "text-emphasis"}`} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bodycopy font-bold text-sm">{opt.label}</span>
                      {selectedKpi === opt.id && <CheckCircle2 className="size-4" />}
                    </div>
                    <p className="font-bodycopy text-xs opacity-80">{opt.desc}</p>
                    <p className="font-bodycopy text-xs opacity-60 mt-1">{opt.benchmark}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Set Target */}
        {step === 2 && (
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-dashboard-border bg-card-bg">
            <div className="flex flex-col gap-1">
              <h2 className="font-brand font-bold text-lg text-sevenpreneur-coal dark:text-white">
                Set Target untuk "{selectedOption.label}"
              </h2>
              <p className="font-bodycopy text-sm text-emphasis">
                Target realistis dalam 90 hari. Industry benchmark ditampilkan sebagai referensi.
              </p>
            </div>

            <div className="flex flex-col gap-6 p-5 rounded-xl border border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30">
              {/* Big number */}
              <div className="flex items-end gap-3">
                <span className="font-brand font-bold text-6xl text-primary leading-none">{target}</span>
                <span className="font-bodycopy text-2xl text-emphasis mb-2">%</span>
                <div className="flex flex-col gap-1 mb-2">
                  <span className="font-bodycopy text-xs text-emphasis">dari karyawan aktif pakai AI</span>
                  <span className="font-bodycopy text-xs font-semibold text-success-foreground">dalam 90 hari ke depan</span>
                </div>
              </div>

              {/* Slider */}
              <div className="flex flex-col gap-3">
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full accent-primary h-2 cursor-pointer"
                />
                <div className="flex items-center justify-between text-xs font-bodycopy text-emphasis">
                  <span>20%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Benchmarks */}
              <div className="flex flex-col gap-2">
                <p className="font-bodycopy text-xs text-emphasis font-semibold">Industry Benchmark:</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Early Stage", val: "30–45%", cls: "text-danger-foreground bg-danger-background" },
                    { label: "Industry Avg", val: "45–60%", cls: "text-warning-foreground bg-warning-background" },
                    { label: "Best in Class", val: "75–90%", cls: "text-success-foreground bg-success-background" },
                  ].map((b) => (
                    <div key={b.label} className={`flex flex-col gap-0.5 p-3 rounded-lg ${b.cls}`}>
                      <span className="font-bodycopy font-bold text-sm">{b.val}</span>
                      <span className="font-bodycopy text-xs opacity-70">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="font-bodycopy text-xs text-emphasis italic">
              💡 Target {target}% artinya {Math.round(450 * target / 100)} dari 450 karyawan Anda aktif pakai AI setiap minggu.
            </p>
          </div>
        )}

        {/* Step 3: Departments */}
        {step === 3 && (
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-dashboard-border bg-card-bg">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="font-brand font-bold text-lg text-sevenpreneur-coal dark:text-white">
                  Definisikan Departemen
                </h2>
                <p className="font-bodycopy text-sm text-emphasis">
                  Pilih departemen yang akan ditracking. Data akan dibreakdown per departemen di dashboard.
                </p>
              </div>
              <div className="flex gap-2">
                <AppButton variant="light" size="small">
                  <Upload className="size-3.5" />
                  Import HRIS
                </AppButton>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {ALL_DEPTS.map((dept) => {
                const selected = selectedDepts.includes(dept);
                return (
                  <button
                    key={dept}
                    onClick={() => toggleDept(dept)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selected
                        ? "border-primary/40 bg-primary/5 text-primary"
                        : "border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30 text-emphasis hover:border-primary/20"
                    }`}
                  >
                    <div className={`size-4 rounded border-2 shrink-0 flex items-center justify-center ${selected ? "bg-primary border-primary" : "border-dashboard-border"}`}>
                      {selected && <CheckCircle2 className="size-3 text-white" />}
                    </div>
                    <span className="font-bodycopy text-xs font-semibold truncate">{dept}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-dashboard-border text-emphasis cursor-pointer hover:bg-sb-item-hover transition-colors">
              <Plus className="size-4" />
              <span className="font-bodycopy text-xs">Tambah departemen lain…</span>
            </div>
            <p className="font-bodycopy text-xs text-emphasis">
              {selectedDepts.length} departemen dipilih
            </p>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-dashboard-border bg-card-bg">
            <div className="flex flex-col gap-1">
              <h2 className="font-brand font-bold text-lg text-sevenpreneur-coal dark:text-white">
                Konfirmasi Setup
              </h2>
              <p className="font-bodycopy text-sm text-emphasis">
                Semua bisa diubah kapan saja. Dashboard Anda siap setelah ini.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col gap-2 p-4 rounded-xl border border-primary/20 bg-primary/5">
                <p className="font-bodycopy text-xs text-emphasis">North Star Metric</p>
                <p className="font-brand font-bold text-sm text-primary">{selectedOption.label}</p>
                <p className="font-bodycopy text-xs text-emphasis">{selectedOption.desc}</p>
              </div>
              <div className="flex flex-col gap-2 p-4 rounded-xl border border-success/20 bg-success-background">
                <p className="font-bodycopy text-xs text-emphasis">Target dalam 90 hari</p>
                <p className="font-brand font-bold text-2xl text-success-foreground">{target}%</p>
                <p className="font-bodycopy text-xs text-emphasis">
                  ≈ {Math.round(450 * target / 100)} dari 450 karyawan
                </p>
              </div>
              <div className="flex flex-col gap-2 p-4 rounded-xl border border-tertiary/20 bg-tertiary/5">
                <p className="font-bodycopy text-xs text-emphasis">Departemen dipilih</p>
                <p className="font-brand font-bold text-2xl text-tertiary">{selectedDepts.length}</p>
                <p className="font-bodycopy text-xs text-emphasis">{selectedDepts.slice(0, 3).join(", ")}{selectedDepts.length > 3 ? ` +${selectedDepts.length - 3}` : ""}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/10">
              <p className="font-bodycopy text-xs font-semibold text-sevenpreneur-coal dark:text-white">
                Yang terjadi setelah Konfirmasi:
              </p>
              {[
                "Champion Anda mendapat notifikasi untuk mulai assign learning paths",
                "Karyawan di-enroll otomatis berdasarkan role",
                "Dashboard Anda live dalam < 14 hari (begitu ada aktivitas pertama)",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 text-primary shrink-0" />
                  <p className="font-bodycopy text-xs text-emphasis">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <AppButton
          variant="light"
          size="default"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
        >
          <ArrowLeft className="size-4" />
          Kembali
        </AppButton>
        <div className="flex items-center gap-1">
          {SPONSOR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-primary" : i < step ? "w-3 bg-primary/40" : "w-3 bg-dashboard-border"
              }`}
            />
          ))}
        </div>
        {step < SPONSOR_STEPS.length - 1 ? (
          <AppButton variant="primary" size="default" onClick={() => setStep((s) => s + 1)}>
            Lanjut
            <ArrowRight className="size-4" />
          </AppButton>
        ) : (
          <AppButton variant="primary" size="default" onClick={onDone}>
            <Sparkles className="size-4" />
            Konfirmasi & Lihat Dashboard
          </AppButton>
        )}
      </div>
    </div>
  );
}

// ─── CHAMPION ONBOARDING ──────────────────────────────────────────────────────

const CHAMPION_STEPS = ["Welcome", "Import Tim", "Assign Path", "Set Goals", "Siap!"];

const LEARNING_PATHS = [
  { id: "ai-starter", label: "AI Starter Pack", desc: "Foundations & first wins untuk semua role", duration: "3 jam", level: "Beginner", icon: Zap },
  { id: "engineering", label: "Engineer Quick Start", desc: "Code review, docs gen, testing dengan AI", duration: "4 jam", level: "Intermediate", icon: Code },
  { id: "productivity", label: "Productivity Boost", desc: "Email, meeting notes, dokumen — lebih cepat 2x", duration: "2.5 jam", level: "Beginner", icon: TrendingUp },
  { id: "advanced", label: "AI Power User", desc: "Prompt engineering, workflow automation, multi-tool", duration: "6 jam", level: "Advanced", icon: Brain },
];

const SAMPLE_TEAM = [
  { name: "Andi Kusuma", role: "Senior Engineer" },
  { name: "Maya Putri", role: "Frontend Engineer" },
  { name: "Rini Sari", role: "Backend Engineer" },
  { name: "Farhan Rizky", role: "DevOps" },
];

function ChampionOnboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [importMethod, setImportMethod] = useState<string | null>(null);
  const [selectedPath, setSelectedPath] = useState("engineering");
  const [weeklyGoal, setWeeklyGoal] = useState(70);
  const [demoFreq, setDemoFreq] = useState("monthly");

  return (
    <div className="flex flex-col gap-6">
      {/* Wizard header */}
      <div className="flex flex-col gap-4 p-6 rounded-xl border border-success/20 bg-gradient-to-br from-success-background via-card-bg to-card-bg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-success/70 to-success">
              <Users className="size-5 text-white" />
            </div>
            <div>
              <p className="font-brand font-bold text-base text-sevenpreneur-coal dark:text-white">
                Team Setup Wizard
              </p>
              <p className="font-bodycopy text-xs text-emphasis">Champion · Budi Santoso, Engineering Lead</p>
            </div>
          </div>
          <span className="font-bodycopy text-xs text-emphasis bg-dashboard-border px-3 py-1 rounded-full">
            ⏱ ~5 menit
          </span>
        </div>
        <OnboardingProgress steps={CHAMPION_STEPS} current={step} color="bg-success" />
      </div>

      <div className="flex flex-col gap-4">

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="flex flex-col items-center gap-8 py-8 px-6 rounded-xl border border-dashboard-border bg-card-bg text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center size-20 rounded-2xl bg-gradient-to-br from-success/70 to-success shadow-lg">
                <UserCheck className="size-10 text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
                  Selamat datang, Budi!
                </h2>
                <p className="font-bodycopy text-sm text-emphasis max-w-md">
                  Sebagai Champion, tugas kamu bukan jadi admin LMS — tapi jadi
                  multiplier. AILENE yang urus teknisnya; kamu fokus di adoption tim.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
              {[
                { icon: Clock, label: "< 10 mnt/minggu", sub: "waktu yang kamu butuh" },
                { icon: Bell, label: "Auto-nudge", sub: "AILENE ingatkan siapa yang stuck" },
                { icon: Download, label: "Team report", sub: "langsung bisa forward ke atasan" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30">
                  <Icon className="size-5 text-success-foreground" />
                  <span className="font-brand font-bold text-sm text-sevenpreneur-coal dark:text-white">{label}</span>
                  <span className="font-bodycopy text-xs text-emphasis">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Import Team */}
        {step === 1 && (
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-dashboard-border bg-card-bg">
            <div className="flex flex-col gap-1">
              <h2 className="font-brand font-bold text-lg text-sevenpreneur-coal dark:text-white">
                Import Anggota Tim
              </h2>
              <p className="font-bodycopy text-sm text-emphasis">
                Pilih cara paling mudah buat kamu. Tim kamu langsung bisa mulai setelah ini.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "hris", label: "Sync dari HRIS", sub: "BambooHR, HiBob, Workday", icon: Building2 },
                { id: "csv", label: "Upload CSV", sub: "Template tersedia, isi nama & email", icon: Upload },
                { id: "manual", label: "Tambah Manual", sub: "Input satu per satu — untuk tim kecil", icon: Plus },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setImportMethod(m.id)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all cursor-pointer ${
                    importMethod === m.id
                      ? "border-success/50 bg-success-background text-success-foreground"
                      : "border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30 text-emphasis hover:border-success/20"
                  }`}
                >
                  <div className={`flex items-center justify-center size-12 rounded-xl ${importMethod === m.id ? "bg-white/40" : "bg-dashboard-border"}`}>
                    <m.icon className="size-6" />
                  </div>
                  <div className="flex flex-col gap-0.5 text-center">
                    <span className="font-bodycopy font-bold text-sm">{m.label}</span>
                    <span className="font-bodycopy text-xs opacity-70">{m.sub}</span>
                  </div>
                </button>
              ))}
            </div>
            {/* Preview */}
            <div className="flex flex-col gap-2 p-4 rounded-xl border border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30">
              <p className="font-bodycopy text-xs text-emphasis font-semibold">Preview anggota tim (dari HRIS):</p>
              <div className="flex flex-col divide-y divide-dashboard-border">
                {SAMPLE_TEAM.map((m) => (
                  <div key={m.name} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <div className="flex size-8 rounded-full bg-success-background items-center justify-center shrink-0">
                      <span className="font-bodycopy font-bold text-xs text-success-foreground">{m.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bodycopy font-semibold text-xs text-sevenpreneur-coal dark:text-white">{m.name}</p>
                      <p className="font-bodycopy text-xs text-emphasis">{m.role}</p>
                    </div>
                    <CheckCircle2 className="size-4 text-success-foreground" />
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2 text-emphasis">
                  <div className="size-8 rounded-full border-2 border-dashed border-dashboard-border flex items-center justify-center shrink-0">
                    <span className="font-bodycopy text-xs">+8</span>
                  </div>
                  <span className="font-bodycopy text-xs">8 anggota lain akan di-import</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Assign First Path */}
        {step === 2 && (
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-dashboard-border bg-card-bg">
            <div className="flex flex-col gap-1">
              <h2 className="font-brand font-bold text-lg text-sevenpreneur-coal dark:text-white">
                Assign Learning Path Pertama
              </h2>
              <p className="font-bodycopy text-sm text-emphasis">
                Path ini akan jadi starting point untuk seluruh tim. Bisa assign berbeda per orang nanti.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {LEARNING_PATHS.map((path) => (
                <button
                  key={path.id}
                  onClick={() => setSelectedPath(path.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    selectedPath === path.id
                      ? "border-success/50 bg-success-background"
                      : "border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30 hover:border-success/20"
                  }`}
                >
                  <div className={`flex items-center justify-center size-10 rounded-lg shrink-0 ${selectedPath === path.id ? "bg-success text-white" : "bg-dashboard-border text-emphasis"}`}>
                    <path.icon className="size-5" />
                  </div>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`font-bodycopy font-bold text-sm ${selectedPath === path.id ? "text-sevenpreneur-coal dark:text-white" : "text-sevenpreneur-coal dark:text-white"}`}>
                        {path.label}
                      </span>
                      <span className={`text-[10px] font-bodycopy font-semibold px-2 py-0.5 rounded-full ${path.level === "Beginner" ? "bg-success-background text-success-foreground" : path.level === "Intermediate" ? "bg-warning-background text-warning-foreground" : "bg-danger-background text-danger-foreground"}`}>
                        {path.level}
                      </span>
                    </div>
                    <p className={`font-bodycopy text-xs ${selectedPath === path.id ? "text-emphasis" : "text-emphasis"}`}>{path.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bodycopy text-xs text-emphasis">{path.duration}</span>
                    {selectedPath === path.id && <CheckCircle2 className="size-5 text-success-foreground" />}
                  </div>
                </button>
              ))}
            </div>
            <p className="font-bodycopy text-xs text-emphasis">
              💡 Rekomendasi untuk tim Engineering: <span className="font-semibold">Engineer Quick Start</span> — paling relevan ke workflow sehari-hari.
            </p>
          </div>
        )}

        {/* Step 3: Set Goals */}
        {step === 3 && (
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-dashboard-border bg-card-bg">
            <div className="flex flex-col gap-1">
              <h2 className="font-brand font-bold text-lg text-sevenpreneur-coal dark:text-white">
                Set Team Goals
              </h2>
              <p className="font-bodycopy text-sm text-emphasis">
                Target ini yang akan kamu track di dashboard. AILENE auto-nudge kalau ada yang lagging.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3 p-5 rounded-xl border border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30">
                <div className="flex flex-col gap-1">
                  <label className="font-bodycopy text-xs text-emphasis font-semibold">
                    % Anggota Aktif per Minggu
                  </label>
                  <span className="font-brand font-bold text-3xl text-success-foreground">{weeklyGoal}%</span>
                </div>
                <input
                  type="range" min={40} max={100} value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                  className="w-full accent-[#499e95] h-2 cursor-pointer"
                />
                <p className="font-bodycopy text-xs text-emphasis">
                  ≈ {Math.round(12 * weeklyGoal / 100)} dari 12 anggota tim aktif per minggu
                </p>
              </div>
              <div className="flex flex-col gap-3 p-5 rounded-xl border border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30">
                <label className="font-bodycopy text-xs text-emphasis font-semibold">
                  Frekuensi Demo Day
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    { id: "weekly", label: "Setiap minggu", sub: "High intensity — untuk tim kompetitif" },
                    { id: "biweekly", label: "Dua minggu sekali", sub: "Balance antara adoption & output" },
                    { id: "monthly", label: "Bulanan", sub: "Standar — paling umum dipakai" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setDemoFreq(f.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-left cursor-pointer transition-all ${demoFreq === f.id ? "border-success/40 bg-success-background" : "border-dashboard-border hover:border-success/20"}`}
                    >
                      <div className={`size-4 rounded-full border-2 shrink-0 ${demoFreq === f.id ? "border-success bg-success" : "border-dashboard-border"}`} />
                      <div>
                        <p className={`font-bodycopy text-xs font-semibold ${demoFreq === f.id ? "text-success-foreground" : "text-sevenpreneur-coal dark:text-white"}`}>{f.label}</p>
                        <p className="font-bodycopy text-[10px] text-emphasis">{f.sub}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Ready */}
        {step === 4 && (
          <div className="flex flex-col items-center gap-6 py-8 px-6 rounded-xl border border-success/20 bg-gradient-to-br from-success-background via-card-bg to-card-bg text-center">
            <div className="flex items-center justify-center size-20 rounded-2xl bg-gradient-to-br from-success/70 to-success shadow-lg">
              <Trophy className="size-10 text-white" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
                Tim kamu siap! 🎉
              </h2>
              <p className="font-bodycopy text-sm text-emphasis max-w-md">
                12 anggota sudah di-enroll. Learning path sudah di-assign.
                Dashboard kamu live — pantau progress mulai sekarang.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
              {[
                { label: "12 anggota", sub: "sudah di-enroll", cls: "text-success-foreground" },
                { label: weeklyGoal + "% target", sub: "aktif per minggu", cls: "text-primary" },
                { label: demoFreq === "weekly" ? "Weekly" : demoFreq === "biweekly" ? "Bi-weekly" : "Monthly", sub: "Demo Day schedule", cls: "text-tertiary" },
              ].map(({ label, sub, cls }) => (
                <div key={label} className="flex flex-col gap-1 p-4 rounded-xl border border-dashboard-border bg-card-bg">
                  <span className={`font-brand font-bold text-lg ${cls}`}>{label}</span>
                  <span className="font-bodycopy text-xs text-emphasis">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <AppButton variant="light" size="default" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ArrowLeft className="size-4" />
          Kembali
        </AppButton>
        <div className="flex items-center gap-1">
          {CHAMPION_STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-success" : i < step ? "w-3 bg-success/40" : "w-3 bg-dashboard-border"}`} />
          ))}
        </div>
        {step < CHAMPION_STEPS.length - 1 ? (
          <AppButton variant="quarternary" size="default" onClick={() => setStep((s) => s + 1)}>
            Lanjut
            <ArrowRight className="size-4" />
          </AppButton>
        ) : (
          <AppButton variant="quarternary" size="default" onClick={onDone}>
            <Sparkles className="size-4" />
            Lihat Team Dashboard
          </AppButton>
        )}
      </div>
    </div>
  );
}

// ─── STUDENT ONBOARDING ───────────────────────────────────────────────────────

const STUDENT_STEPS = ["Welcome", "Pilih Role", "Use Case", "Coba Sandbox", "Selesai!"];

function SandboxMockup({ role }: { role: string }) {
  const uc = (ROLE_USE_CASES[role] ?? ROLE_USE_CASES["engineer"])[0];
  const prompts: Record<string, string> = {
    engineer: 'Review kode ini dan temukan potential bugs:\n\n```js\nfunction getUser(id) {\n  const user = db.find(id)\n  return user.name\n}\n```',
    sales: 'Tulis cold email ke CTO startup fintech yang sedang scale. Tone: profesional tapi conversational.',
    marketing: 'Buat 3 opsi tagline untuk produk project management tool yang target startup.',
    analyst: 'Ringkas dokumen 20 halaman ini menjadi 5 bullet poin eksekutif.',
    pm: 'Tulis user story untuk fitur "share sprint progress ke stakeholder" dalam format As a / I want / So that.',
    ops: 'Buat template SOP untuk proses approval pembelian alat kantor di bawah Rp 5 juta.',
  };
  const responses: Record<string, string> = {
    engineer: '⚠️ Ditemukan 2 potential bugs:\n\n1. **Null pointer** — jika `db.find(id)` return `null`, `user.name` akan throw error\n2. **No error handling** — tidak ada try/catch untuk database error\n\n✅ Saran perbaikan:\n```js\nfunction getUser(id) {\n  const user = db.find(id)\n  if (!user) return null\n  return user.name\n}\n```',
    sales: '📧 Subject: Quick question about [Company]\'s infrastructure scaling\n\nHi [Name],\n\nSaw that [Company] just raised Series B — congrats! Growth at that pace usually brings interesting infrastructure challenges.\n\nWe help fintech teams like yours cut deployment time by 60% while maintaining SOC2 compliance. Curious if that\'s on your radar.\n\nWorth a 15-min call this week?\n\n[Your name]',
    marketing: '🎯 3 opsi tagline:\n\n1. **"Ship faster, stress less"** — fokus ke pain point utama\n2. **"Your team\'s second brain"** — aspirational, memorable\n3. **"Progress, not process"** — contrast yang kuat\n\nRekomendasi: opsi #2 untuk brand awareness, #1 untuk performance campaign.',
    analyst: '📋 Executive Summary:\n\n• Revenue Q1 tumbuh 23% YoY, didorong segmen enterprise\n• CAC turun 15% akibat optimasi paid channel\n• Churn meningkat di segmen SMB — butuh perhatian produk\n• Runway 18 bulan dengan burn rate saat ini\n• Rekomendasi: prioritas retensi SMB sebelum ekspansi',
    pm: '📝 User Story:\n\n**As a** Product Manager,\n**I want** to share a live sprint progress view with stakeholders,\n**So that** they can monitor velocity without attending standups.\n\n**Acceptance Criteria:**\n• View bisa diakses via link tanpa login\n• Update real-time saat task berubah status\n• Bisa difilter per epic atau assignee',
    ops: '📋 SOP Pembelian Alat Kantor < Rp 5 juta\n\n**1. Pengajuan** — Karyawan isi form Google Form dengan: nama item, harga, vendor, justifikasi\n**2. Review** — Manajer langsung approve/reject via email dalam 1x24 jam\n**3. Pembelian** — Finance proses pembayaran dalam 3 hari kerja\n**4. Dokumentasi** — Simpan struk di folder Drive shared\n\n⏱ Total waktu: 3–5 hari kerja',
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30">
      <div className="flex items-center justify-between">
        <p className="font-bodycopy text-xs font-semibold text-sevenpreneur-coal dark:text-white">AI Sandbox — {uc.title}</p>
        <span className="font-bodycopy text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{uc.tool}</span>
      </div>
      {/* Prompt */}
      <div className="flex flex-col gap-1.5">
        <p className="font-bodycopy text-[10px] text-emphasis uppercase tracking-wide">Prompt kamu</p>
        <pre className="font-bodycopy text-xs text-sevenpreneur-coal dark:text-white bg-card-bg p-3 rounded-lg border border-dashboard-border whitespace-pre-wrap">{prompts[role] ?? prompts["engineer"]}</pre>
      </div>
      {/* Response */}
      <div className="flex flex-col gap-1.5">
        <p className="font-bodycopy text-[10px] text-emphasis uppercase tracking-wide flex items-center gap-1">
          <Sparkles className="size-3 text-primary" /> Respons AI
        </p>
        <pre className="font-bodycopy text-xs text-sevenpreneur-coal dark:text-white bg-card-bg p-3 rounded-lg border border-primary/20 whitespace-pre-wrap">{responses[role] ?? responses["engineer"]}</pre>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-bodycopy text-xs text-success-foreground font-semibold">⚡ Generated in 1.2s</span>
        <AppButton variant="primarySoft" size="small">
          <Download className="size-3" />
          Export Prompt Snippet
        </AppButton>
      </div>
    </div>
  );
}

function StudentOnboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState("engineer");
  const [selectedUc, setSelectedUc] = useState(0);

  const roleUseCases = ROLE_USE_CASES[selectedRole] ?? ROLE_USE_CASES["engineer"];

  return (
    <div className="flex flex-col gap-6">
      {/* Wizard header */}
      <div className="flex flex-col gap-4 p-6 rounded-xl border border-tertiary/20 bg-gradient-to-br from-tertiary/5 via-card-bg to-card-bg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-tertiary/70 to-tertiary">
              <Briefcase className="size-5 text-white" />
            </div>
            <div>
              <p className="font-brand font-bold text-base text-sevenpreneur-coal dark:text-white">
                First Win Onboarding
              </p>
              <p className="font-bodycopy text-xs text-emphasis">Student · PT Graha Mandiri Tbk</p>
            </div>
          </div>
          <span className="font-bodycopy text-xs text-emphasis bg-dashboard-border px-3 py-1 rounded-full">
            ⏱ ~5 menit
          </span>
        </div>
        <OnboardingProgress steps={STUDENT_STEPS} current={step} color="bg-tertiary" />
      </div>

      <div className="flex flex-col gap-4">

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="flex flex-col items-center gap-8 py-8 px-6 rounded-xl border border-dashboard-border bg-card-bg text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center size-20 rounded-2xl bg-gradient-to-br from-tertiary/70 to-tertiary shadow-lg">
                <Zap className="size-10 text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
                  Halo, Andi! 👋
                </h2>
                <p className="font-bodycopy text-sm text-emphasis max-w-md">
                  Budi Santoso (manager kamu) udah daftarin kamu ke AILENE.
                  Dalam 5 menit, kamu bakal punya AI workflow yang langsung bisa dipake besok pagi.
                </p>
                <div className="flex items-center gap-2 mx-auto mt-2 px-4 py-2 rounded-full bg-tertiary/10 border border-tertiary/20">
                  <span className="font-bodycopy text-xs text-tertiary">💬 Pesan dari Budi:</span>
                  <span className="font-bodycopy text-xs text-sevenpreneur-coal dark:text-white italic">
                    "Ini bukan training wajib biasa — langsung apply ke kerjaan."
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
              {[
                { icon: Clock, label: "5 menit", sub: "beneran 5 menit" },
                { icon: Zap, label: "Langsung apply", sub: "ke kerjaan hari ini" },
                { icon: Award, label: "+200 XP", sub: "selesaikan onboarding" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-4 rounded-xl border border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30">
                  <Icon className="size-5 text-tertiary" />
                  <span className="font-brand font-bold text-sm text-sevenpreneur-coal dark:text-white">{label}</span>
                  <span className="font-bodycopy text-xs text-emphasis">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Pick Role */}
        {step === 1 && (
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-dashboard-border bg-card-bg">
            <div className="flex flex-col gap-1">
              <h2 className="font-brand font-bold text-lg text-sevenpreneur-coal dark:text-white">
                Kerjaan kamu sehari-hari apa?
              </h2>
              <p className="font-bodycopy text-sm text-emphasis">
                AILENE akan tampilkan use case AI yang paling relevan untuk role-mu.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {STUDENT_ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedRole === role.id
                      ? "border-tertiary/50 bg-tertiary/5 text-tertiary"
                      : "border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30 text-emphasis hover:border-tertiary/20"
                  }`}
                >
                  <div className={`flex items-center justify-center size-12 rounded-xl ${selectedRole === role.id ? "bg-tertiary/20" : "bg-dashboard-border"}`}>
                    <role.icon className={`size-6 ${selectedRole === role.id ? "text-tertiary" : "text-emphasis"}`} />
                  </div>
                  <div className="text-center">
                    <p className="font-bodycopy font-bold text-sm">{role.label}</p>
                    <p className="font-bodycopy text-xs opacity-70">{role.desc}</p>
                  </div>
                  {selectedRole === role.id && <CheckCircle2 className="size-4" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Pick Use Case */}
        {step === 2 && (
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-dashboard-border bg-card-bg">
            <div className="flex flex-col gap-1">
              <h2 className="font-brand font-bold text-lg text-sevenpreneur-coal dark:text-white">
                Pilih satu yang mau kamu coba dulu
              </h2>
              <p className="font-bodycopy text-sm text-emphasis">
                Pilih yang paling relevan — kamu bisa explore lainnya nanti.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {roleUseCases.map((uc, i) => (
                <button
                  key={uc.title}
                  onClick={() => setSelectedUc(i)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    selectedUc === i
                      ? "border-tertiary/50 bg-tertiary/5"
                      : "border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30 hover:border-tertiary/20"
                  }`}
                >
                  <div className={`flex items-center justify-center size-12 rounded-xl shrink-0 ${selectedUc === i ? "bg-tertiary text-white" : "bg-dashboard-border text-emphasis"}`}>
                    <uc.icon className="size-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bodycopy font-bold text-sm text-sevenpreneur-coal dark:text-white">{uc.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="font-bodycopy text-xs text-emphasis">{uc.tool}</span>
                      <span className="font-bodycopy text-xs text-success-foreground font-semibold">⏱ Hemat {uc.timeSaved}</span>
                    </div>
                  </div>
                  {selectedUc === i && <CheckCircle2 className="size-5 text-tertiary" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Sandbox */}
        {step === 3 && (
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-dashboard-border bg-card-bg">
            <div className="flex flex-col gap-1">
              <h2 className="font-brand font-bold text-lg text-sevenpreneur-coal dark:text-white">
                Coba langsung di Sandbox
              </h2>
              <p className="font-bodycopy text-sm text-emphasis">
                Zero setup — sample data sudah disiapkan. Lihat hasilnya dalam hitungan detik.
              </p>
            </div>
            <SandboxMockup role={selectedRole} />
            <div className="flex items-center gap-3 p-3 rounded-lg border border-tertiary/20 bg-tertiary/5">
              <Lightbulb className="size-4 text-tertiary shrink-0" />
              <p className="font-bodycopy text-xs text-emphasis">
                Prompt ini bisa langsung kamu copy dan pakai di{" "}
                <span className="font-semibold text-sevenpreneur-coal dark:text-white">{roleUseCases[selectedUc]?.tool}</span> hari ini.
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {step === 4 && (
          <div className="flex flex-col items-center gap-6 py-8 px-6 rounded-xl border border-tertiary/20 bg-gradient-to-br from-tertiary/5 via-card-bg to-card-bg text-center">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center size-20 rounded-2xl bg-gradient-to-br from-tertiary/70 to-tertiary shadow-lg mb-2">
                <Award className="size-10 text-white" />
              </div>
              <h2 className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">
                First win selesai! 🎉
              </h2>
              <p className="font-bodycopy text-sm text-emphasis max-w-md">
                Kamu udah punya satu workflow AI yang siap dipake.
                Besok coba apply beneran — dan share hasilnya ke tim!
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <div className="flex items-center gap-3 p-4 rounded-xl border border-tertiary/20 bg-tertiary/5">
                <Award className="size-8 text-tertiary shrink-0" />
                <div className="text-left">
                  <p className="font-bodycopy text-xs text-emphasis">XP Earned</p>
                  <p className="font-brand font-bold text-lg text-tertiary">+200 XP · Badge "First Win" 🏅</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl border border-success/20 bg-success-background">
                <Star className="size-8 text-success-foreground shrink-0" />
                <div className="text-left">
                  <p className="font-bodycopy text-xs text-emphasis">Next step</p>
                  <p className="font-brand font-bold text-sm text-success-foreground">Share demo ke Budi — dapat +100 XP lagi</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <AppButton variant="light" size="default" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          <ArrowLeft className="size-4" />
          Kembali
        </AppButton>
        <div className="flex items-center gap-1">
          {STUDENT_STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-tertiary" : i < step ? "w-3 bg-tertiary/40" : "w-3 bg-dashboard-border"}`} />
          ))}
        </div>
        {step < STUDENT_STEPS.length - 1 ? (
          <AppButton variant="tertiary" size="default" onClick={() => setStep((s) => s + 1)}>
            Lanjut
            <ArrowRight className="size-4" />
          </AppButton>
        ) : (
          <AppButton variant="tertiary" size="default" onClick={onDone}>
            <Sparkles className="size-4" />
            Lihat Learning Dashboard
          </AppButton>
        )}
      </div>
    </div>
  );
}

// ─── SPONSOR DASHBOARD ────────────────────────────────────────────────────────

function SponsorView() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-primary/70 to-primary">
              <Building2 className="size-4 text-white" />
            </div>
            <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">ROI Dashboard</h1>
          </div>
          <p className="font-bodycopy text-sm text-emphasis">
            PT Graha Mandiri Tbk &nbsp;·&nbsp; Q2 2026 &nbsp;·&nbsp; 450 karyawan enrolled
          </p>
        </div>
        <AppButton variant="primary" size="default">
          <Download className="size-4" />
          Export Board Report
        </AppButton>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Scorecard title="AI Adoption Rate" value="62%" sub="278 dari 450 karyawan aktif" trend="+8% vs bulan lalu" iconBg="bg-gradient-to-br from-primary/70 to-primary" icon={Users} />
        <Scorecard title="Hours Saved / Bulan" value="1.240 jam" sub="estimasi dari demo submissions" trend="+210 jam" iconBg="bg-gradient-to-br from-success/70 to-success" icon={Clock} />
        <Scorecard title="Projected Cost Saving" value="Rp 156 jt" sub="berdasarkan hourly rate rata-rata" trend="+Rp 28 jt" iconBg="bg-gradient-to-br from-warning/70 to-warning" icon={TrendingUp} />
        <Scorecard title="Skill Maturity Avg" value="3.2 / 5" sub="Awareness → Integration level" trend="+0.4 poin" iconBg="bg-gradient-to-br from-tertiary/70 to-tertiary" icon={Trophy} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 flex flex-col gap-4 p-5 rounded-xl border border-dashboard-border bg-gradient-to-br from-primary/5 via-card-bg to-card-bg">
          <div className="flex flex-col gap-1">
            <p className="font-bodycopy text-xs text-emphasis uppercase tracking-wide font-semibold">North Star Metric</p>
            <p className="font-brand font-bold text-5xl text-primary">62%</p>
            <p className="font-bodycopy text-sm text-sevenpreneur-coal dark:text-white font-semibold">Karyawan aktif pakai AI weekly</p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="w-full bg-dashboard-border rounded-full h-2">
              <div className="h-2 rounded-full bg-gradient-to-r from-primary/70 to-primary" style={{ width: "62%" }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bodycopy text-xs text-emphasis">0%</span>
              <span className="font-bodycopy text-xs font-semibold text-primary">Target: 80%</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 pt-2 border-t border-dashboard-border">
            {[
              { color: "bg-success", label: "278 aktif minggu ini" },
              { color: "bg-warning", label: "87 tidak aktif 7–14 hari" },
              { color: "bg-danger", label: "85 belum mulai" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`size-2 rounded-full ${color}`} />
                <span className="font-bodycopy text-xs text-emphasis">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-4 p-5 rounded-xl border border-dashboard-border bg-card-bg">
          <SectionHeader title="Adoption per Departemen" sub="% karyawan yang aktif pakai AI minimal 1x per minggu" />
          <div className="flex flex-col gap-3">
            {DEPARTMENTS.map((dept) => (
              <div key={dept.name} className="flex items-center gap-3">
                <span className="font-bodycopy text-xs text-emphasis w-24 shrink-0">{dept.name}</span>
                <div className="flex-1 bg-dashboard-border rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full transition-all ${pctColor(dept.pct)}`} style={{ width: `${dept.pct}%` }} />
                </div>
                <div className="flex items-center gap-2 shrink-0 w-20 justify-end">
                  <span className={`font-bodycopy font-semibold text-xs ${dept.pct >= 65 ? "text-success-foreground" : dept.pct >= 45 ? "text-warning-foreground" : "text-danger-foreground"}`}>{dept.pct}%</span>
                  <span className="font-bodycopy text-xs text-emphasis">({dept.count})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeader title="Top Use Cases Bulan Ini" sub="Berdasarkan frekuensi penggunaan & estimated value" />
        <div className="grid grid-cols-3 gap-4">
          {TOP_USE_CASES.map((uc, i) => (
            <div key={uc.name} className="flex items-start gap-3 p-4 rounded-xl border border-dashboard-border bg-card-bg">
              <div className={`flex items-center justify-center size-10 rounded-lg shrink-0 ${uc.color}`}>
                <uc.icon className="size-5" />
              </div>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bodycopy text-xs font-bold text-emphasis">#{i + 1}</span>
                  <span className="font-bodycopy font-semibold text-sm text-sevenpreneur-coal dark:text-white truncate">{uc.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-bodycopy text-emphasis">
                  <span className="flex items-center gap-1"><Users className="size-3" />{uc.users} pengguna</span>
                  <span className="flex items-center gap-1"><Clock className="size-3" />{uc.hoursSaved} jam/minggu</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-5 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex flex-col gap-1">
          <p className="font-brand font-semibold text-sm text-sevenpreneur-coal dark:text-white">Quarterly Business Review Helper</p>
          <p className="font-bodycopy text-xs text-emphasis">Auto-generate 8-slide deck + exec summary + talking points — siap buat board meeting dalam 1 klik.</p>
        </div>
        <AppButton variant="light" size="default">
          <Star className="size-4" />
          Generate QBR Deck
        </AppButton>
      </div>
    </div>
  );
}

// ─── CHAMPION DASHBOARD ───────────────────────────────────────────────────────

function ChampionView() {
  const [nudged, setNudged] = useState<string[]>([]);
  const activeCount = TEAM_MEMBERS.filter((m) => m.status === "active").length;
  const laggingCount = TEAM_MEMBERS.filter((m) => m.status === "lagging").length;
  const ghostedCount = TEAM_MEMBERS.filter((m) => m.status === "ghosted").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-success/70 to-success">
              <Users className="size-4 text-white" />
            </div>
            <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">Team Dashboard</h1>
          </div>
          <p className="font-bodycopy text-sm text-emphasis">Budi Santoso · Engineering Lead · 12 direct reports</p>
        </div>
        <AppButton variant="light" size="default">
          <Download className="size-4" />
          Team Report PDF
        </AppButton>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Scorecard title="Aktif Minggu Ini" value={`${activeCount}/12`} sub="anggota yang submit atau pakai AI" iconBg="bg-gradient-to-br from-success/70 to-success" icon={Zap} />
        <Scorecard title="Use Cases Adopted" value="4" sub="dari 8 yang diassign" iconBg="bg-gradient-to-br from-primary/70 to-primary" icon={Target} />
        <Scorecard title="Demo Submitted" value="24" sub="bulan ini dari seluruh tim" trend="+9 dari bulan lalu" iconBg="bg-gradient-to-br from-tertiary/70 to-tertiary" icon={Trophy} />
        <Scorecard title="Avg Completion" value="54%" sub="learning path assigned" trend="+12%" iconBg="bg-gradient-to-br from-warning/70 to-warning" icon={BarChart3} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 flex flex-col gap-4 p-5 rounded-xl border border-dashboard-border bg-card-bg">
          <div className="flex items-center justify-between">
            <SectionHeader title="Team Roster" sub="Status aktivitas real-time tiap anggota" />
            <div className="flex items-center gap-2 text-xs font-bodycopy">
              <span className="flex items-center gap-1 text-success-foreground"><Circle className="size-2 fill-current" />{activeCount} aktif</span>
              <span className="flex items-center gap-1 text-warning-foreground"><Circle className="size-2 fill-current" />{laggingCount} lagging</span>
              <span className="flex items-center gap-1 text-danger-foreground"><Circle className="size-2 fill-current" />{ghostedCount} ghosted</span>
            </div>
          </div>
          <div className="flex flex-col divide-y divide-dashboard-border">
            {TEAM_MEMBERS.map((member) => {
              const sc = statusConfig(member.status);
              return (
                <div key={member.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className={`size-2 rounded-full shrink-0 ${sc.dot}`} />
                  <div className="flex size-8 rounded-full bg-primary/10 items-center justify-center shrink-0">
                    <span className="font-bodycopy font-bold text-xs text-primary">{member.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bodycopy font-semibold text-xs text-sevenpreneur-coal dark:text-white truncate">{member.name}</span>
                      <span className="font-bodycopy text-[10px] text-emphasis shrink-0">{member.role}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-dashboard-border rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${pctColor(member.progress)}`} style={{ width: `${member.progress}%` }} />
                      </div>
                      <span className="font-bodycopy text-[10px] text-emphasis shrink-0 w-7 text-right">{member.progress}%</span>
                    </div>
                    <span className="font-bodycopy text-[10px] text-emphasis truncate">{member.lastActivity}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {member.status !== "active" && (
                      <AppButton variant="primarySoft" size="small" disabled={nudged.includes(member.name)} onClick={() => setNudged((prev) => [...prev, member.name])}>
                        {nudged.includes(member.name) ? <CheckCircle2 className="size-3" /> : <Send className="size-3" />}
                        {nudged.includes(member.name) ? "Sent" : "Nudge"}
                      </AppButton>
                    )}
                    <AppButton variant="light" size="small">
                      <Calendar className="size-3" />
                    </AppButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-4">
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-dashboard-border bg-card-bg">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-7 rounded-md bg-gradient-to-br from-tertiary/70 to-tertiary">
                <Lightbulb className="size-3.5 text-white" />
              </div>
              <SectionHeader title="Suggested Actions" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-warning-background border border-warning/20">
                <p className="font-bodycopy text-xs text-sevenpreneur-coal dark:text-white font-semibold">Hendra tidak aktif 10 hari</p>
                <p className="font-bodycopy text-xs text-emphasis">Kirim encouragement — rekomendasikan Engineering Quick Start</p>
                <AppButton variant="light" size="small" className="self-start"><Send className="size-3" />Kirim Pesan</AppButton>
              </div>
              <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-danger-background border border-danger/20">
                <p className="font-bodycopy text-xs text-sevenpreneur-coal dark:text-white font-semibold">Agung belum mulai sama sekali</p>
                <p className="font-bodycopy text-xs text-emphasis">Assign DevOps AI Quick Start path</p>
                <AppButton variant="light" size="small" className="self-start"><BookOpen className="size-3" />Assign Path</AppButton>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-4 rounded-xl border border-dashboard-border bg-card-bg">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-7 rounded-md bg-gradient-to-br from-success/70 to-success">
                <Star className="size-3.5 text-white" />
              </div>
              <SectionHeader title="Team Highlights" />
            </div>
            <div className="flex flex-col gap-3">
              {TEAM_DEMOS.slice(0, 2).map((demo) => (
                <div key={demo.member} className="flex flex-col gap-2 p-3 rounded-lg border border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30">
                  <div className="flex items-center gap-2">
                    <div className="flex size-6 rounded-full bg-primary/10 items-center justify-center shrink-0">
                      <span className="font-bodycopy font-bold text-[10px] text-primary">{demo.member.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-bodycopy font-semibold text-xs text-sevenpreneur-coal dark:text-white">{demo.member}</p>
                      <p className="font-bodycopy text-[10px] text-emphasis">{demo.time}</p>
                    </div>
                    <span className="ml-auto font-bodycopy text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{demo.tool}</span>
                  </div>
                  <p className="font-bodycopy text-xs text-emphasis line-clamp-2">{demo.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bodycopy text-[10px] text-success-foreground">⏱ Hemat {demo.timeSaved}</span>
                    <AppButton variant="primarySoft" size="small"><Zap className="size-3" />Amplify</AppButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────

function StudentView() {
  const [triedCases, setTriedCases] = useState<string[]>(["Code Review dengan AI"]);
  const xp = 1240, nextXp = 2000, level = 3;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-gradient-to-br from-tertiary/70 to-tertiary">
              <Briefcase className="size-4 text-white" />
            </div>
            <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">Welcome, Andi Kusuma</h1>
          </div>
          <p className="font-bodycopy text-sm text-emphasis">Software Engineer · PT Graha Mandiri Tbk</p>
        </div>
        <AppButton variant="tertiary" size="default">
          <Flame className="size-4" />
          Share What I Used Today
        </AppButton>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 flex flex-col gap-4">
          <div className="flex flex-col gap-3 p-5 rounded-xl border border-tertiary/20 bg-gradient-to-br from-tertiary/5 to-card-bg">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-gradient-to-br from-tertiary/70 to-tertiary">
                <Award className="size-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bodycopy text-xs text-emphasis">Level {level}</span>
                <span className="font-brand font-bold text-sm text-sevenpreneur-coal dark:text-white">AI Explorer</span>
              </div>
              <span className="ml-auto font-bodycopy font-bold text-lg text-tertiary">
                {xp.toLocaleString()}<span className="text-xs font-normal text-emphasis"> XP</span>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-full bg-dashboard-border rounded-full h-2">
                <div className="h-2 rounded-full bg-gradient-to-r from-tertiary/70 to-tertiary" style={{ width: `${Math.round((xp / nextXp) * 100)}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bodycopy text-[10px] text-emphasis">{xp.toLocaleString()} XP</span>
                <span className="font-bodycopy text-[10px] text-emphasis">Level {level + 1}: {nextXp.toLocaleString()} XP</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["First Win", "7-Day Streak", "Code Master"].map((b) => (
                <span key={b} className="font-bodycopy text-[10px] bg-tertiary/10 text-tertiary px-2 py-0.5 rounded-full">{b}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 p-4 rounded-xl border border-dashboard-border bg-card-bg">
            <SectionHeader title="Quick Wins" sub="Coba dalam 5 menit" />
            {QUICK_WINS.map((qw) => (
              <div key={qw.title} className="flex items-center gap-3 p-3 rounded-lg border border-dashboard-border hover:border-primary/30 hover:bg-sb-item-hover transition-colors cursor-pointer">
                <div className="flex items-center justify-center size-8 rounded-md bg-primary/10 shrink-0">
                  <qw.icon className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-bodycopy font-semibold text-xs text-sevenpreneur-coal dark:text-white">{qw.title}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="font-bodycopy text-[10px] bg-success-background text-success-foreground px-1.5 py-0.5 rounded-full">{qw.time}</span>
                    <span className="font-bodycopy text-[10px] text-emphasis">{qw.tool}</span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-emphasis shrink-0" />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-4 p-5 rounded-xl border border-dashboard-border bg-card-bg">
          <SectionHeader title="Use Cases Untuk Role Kamu" sub="AI tools yang langsung relevan untuk Software Engineer" />
          <div className="grid grid-cols-2 gap-3">
            {STUDENT_USE_CASES.map((uc) => {
              const tried = triedCases.includes(uc.title);
              return (
                <div key={uc.title} className={`flex flex-col gap-3 p-4 rounded-xl border transition-colors ${tried ? "border-success/30 bg-success-background" : "border-dashboard-border bg-sb-item-hover dark:bg-sb-item-hover/30 hover:border-primary/30"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`flex items-center justify-center size-9 rounded-lg shrink-0 ${uc.iconBg}`}>
                      <uc.icon className="size-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bodycopy font-semibold text-xs text-sevenpreneur-coal dark:text-white">{uc.title}</span>
                        {tried && <span className="font-bodycopy text-[10px] bg-success text-white px-1.5 py-0.5 rounded-full">Dicoba</span>}
                      </div>
                      <p className="font-bodycopy text-xs text-emphasis">{uc.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-bodycopy text-emphasis">
                      <span className="font-semibold">{uc.tool}</span>
                      <span className="flex items-center gap-1 text-success-foreground font-semibold"><Clock className="size-3" />{uc.timeSaved}</span>
                    </div>
                    <AppButton variant={tried ? "light" : "primarySoft"} size="small" onClick={() => { if (!tried) setTriedCases((p) => [...p, uc.title]); }}>
                      {tried ? <><CheckCircle2 className="size-3" />Done</> : <><ChevronRight className="size-3" />Coba</>}
                    </AppButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function B2BAilene() {
  const { isCollapsed } = useSidebar();
  const [activeTab, setActiveTab] = useState<Tab>("sponsor");
  const [viewMode, setViewMode] = useState<Record<Tab, ViewMode>>({
    sponsor: "onboarding",
    champion: "onboarding",
    student: "onboarding",
  });

  const currentMode = viewMode[activeTab];

  const handleDone = (tab: Tab) =>
    setViewMode((prev) => ({ ...prev, [tab]: "dashboard" }));

  const handleReset = (tab: Tab) =>
    setViewMode((prev) => ({ ...prev, [tab]: "onboarding" }));

  return (
    <div className={`root hidden w-full min-h-screen py-8 overflow-y-auto lg:flex lg:flex-col ${isCollapsed ? "pl-16" : "pl-64"}`}>
      <div className="container max-w-[calc(100%-4rem)] mx-auto w-full flex flex-col gap-6">
        {/* Page header */}
        <div className="flex flex-col gap-1">
          <h1 className="font-brand font-bold text-2xl text-sevenpreneur-coal dark:text-white">AILENE B2B LMS</h1>
          <p className="font-bodycopy text-sm text-emphasis">
            Platform adopsi AI untuk enterprise — lihat journey setiap stakeholder.
          </p>
        </div>

        {/* Stakeholder tabs */}
        <div className="flex items-center gap-3">
          <TabButton tab="sponsor" active={activeTab === "sponsor"} icon={Building2} label="Sponsor" sublabel="C-Level · ROI & Impact" mode={viewMode.sponsor} onClick={() => setActiveTab("sponsor")} />
          <TabButton tab="champion" active={activeTab === "champion"} icon={Users} label="Champion" sublabel="Manager · Team Success" mode={viewMode.champion} onClick={() => setActiveTab("champion")} />
          <TabButton tab="student" active={activeTab === "student"} icon={Briefcase} label="Student" sublabel="Karyawan · Grow & Perform" mode={viewMode.student} onClick={() => setActiveTab("student")} />

          <div className="ml-auto flex items-center gap-2">
            {currentMode === "dashboard" && (
              <AppButton variant="light" size="small" onClick={() => handleReset(activeTab)}>
                <ArrowLeft className="size-3.5" />
                Lihat Onboarding
              </AppButton>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-dashboard-border bg-card-bg">
              <div className="size-2 rounded-full bg-success animate-pulse" />
              <span className="font-bodycopy text-xs text-emphasis">demo mode · hardcoded</span>
            </div>
          </div>
        </div>

        {/* Tab content */}
        <div className="pb-8">
          {activeTab === "sponsor" && (
            currentMode === "onboarding"
              ? <SponsorOnboarding onDone={() => handleDone("sponsor")} />
              : <SponsorView />
          )}
          {activeTab === "champion" && (
            currentMode === "onboarding"
              ? <ChampionOnboarding onDone={() => handleDone("champion")} />
              : <ChampionView />
          )}
          {activeTab === "student" && (
            currentMode === "onboarding"
              ? <StudentOnboarding onDone={() => handleDone("student")} />
              : <StudentView />
          )}
        </div>
      </div>
    </div>
  );
}
