"use client";
import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Brain,
  Check,
  GraduationCap,
  MessageCircle,
} from "lucide-react";

/* ---- Feature 01: Productivity ---- */
function ProductivityViz() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setOn(true);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const bars = [
    { label: "Reporting", v: 72 },
    { label: "Marketing", v: 64 },
    { label: "Operations", v: 58 },
    { label: "Sales", v: 55 },
    { label: "HR Ops", v: 51 },
  ];

  return (
    <div
      ref={ref}
      className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-[#7B6FF0]/70 via-white/10 to-[#CC446A]/50"
    >
      <div className="relative aspect-[4/3.2] rounded-3xl overflow-hidden p-7 bg-[#0A0918]/95 backdrop-blur-xl">
        <div
          className="absolute pointer-events-none"
          style={{
            top: -100,
            right: -100,
            width: 280,
            height: 280,
            background:
              "radial-gradient(circle, rgba(123,111,240,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col gap-4 h-full">
          <div className="flex justify-between items-center">
            <span className="font-bodycopy text-[10px] font-bold tracking-[2px] uppercase text-white/50">
              Cohort productivity uplift
            </span>
            <span className="font-brand text-[10px] font-bold tracking-[1.5px] uppercase rounded-full px-3 py-1 bg-gradient-to-r from-[#7B6FF0] to-[#CC446A] text-white">
              Q4 / 2025
            </span>
          </div>
          <div className="font-brand font-bold leading-[0.9] tracking-tighter text-white text-7xl lg:text-[100px]">
            +
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#B89FE0] via-[#7B6FF0] to-[#CC446A]">
              {on ? 270 : 0}
            </span>
            %
          </div>
          <div className="flex flex-col gap-2.5 mt-auto">
            {bars.map((b, i) => (
              <div
                key={i}
                className="grid items-center gap-3 text-xs"
                style={{
                  gridTemplateColumns: "80px 1fr 40px",
                }}
              >
                <span className="font-bodycopy text-white/60">{b.label}</span>
                <div className="h-1.5 rounded-full overflow-hidden bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7B6FF0] to-[#CC446A]"
                    style={{
                      width: on ? `${b.v}%` : "0%",
                      transition: `width 1.2s cubic-bezier(.2,.8,.2,1) ${i * 0.1}s`,
                    }}
                  />
                </div>
                <span className="text-right text-white font-bodycopy">
                  +{on ? b.v : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Feature 02: Chat ---- */
function ChatViz() {
  return (
    <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-[#7B6FF0]/70 via-white/10 to-[#CC446A]/50">
      <div className="relative aspect-[4/3.2] rounded-3xl overflow-hidden p-7 bg-[#0A0918]/95 backdrop-blur-xl flex flex-col gap-3">
        <div
          className="absolute pointer-events-none"
          style={{
            top: -100,
            right: -100,
            width: 280,
            height: 280,
            background:
              "radial-gradient(circle, rgba(204,68,106,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 flex flex-col gap-3 h-full">
          <div className="self-start max-w-[80%] p-3 px-4 rounded-2xl rounded-bl-md text-sm leading-[1.45] bg-white/5 border border-white/10 text-white backdrop-blur-md">
            <div className="font-bodycopy text-[10px] font-bold uppercase tracking-[1.5px] text-[#B89FE0] mb-1">
              Peserta — Head of Ops
            </div>
            <p className="font-bodycopy">
              Tim saya pakai prompt umum, hasilnya nggak konsisten. Workflow
              apa yang biasanya dipakai untuk ops report bulanan?
            </p>
          </div>
          <div className="self-end max-w-[80%] p-3 px-4 rounded-2xl rounded-br-md text-sm leading-[1.45] bg-gradient-to-br from-[#7B6FF0] to-[#4C3FEC] text-white">
            <div className="font-bodycopy text-[10px] font-bold uppercase tracking-[1.5px] text-white/80 mb-1">
              Speaker — AI Lead, Mfg co.
            </div>
            <p className="font-bodycopy">
              Saya bagi struktur prompt yang kita pakai di pabrik — ada 3
              layer: context, constraint, output schema. Bisa langsung
              diadopsi.
            </p>
          </div>
          <div className="self-start max-w-[80%] p-3 px-4 rounded-2xl rounded-bl-md text-sm leading-[1.45] bg-white/5 border border-white/10 text-white backdrop-blur-md">
            <div className="font-bodycopy text-[10px] font-bold uppercase tracking-[1.5px] text-[#B89FE0] mb-1">
              Peserta — Head of Ops
            </div>
            <p className="font-bodycopy">Untuk integrasi ke ERP existing-nya gimana?</p>
          </div>
          <div className="self-start inline-flex gap-1 p-3.5 rounded-2xl rounded-bl-md bg-white/5 border border-white/10 backdrop-blur-md">
            {[0, 0.2, 0.4].map((delay, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/60"
                style={{ animation: `cat-blink 1.4s infinite ${delay}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Feature 03: LMS ---- */
function LMSViz() {
  const modules = [
    { lbl: "Foundation", pct: "100%", live: false },
    { lbl: "Tools", pct: "92%", live: false },
    { lbl: "Prompt Eng", pct: "74%", live: true },
    { lbl: "Workflow", pct: "38%", live: false },
    { lbl: "Strategy", pct: "21%", live: false },
    { lbl: "Ethics", pct: "08%", live: false },
  ];

  return (
    <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-[#7B6FF0]/70 via-white/10 to-[#CC446A]/50">
      <div className="relative aspect-[4/3.2] rounded-3xl overflow-hidden p-6 bg-[#0A0918]/95 backdrop-blur-xl grid"
        style={{
          gridTemplateRows: "auto 1fr auto",
          gap: 14,
        }}
      >
        <div className="flex justify-between items-center pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center size-7 rounded-md bg-gradient-to-br from-[#7B6FF0] to-[#4C3FEC]">
              <GraduationCap className="size-4 text-white" />
            </span>
            <span className="font-brand font-bold text-sm text-white">
              Acme.AI Academy
            </span>
          </div>
          <span className="font-bodycopy text-[10px] font-bold uppercase tracking-[1.5px] text-[#B89FE0]">
            214 / 240 active
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {modules.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl text-xs ${
                m.live
                  ? "bg-gradient-to-br from-[#7B6FF0] to-[#4C3FEC] text-white"
                  : "bg-white/5 border border-white/10 text-white"
              }`}
            >
              <div
                className={`font-bodycopy text-[10px] font-bold uppercase tracking-[1.5px] mb-1 ${
                  m.live ? "text-white/70" : "text-white/50"
                }`}
              >
                {m.lbl}
              </div>
              <div className="font-brand text-xl font-bold tracking-tight">
                {m.pct}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-white/10 font-bodycopy text-[11px] text-white/60">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#0fd4a3] animate-pulse" />
            Recording — Sesi 12 / Workflow Automation
          </span>
          <span className="font-brand font-bold text-[#B89FE0]">02:14:08</span>
        </div>
      </div>
    </div>
  );
}

/* ---- Feature block wrapper ---- */
function FeatureBlock({
  num,
  Icon,
  title,
  listItems,
  children,
  reverse = false,
}: {
  num: string;
  Icon: React.ElementType;
  title: string;
  listItems: string[];
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full ${
        reverse ? "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1" : ""
      }`}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-12 rounded-xl bg-gradient-to-br from-[#3417E3] to-[#7B6FF0] shrink-0">
            <Icon className="size-6 text-white" />
          </div>
          <span className="font-bodycopy text-[11px] font-bold tracking-[2px] uppercase text-[#B89FE0]">
            {num}
          </span>
        </div>
        <h3 className="font-brand font-bold text-white text-2xl leading-[1.1] sm:text-3xl lg:text-4xl">
          {title}
        </h3>
        <ul className="flex flex-col gap-3 mt-2">
          {listItems.map((item, i) => (
            <li
              key={i}
              className="font-bodycopy flex gap-3 items-start text-sm text-white/75 lg:text-base"
            >
              <span className="flex aspect-square p-1 items-center justify-center bg-[#3417E3] rounded-full shrink-0 mt-0.5">
                <Check color="#FFFFFF" className="w-3 h-auto lg:w-3.5" />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default function FeaturesCorporateAITrainingSVP() {
  return (
    <section
      id="program"
      className="section-root relative flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="section-container flex flex-col w-full items-center gap-12 p-5 py-10 z-20 lg:px-0 lg:py-[80px] lg:gap-[80px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {/* Section Title & Desc */}
        <div className="section-title-desc flex flex-col w-full text-center items-center gap-3 z-10">
          <div className="flex items-center gap-3 text-xs font-bodycopy font-medium tracking-[0.25em] uppercase text-white/70 mb-2">
            3 Keunggulan Utama
          </div>
          <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl sm:text-3xl sm:max-w-[600px] lg:text-4xl lg:max-w-[788px]">
            Apa yang membuat program ini berbeda
          </h2>
          <p className="section-desc text-sm font-bodycopy text-white/80 max-w-[326px] sm:text-base sm:max-w-[480px] lg:text-xl lg:max-w-[640px]">
            Productivity, speakers, dan custom LMS — tiga elemen yang bikin
            program ini bukan sekedar workshop biasa.
          </p>
        </div>

        <FeatureBlock
          num="01 — Productivity"
          Icon={BarChart3}
          title="Peningkatan produktivitas hingga 270%"
          listItems={[
            "Memangkas waktu reporting & analisis dari hari menjadi jam.",
            "Otomasi tugas-tugas repetitif yang bikin karyawan burnout.",
            "Meningkatkan kualitas output di marketing, sales, ops, dan HR.",
            "Mempercepat decision-making dengan AI-powered insights.",
          ]}
        >
          <ProductivityViz />
        </FeatureBlock>

        <FeatureBlock
          num="02 — Speakers"
          Icon={MessageCircle}
          title="Diajarkan langsung oleh praktisi AI"
          listItems={[
            "Real case studies dari implementasi AI di perusahaan Indonesia.",
            "Insider tips yang nggak akan Anda temukan di YouTube atau Google.",
            "Q&A langsung dengan praktisi yang paham konteks bisnis lokal.",
            "Network dengan komunitas profesional AI di Indonesia.",
          ]}
          reverse
        >
          <ChatViz />
        </FeatureBlock>

        <FeatureBlock
          num="03 — Custom LMS"
          Icon={Brain}
          title="LMS eksklusif, branded untuk perusahaan Anda"
          listItems={[
            "Library materi training accessible kapan saja oleh seluruh tim.",
            "Video recording dari semua sesi training.",
            "Template, prompt library, dan toolkit siap pakai.",
            "Dashboard tracking progress dan adoption rate karyawan.",
            "Onboarding mudah untuk karyawan baru.",
          ]}
        >
          <LMSViz />
        </FeatureBlock>
      </div>

      {/* Decoration Blur */}
      <div className="absolute bg-[#3417E3] size-80 top-32 -left-40 blur-[140px] rounded-full z-[1] opacity-40" />
      <div className="absolute bg-[#CC446A] size-80 bottom-32 -right-40 blur-[140px] rounded-full z-[1] opacity-30" />
      <div className="absolute bg-[#7B6FF0] size-80 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 blur-[160px] rounded-full z-[0] opacity-20" />
    </section>
  );
}
