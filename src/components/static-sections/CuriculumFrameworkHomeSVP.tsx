"use client";
import Image from "next/image";

export default function CuriculumFrameworkHomeSVP() {
  const frameworks = [
    {
      name: "Founder Foundations",
      description:
        "Membangun kesiapan founder melalui self-awareness, tim, hingga arah bisnis",
    },
    {
      name: "Business Ideation",
      description:
        "Mengidentifikasi peluang dari masalah dan merumuskannya menjadi ide bisnis.",
    },
    {
      name: "Market Research and Validation",
      description:
        "Menilai kekuatan ide melalui riset kompetitor dan menguji kelayakan ide di pasar.",
    },
    {
      name: "Product, Business Model, and Offer",
      description:
        "Mendefinisikan value produk, model bisnis, dan strategi harga dengan potensi profitabilitas terbaik.",
    },
    {
      name: "Brand, Sales, and Marketing",
      description:
        "Mengarahkan brand, audiens, dan channel marketing untuk mendorong konversi sales.",
    },
    {
      name: "People and Process Management",
      description:
        "Mengelola sumber daya manusia dan proses kerja agar operasional berjalan efektif & efisien.",
    },
    {
      name: "Finance Management",
      description:
        "Menjaga stabilitas bisnis melalui pengelolaan cashflow dan analisis keuangan.",
    },
    {
      name: "Growth Beyond",
      description:
        "Membangun pertumbuhan dengan pendekatan yang terukur dan data-driven.",
    },
  ];

  return (
    <div className="section-root relative flex items-center justify-center bg-sevenpreneur-coal">
      <div className="section-container flex flex-col w-full items-center p-5 py-10 gap-8 z-10 lg:flex-row lg:items-start lg:px-0 lg:gap-[64px] lg:py-[60px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        <div className="section-title-desc flex flex-col w-full text-center items-center gap-3 lg:sticky lg:top-[138px] lg:text-left lg:items-start">
          <h2 className="section-title w-fit text-transparent leading-snug bg-clip-text bg-gradient-to-r from-40% from-white to-100% to-primary font-brand font-bold text-center text-xl max-w-[420px] sm:text-2xl lg:text-4xl lg:max-w-[680px]">
            SevenFramework+
          </h2>
          <p className="section-desc text-[15px] font-bodycopy text-white max-w-[326px] sm:text-base sm:max-w-[400px] lg:text-xl lg:max-w-[572px]">
            Framework all-in-one untuk mengembangkan bisnis secara menyeluruh
            tanpa teori yang membingungkan.
          </p>
        </div>
        <div className="frameworks relative flex flex-col w-full h-full gap-4">
          {frameworks.map((post) => (
            <div
              className="flex items-start gap-6 z-20 lg:gap-10"
              key={post.name}
            >
              <div className="flex items-center justify-center size-10 p-2 aspect-square shrink-0 bg-surface-black border border-outline rounded-full overflow-hidden">
                <Image
                  className="w-full h-full object-cover"
                  src={
                    "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/logo-sevenpreneur-square-blue.webp"
                  }
                  alt="logo-sevenpreneur"
                  width={100}
                  height={100}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-white font-bodycopy font-bold text-lg lg:text-xl">
                  {post.name}
                </p>
                <p className="text-sevenpreneur-dust text-sm font-bodycopy font-[450] lg:text-base">
                  {post.description}
                </p>
              </div>
            </div>
          ))}
          <div className="absolute w-[2px] h-11/12 left-5 bg-outline-dark z-0" />
        </div>
      </div>
    </div>
  );
}
