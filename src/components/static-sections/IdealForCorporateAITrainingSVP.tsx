"use client";
import { Check } from "lucide-react";

const criteria = [
  "Memiliki 20+ karyawan yang akan terdampak transformasi AI.",
  "Sudah atau sedang mempertimbangkan investasi tools AI.",
  "Ingin competitive advantage melalui efisiensi AI-powered.",
  "Memerlukan structured approach untuk AI adoption, bukan ad-hoc.",
  "Memprioritaskan measurable ROI dari setiap investasi training.",
];

const industries = [
  "Banking & Finance",
  "FMCG",
  "Retail",
  "Manufacturing",
  "Property",
  "Healthcare",
  "Tech & Startup",
  "Professional Services",
];

const stats = [
  { label: "Cohorts Delivered", value: "40+", accent: false },
  { label: "Professionals Trained", value: "2,800+", accent: false },
  { label: "Avg. Productivity Uplift", value: "+270%", accent: true },
];

export default function IdealForCorporateAITrainingSVP() {
  return (
    <section className="section-root relative flex items-center justify-center bg-black overflow-hidden">
      <div className="section-container flex flex-col w-full items-center gap-10 p-5 py-10 z-20 lg:px-0 lg:py-[80px] lg:gap-[64px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {/* Section Title & Desc */}
        <div className="section-title-desc flex flex-col w-full text-center items-center gap-3 z-10">
          <div className="flex items-center gap-3 text-xs font-bodycopy font-medium tracking-[0.25em] uppercase text-white/70 mb-2">
            Ideal Untuk
          </div>
          <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl sm:text-3xl sm:max-w-[600px] lg:text-4xl lg:max-w-[788px]">
            Program ini cocok untuk perusahaan yang...
          </h2>
        </div>

        {/* Two-column: criteria + industries */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-start w-full">
          {/* Criteria list */}
          <div className="criteria flex flex-col gap-3">
            {criteria.map((item, i) => (
              <div
                key={i}
                className="criteria-card relative p-[1px] rounded-xl bg-gradient-to-br from-white/15 via-white/5 to-transparent overflow-hidden"
              >
                <div className="relative w-full flex items-start gap-4 bg-[#0F0E1F] rounded-xl p-5 lg:p-6">
                  <div className="flex items-center justify-center size-8 rounded-full bg-[#3417E3] shrink-0 mt-0.5 lg:size-9">
                    <Check className="size-4 text-white lg:size-[18px]" />
                  </div>
                  <p className="font-bodycopy text-sm text-white/85 leading-[1.5] lg:text-base">
                    <span className="font-brand font-bold text-[#B89FE0] mr-2">
                      0{i + 1}
                    </span>
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Industries card */}
          <div className="industries-card relative p-[1.5px] rounded-3xl bg-gradient-to-br from-[#7B6FF0]/70 via-white/10 to-[#CC446A]/50 overflow-hidden">
            <div className="relative w-full bg-[#0F0E1F] rounded-3xl p-7 lg:p-8">
              <h4 className="font-bodycopy text-[11px] font-bold tracking-[2px] uppercase text-[#B89FE0] mb-4">
                Industri yang sudah kami latih
              </h4>
              <div className="flex flex-wrap gap-2 mb-7">
                {industries.map((ind, i) => (
                  <span
                    key={i}
                    className="font-bodycopy px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[12px] text-white/80 lg:text-[13px]"
                  >
                    {ind}
                  </span>
                ))}
              </div>
              <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-baseline"
                  >
                    <span className="font-bodycopy text-[11px] font-bold tracking-[1.5px] uppercase text-white/50">
                      {stat.label}
                    </span>
                    <span
                      className={`font-brand font-bold text-2xl lg:text-3xl ${
                        stat.accent
                          ? "text-transparent bg-clip-text bg-gradient-to-br from-[#B89FE0] via-[#7B6FF0] to-[#CC446A]"
                          : "text-white"
                      }`}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decoration Blur */}
      <div className="absolute bg-[#3417E3] size-80 top-1/2 -translate-y-1/2 -left-40 blur-[140px] rounded-full z-[1] opacity-40" />
      <div className="absolute bg-[#7B6FF0] size-80 top-1/2 -translate-y-1/2 -right-40 blur-[140px] rounded-full z-[1] opacity-30" />
    </section>
  );
}
