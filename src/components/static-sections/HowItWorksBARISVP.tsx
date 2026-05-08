"use client";
import { useEffect, useRef } from "react";

const steps = [
  {
    num: "1",
    name: "Quick diagnostic",
    desc: "15 questions. 7 minutes. Covers all six dimensions at surface level. Free. No account required.",
    tag: "Free · ~7 min",
  },
  {
    num: "2",
    name: "Deep assessment",
    desc: "28 questions. Goes deeper across all six pillars. Free to complete. Your full report is ready when you finish.",
    tag: "Free to fill · ~12 min",
  },
  {
    num: "3",
    name: "Full report",
    desc: "A complete editorial diagnostic: pillar analysis, AI tool recommendations by function, and a 30-60-90 day adoption roadmap built for your specific gaps.",
    tag: "BARI Premium Report",
  },
];

const reportSections = [
  {
    name: "Data Foundation",
    pct: 45,
    label: "Developing",
    tone: "developing" as const,
  },
  {
    name: "Process Digitisation",
    pct: 62,
    label: "Strength",
    tone: "strength" as const,
  },
  {
    name: "AI Adoption Baseline",
    pct: 28,
    label: "Gap",
    tone: "gap" as const,
  },
  {
    name: "Team Readiness",
    pct: 55,
    label: "Developing",
    tone: "developing" as const,
  },
  {
    name: "AI Search Visibility",
    pct: 22,
    label: "Gap",
    tone: "gap" as const,
  },
  {
    name: "Disruption Exposure",
    pct: 50,
    label: "Developing",
    tone: "developing" as const,
  },
];

const toneStyles = {
  strength: {
    dot: "bg-[#e8e6e1]",
    fill: "bg-[#e8e6e1]",
    label: "text-[#e8e6e1]",
  },
  developing: {
    dot: "bg-[#8a8780]",
    fill: "bg-[#8a8780]",
    label: "text-[#8a8780]",
  },
  gap: {
    dot: "bg-[#a8615e]/70",
    fill: "bg-[#a8615e]/70",
    label: "text-[#a8615e]/80",
  },
};

export default function HowItWorksBARISVP() {
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
      id="how"
      ref={ref}
      className="relative py-24 md:py-[100px] border-t border-[#2a2826]"
      style={{ background: "#0a0908", color: "#f5f4f0" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Steps */}
          <div>
            <div className="bari-reveal opacity-0 translate-y-4 transition-all duration-700 inline-flex items-center gap-2.5 text-[10px] tracking-[0.3em] uppercase font-medium text-[#8a8780] mb-5">
              <span className="w-4 h-px bg-[#5a5853]" />
              The process
            </div>
            <h2
              className="bari-reveal opacity-0 translate-y-4 transition-all duration-700 delay-100 font-cormorant font-normal mb-10"
              style={{
                fontSize: "clamp(36px, 5vw, 60px)",
                lineHeight: 1.05,
                letterSpacing: "-1.5px",
              }}
            >
              Two stages.
              <br />
              <em className="italic">One honest answer.</em>
            </h2>

            <div className="flex flex-col">
              {steps.map((s, i) => (
                <div
                  key={s.num}
                  className={`bari-reveal opacity-0 translate-y-4 transition-all duration-500 group grid grid-cols-[48px_1fr] gap-5 py-6 border-b border-[#1f1d1b] ${i === 0 ? "border-t border-[#1f1d1b]" : ""}`}
                  style={{ transitionDelay: `${i * 80 + 150}ms` }}
                >
                  <div
                    className="font-cormorant font-light text-[#3d3a36] group-hover:text-[#5a5853] pt-0.5 transition-colors"
                    style={{
                      fontSize: 36,
                      lineHeight: 1,
                      letterSpacing: "-1px",
                    }}
                  >
                    {s.num}
                  </div>
                  <div>
                    <div
                      className="font-cormorant font-normal text-[#e8e6e1] group-hover:text-[#f5f4f0] mb-1.5 transition-colors"
                      style={{ fontSize: 20, letterSpacing: "-0.2px" }}
                    >
                      {s.name}
                    </div>
                    <p className="font-read text-[13px] text-[#8a8780] leading-[1.6] mb-2">
                      {s.desc}
                    </p>
                    <span className="inline-block font-read text-[10px] tracking-[1.5px] uppercase text-[#5a5853] font-medium">
                      {s.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report preview */}
          <div className="bari-reveal opacity-0 translate-y-4 transition-all duration-700 delay-200">
            <div className="rounded-[20px] bg-[#161513] border border-[#2a2826] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a2826]">
                <span className="font-cormorant text-base italic text-[#c9c6bf]">
                  BARI Premium Report
                </span>
                <span className="font-read text-[9px] font-semibold tracking-[1.5px] uppercase rounded-full px-2.5 py-1 bg-[#dedbd5] text-[#0a0908]">
                  AI-Adjacent
                </span>
              </div>

              <div className="flex items-baseline gap-2 px-6 py-6 border-b border-[#2a2826]">
                <span
                  className="font-cormorant font-light"
                  style={{
                    fontSize: 64,
                    lineHeight: 1,
                    letterSpacing: "-3px",
                    background:
                      "linear-gradient(180deg, #f5f4f0 0%, #c9c6bf 60%, #6e6c66 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  47
                </span>
                <div className="pb-1.5">
                  <span className="font-cormorant text-lg italic text-[#e8e6e1] block">
                    AI-Adjacent
                  </span>
                  <span className="font-read text-[10px] text-[#8a8780] tracking-[2px] uppercase">
                    / 100
                  </span>
                </div>
              </div>

              <div className="px-6 py-5 flex flex-col gap-3.5">
                {reportSections.map((s) => {
                  const t = toneStyles[s.tone];
                  return (
                    <div key={s.name} className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${t.dot}`} />
                      <span className="font-read text-[13px] text-[#c9c6bf] flex-1">
                        {s.name}
                      </span>
                      <div className="w-20 h-0.5 bg-[#2a2826] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${t.fill}`}
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                      <span
                        className={`font-read text-[10px] min-w-[60px] text-right ${t.label}`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mx-6 mb-6 px-4 py-4 bg-[#1c1a17] rounded-xl border border-[#3d3a36] flex items-center justify-between gap-4">
                <span className="font-read text-[13px] text-[#c9c6bf]">
                  <strong className="text-[#f5f4f0] font-medium">
                    Your report is ready.
                  </strong>{" "}
                  Includes tool recs + roadmap.
                </span>
                <span className="font-read text-[12px] font-medium rounded-full px-4 h-9 inline-flex items-center bg-[#dedbd5] text-[#0a0908] whitespace-nowrap">
                  View report
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
