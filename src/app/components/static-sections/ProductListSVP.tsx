"use client";
import ProductItemHomeSVP from "../items/ProductItemHomeSVP";

export default function ProductListSVP() {
  const productList = [
    {
      name: "Sevenpreneur Business Blueprint Program",
      desc: "Program pembelajaran bisnis intensif dalam 10–14 sesi untuk memulai atau scale-up bisnis.",
      path: "/cohorts/sevenpreneur-business-blueprint-program",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/product-sbbp.webp",
    },
    {
      name: "AI Business Process Automation Bootcamp",
      desc: "Kelas intensif untuk membangun sistem proses bisnis yang berjalan otomatis dengan dukungan AI.",
      path: null,
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/product-aibpa.webp",
    },
    {
      name: "RE:START Conference",
      desc: "Annual business conference yang membantu bisnis me-reset strategi melalui sesi insight-driven, pembahasan tren masa depan, dan studi kasus.",
      path: "/events/restart-conference",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/product-restart.webp",
    },
    {
      name: "Community Event",
      desc: "Networking strategis untuk menjaring, mengembangkan, dan menghubungkan entrepreneur potensial.",
      path: "/events/sevenpreneur-business-networking/1",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/product-community.webp",
    },
    {
      name: "Learning Series",
      desc: "Video on-demand untuk belajar bisnis kapan saja, di mana saja, tanpa batasan waktu.",
      path: "/playlists/playlists/restart-conference-2025/1",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/product-vod.webp",
    },
  ];
  return (
    <div className="section-root relative flex items-center justify-center overflow-hidden dark:bg-coal-black">
      <div className="section-container flex flex-col w-full items-center gap-8 lg:gap-[48px] p-5 py-10 z-20 lg:px-0 lg:py-[60px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        <h2 className="section-title w-fit text-transparent leading-snug bg-clip-text bg-gradient-to-r from-40% from-black to-100% to-primary font-brand font-bold text-center text-xl sm:text-2xl lg:text-4xl lg:max-w-[680px] dark:from-white">
          Our Programs & Experiences
        </h2>
        <div className="grid grid-cols-1 gap-3 items-stretch sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {productList.map((post) => (
            <ProductItemHomeSVP
              key={post.name}
              productName={post.name}
              productDesc={post.desc}
              productImage={post.image}
              productPath={post.path}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
