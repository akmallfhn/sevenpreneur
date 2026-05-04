import { Award, Brain, Globe, Target, TrendingUp, Users } from "lucide-react";

const advantages = [
  {
    Icon: Brain,
    title: "AI-Integrated Learning",
    description:
      "Platform pertama di Indonesia yang mengintegrasikan kecerdasan buatan dalam setiap aspek pembelajaran bisnis.",
  },
  {
    Icon: Users,
    title: "World-Class Coaches",
    description:
      "Belajar langsung dari para praktisi — CEO perusahaan besar, founder startup, hingga pejabat pemerintahan.",
  },
  {
    Icon: Target,
    title: "Framework-Based",
    description:
      "Semua materi disusun dengan framework terstruktur yang langsung bisa diterapkan ke bisnis nyata.",
  },
  {
    Icon: TrendingUp,
    title: "Proven Results",
    description:
      "Ribuan alumni telah membuktikan transformasi bisnis yang nyata setelah bergabung dengan ekosistem Sevenpreneur.",
  },
  {
    Icon: Globe,
    title: "Ecosystem Access",
    description:
      "Bergabung dengan komunitas founder dan business leader terpilih yang saling mendorong pertumbuhan bersama.",
  },
  {
    Icon: Award,
    title: "Continuous Innovation",
    description:
      "Selalu di garis terdepan — konten, tools, dan metode pembelajaran yang terus diperbarui sesuai kebutuhan pasar.",
  },
];

const founders = [
  {
    name: "Raymond Chin",
    role: "Founder & CEO",
    description:
      "Arsitek di balik framework bisnis Sevenpreneur. Memimpin visi untuk menghadirkan pelatihan bisnis berbasis AI yang mengubah cara Indonesia berbisnis.",
    initials: "RC",
    accentFrom: "from-tertiary",
    accentTo: "to-primary",
  },
  {
    name: "[Nama CTO]",
    role: "Chief Technology Officer",
    description:
      "Memimpin pengembangan teknologi platform Sevenpreneur, dari infrastruktur AI hingga produk digital yang menggerakkan ekosistem pembelajaran.",
    initials: "CT",
    accentFrom: "from-primary",
    accentTo: "to-secondary",
  },
  {
    name: "[Nama COO]",
    role: "Chief Operating Officer",
    description:
      "Bertanggung jawab atas keseluruhan operasional Sevenpreneur — memastikan setiap program dan layanan berjalan optimal untuk para member.",
    initials: "CO",
    accentFrom: "from-secondary",
    accentTo: "to-tertiary",
  },
];

