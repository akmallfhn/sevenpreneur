"use client";
import { useEffect, useRef, useState } from "react";

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const els = ref.current?.querySelectorAll(".cat-reveal");
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
  }, [ref]);
}

/* ---- Feature 01: Productivity ---- */
function ProductivityViz() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setOn(true);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const bars = [
    { label: "Reporting", v: 72 },
    { label: "Marketing", v: 64 },
    { label: "Operations", v: 58 },
    { label: "Sales", v: 55 },
    { label: "HR Ops", v: 51 },
  ];

  return (
    <div
      ref={ref}
      className="aspect-[4/3.2] rounded-[18px] overflow-hidden p-6 relative"
      style={{
        background: "#050505",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#fff",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 20% 0%, rgba(1,101,252,0.25), transparent 60%), radial-gradient(ellipse 60% 60% at 90% 100%, rgba(231,77,121,0.18), transparent 60%)",
        }}
      />
      <div className="relative z-10 flex flex-col gap-4 h-full">
        <div
          className="flex justify-between items-center text-[11px] uppercase tracking-widest"
          style={{
            fontFamily: "JetBrains Mono, monospace",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span>Cohort productivity uplift</span>
          <span>Q4 / 2025</span>
        </div>
        <div
          className="font-brand font-semibold leading-[0.9] tracking-tighter"
          style={{ fontSize: "clamp(72px, 12vw, 120px)" }}
        >
          +<span style={{ color: "#0165fc" }}>{on ? 60 : 0}</span>%
        </div>
        <div className="flex flex-col gap-2.5 mt-auto">
          {bars.map((b, i) => (
            <div
              key={i}
              className="grid items-center gap-3 text-[12px]"
              style={{
                gridTemplateColumns: "80px 1fr 40px",
                fontFamily: "JetBrains Mono, monospace",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <span>{b.label}</span>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    background: "#0165fc",
                    width: on ? `${b.v}%` : "0%",
                    transition: `width 1.2s cubic-bezier(.2,.8,.2,1) ${i * 0.1}s`,
                  }}
                />
              </div>
              <span className="text-right text-white">+{on ? b.v : 0}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Feature 02: Chat ---- */
function ChatViz() {
  return (
    <div
      className="aspect-[4/3.2] rounded-[18px] overflow-hidden p-6 relative flex flex-col gap-3"
      style={{
        background: "#050505",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "#fff",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 20% 0%, rgba(1,101,252,0.25), transparent 60%), radial-gradient(ellipse 60% 60% at 90% 100%, rgba(231,77,121,0.18), transparent 60%)",
        }}
      />
      <div className="relative z-10 flex flex-col gap-3 h-full">
        <div
          className="self-start max-w-[78%] p-3 px-4 rounded-[14px] rounded-bl-[4px] text-sm leading-[1.45]"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
          }}
        >
          <div
            className="text-[10px] uppercase tracking-widest opacity-60 mb-1"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Peserta — Head of Ops
          </div>
          Tim saya pakai prompt umum, hasilnya nggak konsisten. Workflow apa
          yang biasanya dipakai untuk ops report bulanan?
        </div>
        <div
          className="self-end max-w-[78%] p-3 px-4 rounded-[14px] rounded-br-[4px] text-sm leading-[1.45] text-white"
          style={{ background: "#0165fc" }}
        >
          <div
            className="text-[10px] uppercase tracking-widest opacity-60 mb-1"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Speaker — AI Lead, Mfg co.
          </div>
          Saya bagi struktur prompt yang kita pakai di pabrik—ada 3 layer:
          context, constraint, output schema. Bisa langsung diadopsi.
        </div>
        <div
          className="self-start max-w-[78%] p-3 px-4 rounded-[14px] rounded-bl-[4px] text-sm leading-[1.45]"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
          }}
        >
          <div
            className="text-[10px] uppercase tracking-widest opacity-60 mb-1"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            Peserta — Head of Ops
          </div>
          Untuk integrasi ke ERP existing-nya gimana?
        </div>
        <div
          className="self-start inline-flex gap-1 p-3.5 rounded-[14px] rounded-bl-[4px]"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {[0, 0.2, 0.4].map((delay, i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/50"
              style={{ animation: `cat-blink 1.4s infinite ${delay}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Feature 03: LMS ---- */
function LMSViz() {
  const modules = [
    { lbl: "Foundation", pct: "100%", live: false },
    { lbl: "Tools", pct: "92%", live: false },
    { lbl: "Prompt Eng", pct: "74%", live: true },
    { lbl: "Workflow", pct: "38%", live: false },
    { lbl: "Strategy", pct: "21%", live: false },
    { lbl: "Ethics", pct: "08%", live: false },
  ];

  return (
    <div
      className="aspect-[4/3.2] rounded-[18px] overflow-hidden p-5 grid"
      style={{
        gridTemplateRows: "auto 1fr auto",
        gap: 14,
        background: "#f5f5f5",
        border: "1px solid #e8e8e8",
      }}
    >
      <div className="flex justify-between items-center pb-3 border-b border-[#e8e8e8]">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <span className="w-5 h-5 rounded-md bg-[#0165fc]" />
          <span>Acme.AI Academy</span>
        </div>
        <span
          className="text-[11px] text-[#777]"
          style={{ fontFamily: "JetBrains Mono, monospace" }}
        >
          214 / 240 active
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {modules.map((m, i) => (
          <div
            key={i}
            className="p-3 rounded-[10px] border text-[12px]"
            style={{
              background: m.live ? "#0a0a0a" : "#ffffff",
              borderColor: m.live ? "transparent" : "#e8e8e8",
              color: m.live ? "#fff" : "#0a0a0a",
            }}
          >
            <div
              className="text-[10px] uppercase tracking-widest mb-1"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                color: m.live ? "rgba(255,255,255,0.5)" : "#777",
              }}
            >
              {m.lbl}
            </div>
            <div className="font-brand text-xl font-semibold tracking-tight">
              {m.pct}
            </div>
          </div>
        ))}
      </div>
      <div
        className="flex justify-between items-center pt-3 border-t border-[#e8e8e8] text-[11px] text-[#777]"
        style={{ fontFamily: "JetBrains Mono, monospace" }}
      >
        <span>● Recording — Sesi 12 / Workflow Automation</span>
        <span>02:14:08</span>
      </div>
    </div>
  );
}

/* ---- Feature block wrapper ---- */
function FeatureBlock({
  num,
  numColor,
  title,
  listItems,
  listColor,
  children,
  reverse = false,
}: {
  num: string;
  numColor: string;
  title: string;
  listItems: string[];
  listColor: string;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={`cat-reveal opacity-0 translate-y-6 transition-all duration-700 border-t border-[#e8e8e8] py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center ${reverse ? "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1" : ""}`}
    >
      <div>
        <div
          className="font-brand flex items-center gap-2.5 mb-5 text-sm font-semibold tracking-[0.04em]"
          style={{ color: numColor }}
        >
          <span className="w-6 h-px" style={{ background: numColor }} />
          {num}
        </div>
        <h3
          className="font-brand font-semibold leading-[1.05] mb-5"
          style={{
            fontSize: "clamp(28px, 3.4vw, 44px)",
            letterSpacing: "-0.025em",
            color: "#0a0a0a",
          }}
        >
          {title}
        </h3>
        <ul className="flex flex-col gap-3">
          {listItems.map((item, i) => (
            <li
              key={i}
              className="font-bodycopy flex gap-3 items-start text-[16px] text-[#3a3a3a]"
            >
              <span
                className="flex-shrink-0 w-[18px] h-[18px] mt-1 rounded-full"
                style={{
                  background: `${listColor}14`,
                  backgroundImage: `radial-gradient(circle, ${listColor} 4px, transparent 4px)`,
                }}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function FeaturesCorporateAITrainingSVP() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  return (
    <section ref={ref} id="program" className="py-24 pb-0 bg-white">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end mb-6 cat-reveal opacity-0 translate-y-6 transition-all duration-700">
          <div>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 text-[11px] uppercase tracking-[0.12em] text-[#777]"
              style={{
                background: "#f5f5f5",
                borderColor: "#e8e8e8",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0165fc]" />3
              Keunggulan Utama
            </span>
            <h2
              className="font-brand font-semibold leading-[0.98] text-[#0a0a0a]"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                letterSpacing: "-0.035em",
              }}
            >
              Apa yang membuat program ini berbeda.
            </h2>
          </div>
        </div>

        <FeatureBlock
          num="01 — Productivity"
          numColor="#0165fc"
          title="Peningkatan produktivitas hingga 60%."
          listItems={[
            "Memangkas waktu reporting & analisis dari hari menjadi jam.",
            "Otomasi tugas-tugas repetitif yang bikin karyawan burnout.",
            "Meningkatkan kualitas output di marketing, sales, ops, dan HR.",
            "Mempercepat decision-making dengan AI-powered insights.",
          ]}
          listColor="#0165fc"
        >
          <ProductivityViz />
        </FeatureBlock>

        <FeatureBlock
          num="02 — Speakers"
          numColor="#e74d79"
          title="Diajarkan langsung oleh praktisi AI."
          listItems={[
            "Real case studies dari implementasi AI di perusahaan Indonesia.",
            "Insider tips yang nggak akan Anda temukan di YouTube atau Google.",
            "Q&A langsung dengan praktisi yang paham konteks bisnis lokal.",
            "Network dengan komunitas profesional AI di Indonesia.",
          ]}
          listColor="#e74d79"
          reverse
        >
          <ChatViz />
        </FeatureBlock>

        <FeatureBlock
          num="03 — Custom LMS"
          numColor="#0165fc"
          title="LMS eksklusif, branded untuk perusahaan Anda."
          listItems={[
            "Library materi training accessible kapan saja oleh seluruh tim.",
            "Video recording dari semua sesi training.",
            "Template, prompt library, dan toolkit siap pakai.",
            "Dashboard tracking progress dan adoption rate karyawan.",
            "Onboarding mudah untuk karyawan baru.",
          ]}
          listColor="#0165fc"
        >
          <LMSViz />
        </FeatureBlock>

        <div className="border-t border-[#e8e8e8]" />
      </div>
    </section>
  );
}
