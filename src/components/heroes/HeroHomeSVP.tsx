"use client";
import Image from "next/image";
import Link from "next/link";
import AppButton from "../buttons/AppButton";
import {
  Building2,
  GraduationCap,
  Play,
  ShieldCheck,
  Star,
  Trophy,
  Users,
} from "lucide-react";

const testimonials = [
  {
    name: "Rudy Salim",
    role: "Entrepreneur",
    body: "Materinya relevan, aplikatif, dan benar-benar bantu scale up bisnis.",
    av: "RS",
    color: "from-[#7B6FF0] to-[#4C3FEC]",
  },
  {
    name: "Dewa Eka Prayoga",
    role: "CEO Dewaweb",
    body: "Programnya terstruktur dan dibimbing oleh praktisi nyata.",
    av: "DP",
    color: "from-[#E74D79] to-[#CC446A]",
  },
  {
    name: "Christina Lie",
    role: "CEO of Sagara",
    body: "Komunitasnya suportif, networkingnya luar biasa.",
    av: "CL",
    color: "from-[#65D6CA] to-[#499E95]",
  },
];

const stats = [
  {
    icon: GraduationCap,
    value: "100+",
    label: "Kelas & Program Praktis",
  },
  {
    icon: Users,
    value: "25.000+",
    label: "Member Aktif",
  },
  {
    icon: Building2,
    value: "500+",
    label: "Perusahaan & Founder Telah Dilatih",
  },
  {
    icon: Trophy,
    value: "Top 1",
    label: "Platform Belajar Bisnis di Indonesia",
  },
];

