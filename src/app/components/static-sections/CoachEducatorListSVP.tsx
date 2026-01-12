"use client";

import CoachEducatorItemSVP from "../items/CoachEducatorItemSVP";

export default function CoachEducatorListSVP() {
  const coachList = [
    {
      name: "Raymond Chin",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/coach-raymond.webp",
      title: "Founder of Sevenpreneur",
    },
    {
      name: "Vicktor Aritonang",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/coach-vicktor.webp",
      title: "CEO of SSPACE",
    },
    {
      name: "Berry Boen",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/coach-berry.webp",
      title: "Operational Director of Datascrip",
    },
    {
      name: "Yusuf Arezany",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/coach-yusuf.webp",
      title: "Market Researcher Specialist",
    },
    {
      name: "Adythia Pratama",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/coach-adyt.webp",
      title: "Guerilla Marketing Specialist",
    },
    {
      name: "Tom Lembong",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/coach-tom.webp",
      title: "Former Trade Minister Indonesia",
    },
    {
      name: "Basuki T. Purnama",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/coach-ahok.webp",
      title: "Former Governor of Jakarta",
    },
  ];

  return (
    <div className="section-root relative flex items-center justify-center overflow-hidden dark:bg-coal-black">
      <div className="section-container flex flex-col w-full items-center gap-20 p-5 py-10 pb-0 z-20 lg:px-0 lg:py-[60px] lg:pb-0 lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        <div className="section-item flex flex-col w-full items-center gap-8 lg:gap-[48px]">
          <h2 className="section-title w-fit text-transparent leading-snug bg-clip-text bg-gradient-to-r from-40% from-black to-100% to-primary font-brand font-bold text-center text-xl max-w-[420px] sm:text-2xl lg:text-4xl lg:max-w-[680px] dark:from-white">
            Learn directly from experienced business coaches and experts
          </h2>
          <div className="coaches grid grid-cols-2 w-full gap-4 sm:grid-cols-3 lg:gap-5 lg:grid-cols-5">
            {coachList.map((post) => (
              <CoachEducatorItemSVP
                key={post.name}
                coachName={post.name}
                coachImage={post.image}
                coachTitle={post.title}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
