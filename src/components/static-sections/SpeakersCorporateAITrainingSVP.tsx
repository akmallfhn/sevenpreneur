"use client";
import { useEffect, useRef } from "react";

const speakers = [
  {
    name: "Speaker — Praktisi AI",
    role: "AI Lead · Banking",
    achievement:
      "Implementasi AI di 50+ proses internal, fokus pada otomasi reporting dan risk analysis.",
    initials: "SP",
  },
  {
    name: "Speaker — Praktisi AI",
    role: "Head of Data · FMCG",
    achievement:
      "Memimpin AI transformation untuk supply chain dan demand forecasting di tingkat regional.",
    initials: "SP",
  },
  {
    name: "Speaker — Praktisi AI",
    role: "CTO · Tech Startup",
    achievement:
      "Membangun AI-native product dari nol—dari prompt design sampai production-grade workflow.",
    initials: "SP",
  },
];

export default function SpeakersCorporateAITrainingSVP() {
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
    <section ref={ref} id="speakers" className="py-24 md:py-32 bg-[#f5f5f5]">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end mb-12 cat-reveal opacity-0 translate-y-6 transition-all duration-700">
          <div>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 text-[11px] uppercase tracking-[0.12em] text-[#777]"
              style={{ background: "#ffffff", borderColor: "#e8e8e8", fontFamily: "JetBrains Mono, monospace" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0165fc]" />
              Speaker
            </span>
            <h2
              className="font-brand font-semibold leading-[0.98] text-[#0a0a0a]"
              style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-0.035em" }}
            >
              Belajar dari mereka yang sudah membuktikan.
            </h2>
          </div>
          <p
            className="font-bodycopy italic"
            style={{ fontSize: "clamp(18px, 1.4vw, 22px)", color: "#3a3a3a", lineHeight: 1.5, maxWidth: 680 }}
          >
            "Bukan dari yang sekedar tahu, tapi dari yang sudah melakukan."
          </p>
        </div>

        {/* Speaker cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {speakers.map((s, i) => (
            <div
              key={i}
              className="cat-reveal opacity-0 translate-y-6 transition-all duration-700 bg-white border border-[#e8e8e8] rounded-2xl p-6"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Photo placeholder */}
              <div
                className="aspect-square rounded-xl mb-4 relative grid place-items-center"
                style={{
                  background: "repeating-linear-gradient(135deg, #f5f5f5 0 8px, #e8e8e8 8px 9px)",
                }}
              >
                <div
                  className="absolute inset-4 border border-dashed border-[#d0d0d0] rounded-lg"
                />
                <span
                  className="relative text-[11px] text-[#777] tracking-[0.1em] uppercase px-2 py-1 bg-white rounded"
                  style={{ fontFamily: "JetBrains Mono, monospace" }}
                >
                  SPEAKER PHOTO
                </span>
              </div>
              <h4
                className="font-brand font-semibold text-[20px] text-[#0a0a0a] mb-1"
                style={{ letterSpacing: "-0.015em" }}
              >
                {s.name}
              </h4>
              <p
                className="text-[13px] text-[#777] mb-3.5"
                style={{ fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.04em" }}
              >
                {s.role}
              </p>
              <p className="font-bodycopy text-[14px] text-[#3a3a3a] pt-3.5 border-t border-[#e8e8e8]">
                {s.achievement}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center cat-reveal opacity-0 translate-y-6 transition-all duration-700">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#d0d0d0] text-[#3a3a3a] text-sm font-medium transition-all hover:-translate-y-0.5 hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a]"
          >
            Lihat semua speaker
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
