"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HeroBARISVP() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = ref.current?.querySelectorAll(".bari-reveal");
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
    <section
      ref={ref}
      className="relative overflow-hidden pt-24 pb-28 md:pt-28 md:pb-32"
      style={{ background: "#0a0908", color: "#f5f4f0" }}
    >
      {/* Top radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 900,
          height: 500,
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(222,219,213,0.04) 0%, transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-[72px] items-center">
          {/* Left: copy */}
          <div>
            <div className="bari-reveal opacity-0 translate-y-6 transition-all duration-700 inline-flex items-center gap-3 text-[10px] tracking-[0.25em] uppercase font-medium text-[#8a8780] mb-9">
              <span className="w-5 h-px bg-[#5a5853]" />
              Business AI Readiness Index
            </div>

            <h1
              className="bari-reveal opacity-0 translate-y-6 transition-all duration-700 delay-100 font-cormorant font-normal text-[#f5f4f0] mb-7"
              style={{
                fontSize: "clamp(52px, 8vw, 94px)",
                lineHeight: 0.97,
                letterSpacing: "-3px",
              }}
            >
              Know where
              <br />
              your business
              <br />
              <em className="italic text-[#e8e6e1]">actually stands.</em>
            </h1>

            <p
              className="bari-reveal opacity-0 translate-y-6 transition-all duration-700 delay-150 font-cormorant font-light text-[#c9c6bf] max-w-[520px] mb-11"
              style={{
                fontSize: 22,
                lineHeight: 1.45,
                letterSpacing: "-0.2px",
              }}
            >
              This assessment will determine where your organization stands —
              and how far you can go.
            </p>

            <div className="bari-reveal opacity-0 translate-y-6 transition-all duration-700 delay-200 flex items-center gap-4 flex-wrap mb-12">
              <Link
                href="/business-ai-readiness-index/assesments"
                className="inline-flex items-center justify-center font-medium font-read rounded-full px-8 h-[52px] text-[15px] tracking-[0.2px] bg-[#e8e6e1] text-[#0a0908] hover:bg-[#f5f4f0] transition-colors"
              >
                Begin assessment
              </Link>
              <Link
                href="#measures"
                className="inline-flex items-center justify-center font-medium font-read rounded-full px-8 h-[52px] text-[15px] tracking-[0.2px] bg-transparent text-[#c9c6bf] border border-[#3d3a36] hover:border-[#5a5853] hover:text-[#f5f4f0] hover:bg-white/[0.03] transition-colors"
              >
                See what it measures
              </Link>
            </div>

            <div className="bari-reveal opacity-0 translate-y-6 transition-all duration-700 delay-300 flex gap-8 pt-8 border-t border-[#2a2826]">
              {[
                { val: "20", lbl: "Minutes" },
                { val: "6", lbl: "Dimensions" },
                { val: "43", lbl: "Diagnostic questions" },
                { val: "1", lbl: "Definitive answer" },
              ].map((s) => (
                <div key={s.lbl}>
                  <span
                    className="font-cormorant font-light block mb-0.5"
                    style={{
                      fontSize: 32,
                      letterSpacing: "-1px",
                      background:
                        "linear-gradient(180deg, #f5f4f0 0%, #c9c6bf 50%, #6e6c66 100%)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {s.val}
                  </span>
                  <span className="font-read text-[11px] text-[#8a8780] tracking-[1px] uppercase">
                    {s.lbl}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: score preview card */}
          <div className="bari-reveal opacity-0 translate-y-6 transition-all duration-700 delay-150">
            <div className="relative overflow-hidden rounded-3xl bg-[#161513] border border-[#2a2826] p-7">
              <div
                className="absolute pointer-events-none"
                style={{
                  top: -80,
                  right: -80,
                  width: 260,
                  height: 260,
                  background:
                    "radial-gradient(circle, rgba(245,244,240,0.05) 0%, transparent 70%)",
                }}
              />

              <div className="relative flex items-center justify-between mb-6 pb-5 border-b border-[#2a2826]">
                <span className="font-cormorant text-[15px] italic text-[#8a8780]">
                  Sample report preview
                </span>
                <span className="font-read text-[9px] font-semibold tracking-[1.5px] uppercase rounded-full px-2.5 py-1 bg-[#dedbd5] text-[#0a0908]">
                  AI-Capable
                </span>
              </div>

              <div className="relative flex items-baseline gap-4 mb-1.5">
                <span
                  className="font-cormorant font-light"
                  style={{
                    fontSize: 88,
                    lineHeight: 1,
                    letterSpacing: "-4px",
                    background:
                      "linear-gradient(180deg, #f5f4f0 0%, #c9c6bf 55%, #6e6c66 100%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  61
                </span>
                <div className="flex-1 pb-2">
                  <div className="font-cormorant text-xl italic text-[#e8e6e1] mb-0.5">
                    AI-Capable
                  </div>
                  <div className="font-read text-[10px] text-[#8a8780] tracking-[2px] uppercase">
                    out of 100
                  </div>
                </div>
              </div>

              <div className="relative font-cormorant text-sm italic text-[#8a8780] leading-[1.5] mb-6 pb-6 border-b border-[#2a2826]">
                &ldquo;A business with the foundation to move — if it chooses
                where to move first.&rdquo;
              </div>

              <div className="relative flex flex-col">
                {[
                  {
                    name: "Process Digitisation",
                    pct: 70,
                    tier: "Strength",
                    color: "bg-[#e8e6e1]",
                  },
                  {
                    name: "Team Readiness",
                    pct: 80,
                    tier: "Strength",
                    color: "bg-[#e8e6e1]",
                  },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="grid grid-cols-[1fr_80px_60px] gap-3 items-center py-2.5 border-b border-[#1f1d1b] text-xs"
                  >
                    <span className="font-read text-[#c9c6bf]">{p.name}</span>
                    <div className="h-0.5 bg-[#2a2826] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${p.color}`}
                        style={{ width: `${p.pct}%` }}
                      />
                    </div>
                    <span className="font-read text-right text-[#e8e6e1] text-[10px] tracking-[0.5px]">
                      {p.tier}
                    </span>
                  </div>
                ))}
                {[
                  { name: "Data Foundation", max: 20 },
                  { name: "AI Adoption Baseline", max: 15 },
                  { name: "AI Search Visibility", max: 10 },
                  { name: "Disruption Exposure", max: 15 },
                ].map((row, i, arr) => (
                  <div
                    key={row.name}
                    className={`flex items-center justify-between py-2.5 text-xs ${i < arr.length - 1 ? "border-b border-[#1f1d1b]" : ""}`}
                  >
                    <span className="font-read text-[#5a5853]">{row.name}</span>
                    <span
                      className="font-jetbrains text-[11px] text-[#5a5853] select-none tracking-[1px]"
                      style={{ filter: "blur(3.5px)" }}
                    >
                      ##.# / {row.max}
                    </span>
                    <span className="text-[#5a5853] text-[11px] opacity-60">
                      🔒
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
