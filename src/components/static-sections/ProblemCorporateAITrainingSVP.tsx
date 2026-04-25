"use client";
import { useEffect, useRef } from "react";

const problems = [
  "Setiap hari harus ngejelasin konteks dari nol ke AI—karena tidak ada sistem yang menyimpan knowledge perusahaan.",
  "Output AI tiap orang beda-beda karena tidak ada standard prompt, sistem, dan konsistensi.",
  "Yang bisa diotomasi dalam 5 menit masih dikerjakan manual 2 jam karena tim tidak tahu AI bisa diprogram, bukan cuma dichat.",
  "Senior staff menolak pakai AI karena merasa hasilnya generik—padahal masalahnya ada di cara pakainya, bukan toolsnya.",
  "Manajemen tidak bisa ukur ROI dari AI—karena penggunaannya tersebar, tidak terdokumentasi, dan tiap orang beda cara.",
  "Task lintas tim masih jalan manual, padahal AI agents sudah bisa handle workflow kompleks tanpa koordinasi manusia.",
];

export default function ProblemCorporateAITrainingSVP() {
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
    <section
      ref={ref}
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "#050505", color: "#ffffff" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 15% 10%, rgba(1,101,252,0.18), transparent 60%), radial-gradient(ellipse 50% 40% at 85% 90%, rgba(231,77,121,0.12), transparent 60%)",
        }}
      />
      <div className="relative z-10 max-w-[1240px] mx-auto px-5 md:px-8">
        {/* Section header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end mb-14 cat-reveal opacity-0 translate-y-6 transition-all duration-700">
          <div>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 text-[11px] uppercase tracking-[0.12em]"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0165fc]" />
              The Reality
            </span>
            <h2
              className="font-brand font-semibold tracking-tight leading-[0.98]"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                letterSpacing: "-0.035em",
              }}
            >
              Sekadar ngeprompt di ChatGPT
              <br />
              bukan strategi AI.{" "}
            </h2>
          </div>
        </div>

        {/* Problem grid */}
        <div
          className="cat-reveal opacity-0 translate-y-6 transition-all duration-700 delay-100 grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden border"
          style={{
            gap: "1px",
            background: "rgba(255,255,255,0.06)",
            borderColor: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
          }}
        >
          {problems.map((text, i) => (
            <div
              key={i}
              className="flex gap-4 p-7 transition-colors"
              style={{ background: "rgba(255,255,255,0.02)" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background =
                  "rgba(255,255,255,0.05)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background =
                  "rgba(255,255,255,0.02)")
              }
            >
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full grid place-items-center text-sm"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                ×
              </div>
              <p className="font-bodycopy text-white leading-[1.5]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
