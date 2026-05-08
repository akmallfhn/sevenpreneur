"use client";

const modules = [
  {
    n: "01",
    t: "AI Foundation untuk Profesional",
    d: "Memahami AI tanpa jargon teknis. Bagaimana AI bekerja, apa yang bisa dan tidak bisa dilakukan, dan bagaimana cara berpikir tentang AI dalam konteks bisnis.",
  },
  {
    n: "02",
    t: "Practical AI Tools per Departemen",
    d: "Tools AI terbaik untuk Marketing, Sales, Operations, HR, Finance, dan Customer Service. Hands-on workshop, bukan demo.",
  },
  {
    n: "03",
    t: "Prompt Engineering for Business",
    d: "Cara menulis prompt yang menghasilkan output berkualitas profesional. Dari brief sederhana sampai workflow kompleks.",
  },
  {
    n: "04",
    t: "AI Workflow Automation",
    d: "Membangun workflow otomatis yang nyambung antar tools. Memangkas pekerjaan manual yang memakan waktu.",
  },
  {
    n: "05",
    t: "AI Strategy & Implementation",
    d: "Untuk leader: bagaimana merancang AI roadmap, menghitung ROI, dan mendrive adopsi di seluruh organisasi.",
  },
  {
    n: "06",
    t: "Ethics, Security & Risk",
    d: "Menggunakan AI dengan bertanggung jawab — data privacy, security, compliance, dan risk mitigation.",
  },
];

export default function CurriculumCorporateAITrainingSVP() {
  return (
    <section
      id="curriculum"
      className="section-root relative flex items-center justify-center bg-black overflow-hidden"
    >
      <div className="section-container flex flex-col w-full items-center gap-10 p-5 py-10 z-20 lg:px-0 lg:py-[80px] lg:gap-[64px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {/* Section Title & Desc */}
        <div className="section-title-desc flex flex-col w-full text-center items-center gap-3 z-10">
          <div className="flex items-center gap-3 text-xs font-bodycopy font-medium tracking-[0.25em] uppercase text-white/70 mb-2">
            Curriculum
          </div>
          <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl sm:text-3xl sm:max-w-[600px] lg:text-4xl lg:max-w-[788px]">
            Apa yang akan dipelajari tim kamu
          </h2>
          <p className="section-desc text-sm font-bodycopy text-white/80 max-w-[326px] sm:text-base sm:max-w-[480px] lg:text-xl lg:max-w-[640px]">
            6 modul terstruktur dari fondasi sampai strategi implementasi —
            dirancang khusus untuk tim corporate yang mau adopsi AI secara
            sistematis.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="modules grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 w-full">
          {modules.map((m) => (
            <div
              key={m.n}
              className="module-card relative p-[1px] rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-transparent overflow-hidden group"
            >
              <div className="relative w-full h-full bg-[#0F0E1F] rounded-2xl p-6 lg:p-7 transition-colors group-hover:bg-[#16142a]">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center justify-center size-10 rounded-full bg-[#3417E3] outline-4 outline-[#1a1640] font-brand font-bold text-white text-sm">
                    {m.n}
                  </div>
                  <span className="font-bodycopy text-[10px] font-bold tracking-[1.5px] uppercase text-[#B89FE0]">
                    Module
                  </span>
                </div>
                <h3 className="font-brand font-bold text-lg text-white mb-2.5 leading-tight lg:text-xl">
                  {m.t}
                </h3>
                <p className="font-bodycopy text-sm text-white/70 leading-[1.6] lg:text-[15px]">
                  {m.d}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decoration Blur */}
      <div className="absolute bg-[#3417E3] size-80 top-1/2 -translate-y-1/2 -left-40 blur-[140px] rounded-full z-[1] opacity-50" />
      <div className="absolute bg-[#CC446A] size-80 top-1/2 -translate-y-1/2 -right-40 blur-[140px] rounded-full z-[1] opacity-30" />
    </section>
  );
}
