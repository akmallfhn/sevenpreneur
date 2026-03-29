"use client";
import CoachEducatorItemSVP from "../items/CoachEducatorItemSVP";

export default function CoachEducatorListSVP() {
  const coachList = [
    {
      name: "Raymond Chin",
      archetype: "The Framework Architect",
      role: "Founder of Sevenpreneur",
      description:
        "Lewat framework, Raymond Chin mengubah cara orang memahami dan memenangkan bisnis.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/svp-coach-raymond.webp",
    },
    {
      name: "Suwandi Soh",
      archetype: "The Efficiency Thinker",
      role: "CEO of Mekari",
      description:
        "Fokus pada cara kerja, Suwandi Soh menyusun sistem agar bisnis berjalan efektif dan scalable.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/svp-coach-suwandi.webp",
    },
    {
      name: "Ferry Irwandi",
      archetype: "The Business Professor",
      role: "Founder of Malaka Group",
      description:
        "Dengan pendekatan khas akademis, Ferry menjelaskan bisnis lewat logika angka dan rasio keuangan.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/svp-coach-ferry.webp",
    },
    {
      name: "Berry Boen",
      archetype: "The Operations Commander",
      role: "Operational Director of Datascrip",
      description:
        "Menggabungkan people dan process, Berry Boen menyelaraskan tim dan sistem untuk menghasilkan eksekusi yang presisi.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/svp-coach-berry.webp",
    },
    {
      name: "Basuki T. Purnama (Ahok)",
      archetype: "The Integrity Enforcer",
      role: "Former Governor of DKI Jakarta",
      description:
        "Tegas tanpa  kompromi, leader yang menjaga integritas dan mendorong sistem yang lebih transparan.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/svp-coach-ahok.webp",
    },
    {
      name: "Sigit Djokosoetono",
      archetype: "The Service Guardian",
      role: "Deputy CEO of Bluebird",
      description:
        "Dikenal sebagai sosok di balik konsistensi layanan dan kepercayaan yang melekat pada Bluebird.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/svp-coach-sigit.webp",
    },
    {
      name: "Vicktor Aritonang",
      archetype: "The Growth Driver",
      role: "CEO of SSPACE",
      description:
        "Dari awareness ke revenue,  Vicktor telah membantu ratusan brand besar mengubah exposure menjadi hasil bisnis yang nyata.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/svp-coach-vicktor.webp",
    },
    {
      name: "Tom Lembong",
      archetype: "The Macro Thinker",
      role: "Former of Trade Minister Indonesia",
      description:
        "Berpikir dalam skala global, Tom merupakan sosok yang merancang strategi agar bisnis mampu kompetitif di pasar dunia.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/svp-coach-tom.webp",
    },
  ];

  return (
    <div className="section-root relative flex items-center justify-center overflow-hidden bg-coal-black">
      <div className="section-container flex flex-col w-full items-center gap-20 p-5 py-10 z-20 lg:px-0 lg:py-[60px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        <div className="section-item flex flex-col w-full items-center gap-8 lg:gap-[48px]">
          <h2 className="section-title w-fit text-transparent leading-snug bg-clip-text bg-gradient-to-r from-40% from-white to-100% to-primary font-brand font-bold text-center text-xl max-w-[420px] sm:text-2xl lg:text-4xl lg:max-w-[680px]">
            Start with a Connection. <br />
            Meet Your Growth Partners.
          </h2>
          <div className="coaches grid grid-cols-1 w-full gap-7 sm:gap-9 sm:grid-cols-2">
            {coachList.map((post, index) => (
              <CoachEducatorItemSVP
                key={post.name}
                index={index + 1}
                coachName={post.name}
                coachImage={post.image}
                coachRole={post.role}
                coachArchetype={post.archetype}
                coachDesc={post.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
