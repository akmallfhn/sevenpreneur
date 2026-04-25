"use client";
import { useEffect, useRef } from "react";
import { Brain, Focus, Library, Map, Workflow, BarChart3 } from "lucide-react";

const cards = [
  {
    tag: "Fondasi",
    title: "Pahami cara AI bekerja",
    desc: "AI bukan mesin pencari. Ia sistem probabilistik yang butuh konteks tepat untuk bisa efektif.",
    accent: "#0165fc",
    Icon: Brain,
  },
  {
    tag: "Context Engineering",
    title: "Output bagus = konteks yang bagus",
    desc: "Definisikan peran, batasan, dan tujuan dengan jelas—bukan sekadar ngetik pertanyaan.",
    accent: "#0165fc",
    Icon: Focus,
  },
  {
    tag: "Prompt sebagai Sistem",
    title: "Prompt adalah aset, bukan pertanyaan sekali pakai",
    desc: "Bangun prompt library yang bisa dipakai ulang dan distandarisasi di seluruh departemen.",
    accent: "#e74d79",
    Icon: Library,
  },
  {
    tag: "Workflow Mapping",
    title: "Tahu persis di mana AI paling berdampak",
    desc: "Identifikasi titik spesifik di workflow Anda yang bisa dipangkas paling signifikan.",
    accent: "#e74d79",
    Icon: Map,
  },
  {
    tag: "Build, Don't Just Chat",
    title: "Dari chat ke sistem otomatis",
    desc: "Otomasi task repetitif dan integrasikan AI ke tools yang sudah dipakai—tanpa jadi developer.",
    accent: "#0a0a0a",
    Icon: Workflow,
  },
  {
    tag: "Iterasi & Ukur",
    title: "Skill AI yang terus berkembang",
    desc: "Framework dokumentasi dan pengukuran ROI—supaya tim tidak berhenti berkembang setelah training.",
    accent: "#0a0a0a",
    Icon: BarChart3,
  },
];

export default function SolutionCorporateAITrainingSVP() {
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
        <div className="mb-12 cat-reveal opacity-0 translate-y-6 transition-all duration-700">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 text-[11px] uppercase tracking-[0.12em] text-[#777]"
            style={{
              background: "#f5f5f5",
              borderColor: "#e8e8e8",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0165fc]" />
            Pendekatan Kami
          </span>
          <h2
            className="font-brand font-semibold leading-[0.98]"
            style={{
              fontSize: "clamp(36px, 5.5vw, 72px)",
              letterSpacing: "-0.035em",
              color: "#0a0a0a",
              maxWidth: 900,
            }}
          >
            Bukan cuma prompt.{" "}
            <em className="italic" style={{ color: "#0165fc" }}>
              Kami bangun sistem AI yang benar-benar dipakai.
            </em>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          {cards.map((card, i) => (
            <div
              key={i}
              className="cat-reveal opacity-0 translate-y-6 transition-all duration-700 bg-[#f5f5f5] border border-[#e8e8e8] rounded-2xl p-7"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-11 h-11 rounded-xl grid place-items-center"
                  style={{ background: `${card.accent}12` }}
                >
                  <card.Icon
                    size={20}
                    strokeWidth={1.7}
                    style={{
                      color: card.accent === "#0a0a0a" ? "#555" : card.accent,
                    }}
                  />
                </div>
                <span
                  className="text-[11px] uppercase tracking-[0.1em] px-2.5 py-1 rounded-full font-mono"
                  style={{
                    background: `${card.accent}10`,
                    color: card.accent === "#0a0a0a" ? "#777" : card.accent,
                  }}
                >
                  {card.tag}
                </span>
              </div>
              <h4
                className="font-bodycopy font-semibold text-[18px] mb-2 text-[#0a0a0a]"
                style={{ letterSpacing: "-0.01em" }}
              >
                {card.title}
              </h4>
              <p className="font-bodycopy text-[15px] text-[#3a3a3a]">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
