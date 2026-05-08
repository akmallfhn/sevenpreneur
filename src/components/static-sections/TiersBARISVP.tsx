"use client";
import { useEffect, useRef } from "react";

const tiers = [
  {
    range: "80 — 100",
    score: "80+",
    name: "AI-Native",
    desc: "Ready to deploy AI at scale. The competitive advantage window is now.",
  },
  {
    range: "60 — 79",
    score: "60+",
    name: "AI-Capable",
    desc: "Strong foundation. Targeted investments will unlock significant gains.",
  },
  {
    range: "40 — 59",
    score: "40+",
    name: "AI-Adjacent",
    desc: "Partial readiness. Clear gaps identified. A structured roadmap is required.",
  },
  {
    range: "20 — 39",
    score: "20+",
    name: "AI-Aware",
    desc: "Awareness exceeds infrastructure. Foundational work precedes AI strategy.",
  },
  {
    range: "0 — 19",
    score: "—",
    name: "Pre-AI",
    desc: "Not yet ready for meaningful AI adoption. Start with digitisation first.",
  },
];

export default function TiersBARISVP() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".bari-reveal");
    if (!els) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("opacity-100", "translate-y-0");
            e.target.classList.remove("opacity-0", "translate-y-4");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="tiers"
      ref={ref}
      className="relative py-24 md:py-[100px] border-t border-[#2a2826]"
      style={{ background: "#111110", color: "#f5f4f0" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="bari-reveal opacity-0 translate-y-4 transition-all duration-700 inline-flex items-center gap-2.5 text-[10px] tracking-[0.3em] uppercase font-medium text-[#8a8780] mb-5">
          <span className="w-4 h-px bg-[#5a5853]" />
          Score tiers
        </div>
        <h2
          className="bari-reveal opacity-0 translate-y-4 transition-all duration-700 delay-100 font-cormorant font-normal mb-5"
          style={{
            fontSize: "clamp(36px, 5vw, 60px)",
            lineHeight: 1.05,
            letterSpacing: "-1.5px",
          }}
        >
          Five positions.
          <br />
          <em className="italic">One clear picture.</em>
        </h2>
        <p className="bari-reveal opacity-0 translate-y-4 transition-all duration-700 delay-150 font-read text-[17px] text-[#c9c6bf] leading-relaxed max-w-[560px] mb-12">
          Every BARI score maps to one of five tiers. The tier tells you where
          your business stands relative to AI-readiness — not relative to a
          benchmark, but in absolute terms.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-[#2a2826] rounded-2xl overflow-hidden">
          {tiers.map((t, i) => (
            <div
              key={t.name}
              className="bari-reveal opacity-0 translate-y-4 transition-all duration-500 bg-[#161513] hover:bg-[#1c1a17] py-6 px-5 text-center"
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <span className="block font-jetbrains text-[10px] text-[#5a5853] tracking-[1px] mb-4">
                {t.range}
              </span>
              <span
                className="block font-cormorant font-light mb-3"
                style={{
                  fontSize: 40,
                  lineHeight: 1,
                  letterSpacing: "-1.5px",
                  background:
                    "linear-gradient(180deg, #f5f4f0 0%, #8a8780 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t.score}
              </span>
              <div className="font-cormorant text-base italic text-[#e8e6e1] mb-2.5">
                {t.name}
              </div>
              <p className="font-read text-[11px] text-[#8a8780] leading-[1.55]">
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