export default function HeroHomeSVP() {
  return (
    <section className="hero-root relative w-full overflow-hidden bg-gradient-to-b from-white via-[#f5f7fb] to-white dark:from-[#0a0d1f] dark:via-[#0d1028] dark:to-[#0a0d1f]">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-32 size-[480px] rounded-full bg-[#7B6FF0]/10 blur-3xl dark:bg-[#7B6FF0]/20" />
        <div className="absolute -bottom-40 -right-32 size-[520px] rounded-full bg-[#E74D79]/10 blur-3xl dark:bg-[#E74D79]/15" />
      </div>

      {/* Decorative grid lines */}
      <svg
        className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.07] dark:opacity-[0.12]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hero-grid"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-slate-900 dark:text-white"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      <div className="hero-container relative z-10 mx-auto flex w-full max-w-[1300px] flex-col gap-10 px-4 pt-10 pb-8 lg:px-8 lg:pt-20 lg:pb-12 xl:px-12">
        {/* Top: 2-column hero */}
        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          {/* Left: copy + CTAs + social proof */}
          <div className="flex flex-col items-center gap-6 lg:items-start">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7B6FF0]/30 bg-[#7B6FF0]/10 px-4 py-1.5 backdrop-blur-sm dark:border-[#7B6FF0]/40 dark:bg-[#7B6FF0]/15">
              <ShieldCheck className="size-4 text-[#7B6FF0] dark:text-[#B3AAE9]" />
              <span className="font-bodycopy text-xs font-medium text-[#4C3FEC] dark:text-[#B3AAE9]">
                Platform Belajar & Komunitas Bisnis Terpercaya
              </span>
            </div>

            {/* Headline */}
            <h1 className="hero-title text-center font-brand text-4xl font-bold leading-[1.1] text-slate-900 dark:text-white sm:text-5xl lg:text-left lg:text-[56px] xl:text-[64px]">
              Build your{" "}
              <span className="bg-gradient-to-r from-[#7B6FF0] to-[#E74D79] bg-clip-text text-transparent">
                profitable
              </span>{" "}
              business.
              <br />
              Scale your{" "}
              <span className="bg-gradient-to-r from-[#7B6FF0] to-[#E74D79] bg-clip-text text-transparent">
                next
              </span>{" "}
              one.
            </h1>

            {/* Description */}
            <p className="hero-description max-w-[520px] text-center font-bodycopy text-base text-slate-600 dark:text-slate-300 lg:text-left lg:text-lg">
              Dari nol sampai scale up, kami bantu kamu bertumbuh lewat belajar,
              praktik, mentor, dan komunitas yang aktif.
            </p>

            {/* CTAs */}
            <div className="flex w-full flex-col items-center gap-3 sm:w-fit sm:flex-row">
              <Link href="/cohorts/sevenpreneur-business-blueprint-program">
                <AppButton
                  size="largeRounded"
                  variant="primary"
                  className="w-full bg-gradient-to-r from-[#7B6FF0] to-[#4C3FEC] text-white shadow-lg shadow-[#7B6FF0]/30 hover:from-[#6A5FE0] hover:to-[#3B2FDC] sm:w-fit"
                  featureName="explore_product"
                  featurePagePoint="Home Page"
                  featurePlacement="hero-banner"
                >
                  <span className="text-base lg:text-lg">
                    Mulai Belajar Gratis
                  </span>
                </AppButton>
              </Link>
              <AppButton
                size="largeRounded"
                variant="ghost"
                className="w-full border border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white/20 dark:text-white dark:hover:bg-white/5 sm:w-fit"
                featureName="watch_intro_video"
                featurePagePoint="Home Page"
                featurePlacement="hero-banner"
              >
                <span className="flex size-6 items-center justify-center rounded-full bg-[#7B6FF0]">
                  <Play className="size-3 fill-white text-white" />
                </span>
                <span className="text-base lg:text-lg">Lihat Video</span>
              </AppButton>
            </div>

            {/* Social proof */}
            <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4 lg:items-start">
              <div className="flex -space-x-2">
                {["#7B6FF0", "#E74D79", "#65D6CA", "#0165FC", "#FFA6C1"].map(
                  (c, i) => (
                    <div
                      key={i}
                      className="flex size-9 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white shadow-sm dark:border-[#0d1028]"
                      style={{ backgroundColor: c }}
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  )
                )}
              </div>
              <div className="flex flex-col items-center gap-0.5 sm:items-start">
                <p className="font-bodycopy text-sm font-medium text-slate-900 dark:text-white">
                  +25.000 member sudah bertumbuh bersama Sevenpreneur
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-3.5 fill-[#FFB800] text-[#FFB800]"
                      />
                    ))}
                  </div>
                  <span className="font-bodycopy text-xs text-slate-600 dark:text-slate-400">
                    4.9/5 dari 1.200+ ulasan
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: image + floating testimonial cards */}
          <div className="relative w-full">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#7B6FF0]/20 to-[#E74D79]/10 dark:from-[#7B6FF0]/20 dark:to-[#E74D79]/10">
              <Image
                src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/image-homepage.webp"
                alt="Sevenpreneur Speaker"
                width={1200}
                height={1500}
                className="size-full object-cover"
                priority
              />
            </div>

            {/* Floating testimonial cards */}
            <div className="absolute -right-2 top-4 hidden w-[260px] flex-col gap-3 sm:flex lg:-right-6 lg:top-8 xl:-right-10 xl:w-[280px]">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200 bg-white/95 p-3.5 shadow-xl shadow-slate-900/5 backdrop-blur-md dark:border-white/10 dark:bg-[#161827]/90 dark:shadow-black/40"
                  style={{
                    transform: `translateX(${i % 2 === 0 ? "0" : "-12px"})`,
                  }}
                >
                  <div className="mb-2 flex items-center gap-2.5">
                    <div
                      className={`flex size-8 items-center justify-center rounded-full bg-gradient-to-br ${t.color} shrink-0`}
                    >
                      <span className="font-brand text-[11px] font-bold text-white">
                        {t.av}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bodycopy text-[13px] font-semibold text-slate-900 dark:text-white">
                        {t.name}
                      </span>
                      <span className="font-bodycopy text-[11px] text-slate-500 dark:text-slate-400">
                        {t.role}
                      </span>
                    </div>
                  </div>
                  <p className="font-bodycopy text-[12px] leading-relaxed text-slate-700 dark:text-slate-300">
                    &ldquo;{t.body}&rdquo;
                  </p>
                  <div className="mt-2 flex items-center gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="size-3 fill-[#FFB800] text-[#FFB800]"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="hero-stats relative w-full rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 lg:p-6">
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-0">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 lg:gap-4 lg:px-6 ${
                    i > 0
                      ? "lg:border-l lg:border-slate-200 dark:lg:border-white/10"
                      : ""
                  }`}
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#7B6FF0]/10 dark:bg-[#7B6FF0]/20 lg:size-12">
                    <Icon className="size-5 text-[#7B6FF0] dark:text-[#B3AAE9] lg:size-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-brand text-xl font-bold text-slate-900 dark:text-white lg:text-2xl">
                      {s.value}
                    </span>
                    <span className="font-bodycopy text-[11px] text-slate-600 dark:text-slate-400 lg:text-xs">
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
