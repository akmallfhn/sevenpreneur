"use client";
import { useEffect, useRef, useState } from "react";
import AppButton from "../buttons/AppButton";

function ArrowIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 5l7 7-7 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    spark: (
      <path
        d="M12 2v6m0 8v6M2 12h6m8 0h6M5 5l4 4m6 6l4 4M5 19l4-4m6-6l4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
    brain: (
      <path
        d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-2 5.83V15a3 3 0 0 0 3 3h1a3 3 0 0 0 5 0h1a3 3 0 0 0 3-3v-1.17A3 3 0 0 0 18 8V7a3 3 0 0 0-6-1 3 3 0 0 0-3-2zM9 10v0M15 10v0M9 16v0M15 16v0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    ),
    chip: (
      <>
        <rect
          x="6"
          y="6"
          width="12"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <rect
          x="9"
          y="9"
          width="6"
          height="6"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </>
    ),
    bolt: (
      <path
        d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
    flow: (
      <>
        <circle cx="6" cy="6" r="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="18" r="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 7l3 9M16 7l-3 9" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
    chat: (
      <path
        d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-6.5A8 8 0 1 1 21 12z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
    shield: (
      <path
        d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
    chart: (
      <path
        d="M3 3v18h18M7 14l4-4 3 3 5-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    code: (
      <path
        d="M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  };
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      {icons[name]}
    </svg>
  );
}

const chips = [
  {
    icon: "spark",
    label: "AI Tools",
    color: "#5cc7ff",
    pos: "top-[8%] left-[3%]",
    delay: "0s",
  },
  {
    icon: "brain",
    label: "LLM",
    color: "#ff8fb1",
    pos: "top-[4%] left-[24%]",
    delay: "-1.2s",
  },
  {
    icon: "bolt",
    label: "Automation",
    color: "#a48aff",
    pos: "top-[8%] right-[3%]",
    delay: "-2.4s",
  },
  {
    icon: "flow",
    label: "Workflow",
    color: "#ffc94d",
    pos: "top-[4%] right-[26%]",
    delay: "-3.6s",
  },
  {
    icon: "chart",
    label: "+60% ROI",
    color: "#5cc7ff",
    pos: "bottom-[8%] left-[3%]",
    delay: "-4.8s",
  },
  {
    icon: "shield",
    label: "Secure",
    color: "#ff8fb1",
    pos: "bottom-[4%] left-[24%]",
    delay: "-1.6s",
  },
  {
    icon: "chat",
    label: "Prompts",
    color: "#a48aff",
    pos: "bottom-[8%] right-[3%]",
    delay: "-2.8s",
  },
  {
    icon: "chip",
    label: "Stack",
    color: "#ffc94d",
    pos: "bottom-[4%] right-[26%]",
    delay: "-4s",
  },
];

function HeroDemoCard() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setPct(60), 400);
    return () => clearTimeout(t);
  }, []);

  const bars = [
    { label: "Reporting", pct: 72 },
    { label: "Marketing", pct: 64 },
    { label: "Operations", pct: 58 },
    { label: "HR Ops", pct: 51 },
  ];

  return (
    <div className="my-16 md:my-20 border border-[#e8e8e8] rounded-2xl bg-[#f5f5f5] p-4 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.25)]">
      <div
        className="rounded-2xl p-6 min-h-[320px] relative overflow-hidden text-white"
        style={{
          background: "#050505",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 0% 0%, rgba(1,101,252,0.22), transparent 60%), radial-gradient(ellipse 50% 50% at 100% 100%, rgba(231,77,121,0.16), transparent 60%)",
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span
              className="ml-3 text-[11px] text-white/60 px-3 py-1.5 rounded-md"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              sevenpreneur.com / dashboard
            </span>
            <span
              className="ml-auto text-[11px] text-white/60 tracking-widest"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              LIVE · Q1 2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-4">
            <div
              className="rounded-xl p-4 border border-white/8"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(20px)",
              }}
            >
              <p
                className="text-[11px] uppercase tracking-widest text-white/50 mb-3"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                Productivity Lift — Cohort 14
              </p>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-brand text-[64px] md:text-[80px] font-semibold leading-none tracking-tighter text-white">
                  +{Math.round(pct)}
                  <span style={{ color: "#0165fc" }}>%</span>
                </span>
                <span
                  className="text-[11px] uppercase text-white/50 tracking-widest leading-tight"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  vs. baseline
                  <br />
                  30-day window
                </span>
              </div>
              {bars.map((b, i) => (
                <div
                  key={i}
                  className="grid gap-2 items-center mb-2 text-[12px]"
                  style={{
                    gridTemplateColumns: "80px 1fr 40px",
                    fontFamily: "JetBrains Mono, monospace",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  <span>{b.label}</span>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        background: "#0165fc",
                        width: `${(pct / 60) * b.pct}%`,
                        transition: "width 1.2s cubic-bezier(.2,.8,.2,1)",
                      }}
                    />
                  </div>
                  <span className="text-right text-white">
                    +{Math.round((pct / 60) * b.pct)}%
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <div
                className="rounded-xl p-4 border border-white/8"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <p
                  className="text-[11px] uppercase tracking-widest text-white/50 mb-3"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  Adoption
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { k: "Active users", v: "94%" },
                    { k: "Completion", v: "88%" },
                    { k: "Daily prompt", v: "11.4" },
                    { k: "Hours saved", v: "18.2" },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.04)" }}
                    >
                      <p
                        className="text-[10px] uppercase tracking-widest text-white/50 mb-1"
                        style={{ fontFamily: "JetBrains Mono, monospace" }}
                      >
                        {s.k}
                      </p>
                      <p className="font-brand text-xl font-semibold tracking-tight">
                        {s.v}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="rounded-xl p-4 border border-white/8"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <p
                  className="text-[11px] uppercase tracking-widest text-white/50 mb-3"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  Active modules
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    "Prompt Engineering",
                    "AI Workflow",
                    "Department Tools",
                    "Strategy & ROI",
                  ].map((m, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center px-3 py-2 rounded-md text-[13px]"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <span className="font-bodycopy text-white">{m}</span>
                      <span
                        className="text-[10px]"
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          color: "#0165fc",
                        }}
                      >
                        ● live
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroCorporateAITrainingSVP() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll(".cat-reveal");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("opacity-100", "translate-y-0");
            e.target.classList.remove("opacity-0", "translate-y-6");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={sectionRef}>
      {/* Hero */}
      <section
        className="relative overflow-hidden flex items-center min-h-[88vh] pt-14 pb-16 md:pt-16 md:pb-20 isolate"
        style={{ background: "#000000", color: "#ffffff" }}
      >
        {/* Background layers */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute inset-[-2px]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              WebkitMaskImage:
                "radial-gradient(ellipse 60% 50% at 50% 50%, black 30%, transparent 80%)",
              maskImage:
                "radial-gradient(ellipse 60% 50% at 50% 50%, black 30%, transparent 80%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
            }}
          />
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,0,0,0) 0%, #000 70%)",
            }}
          />
        </div>

        {/* Floating chips */}
        <div className="absolute inset-0 z-10 pointer-events-none hidden md:block">
          {chips.map((chip, i) => (
            <div
              key={i}
              className={`absolute ${chip.pos} hidden lg:inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/12 text-white/92 text-[12px] tracking-wide`}
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px) saturate(140%)",
                WebkitBackdropFilter: "blur(20px) saturate(140%)",
                boxShadow:
                  "0 8px 24px -8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
                fontFamily: "JetBrains Mono, monospace",
                animation: `cat-chip-float 8s ease-in-out infinite`,
                animationDelay: chip.delay,
                color: "rgba(255,255,255,0.92)",
              }}
            >
              <span style={{ color: chip.color, flexShrink: 0 }}>
                <HeroIcon name={chip.icon} />
              </span>
              <span>{chip.label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-20 w-full max-w-[1240px] mx-auto px-5 md:px-8 text-center">
          {/* Tag */}
          <div className="cat-reveal opacity-0 translate-y-6 transition-all duration-700 flex justify-center mb-7">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] tracking-widest uppercase"
              style={{
                background: "rgba(255,255,255,0.06)",
                borderColor: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(20px) saturate(140%)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#0fd4a3]"
                style={{ animation: "cat-dot-pulse 2s infinite" }}
              />
              CORPORATE AI TRAINING PROGRAM · BATCH 2026
            </span>
          </div>

          {/* Headline */}
          <h1
            className="cat-reveal opacity-0 translate-y-6 transition-all duration-700 delay-100 font-brand font-semibold tracking-[-0.04em] leading-[0.96] mx-auto mb-8 text-white"
            style={{
              fontSize: "clamp(40px, 8vw, 88px)",
              maxWidth: "1180px",
              textShadow: "0 4px 60px rgba(0,0,0,0.4)",
            }}
          >
            Tingkatkan Produktivitas Tim Anda Hingga{" "}
            <span
              style={{
                background:
                  "linear-gradient(95deg, #0165fc 0%, #5a3df0 30%, #e74d79 60%, #ff8a3d 90%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                fontWeight: 700,
                letterSpacing: "-0.05em",
                display: "inline-block",
                position: "relative",
              }}
            >
              60%
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="cat-reveal font-bodycopy opacity-0 translate-y-6 transition-all duration-700 delay-150 mx-auto text-center"
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "clamp(17px, 1.4vw, 20px)",
              maxWidth: "720px",
              lineHeight: 1.5,
            }}
          >
            Tim yang cuma andalin ChatGPT udah ketinggalan jauh. Tingkatkan
            produktivitas tim langsung applicable ke workflow.
          </p>

          {/* CTA buttons */}
          <div className="cat-reveal opacity-0 translate-y-6 transition-all duration-700 delay-200 flex flex-wrap justify-center gap-3 mt-10">
            <a
              href="https://wa.me/6285353533844"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AppButton variant="flux" size="largeRounded">
                Konsultasi Gratis untuk Tim Anda
                <ArrowIcon />
              </AppButton>
            </a>
          </div>
        </div>
      </section>
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        <HeroDemoCard />
      </div>
    </div>
  );
}
