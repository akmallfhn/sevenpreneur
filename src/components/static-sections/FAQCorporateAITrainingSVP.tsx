"use client";
import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    q: "Berapa lama durasi program training?",
    a: "Program standar berlangsung 4–8 sesi tergantung scope. Kami fleksibel menyesuaikan dengan ketersediaan tim Anda—bisa intensif beberapa hari penuh atau dipecah menjadi sesi mingguan.",
  },
  {
    q: "Apakah training dilakukan online atau offline?",
    a: "Keduanya tersedia. Kami juga menyediakan opsi hybrid sesuai preferensi perusahaan Anda.",
  },
  {
    q: "Berapa jumlah peserta minimum dan maksimum?",
    a: "Untuk pengalaman optimal, kami menyarankan 15–50 peserta per batch. Untuk perusahaan dengan tim lebih besar, kami bisa atur multiple batch.",
  },
  {
    q: "Apakah materi bisa dikustomisasi sesuai industri kami?",
    a: "Tentu. Sebelum program dimulai, kami melakukan assessment untuk memahami konteks bisnis, pain points, dan tujuan spesifik perusahaan Anda.",
  },
  {
    q: "Bagaimana cara mengukur ROI dari training ini?",
    a: "Kami sediakan framework pengukuran yang jelas—dari adoption rate, productivity metrics, sampai dampak ke business KPI yang Anda targetkan.",
  },
  {
    q: "Berapa lama akses ke Custom LMS?",
    a: "Akses LMS tersedia 12 bulan setelah program selesai, dengan opsi perpanjangan tahunan.",
  },
  {
    q: "Apakah ada follow-up setelah training selesai?",
    a: "Ya. Kami sediakan sesi follow-up untuk memastikan implementasi berjalan dan menjawab tantangan yang muncul di lapangan.",
  },
];

export default function FAQCorporateAITrainingSVP() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number>(0);

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
    <section ref={ref} id="faq" className="py-24 md:py-32">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end mb-14 cat-reveal opacity-0 translate-y-6 transition-all duration-700">
          <div>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 text-[11px] uppercase tracking-[0.12em] text-[#777]"
              style={{ background: "#f5f5f5", borderColor: "#e8e8e8", fontFamily: "JetBrains Mono, monospace" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#0165fc]" />
              FAQ
            </span>
            <h2
              className="font-brand font-semibold leading-[0.98] text-[#0a0a0a]"
              style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-0.035em" }}
            >
              Yang sering ditanyakan.
            </h2>
          </div>
          <p className="font-bodycopy" style={{ fontSize: "clamp(18px, 1.4vw, 22px)", color: "#3a3a3a", lineHeight: 1.5, maxWidth: 680 }}>
            Tidak menemukan jawabannya? Hubungi kami langsung—kami akan respon dalam 1×24 jam
            kerja.
          </p>
        </div>

        {/* Accordion */}
        <div className="cat-reveal opacity-0 translate-y-6 transition-all duration-700 delay-100 flex flex-col">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="border-t border-[#e8e8e8] py-7 cursor-pointer"
                style={{ borderBottom: i === faqs.length - 1 ? "1px solid #e8e8e8" : undefined }}
                onClick={() => setOpen(isOpen ? -1 : i)}
              >
                <div
                  className="font-brand flex justify-between gap-8 items-start font-medium leading-[1.3]"
                  style={{
                    fontSize: "clamp(18px, 1.8vw, 22px)",
                    letterSpacing: "-0.015em",
                    color: "#0a0a0a",
                  }}
                >
                  <span>{faq.q}</span>
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full border border-[#d0d0d0] grid place-items-center transition-all duration-200"
                    style={{
                      background: isOpen ? "#0a0a0a" : "transparent",
                      color: isOpen ? "#ffffff" : "#0a0a0a",
                      transform: isOpen ? "rotate(45deg)" : "none",
                    }}
                  >
                    +
                  </span>
                </div>
                <div
                  className="font-bodycopy overflow-hidden transition-all duration-300 text-[#3a3a3a] text-[16px] leading-[1.55]"
                  style={{
                    maxHeight: isOpen ? "400px" : "0",
                    marginTop: isOpen ? "16px" : "0",
                    maxWidth: 720,
                  }}
                >
                  {faq.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
