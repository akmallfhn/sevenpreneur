"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

const cards = [
  {
    icon: "❉",
    title: ["Pillar", "deep-dives"],
    desc: "A 3–4 paragraph narrative for each of the six dimensions — what we found, what it means for your business specifically, and what is at stake if the gap remains.",
  },
  {
    icon: "✦",
    title: ["AI tool", "recommendations"],
    desc: "Concrete tool recommendations organised by business function — Sales, Operations, Finance, Marketing, Customer Service. Filtered to your industry and current adoption level. No generic lists.",
  },
  {
    icon: "❖",
    title: ["30-60-90 day", "roadmap"],
    desc: "A phased adoption roadmap oriented toward your stated outcome and sequenced around your specific gaps. Not a generic plan — built from what your assessment revealed.",
  },
  {
    icon: "✧",
    title: ["Executive", "summary"],
    desc: "A one-page verdict — your overall position, the two or three most important observations, and one sentence that tells you what to do first. Shareable with a co-founder, board, or team.",
  },
];

export default function ReportContentsBARISVP() {
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
      ref={ref}
      className="relative py-24 md:py-[100px] border-t border-[#2a2826]"
      style={{ background: "#0a0908", color: "#f5f4f0" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="bari-reveal opacity-0 translate-y-4 transition-all duration-700 inline-flex items-center gap-2.5 text-[10px] tracking-[0.3em] uppercase font-medium text-[#8a8780] mb-5">
          <span className="w-4 h-px bg-[#5a5853]" />
          Premium report
        </div>
        <h2
          className="bari-reveal opacity-0 translate-y-4 transition-all duration-700 delay-100 font-cormorant font-normal mb-5"
          style={{
            fontSize: "clamp(36px, 5vw, 60px)",
            lineHeight: 1.05,
            letterSpacing: "-1.5px",
          }}
        >
          The BARI <em className="italic">Premium Report</em>
        </h2>
        <p className="bari-reveal opacity-0 translate-y-4 transition-all duration-700 delay-150 font-read text-[17px] text-[#c9c6bf] leading-relaxed max-w-[560px] mb-12">
          A complete editorial diagnostic — not a score, not a checklist, not a
          generic PDF. A specific assessment of your business, written by AI
          trained on your answers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2a2826] rounded-2xl overflow-hidden">
          {cards.map((c, i) => (
            <div
              key={c.title.join(" ")}
              className="bari-reveal opacity-0 translate-y-4 transition-all duration-500 bg-[#161513] hover:bg-[#1c1a17] p-8"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <span className="block text-xl mb-4 opacity-80">{c.icon}</span>
              <div
                className="font-cormorant font-normal text-[#f5f4f0] mb-2.5"
                style={{ fontSize: 22, letterSpacing: "-0.3px" }}
              >
                {c.title[0]} <em className="italic">{c.title[1]}</em>
              </div>
              <p className="font-read text-[13px] text-[#8a8780] leading-[1.65]">
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Chrome callout */}
        <div className="bari-reveal opacity-0 translate-y-4 transition-all duration-700 mt-20 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-center bg-[#dedbd5] text-[#0a0908] rounded-[20px] p-12">
          <div>
            <div
              className="font-cormorant font-normal"
              style={{ fontSize: 28, lineHeight: 1.25, letterSpacing: "-0.5px" }}
            >
              &ldquo;One honest answer&rdquo; means the report tells you what is
              true — including the parts that are not ready.{" "}
              <em className="italic">
                Earned praise at high scores. No alarm at low ones.
              </em>
            </div>
            <div className="font-read text-sm text-[#6e6c66] mt-2.5">
              Written to the standard of an editorial diagnostic, not a
              marketing asset.
            </div>
          </div>
          <Link
            href="/business-ai-readiness-index/assesments"
            className="inline-flex items-center justify-center font-medium font-read rounded-full px-8 h-[52px] text-[15px] tracking-[0.2px] bg-[#0a0908] text-[#f5f4f0] border border-[#3d3a36] whitespace-nowrap hover:bg-[#161513] transition-colors"
          >
            Begin assessment
          </Link>
        </div>
      </div>
    </section>
  );
}
