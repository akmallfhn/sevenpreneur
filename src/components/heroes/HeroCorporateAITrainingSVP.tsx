"use client";
import {
  ArrowRight,
  BarChart3,
  GraduationCap,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";

const trustBadges = [
  { Icon: GraduationCap, label: "Praktisi AI Industri" },
  { Icon: ShieldCheck, label: "Enterprise-Grade" },
  { Icon: Sparkles, label: "Custom LMS" },
];

const adoptionRows = [
  { Icon: BarChart3, name: "Reporting", pct: 72, label: "+72%" },
  { Icon: Workflow, name: "Operations", pct: 64, label: "+64%" },
  { Icon: MessageCircle, name: "Marketing", pct: 58, label: "+58%" },
];

export default function HeroCorporateAITrainingSVP() {
  return (
    <div className="hero-root relative gap-5 flex flex-col items-center w-full bg-black overflow-hidden">
      <div className="hero-container relative flex w-full items-center py-12 px-4 z-[70] lg:px-8 lg:pt-24 lg:pb-28 lg:max-w-[988px] xl:max-w-[1280px] 2xl:max-w-[1380px]">
        <div className="hero-grid grid grid-cols-1 w-full gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-12 xl:gap-14">
          {/* LEFT — Content */}
          <div className="hero-content flex flex-col w-full items-center text-center gap-7 lg:items-start lg:text-left">
            {/* Eyebrow */}
            <div className="hero-eyebrow inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-[11px] font-bodycopy font-semibold tracking-[0.25em] uppercase text-white/80 bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0fd4a3] animate-pulse" />
              Corporate AI Training
            </div>

            {/* Title */}
            <h1 className="hero-title font-brand font-bold text-white leading-[1.05] text-4xl sm:text-5xl lg:text-[58px] xl:text-[68px] tracking-tight max-w-[680px]">
              Tingkatkan produktivitas tim hingga{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#B89FE0] via-[#7B6FF0] to-[#CC446A]">
                270%
              </span>
            </h1>

            {/* Description */}
            <p className="hero-description font-bodycopy text-white/70 text-base max-w-[540px] sm:text-lg lg:text-xl">
              Tim yang cuma andelin ChatGPT udah ketinggalan jauh. Kami bangun
              sistem AI yang langsung applicable ke workflow tim kamu.
            </p>

            {/* CTAs */}
            <div className="hero-ctas flex flex-col w-full items-stretch gap-3 sm:flex-row sm:w-fit sm:items-center">
              <a
                href="https://wa.me/6285353533844?text=Halo%2C%20MinSeven!%20%F0%9F%91%8B%0ASaya%20tertarik%20untuk%20mengetahui%20lebih%20lanjut%20tentang%20*Corporate%20AI%20Training*%20dari%20Sevenpreneur.%20Boleh%20konsultasi%20dulu%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 h-[58px] pl-6 pr-2 rounded-full bg-gradient-to-r from-[#7B6FF0] via-[#5E47ED] to-[#4C3FEC] text-white font-bodycopy font-semibold text-base shadow-[0_8px_32px_-4px_rgba(123,111,240,0.5)] hover:shadow-[0_12px_40px_-4px_rgba(123,111,240,0.7)] transition-all overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Rocket className="size-5 relative" />
                <span className="relative">Konsultasi Gratis</span>
                <span className="relative flex items-center justify-center size-10 rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
                  <ArrowRight className="size-4" />
                </span>
              </a>

              <Link
                href="#program"
                className="group inline-flex items-center justify-center gap-3 h-[58px] px-6 rounded-full bg-white/5 border border-white/15 text-white font-bodycopy font-semibold text-base hover:bg-white/10 hover:border-white/25 transition-all backdrop-blur-sm"
              >
                <span className="flex items-center justify-center size-7 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                  <Sparkles className="size-3.5" />
                </span>
                Lihat program
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges flex flex-wrap items-center justify-center gap-x-5 gap-y-3 mt-1 lg:justify-start">
              {trustBadges.map((b) => (
                <div
                  key={b.label}
                  className="flex items-center gap-2 font-bodycopy text-sm text-white/60"
                >
                  <span className="flex items-center justify-center size-7 rounded-full bg-white/5 border border-white/10">
                    <b.Icon className="size-3.5 text-[#B89FE0]" />
                  </span>
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Productivity Dashboard Card */}
          <div className="hero-card relative w-full max-w-[480px] mx-auto lg:max-w-none lg:mx-0">
            <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-[#7B6FF0]/70 via-white/10 to-[#CC446A]/50 shadow-[0_30px_80px_-20px_rgba(76,63,236,0.5)]">
              <div className="relative bg-[#0A0918]/95 rounded-3xl p-7 backdrop-blur-xl overflow-hidden lg:p-8">
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: -120,
                    right: -120,
                    width: 320,
                    height: 320,
                    background:
                      "radial-gradient(circle, rgba(123,111,240,0.18) 0%, transparent 70%)",
                  }}
                />

                {/* Header */}
                <div className="relative flex items-center justify-between mb-7">
                  <span className="font-bodycopy text-sm text-white/60">
                    Live Dashboard Preview
                  </span>
                  <span className="font-brand text-[10px] font-bold tracking-[1.5px] uppercase rounded-full px-3 py-1.5 bg-gradient-to-r from-[#7B6FF0] to-[#CC446A] text-white">
                    Q1 2026
                  </span>
                </div>

                {/* Productivity uplift big number */}
                <div className="relative mb-6">
                  <p className="font-bodycopy text-[10px] font-bold tracking-[2px] uppercase text-white/50 mb-3">
                    Productivity Uplift — Cohort 14
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="font-brand font-bold text-7xl text-white leading-none lg:text-[88px]">
                      +270
                      <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#B89FE0] via-[#7B6FF0] to-[#CC446A]">
                        %
                      </span>
                    </span>
                    <div className="flex flex-col pb-2">
                      <span className="font-bodycopy text-[11px] text-white/50 tracking-[1.5px] uppercase">
                        vs. baseline
                      </span>
                      <span className="font-bodycopy text-[11px] text-white/50 tracking-[1.5px] uppercase">
                        30-day window
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section header */}
                <div className="relative flex items-center gap-3 mb-4">
                  <span className="font-bodycopy text-[10px] font-bold tracking-[2px] uppercase text-white/50">
                    Adoption per Departemen
                  </span>
                  <span className="flex-1 h-px bg-white/10" />
                </div>

                {/* Rows */}
                <div className="relative flex flex-col gap-3.5 mb-6">
                  {adoptionRows.map((r) => (
                    <div
                      key={r.name}
                      className="grid grid-cols-[28px_1fr_auto_50px] items-center gap-3"
                    >
                      <span className="flex items-center justify-center size-7 rounded-full bg-white/5 border border-white/10">
                        <r.Icon className="size-3.5 text-[#B89FE0]" />
                      </span>
                      <span className="font-bodycopy text-[13px] text-white/85 truncate">
                        {r.name}
                      </span>
                      <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden lg:w-24">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#7B6FF0] to-[#CC446A]"
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                      <span className="font-bodycopy text-[11px] tracking-[0.5px] font-bold text-right text-[#B89FE0]">
                        {r.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA bar */}
                <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-[#7B6FF0]/60 via-white/10 to-[#CC446A]/60">
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#13102E]/90">
                    <span className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-[#7B6FF0] to-[#4C3FEC] shrink-0">
                      <Zap className="size-4 text-white fill-white" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bodycopy text-[13px] font-semibold text-white leading-tight">
                        Custom LMS untuk tim kamu
                      </p>
                      <p className="font-bodycopy text-[11px] text-white/55 leading-tight">
                        branded · accessible · scalable
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-white/60 shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Background Decoration === */}

      {/* Orbital ring SVG */}
      <svg
        className="absolute pointer-events-none z-[2] opacity-60"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(1600px, 140vw)",
          height: "min(1600px, 140vw)",
        }}
        viewBox="0 0 1600 1600"
        fill="none"
      >
        <defs>
          <linearGradient
            id="cat-ring-grad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#7B6FF0" stopOpacity="0" />
            <stop offset="50%" stopColor="#7B6FF0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#CC446A" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="cat-ring-grad-2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#CC446A" stopOpacity="0" />
            <stop offset="50%" stopColor="#B89FE0" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7B6FF0" stopOpacity="0" />
          </linearGradient>
        </defs>
        <ellipse
          cx="800"
          cy="800"
          rx="780"
          ry="780"
          stroke="url(#cat-ring-grad)"
          strokeWidth="1"
        />
        <ellipse
          cx="800"
          cy="800"
          rx="640"
          ry="640"
          stroke="url(#cat-ring-grad-2)"
          strokeWidth="1"
          transform="rotate(35 800 800)"
        />
        <ellipse
          cx="800"
          cy="800"
          rx="500"
          ry="500"
          stroke="url(#cat-ring-grad)"
          strokeWidth="1"
          transform="rotate(70 800 800)"
        />
        <ellipse
          cx="800"
          cy="800"
          rx="360"
          ry="360"
          stroke="url(#cat-ring-grad-2)"
          strokeWidth="1"
        />
      </svg>

      {/* Dotted starfield */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 1px, transparent 1px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.3) 1px, transparent 1px), radial-gradient(circle at 40% 80%, rgba(184,159,224,0.4) 1px, transparent 1px), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.3) 1px, transparent 1px), radial-gradient(circle at 15% 70%, rgba(123,111,240,0.4) 1px, transparent 1px)",
          backgroundSize:
            "200px 200px, 280px 280px, 320px 320px, 240px 240px, 360px 360px",
        }}
      />

      {/* Circle Blur */}
      <div className="absolute flex bg-[#3417E3] size-[400px] -top-40 -left-40 blur-[140px] rounded-full z-[0] opacity-50 lg:size-[600px] lg:blur-[180px]" />
      <div className="absolute flex bg-[#CC446A] size-[400px] bottom-0 -right-40 blur-[140px] rounded-full z-[0] opacity-30 lg:size-[600px] lg:blur-[180px]" />
      <div className="absolute flex bg-[#7B6FF0] w-[800px] h-[260px] -bottom-[120px] left-1/2 -translate-x-1/2 blur-[120px] rounded-full z-[0] opacity-30" />
    </div>
  );
}
