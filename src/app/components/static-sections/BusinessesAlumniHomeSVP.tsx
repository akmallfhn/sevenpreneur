"use client";
import Image from "next/image";

export default function BusinessesAlumniHomeSVP() {
  const alumni = [
    {
      name: "Antarestar",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-antarestar.svg",
      company_url: "https://antarestar.com/",
    },
    {
      name: "Gentanala",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-gentanala.svg",
      company_url: "https://www.instagram.com/gentanala/",
    },
    {
      name: "Geprekin Aja",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-geprekin-aja.webp",
      company_url: "https://geprekinaja.com/",
    },
    {
      name: "Mulai Travel",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-mulai-travel.webp",
      company_url: "https://www.mulai.travel/",
    },
    {
      name: "Koffietogo",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-koffietogo.webp",
      company_url: "https://www.instagram.com/koffietogo.id/",
    },
    {
      name: "Sehati Life",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-sehati.webp",
      company_url: "https://www.instagram.com/sehati.life/",
    },
    {
      name: "Pixify Studio",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-pixify-studio.webp",
      company_url: "https://pixify.id/pricelist/",
    },
    {
      name: "Haventwined",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-haventwined.webp",
      company_url: "https://www.haventwined.com/",
    },
    {
      name: "MySkill",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-myskill.svg",
      company_url: "https://myskill.id/",
    },
    {
      name: "Culture Stock",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-culture-stock.webp",
      company_url: "https://culturestock.id/",
    },
    {
      name: "Dimtime",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-dimtime.webp",
      company_url: "https://www.instagram.com/_dimtime/",
    },
    {
      name: "Apotek Sehat Berkat",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-apt-sehat-berkat.webp",
      company_url: "https://www.instagram.com/apoteksehatberkat/",
    },
    {
      name: "Monsphysio",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-monsphysio.webp",
      company_url: "https://www.monsphysio.com/",
    },
    {
      name: "Tumbuh Jaya",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-tumbuh-jaya.webp",
      company_url: "https://www.tumbuhjaya.com/",
    },
    {
      name: "Sandhika Karyatama",
      logo_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/alumni-sandhika-karyatama.webp",
      company_url: "https://www.instagram.com/sandhika.karyatama/",
    },
    // {
    //   name: "Maketku",
    //   logo_image: "",
    //   company_url: "",
    // },
    // {
    //   name: "Ben Dino",
    //   logo_image: "",
    //   company_url: "",
    // },
  ];

  const alumniLogos = Array(5).fill(alumni).flat();
  const loopedMessages = [...alumniLogos, ...alumniLogos];

  return (
    <div className="section-root relative flex items-center justify-center overflow-hidden bg-coal-black">
      <div className="section-container flex flex-col w-full items-center gap-6 p-5 py-10 pb-0 z-20 lg:px-0 lg:py-[60px] lg:gap-[48px] ">
        <h2 className="section-title w-fit text-transparent leading-snug bg-clip-text bg-gradient-to-r from-40% from-white to-100% to-primary font-brand font-bold text-center text-xl sm:text-2xl lg:text-4xl lg:max-w-[680px]">
          Empowering 900+ Real Businesses, <br /> Scaled Through Our Program
        </h2>
        <div className="logo-tracks flex flex-col gap-5">
          <div className="logo-track-top flex items-center gap-4 lg:gap-7">
            {loopedMessages.map((post, index) => (
              <a
                href={post.company_url}
                className="logo-item flex max-w-[120px] h-auto shrink-0 p-2 items-center justify-center aspect-[222/88] bg-linear-to-b from-0% from-surface-black to-100% to-[#1C1C1C] border border-outline-dark rounded-full overflow-hidden lg:max-w-[158px] lg:p-3"
                key={`${post.name}${index}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  className="object-contain w-full h-full"
                  src={post.logo_image}
                  alt={post.name}
                  width={150}
                  height={150}
                />
              </a>
            ))}
          </div>
        </div>
        <div className="logo-track-bottom flex items-center gap-4 lg:gap-7">
          {loopedMessages.map((post, index) => (
            <a
              href={post.company_url}
              className="logo-item flex max-w-[120px] h-auto shrink-0 p-2 items-center justify-center aspect-[222/88] bg-linear-to-b from-0% from-surface-black to-100% to-[#1C1C1C] border border-outline-dark rounded-full overflow-hidden lg:max-w-[158px] lg:p-3"
              key={`${post.name}${index}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className="object-contain w-full h-full"
                src={post.logo_image}
                alt={post.name}
                width={150}
                height={150}
              />
            </a>
          ))}
        </div>

        {/* CSS-in-JS */}
        <style jsx>{`
          @keyframes logo-top {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .logo-track-top {
            display: inline-flex;
            animation: logo-top 72s linear infinite;
          }
          .logo-track-top:hover {
            animation-play-state: paused;
          }
          @keyframes logo-bottom {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0%);
            }
          }
          .logo-track-bottom {
            display: inline-flex;
            animation: logo-bottom 72s linear infinite;
          }
          .logo-track-bottom:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </div>
  );
}
