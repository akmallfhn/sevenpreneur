"use client";
import { ArrowRight, Clock, Mail, Phone, Rocket } from "lucide-react";
import Image from "next/image";

const contactInfo = [
  { Icon: Phone, text: "WhatsApp +62 853-5353-3844" },
  { Icon: Mail, text: "event@sevenpreneur.com" },
  { Icon: Clock, text: "Respon dalam 1×24 jam kerja" },
];

export default function FinalCTACorporateAITrainingSVP() {
  return (
    <section
      id="cta"
      className="section-root relative flex items-center justify-center bg-gradient-to-b from-0% from-black via-60% via-[#1a1640] to-100% to-[#3417E3] overflow-hidden"
    >
      <div className="section-container flex flex-col w-full items-center gap-10 p-5 py-16 z-20 lg:px-0 lg:py-[120px] lg:gap-12 lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        <div className="cta-card w-full max-w-[1100px] mx-auto p-[1.5px] rounded-3xl bg-gradient-to-br from-[#7B6FF0] via-[#B89FE0]/50 to-[#CC446A] overflow-hidden">
          <div className="cta-inner relative flex flex-col gap-10 w-full bg-[#0F0E1F]/95 rounded-3xl p-8 backdrop-blur-xl lg:flex-row lg:items-center lg:p-14 lg:gap-16">
            {/* Left: Headline + CTA */}
            <div className="flex flex-col gap-7 flex-1">
              <div className="flex items-center gap-3 text-xs font-bodycopy font-medium tracking-[0.25em] uppercase text-white/70 self-start lg:self-auto">
                Final Step
              </div>

              <h2 className="cta-title text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-3xl leading-[1.05] sm:text-4xl lg:text-5xl xl:text-[56px]">
                Siap untuk lompatan{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#B89FE0] via-[#7B6FF0] to-[#CC446A]">
                  berikutnya?
                </span>
              </h2>
              <a
                href="https://wa.me/6285353533844?text=Halo%2C%20MinSeven!%20%F0%9F%91%8B%0ASaya%20tertarik%20untuk%20mengetahui%20lebih%20lanjut%20tentang%20*Corporate%20AI%20Training*%20dari%20Sevenpreneur.%20Boleh%20konsultasi%20dulu%3F%0A%0A%E2%80%A2%20Nama%3A%20(isi%20di%20sini)%0A%E2%80%A2%20Perusahaan%3A%20(isi%20di%20sini)%0A%E2%80%A2%20Jumlah%20Tim%3A%20(isi%20di%20sini)%0A%0ATerima%20kasih%20%F0%9F%99%8F"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-3 h-[58px] pl-6 pr-2 rounded-full bg-gradient-to-r from-[#7B6FF0] via-[#5E47ED] to-[#4C3FEC] text-white font-bodycopy font-semibold text-base shadow-[0_8px_32px_-4px_rgba(123,111,240,0.5)] hover:shadow-[0_12px_40px_-4px_rgba(123,111,240,0.7)] transition-all overflow-hidden self-start"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Rocket className="size-5 relative" />
                <span className="relative">Jadwalkan konsultasi gratis</span>
                <span className="relative flex items-center justify-center size-10 rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
                  <ArrowRight className="size-4" />
                </span>
              </a>
            </div>

            {/* Right: Contact info */}
            <div className="flex flex-col gap-3 w-full lg:max-w-[320px] shrink-0">
              <h4 className="font-bodycopy text-[11px] font-bold tracking-[2px] uppercase text-[#B89FE0] mb-1">
                Kontak Langsung
              </h4>
              {contactInfo.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
                >
                  <span className="flex items-center justify-center size-10 rounded-full bg-gradient-to-br from-[#3417E3] to-[#7B6FF0] shrink-0">
                    <item.Icon className="size-4 text-white" />
                  </span>
                  <span className="font-bodycopy text-sm text-white/85">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Decoration */}
      <Image
        className="absolute inset-x-0 bottom-0 w-full h-auto object-cover mix-blend-plus-lighter opacity-50 z-[2]"
        src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/overlay-curiculum%201.webp"
        alt="Overlay Background"
        width={1000}
        height={1000}
      />

      {/* Decoration Blur */}
      <div className="absolute bg-[#CC446A] size-72 top-20 -left-32 blur-[120px] rounded-full z-[1] opacity-40" />
      <div className="absolute bg-[#7B6FF0] size-72 bottom-20 -right-32 blur-[120px] rounded-full z-[1] opacity-50" />
    </section>
  );
}