export default function CompanySVP() {
  return (
    <div className="relative">
      {/* ─── Hero ─── */}
      <section className="section-root relative flex items-center justify-center overflow-hidden bg-sevenpreneur-coal">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-tertiary/20 blur-[120px]" />
          <div className="absolute -bottom-32 -right-32 h-[480px] w-[480px] rounded-full bg-primary/15 blur-[120px]" />
        </div>

        <div className="section-container relative flex flex-col w-full items-center gap-6 px-5 py-14 z-10 text-center lg:px-0 lg:py-[88px] lg:gap-8 lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bodycopy font-semibold tracking-widest text-white/60 uppercase">
            About Us
          </span>
          <h1 className="font-brand font-bold text-2xl leading-snug text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-primary max-w-[340px] sm:text-3xl sm:max-w-[480px] lg:text-[52px] lg:leading-tight lg:max-w-[760px]">
            Building the Future of Business Education in Indonesia
          </h1>
          <p className="font-bodycopy text-sm text-white/60 max-w-[320px] sm:text-base sm:max-w-[480px] lg:text-lg lg:max-w-[600px]">
            Sevenpreneur hadir untuk mengubah cara Indonesia belajar bisnis —
            lebih terstruktur, lebih relevan, dan terintegrasi dengan kecerdasan
            buatan.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {[
              { value: "10K+", label: "Alumni Aktif" },
              { value: "50+", label: "Expert Coaches" },
              { value: "2019", label: "Berdiri Sejak" },
            ].map(({ value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <span className="font-brand font-bold text-2xl text-white lg:text-4xl">
                  {value}
                </span>
                <span className="font-bodycopy text-xs text-white/50 tracking-wide uppercase">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Vision & Mission ─── */}
      <section className="section-root relative flex items-center justify-center bg-background">
        <div className="section-container flex flex-col w-full items-center gap-10 px-5 py-12 lg:px-0 lg:py-[72px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-xs font-bodycopy font-semibold tracking-widest text-primary uppercase">
              Our Foundation
            </span>
            <h2 className="font-brand font-bold text-xl text-foreground leading-snug sm:text-2xl lg:text-4xl">
              Visi & Misi
            </h2>
          </div>

          <div className="grid grid-cols-1 w-full gap-5 lg:grid-cols-2">
            {/* Visi */}
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-7 lg:p-9">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tertiary/10">
                  <svg
                    className="h-5 w-5 text-tertiary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </div>
                <h3 className="font-brand font-bold text-lg text-foreground">
                  Visi
                </h3>
              </div>
              <p className="font-bodycopy text-base text-emphasis leading-relaxed">
                Menjadi ekosistem pelatihan bisnis berbasis AI terdepan di Asia
                Tenggara yang melahirkan generasi pengusaha berdampak — dari
                Indonesia untuk dunia.
              </p>
            </div>

            {/* Misi */}
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-7 lg:p-9">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <svg
                    className="h-5 w-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
                    />
                  </svg>
                </div>
                <h3 className="font-brand font-bold text-lg text-foreground">
                  Misi
                </h3>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  "Menghadirkan kurikulum bisnis yang terstruktur, praktis, dan terus relevan dengan dinamika pasar.",
                  "Menghubungkan para pebisnis dengan mentor dan komunitas kelas dunia.",
                  "Memanfaatkan teknologi AI untuk mempersonalisasi perjalanan belajar setiap member.",
                  "Mendorong pertumbuhan bisnis yang berkelanjutan dan berdampak positif bagi masyarakat.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 font-bodycopy text-sm text-emphasis leading-relaxed"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Keunggulan ─── */}
      <section className="section-root relative flex items-center justify-center bg-section-background">
        <div className="section-container flex flex-col w-full items-center gap-10 px-5 py-12 lg:px-0 lg:py-[72px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-xs font-bodycopy font-semibold tracking-widest text-primary uppercase">
              Why Sevenpreneur
            </span>
            <h2 className="font-brand font-bold text-xl text-foreground leading-snug sm:text-2xl lg:text-4xl">
              Keunggulan Kami
            </h2>
            <p className="font-bodycopy text-sm text-emphasis max-w-[340px] mt-1 sm:text-base sm:max-w-[480px]">
              Bukan sekadar kursus online biasa — kami membangun ekosistem
              bisnis yang menyeluruh.
            </p>
          </div>

          <div className="grid grid-cols-1 w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {advantages.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="group flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 transition-shadow hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-tertiary/10 transition-colors group-hover:bg-tertiary/15">
                  <Icon className="h-5 w-5 text-tertiary" strokeWidth={1.8} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-brand font-bold text-base text-foreground">
                    {title}
                  </h3>
                  <p className="font-bodycopy text-sm text-emphasis leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Leadership Team ─── */}
      <section className="section-root relative flex items-center justify-center bg-background">
        <div className="section-container flex flex-col w-full items-center gap-10 px-5 py-12 lg:px-0 lg:py-[72px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-xs font-bodycopy font-semibold tracking-widest text-primary uppercase">
              The Team
            </span>
            <h2 className="font-brand font-bold text-xl text-foreground leading-snug sm:text-2xl lg:text-4xl">
              Di Balik Sevenpreneur
            </h2>
            <p className="font-bodycopy text-sm text-emphasis max-w-[340px] mt-1 sm:text-base sm:max-w-[480px]">
              Tim yang berkomitmen untuk mengubah cara Indonesia belajar dan
              berbisnis.
            </p>
          </div>

          <div className="grid grid-cols-1 w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {founders.map(
              ({ name, role, description, initials, accentFrom, accentTo }) => (
                <div
                  key={name}
                  className="flex flex-col gap-5 rounded-2xl border border-border bg-background p-7"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accentFrom} ${accentTo}`}
                  >
                    <span className="font-brand font-bold text-lg text-white">
                      {initials}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-brand font-bold text-base text-foreground">
                      {name}
                    </h3>
                    <span className="font-bodycopy text-xs font-semibold text-primary tracking-wide uppercase">
                      {role}
                    </span>
                  </div>
                  <div className="h-px w-full bg-border" />
                  <p className="font-bodycopy text-sm text-emphasis leading-relaxed">
                    {description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ─── Closing CTA ─── */}
      <section className="section-root relative flex items-center justify-center overflow-hidden bg-sevenpreneur-coal">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[320px] w-[640px] rounded-full bg-tertiary/20 blur-[100px]" />
        </div>
        <div className="section-container relative flex flex-col w-full items-center gap-6 px-5 py-12 z-10 text-center lg:px-0 lg:py-[72px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
          <h2 className="font-brand font-bold text-xl leading-snug text-transparent bg-clip-text bg-gradient-to-r from-white to-primary max-w-[340px] sm:text-2xl sm:max-w-[480px] lg:text-4xl lg:max-w-[600px]">
            Siap Bergabung dengan Ekosistem Sevenpreneur?
          </h2>
          <p className="font-bodycopy text-sm text-white/60 max-w-[300px] sm:text-base sm:max-w-[440px]">
            Ribuan founder telah memulai perjalanan mereka bersama kami.
            Saatnya giliranmu.
          </p>
          <a
            href="/cohorts/sevenpreneur-business-blueprint-program"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 font-bodycopy text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Mulai Sekarang
          </a>
        </div>
      </section>
    </div>
  );
}
