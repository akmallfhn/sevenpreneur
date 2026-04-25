"use client";
import { useEffect, useRef } from "react";

const criteria = [
  "Memiliki 20+ karyawan yang akan terdampak transformasi AI.",
  "Sudah atau sedang mempertimbangkan investasi tools AI.",
  "Ingin competitive advantage melalui efisiensi AI-powered.",
  "Memerlukan structured approach untuk AI adoption, bukan ad-hoc.",
  "Memprioritaskan measurable ROI dari setiap investasi training.",
];

const industries = [
  "Banking & Finance",
  "FMCG",
  "Retail",
  "Manufacturing",
  "Property",
  "Healthcare",
  "Tech & Startup",
  "Professional Services",
];

const stats = [
  { label: "COHORTS DELIVERED", value: "40+", accent: false },
  { label: "PROFESSIONALS TRAINED", value: "2,800+", accent: false },
  { label: "AVG. PRODUCTIVITY UPLIFT", value: "+60%", accent: true },
];

export default function IdealForCorporateAITrainingSVP() {
  const ref = useRef<HTMLElement>(null);

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
  }, []);

  return (
    <section ref={ref} className="py-24 pb-0">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end mb-14 cat-reveal opacity-0 translate-y-6 transition-all duration-700">
          <div>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 text-[11px] uppercase tracking-[0.12em] text-[#777]"
              style={{
                background: "#f5f5f5",
                borderColor: "#e8e8e8",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0165fc]" />
              Ideal Untuk
            </span>
            <h2
              className="font-brand font-semibold leading-[0.98] text-[#0a0a0a]"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                letterSpacing: "-0.035em",
              }}
            >
              Program ini cocok untuk perusahaan yang...
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="cat-reveal opacity-0 translate-y-6 transition-all duration-700 delay-100 grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-10 md:gap-16 items-start">
          {/* Criteria list */}
          <ul className="flex flex-col">
            {criteria.map((item, i) => (
              <li
                key={i}
                className="font-bodycopy flex gap-4 py-5 border-b border-[#e8e8e8] text-[#0a0a0a] leading-[1.4]"
                style={{
                  fontSize: "clamp(17px, 1.6vw, 21px)",
                  letterSpacing: "-0.005em",
                  borderTop: i === 0 ? "1px solid #e8e8e8" : undefined,
                }}
              >
                <span
                  className="flex-shrink-0 text-[12px] text-[#777] mt-1.5"
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    letterSpacing: "0.06em",
                  }}
                >
                  0{i + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Industries card */}
          <div className="p-7 border border-[#e8e8e8] rounded-2xl bg-[#f5f5f5]">
            <h4
              className="text-[14px] uppercase tracking-[0.08em] text-[#777] font-medium mb-4"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              Industri yang sudah kami latih
            </h4>
            <div className="flex flex-wrap gap-2 mb-6">
              {industries.map((ind, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full bg-white border border-[#e8e8e8] text-[13px] text-[#3a3a3a]"
                >
                  {ind}
                </span>
              ))}
            </div>
            <div className="pt-5 border-t border-[#e8e8e8] flex flex-col gap-3.5">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex justify-between"
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: 12,
                    letterSpacing: "0.06em",
                  }}
                >
                  <span className="text-[#777]">{stat.label}</span>
                  <span style={{ color: stat.accent ? "#0165fc" : "#777" }}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
