"use client";
import { useEffect, useRef } from "react";
import AppButton from "../buttons/AppButton";
import { ArrowRight } from "lucide-react";

export default function FinalCTACorporateAITrainingSVP() {
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
      id="cta"
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: "#050505", color: "#ffffff" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 20% 30%, rgba(1,101,252,0.22), transparent 60%), radial-gradient(ellipse 50% 50% at 90% 80%, rgba(231,77,121,0.18), transparent 60%)",
        }}
      />
      <div className="relative z-10 max-w-[1240px] mx-auto px-5 md:px-8">
        {/* Tag */}
        <div className="cat-reveal opacity-0 translate-y-6 transition-all duration-700 flex items-center gap-3 mb-8">
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] uppercase tracking-[0.12em]"
            style={{
              background: "rgba(255,255,255,0.05)",
              borderColor: "rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0165fc]" />
            Final Step
          </span>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-10 md:gap-16 items-end">
          <div className="cat-reveal opacity-0 translate-y-6 transition-all duration-700">
            <h2
              className="font-brand font-semibold leading-[0.98]"
              style={{
                fontSize: "clamp(40px, 6vw, 88px)",
                letterSpacing: "-0.035em",
              }}
            >
              Siap untuk lompatan{" "}
              <em className="not-italic" style={{ color: "#e74d79" }}>
                berikutnya?
              </em>
            </h2>
            <p
              className="font-bodycopy mt-8"
              style={{
                fontSize: "clamp(18px, 1.4vw, 22px)",
                color: "rgba(255,255,255,0.62)",
                lineHeight: 1.5,
                maxWidth: 680,
              }}
            >
              Jangan biarkan tim Anda tertinggal sementara kompetitor sudah
              memanfaatkan AI untuk efisiensi 60% lebih tinggi. Mulai dari
              konsultasi gratis.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a
                href="https://wa.me/6285353533844?text=Halo%2C%20MinSeven!%20%F0%9F%91%8B%0ASaya%20tertarik%20untuk%20mengetahui%20lebih%20lanjut%20tentang%20*Corporate%20AI%20Training*%20dari%20Sevenpreneur.%20Boleh%20konsultasi%20dulu%3F%0A%0A%E2%80%A2%20Nama%3A%20(isi%20di%20sini)%0A%E2%80%A2%20Perusahaan%3A%20(isi%20di%20sini)%0A%E2%80%A2%20Jumlah%20Tim%3A%20(isi%20di%20sini)%0A%0ATerima%20kasih%20%F0%9F%99%8F"
                target="_blank"
                rel="noopener noreferrer"
              >
                <AppButton variant="flux" size="large">
                  Jadwalkan konsultasi gratis
                  <ArrowRight />
                </AppButton>
              </a>
            </div>
          </div>

          {/* Contact info */}
          <div className="cat-reveal opacity-0 translate-y-6 transition-all duration-700 delay-100 flex flex-col gap-5">
            {[
              {
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                text: "WhatsApp · +62 853-5353-3844",
              },
              {
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ),
                text: "event@sevenpreneur.com",
              },
              {
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M12 6v6l4 2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                ),
                text: "Respon dalam 1×24 jam kerja",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="font-bodycopy flex items-center gap-3 text-[15px]"
                style={{ color: "rgba(255,255,255,0.62)" }}
              >
                <span
                  className="w-8 h-8 rounded-lg grid place-items-center flex-shrink-0 border"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    borderColor: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {item.icon}
                </span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
