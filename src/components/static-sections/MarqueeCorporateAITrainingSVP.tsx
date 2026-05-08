"use client";
import Image from "next/image";

const logos = [
  {
    src: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-claude.webp",
    alt: "Claude",
  },
  {
    src: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-chatgpt.webp",
    alt: "ChatGPT",
  },
  {
    src: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-copilot.webp",
    alt: "Copilot",
  },
  {
    src: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-gemini.webp",
    alt: "Gemini",
  },
  {
    src: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-perplexity.webp",
    alt: "Perplexity",
  },
];

export default function MarqueeCorporateAITrainingSVP() {
  const repeated = Array.from({ length: 8 }, () => logos).flat();

  return (
    <div className="section-root relative flex flex-col items-center justify-center bg-black border-y border-white/5 overflow-hidden py-10 lg:py-14">
      <p className="font-bodycopy text-center text-[11px] font-medium uppercase tracking-[0.25em] text-white/60 mb-8 px-4 lg:text-xs">
        Tools terdepan untuk transformasi bisnis
      </p>
      <div
        className="flex items-center"
        style={{
          animation: "cat-marquee 120s linear infinite",
          width: "max-content",
        }}
      >
        {repeated.map((logo, i) => (
          <div
            key={i}
            className="flex items-center justify-center mx-10 lg:mx-16 opacity-70 hover:opacity-100 transition-opacity"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={400}
              height={120}
              className="object-contain h-8 w-auto lg:h-10"
            />
          </div>
        ))}
      </div>

      {/* Edge fade */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
    </div>
  );
}
