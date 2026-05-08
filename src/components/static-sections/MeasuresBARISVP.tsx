"use client";
import { useEffect, useRef } from "react";

const pillars = [
  {
    num: "01",
    weight: "20 pts",
    name: ["Data", "Foundation"],
    desc: "Is your data structured, accessible, and clean enough for AI to use? Not whether it exists — whether it's usable.",
  },
  {
    num: "02",
    weight: "20 pts",
    name: ["Process", "Digitisation"],
    desc: "AI cannot automate what is not yet digital. This dimension measures how far your operations have moved beyond manual.",
  },
  {
    num: "03",
    weight: "15 pts",
    name: ["AI Adoption", "Baseline"],
    desc: "Where your team currently sits — from no AI tools to embedded, measured AI across multiple business functions.",
  },
  {
    num: "04",
    weight: "20 pts",
    name: ["Team & Leadership", "Readiness"],
    desc: "The human side. Do you have the capability, the owner, and the culture to actually execute an AI strategy?",
  },
  {
    num: "05",
    weight: "10 pts",
    name: ["AI Search", "Visibility"],
    desc: "When potential customers ask ChatGPT or Perplexity about businesses like yours — do you appear in the answer?",
  },
  {
    num: "06",
    weight: "15 pts",
    name: ["Disruption", "Exposure"],
    desc: "How exposed is your business model to AI displacement — and how prepared is your strategy for what is already happening?",
  },
];

export default function MeasuresBARISVP() {
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
      id="measures"
      ref={ref}
      className="relative py-24 md:py-[100px] border-t border-[#2a2826]"
      style={{ background: "#0a0908", color: "#f5f4f0" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="max-w-[700px] mb-16">
          <div className="bari-reveal opacity-0 translate-y-4 transition-all duration-700 inline-flex items-center gap-2.5 text-[10px] tracking-[0.3em] uppercase font-medium text-[#8a8780] mb-5">
            <span className="w-4 h-px bg-[#5a5853]" />
            Six dimensions
          </div>
          <h2
            className="bari-reveal opacity-0 translate-y-4 transition-all duration-700 delay-100 font-cormorant font-normal mb-5"
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
            }}
          >
            What BARI <em className="italic">measures</em>
          </h2>
          <p className="bari-reveal opacity-0 translate-y-4 transition-all duration-700 delay-150 font-read text-[17px] text-[#c9c6bf] leading-relaxed max-w-[560px]">
            AI readiness is not one thing. BARI diagnoses your business across
            six dimensions — from the data infrastructure AI requires to the
            strategic exposure you face if you wait too long.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2a2826] rounded-2xl overflow-hidden">
          {pillars.map((p, i) => (
            <div
              key={p.num}
              className="bari-reveal opacity-0 translate-y-4 transition-all duration-500 relative bg-[#161513] hover:bg-[#1c1a17] p-7"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <span className="font-jetbrains text-[11px] text-[#5a5853] tracking-[1px] mb-5 block">
                {p.num}
              </span>
              <span className="absolute top-7 right-7 font-jetbrains text-[10px] text-[#5a5853] tracking-[0.5px]">
                {p.weight}
              </span>
              <div
                className="font-cormorant font-normal text-[#f5f4f0] mb-3"
                style={{
                  fontSize: 22,
                  lineHeight: 1.2,
                  letterSpacing: "-0.3px",
                }}
              >
                {p.name[0]}
                <br />
                <em className="italic">{p.name[1]}</em>
              </div>
              <p className="font-read text-[13px] text-[#8a8780] leading-[1.6]">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
