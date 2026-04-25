"use client";
import { useEffect, useRef } from "react";

const testimonials = [
  {
    body: "Setelah program selesai, tim reporting kami bisa rilis monthly insight dalam 3 jam—dulu butuh 2 hari. Yang berubah bukan tools-nya, tapi cara tim berpikir tentang AI.",
    name: "[Nama Klien]",
    role: "Head of Operations · Banking",
    av: "BN",
    quoteColor: "#e74d79",
  },
  {
    body: "Yang bikin beda dari training lain: speakernya benar-benar pernah bangun ini di lapangan. Q&A jadi diskusi nyata, bukan sesi baca slide.",
    name: "[Nama Klien]",
    role: "Director of Data · FMCG",
    av: "FM",
    quoteColor: "#0165fc",
  },
  {
    body: "Custom LMS-nya jadi aset jangka panjang. Karyawan baru kami sekarang onboarding lewat platform itu. ROI-nya jauh melebihi ekspektasi.",
    name: "[Nama Klien]",
    role: "CHRO · Manufacturing",
    av: "MF",
    quoteColor: "#e74d79",
  },
];

export default function TestimonialsCorporateAITrainingSVP() {
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
            "radial-gradient(ellipse 50% 40% at 80% 20%, rgba(1,101,252,0.16), transparent 60%), radial-gradient(ellipse 60% 50% at 10% 80%, rgba(231,77,121,0.14), transparent 60%)",
        }}
      />
      <div className="relative z-10 max-w-[1240px] mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-end mb-12 cat-reveal opacity-0 translate-y-6 transition-all duration-700">
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
              Social Proof
            </span>
            <h2
              className="font-brand font-semibold leading-[0.98] text-white"
              style={{ fontSize: "clamp(36px, 5vw, 64px)", letterSpacing: "-0.035em" }}
            >
              Apa kata mereka yang sudah bergabung.
            </h2>
          </div>
          <p className="font-bodycopy" style={{ fontSize: "clamp(18px, 1.4vw, 22px)", color: "rgba(255,255,255,0.62)", lineHeight: 1.5, maxWidth: 680 }}>
            Hasil paling bermakna datang dari tim yang akhirnya punya bahasa dan tools yang sama
            untuk membicarakan AI di pekerjaan sehari-hari.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="cat-reveal opacity-0 translate-y-6 transition-all duration-700 rounded-2xl p-7 flex flex-col gap-5 border"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(24px) saturate(140%)",
                WebkitBackdropFilter: "blur(24px) saturate(140%)",
                borderColor: "rgba(255,255,255,0.1)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="font-brand text-[56px] leading-[0.5] h-7"
                style={{ color: t.quoteColor }}
              >
                "
              </div>
              <p className="font-bodycopy text-[17px] text-white leading-[1.5] flex-1">{t.body}</p>
              <div
                className="flex items-center gap-3 pt-4 border-t"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="font-brand w-10 h-10 rounded-full grid place-items-center text-sm font-semibold text-white flex-shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                  }}
                >
                  {t.av}
                </div>
                <div>
                  <div className="text-[14px] text-white">{t.name}</div>
                  <div
                    className="text-[12px]"
                    style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.6)" }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
