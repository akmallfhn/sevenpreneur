"use client";
import { Quote } from "lucide-react";

const testimonials = [
  {
    body: "Setelah program selesai, tim reporting kami bisa rilis monthly insight dalam 3 jam — dulu butuh 2 hari. Yang berubah bukan tools-nya, tapi cara tim berpikir tentang AI.",
    name: "[Nama Klien]",
    role: "Head of Operations · Banking",
    av: "BN",
  },
  {
    body: "Yang bikin beda dari training lain: speakernya benar-benar pernah bangun ini di lapangan. Q&A jadi diskusi nyata, bukan sesi baca slide.",
    name: "[Nama Klien]",
    role: "Director of Data · FMCG",
    av: "FM",
  },
  {
    body: "Custom LMS-nya jadi aset jangka panjang. Karyawan baru kami sekarang onboarding lewat platform itu. ROI-nya jauh melebihi ekspektasi.",
    name: "[Nama Klien]",
    role: "CHRO · Manufacturing",
    av: "MF",
  },
];

export default function TestimonialsCorporateAITrainingSVP() {
  return (
    <section className="section-root relative flex items-center justify-center bg-black overflow-hidden">
      <div className="section-container flex flex-col w-full items-center gap-10 p-5 py-10 z-20 lg:px-0 lg:py-[80px] lg:gap-[64px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {/* Section Title & Desc */}
        <div className="section-title-desc flex flex-col w-full text-center items-center gap-3 z-10">
          <div className="flex items-center gap-3 text-xs font-bodycopy font-medium tracking-[0.25em] uppercase text-white/70 mb-2">
            Social Proof
          </div>
          <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl sm:text-3xl sm:max-w-[600px] lg:text-4xl lg:max-w-[788px]">
            Apa kata mereka yang sudah bergabung
          </h2>
          <p className="section-desc text-sm font-bodycopy text-white/80 max-w-[326px] sm:text-base sm:max-w-[480px] lg:text-xl lg:max-w-[640px]">
            Hasil paling bermakna datang dari tim yang akhirnya punya bahasa
            dan tools yang sama untuk membicarakan AI di pekerjaan sehari-hari.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="testimonials grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5 w-full">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="testimonial-card relative p-[1px] rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-transparent overflow-hidden group"
            >
              <div className="relative w-full h-full flex flex-col gap-5 bg-[#0F0E1F] rounded-2xl p-6 lg:p-7 transition-colors group-hover:bg-[#16142a]">
                <Quote className="size-7 text-[#B89FE0]" />
                <p className="font-bodycopy text-[15px] text-white leading-[1.55] flex-1 lg:text-base">
                  {t.body}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-center size-10 rounded-full bg-gradient-to-br from-[#7B6FF0] to-[#4C3FEC] shrink-0">
                    <span className="font-brand font-bold text-sm text-white">
                      {t.av}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-brand font-bold text-sm text-white truncate">
                      {t.name}
                    </div>
                    <div className="font-bodycopy text-[11px] font-bold tracking-[1px] uppercase text-[#B89FE0] truncate">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decoration Blur */}
      <div className="absolute bg-[#3417E3] size-80 top-20 -left-40 blur-[140px] rounded-full z-[1] opacity-40" />
      <div className="absolute bg-[#CC446A] size-80 bottom-20 -right-40 blur-[140px] rounded-full z-[1] opacity-30" />
    </section>
  );
}
