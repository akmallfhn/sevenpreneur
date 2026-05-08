"use client";
import { ArrowRight, User } from "lucide-react";
import Link from "next/link";

const speakers = [
  {
    name: "Speaker — Praktisi AI",
    role: "AI Lead · Banking",
    achievement:
      "Implementasi AI di 50+ proses internal, fokus pada otomasi reporting dan risk analysis.",
  },
  {
    name: "Speaker — Praktisi AI",
    role: "Head of Data · FMCG",
    achievement:
      "Memimpin AI transformation untuk supply chain dan demand forecasting di tingkat regional.",
  },
  {
    name: "Speaker — Praktisi AI",
    role: "CTO · Tech Startup",
    achievement:
      "Membangun AI-native product dari nol — dari prompt design sampai production-grade workflow.",
  },
];

export default function SpeakersCorporateAITrainingSVP() {
  return (
    <section
      id="speakers"
      className="section-root relative flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="section-container flex flex-col w-full items-center gap-10 p-5 py-10 z-20 lg:px-0 lg:py-[80px] lg:gap-[64px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {/* Section Title & Desc */}
        <div className="section-title-desc flex flex-col w-full text-center items-center gap-3 z-10">
          <div className="flex items-center gap-3 text-xs font-bodycopy font-medium tracking-[0.25em] uppercase text-white/70 mb-2">
            Speaker
          </div>
          <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl sm:text-3xl sm:max-w-[600px] lg:text-4xl lg:max-w-[788px]">
            Belajar dari mereka yang sudah membuktikan
          </h2>
          <p className="section-desc text-sm font-bodycopy italic text-white/80 max-w-[326px] sm:text-base sm:max-w-[480px] lg:text-xl lg:max-w-[640px]">
            &ldquo;Bukan dari yang sekedar tahu, tapi dari yang sudah
            melakukan.&rdquo;
          </p>
        </div>

        {/* Speaker Cards */}
        <div className="speakers grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 w-full">
          {speakers.map((s, i) => (
            <div
              key={i}
              className="speaker-card relative p-[1px] rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-transparent overflow-hidden group"
            >
              <div className="relative w-full h-full bg-[#0F0E1F] rounded-2xl p-6 lg:p-7 transition-colors group-hover:bg-[#16142a]">
                {/* Photo placeholder */}
                <div className="aspect-square rounded-2xl mb-5 relative grid place-items-center bg-gradient-to-br from-[#7B6FF0]/20 via-[#3417E3]/15 to-[#CC446A]/20 border border-white/10 overflow-hidden">
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 8px, transparent 8px 9px)",
                    }}
                  />
                  <div className="relative flex flex-col items-center gap-2">
                    <div className="flex items-center justify-center size-16 rounded-full bg-white/10 border border-white/15">
                      <User className="size-8 text-white/40" />
                    </div>
                    <span className="font-bodycopy text-[10px] font-bold tracking-[1.5px] uppercase text-white/50 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                      Speaker Photo
                    </span>
                  </div>
                </div>
                <h3 className="font-brand font-bold text-lg text-white mb-1 lg:text-xl">
                  {s.name}
                </h3>
                <p className="font-bodycopy text-[11px] font-bold tracking-[1.5px] uppercase text-[#B89FE0] mb-3.5">
                  {s.role}
                </p>
                <p className="font-bodycopy text-sm text-white/70 pt-3.5 border-t border-white/10 leading-[1.55]">
                  {s.achievement}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* All speakers link */}
        <Link
          href="#"
          className="group inline-flex items-center justify-center gap-3 h-[52px] px-7 rounded-full bg-white/5 border border-white/15 text-white font-bodycopy font-semibold text-sm hover:bg-white/10 hover:border-white/25 transition-all backdrop-blur-sm"
        >
          Lihat semua speaker
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Decoration Blur */}
      <div className="absolute bg-[#7B6FF0] size-80 top-1/2 -translate-y-1/2 -left-40 blur-[140px] rounded-full z-[1] opacity-40" />
      <div className="absolute bg-[#3417E3] size-80 top-1/2 -translate-y-1/2 -right-40 blur-[140px] rounded-full z-[1] opacity-50" />
    </section>
  );
}
