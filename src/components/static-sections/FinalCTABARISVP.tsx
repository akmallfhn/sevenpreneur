"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

const bullets = [
  "Six-pillar diagnostic across all dimensions of AI readiness",
  "Editorial-grade report generated from your specific answers",
  "AI tool recommendations by business function",
  "30-60-90 day adoption roadmap oriented to your gaps",
];

export default function FinalCTABARISVP() {
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
      id="start"
      ref={ref}
      className="relative py-28 md:py-[120px] text-center border-t border-[#2a2826]"
      style={{ background: "#0a0908", color: "#f5f4f0" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="bari-reveal opacity-0 translate-y-4 transition-all duration-700 relative overflow-hidden bg-[#161513] border border-[#2a2826] rounded-[28px] p-10 md:p-16 max-w-[680px] mx-auto">
          <div
            className="absolute pointer-events-none"
            style={{
              top: -120,
              left: "50%",
              transform: "translateX(-50%)",
              width: 500,
              height: 300,
              background:
                "radial-gradient(ellipse, rgba(222,219,213,0.055) 0%, transparent 65%)",
            }}
          />

          <div className="relative">
            <div className="font-read text-[10px] tracking-[0.3em] uppercase font-medium text-[#8a8780] mb-7">
              Begin now
            </div>
            <h2
              className="font-cormorant font-normal mb-5"
              style={{
                fontSize: "clamp(40px, 6vw, 64px)",
                lineHeight: 1.02,
                letterSpacing: "-2px",
              }}
            >
              Your index.
              <br />
              <em className="italic">Your answer.</em>
            </h2>
            <p
              className="font-cormorant font-light text-[#c9c6bf] mb-10"
              style={{ fontSize: 20, lineHeight: 1.5 }}
            >
              Stage 1 is free and takes seven minutes. No account required —
              just answers.
            </p>

            <ul className="flex flex-col gap-2.5 mb-9 text-left">
              {bullets.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2.5 font-read text-sm text-[#c9c6bf] leading-[1.5]"
                >
                  <span className="text-[#5a5853] shrink-0 mt-0.5">→</span>
                  {b}
                </li>
              ))}
            </ul>

            <Link
              href="/business-ai-readiness-index/assesments"
              className="inline-flex w-full items-center justify-center font-medium font-read rounded-full px-8 h-[52px] text-[15px] tracking-[0.2px] bg-[#e8e6e1] text-[#0a0908] hover:bg-[#f5f4f0] transition-colors"
            >
              Begin assessment →
            </Link>

            <div className="font-read text-[11px] text-[#5a5853] tracking-[0.5px] mt-6">
              Powered by Sevenpreneur × Claude AI
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
