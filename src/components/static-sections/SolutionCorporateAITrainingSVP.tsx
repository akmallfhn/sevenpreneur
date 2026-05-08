"use client";
import { Brain, Focus, Library, Map, Workflow, BarChart3 } from "lucide-react";

const cards = [
  {
    tag: "Fondasi",
    title: "Pahami cara AI bekerja",
    desc: "AI bukan mesin pencari. Ia sistem probabilistik yang butuh konteks tepat untuk bisa efektif.",
    Icon: Brain,
  },
  {
    tag: "Context Engineering",
    title: "Output bagus = konteks yang bagus",
    desc: "Definisikan peran, batasan, dan tujuan dengan jelas — bukan sekadar ngetik pertanyaan.",
    Icon: Focus,
  },
  {
    tag: "Prompt sebagai Sistem",
    title: "Prompt adalah aset, bukan pertanyaan sekali pakai",
    desc: "Bangun prompt library yang bisa dipakai ulang dan distandarisasi di seluruh departemen.",
    Icon: Library,
  },
  {
    tag: "Workflow Mapping",
    title: "Tahu persis di mana AI paling berdampak",
    desc: "Identifikasi titik spesifik di workflow Anda yang bisa dipangkas paling signifikan.",
    Icon: Map,
  },
  {
    tag: "Build, Don't Just Chat",
    title: "Dari chat ke sistem otomatis",
    desc: "Otomasi task repetitif dan integrasikan AI ke tools yang sudah dipakai — tanpa jadi developer.",
    Icon: Workflow,
  },
  {
    tag: "Iterasi & Ukur",
    title: "Skill AI yang terus berkembang",
    desc: "Framework dokumentasi dan pengukuran ROI — supaya tim tidak berhenti berkembang setelah training.",
    Icon: BarChart3,
  },
];

export default function SolutionCorporateAITrainingSVP() {
  return (
    <section className="section-root relative flex items-center justify-center bg-black overflow-hidden">
      <div className="section-container flex flex-col w-full items-center gap-10 p-5 py-10 z-20 lg:px-0 lg:py-[80px] lg:gap-[64px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {/* Section Title & Desc */}
        <div className="section-title-desc flex flex-col w-full text-center items-center gap-3 z-10">
          <div className="flex items-center gap-3 text-xs font-bodycopy font-medium tracking-[0.25em] uppercase text-white/70 mb-2">
            Pendekatan Kami
          </div>
          <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl sm:text-3xl sm:max-w-[600px] lg:text-4xl lg:max-w-[788px]">
            Bukan cuma prompt. Kami bangun sistem AI yang dipakai tim
          </h2>
          <p className="section-desc text-sm font-bodycopy text-white/80 max-w-[326px] sm:text-base sm:max-w-[480px] lg:text-xl lg:max-w-[640px]">
            6 pilar pendekatan kami untuk bikin AI benar-benar embedded di
            workflow tim — bukan sekedar tools yang dipake sesekali.
          </p>
        </div>

        {/* Solution Cards Grid */}
        <div className="cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 w-full">
          {cards.map((c) => (
            <div
              key={c.title}
              className="solution-card relative p-[1px] rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-transparent overflow-hidden group"
            >
              <div className="relative w-full h-full bg-[#0F0E1F] rounded-2xl p-6 lg:p-7 transition-colors group-hover:bg-[#16142a]">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center justify-center size-12 rounded-xl bg-gradient-to-br from-[#3417E3] to-[#7B6FF0]">
                    <c.Icon className="size-6 text-white" />
                  </div>
                  <span className="font-bodycopy text-[10px] font-bold tracking-[1.5px] uppercase text-[#B89FE0] px-2.5 py-1 rounded-full bg-[#B89FE0]/10 border border-[#B89FE0]/20">
                    {c.tag}
                  </span>
                </div>
                <h3 className="font-brand font-bold text-lg text-white mb-2.5 leading-tight lg:text-xl">
                  {c.title}
                </h3>
                <p className="font-bodycopy text-sm text-white/70 leading-[1.6] lg:text-[15px]">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decoration Blur */}
      <div className="absolute bg-[#3417E3] size-80 top-1/2 -translate-y-1/2 -left-40 blur-[140px] rounded-full z-[1] opacity-50" />
      <div className="absolute bg-[#7B6FF0] size-80 top-1/2 -translate-y-1/2 -right-40 blur-[140px] rounded-full z-[1] opacity-30" />
    </section>
  );
}
