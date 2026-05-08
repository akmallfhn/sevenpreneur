"use client";
import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Berapa lama durasi program training?",
    a: "Program disesuaikan dengan kebutuhan korporat. Dapat secara intensif selama beberapa hari atau dipecah menjadi sesi mingguan.",
  },
  {
    q: "Apakah training dilakukan online atau offline?",
    a: "Keduanya tersedia. Kami juga menyediakan opsi hybrid sesuai preferensi perusahaan Anda.",
  },
  {
    q: "Apakah materi bisa dikustomisasi sesuai industri kami?",
    a: "Tentu. Sebelum program dimulai, kami melakukan assessment untuk memahami konteks bisnis, pain points, dan tujuan spesifik perusahaan Anda.",
  },
  {
    q: "Bagaimana cara mengukur ROI dari training ini?",
    a: "Kami sediakan framework pengukuran yang jelas — dari adoption rate, productivity metrics, sampai dampak ke business KPI yang Anda targetkan.",
  },
  {
    q: "Apakah ada follow-up setelah training selesai?",
    a: "Ya. Kami sediakan sesi follow-up untuk memastikan implementasi berjalan dan menjawab tantangan yang muncul di lapangan.",
  },
];

export default function FAQCorporateAITrainingSVP() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section
      id="faq"
      className="section-root relative flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="section-container flex flex-col w-full items-center gap-10 p-5 py-10 z-20 lg:px-0 lg:py-[80px] lg:gap-[64px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {/* Section Title & Desc */}
        <div className="section-title-desc flex flex-col w-full text-center items-center gap-3 z-10">
          <div className="flex items-center gap-3 text-xs font-bodycopy font-medium tracking-[0.25em] uppercase text-white/70 mb-2">
            FAQ
          </div>
          <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl sm:text-3xl sm:max-w-[600px] lg:text-4xl lg:max-w-[788px]">
            Yang sering ditanyakan
          </h2>
        </div>

        {/* Accordion */}
        <div className="faqs flex flex-col gap-3 w-full max-w-[920px]">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`faq-card relative p-[1px] rounded-2xl overflow-hidden transition-all ${
                  isOpen
                    ? "bg-gradient-to-br from-[#7B6FF0]/60 via-white/10 to-[#CC446A]/40"
                    : "bg-gradient-to-br from-white/15 via-white/5 to-transparent"
                }`}
              >
                <button
                  type="button"
                  className="relative w-full flex flex-col bg-[#0F0E1F] rounded-2xl p-5 lg:p-6 text-left cursor-pointer hover:bg-[#16142a] transition-colors"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <div className="flex justify-between gap-6 items-center">
                    <h3 className="font-bodycopy font-bold text-white text-base lg:text-lg">
                      {faq.q}
                    </h3>
                    <span
                      className={`flex items-center justify-center size-9 rounded-full shrink-0 transition-all ${
                        isOpen
                          ? "bg-gradient-to-br from-[#7B6FF0] to-[#4C3FEC] rotate-45"
                          : "bg-white/5 border border-white/10"
                      }`}
                    >
                      <Plus className="size-4 text-white" />
                    </span>
                  </div>
                  <div
                    className="font-bodycopy overflow-hidden transition-all duration-300 text-sm text-white/70 leading-[1.6] lg:text-[15px]"
                    style={{
                      maxHeight: isOpen ? "400px" : "0",
                      marginTop: isOpen ? "16px" : "0",
                    }}
                  >
                    {faq.a}
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decoration Blur */}
      <div className="absolute bg-[#3417E3] size-80 top-1/2 -translate-y-1/2 -left-40 blur-[140px] rounded-full z-[1] opacity-40" />
      <div className="absolute bg-[#CC446A] size-80 top-1/2 -translate-y-1/2 -right-40 blur-[140px] rounded-full z-[1] opacity-30" />
    </section>
  );
}
