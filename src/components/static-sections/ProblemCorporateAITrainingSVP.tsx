"use client";
import { X } from "lucide-react";

const problems = [
  "Setiap hari harus ngejelasin konteks dari nol ke AI — karena tidak ada sistem yang menyimpan knowledge perusahaan.",
  "Output AI tiap orang beda-beda karena tidak ada standard prompt, sistem, dan konsistensi.",
  "Yang bisa diotomasi dalam 5 menit masih dikerjakan manual 2 jam karena tim tidak tahu AI bisa diprogram, bukan cuma dichat.",
  "Senior staff menolak pakai AI karena merasa hasilnya generik — padahal masalahnya ada di cara pakainya, bukan toolsnya.",
  "Manajemen tidak bisa ukur ROI dari AI — karena penggunaannya tersebar, tidak terdokumentasi, dan tiap orang beda cara.",
  "Task lintas tim masih jalan manual, padahal AI agents sudah bisa handle workflow kompleks tanpa koordinasi manusia.",
];

export default function ProblemCorporateAITrainingSVP() {
  return (
    <section className="section-root relative flex items-center justify-center bg-black overflow-hidden">
      <div className="section-container flex flex-col w-full items-center gap-10 p-5 py-10 z-20 lg:px-0 lg:py-[80px] lg:gap-[64px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {/* Section Title & Desc */}
        <div className="section-title-desc flex flex-col w-full text-center items-center gap-3 z-10">
          <div className="flex items-center gap-3 text-xs font-bodycopy font-medium tracking-[0.25em] uppercase text-white/70 mb-2">
            The Reality
          </div>
          <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl sm:text-3xl sm:max-w-[600px] lg:text-4xl lg:max-w-[788px]">
            Sekadar ngeprompt di ChatGPT bukan strategi AI
          </h2>
          <p className="section-desc text-sm font-bodycopy text-white/80 max-w-[326px] sm:text-base sm:max-w-[480px] lg:text-xl lg:max-w-[640px]">
            Ini realita yang dihadapi mayoritas tim corporate. Tools-nya udah
            ada, tapi tim belum punya sistem dan kerangka berpikir yang tepat.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="problems grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 w-full">
          {problems.map((text, i) => (
            <div
              key={i}
              className="problem-card relative p-[1px] rounded-2xl bg-gradient-to-br from-[#CC446A]/30 via-white/5 to-transparent overflow-hidden group"
            >
              <div className="relative w-full h-full flex gap-4 bg-[#0F0E1F] rounded-2xl p-6 lg:p-7 transition-colors group-hover:bg-[#16142a]">
                <div className="flex items-center justify-center size-10 rounded-full bg-[#CC446A]/15 border border-[#CC446A]/30 shrink-0">
                  <X className="size-5 text-[#CC446A]" />
                </div>
                <p className="font-bodycopy text-sm text-white/80 leading-[1.6] lg:text-[15px]">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decoration Blur */}
      <div className="absolute bg-[#CC446A] size-80 top-1/2 -translate-y-1/2 -left-40 blur-[140px] rounded-full z-[1] opacity-30" />
      <div className="absolute bg-[#3417E3] size-80 top-1/2 -translate-y-1/2 -right-40 blur-[140px] rounded-full z-[1] opacity-40" />
    </section>
  );
}
