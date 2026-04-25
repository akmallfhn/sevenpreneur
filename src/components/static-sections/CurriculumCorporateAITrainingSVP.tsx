"use client";
import { useEffect, useRef } from "react";

const modules = [
  {
    n: "Module 01",
    t: "AI Foundation untuk Profesional",
    d: "Memahami AI tanpa jargon teknis. Bagaimana AI bekerja, apa yang bisa dan tidak bisa dilakukan, dan bagaimana cara berpikir tentang AI dalam konteks bisnis.",
  },
  {
    n: "Module 02",
    t: "Practical AI Tools per Departemen",
    d: "Tools AI terbaik untuk Marketing, Sales, Operations, HR, Finance, dan Customer Service. Hands-on workshop, bukan demo.",
  },
  {
    n: "Module 03",
    t: "Prompt Engineering for Business",
    d: "Cara menulis prompt yang menghasilkan output berkualitas profesional. Dari brief sederhana sampai workflow kompleks.",
  },
  {
    n: "Module 04",
    t: "AI Workflow Automation",
    d: "Membangun workflow otomatis yang nyambung antar tools. Memangkas pekerjaan manual yang memakan waktu.",
  },
  {
    n: "Module 05",
    t: "AI Strategy & Implementation",
    d: "Untuk leader: bagaimana merancang AI roadmap, menghitung ROI, dan mendrive adopsi di seluruh organisasi.",
  },
  {
    n: "Module 06",
    t: "Ethics, Security & Risk",
    d: "Menggunakan AI dengan bertanggung jawab—data privacy, security, compliance, dan risk mitigation.",
  },
];

export default function CurriculumCorporateAITrainingSVP() {
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
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} id="curriculum" className="py-24 md:py-32">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end mb-14 cat-reveal opacity-0 translate-y-6 transition-all duration-700">
          <div>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 text-[11px] uppercase tracking-[0.12em] text-[#777]"
              style={{ background: "#f5f5f5", borderColor: "#e8e8e8", fontFamily: "JetBrains Mono, monospace" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0165fc]" />
              Curriculum
            </span>
            <h2
              className="font-brand font-semibold leading-[0.98] text-[#0a0a0a]"
              style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-0.035em" }}
            >
              Apa yang akan dipelajari tim Anda.
            </h2>
          </div>
          <p className="font-bodycopy" style={{ fontSize: "clamp(18px, 1.4vw, 22px)", color: "#3a3a3a", lineHeight: 1.5, maxWidth: 680 }}>
            Enam modul yang membentuk fondasi penggunaan AI yang sustainable. Curriculum dapat
            dikustomisasi sesuai kebutuhan dan industri perusahaan Anda.
          </p>
        </div>

        {/* Module grid */}
        <div
          className="cat-reveal opacity-0 translate-y-6 transition-all duration-700 delay-100 grid grid-cols-1 md:grid-cols-3 rounded-[18px] overflow-hidden border border-[#e8e8e8]"
          style={{ gap: "1px", background: "#e8e8e8" }}
        >
          {modules.map((m, i) => (
            <div
              key={i}
              className="bg-white p-8 transition-colors hover:bg-[#f5f5f5] cursor-default"
            >
              <span
                className="block mb-5 text-[11px] uppercase tracking-[0.12em]"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  color: i % 2 === 0 ? "#0165fc" : "#e74d79",
                }}
              >
                {m.n}
              </span>
              <h4
                className="font-brand font-semibold text-[22px] text-[#0a0a0a] mb-3 leading-[1.2]"
                style={{ letterSpacing: "-0.02em" }}
              >
                {m.t}
              </h4>
              <p className="font-bodycopy text-[15px] text-[#3a3a3a] leading-[1.5]">{m.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
