"use client";
import Image from "next/image";
import FAQItemBlueprintProgramSVP from "../items/FAQItemBlueprintProgramSVP";
import AppButton from "../buttons/AppButton";

interface FAQBlueprintProgramSVPProps {
  cohortId: number;
}

export default function FAQBlueprintProgramSVP(
  props: FAQBlueprintProgramSVPProps
) {
  const faqSevenpreneur = [
    {
      question: "Apakah program ini dapat dicicil pembayarannya?",
      answer:
        "Kami tidak ingin biaya program pembelajaran menjadi hambatan bagi kamu untuk belajar dan berkembang. Oleh karena itu, kamu dapat mencicil biaya program pembelajaran melalui pihak ketiga yang telah bekerja sama dengan Sevenpreneur seperti Kredivo, Akulaku, serta kartu kredit (Visa, Mastercard, Amex) agar proses pembayaran lebih mudah dan fleksibel.",
    },
    {
      question:
        "Apakah program ini bisa diikuti oleh pemula yang belum punya bisnis?",
      answer:
        "Materi dirancang mulai dari fundamental hingga strategi lanjutan, sehingga cocok untuk pemula maupun pelaku usaha yang ingin scale-up.",
    },
    {
      question: "Apakah program ini dilakukan online atau offline?",
      answer:
        "Mayoritas sesi berlangsung online melalui live class interaktif dan akses rekaman yang bisa dipelajari kapan saja. Untuk peserta VIP, tersedia sesi offline/workshop eksklusif agar bisa belajar langsung, networking, dan mendapat pengalaman lebih mendalam.",
    },
    {
      question:
        "Apakah saya akan mendapatkan sertifikat setelah menyelesaikan program?",
      answer:
        "Ya, peserta yang menyelesaikan seluruh modul dan tugas akan memperoleh e-certificate resmi dari Sevenpreneur.",
    },
    {
      question: "Berapa lama durasi programnya?",
      answer:
        "Program berlangsung selama ±3 minggu dengan kombinasi kelas coaching 7 Business Framework, sesi Founder Series on Stage, serta praktik berbasis bisnis nyata agar peserta langsung bisa mengaplikasikan ilmunya.",
    },
    {
      question: "Apakah ada mentoring atau konsultasi 1-on-1?",
      answer:
        "Selama kelas berlangsung, peserta bebas bertanya langsung kepada mentor. Selain itu, tersedia sesi konsultasi 1-on-1 yang dapat diikuti oleh peserta VIP di hari terakhir program.",
    },
    {
      question: "Bagaimana jika saya tidak bisa hadir di kelas live?",
      answer:
        "Sangat disayangkan jika tidak bisa hadir di kelas live, karena di momen inilah kamu mendapatkan pengalaman belajar mendalam: materi inti yang dibahas lebih mendalam, real insight dari coach, serta diskusi interaktif yang sering kali tidak tercapture di modul. Namun, jika terpaksa berhalangan, tenang saja—semua sesi live direkam dan tetap bisa dipelajari ulang melalui LMS Sevenpreneur.",
    },
    {
      question: "Apakah materi bisa diakses selamanya?",
      answer:
        "Semua video rekaman, modul, tools, template/worksheet, dan presentasi bisa diakses tanpa batas waktu setelah program berakhir melalui LMS Sevenpreneur.",
    },
    {
      question: "Apa perbedaan program ini dengan training bisnis lainnya?",
      answer:
        "Sevenpreneur Business Blueprint Program merupakan program all-in-one yang membekali kamu dengan semua aspek bisnis: leadership, operasional, finance, sales & marketing, product, hingga strategi end-to-end. Semua materi disajikan dalam bentuk actionable steps sehingga bisa langsung diterapkan.",
    },
  ];

  return (
    <div className="section-root relative flex items-center justify-center bg-black overflow-hidden">
      <div className="section-container flex flex-col w-full items-center gap-20 p-5 py-10 pb-0 z-20 lg:px-0 lg:py-[60px] lg:pb-0 lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        <div className="section-item flex flex-col w-full items-center gap-8 lg:gap-[64px]">
          <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-center text-2xl sm:text-3xl lg:text-4xl">
            Everything You Need to Know
          </h2>
          <div className="section-faq flex flex-col w-full max-w-[840px] gap-3 lg:gap-3">
            {faqSevenpreneur.map((post, index) => (
              <FAQItemBlueprintProgramSVP
                key={index}
                questions={post.question}
                answer={post.answer}
              />
            ))}
          </div>
        </div>

        {/* Help Desk */}
        <div className="section-item flex items-center justify-between gap-8 max-w-[840px]">
          <div className="section-title hidden gap-8 shrink-0 lg:flex lg:flex-col">
            <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-20% from-[#FFFFFF] to-100% to-[#B89FE0] font-brand font-bold text-2xl sm:text-3xl lg:text-4xl">
              Punya pertanyaan lanjutan? <br /> Konsultasikan bersama kami
            </h2>
            <a
              href="https://wa.me/6282312492067?text=Halo%2C%20MinSeven!%20👋%0AAku%20tertarik%20untuk%20mengikuti%20*Sevenpreneur%20Business%20Blueprint%20Program%20Batch%207*%20dan%20mau%20konsultasi%20lebih%20lanjut.%20Berikut%20dataku%3A%0A•%20Nama%3A%20(isi%20di%20sini)%0A•%20Email%3A%20(isi%20di%20sini)%0A%0ATerima%20kasih%2C%20MinSeven%20🙏"
              target="_blank"
              rel="noopenner noreferrer"
              className="w-[240px]"
            >
              <AppButton
                variant="primaryGradient"
                size="largeRounded"
                className="w-full"
                // GTM
                featureName="whatsapp_consultation"
                featureId={String(props.cohortId)}
                featureProductCategory="COHORT"
                featureProductName="Sevenpreneur Business Blueprint Program Batch 7"
                featurePagePoint="Product Detail Page"
                featurePlacement="page-end-desktop"
                // Meta
                metaEventName="Contact"
                metaContentIds={[String(props.cohortId)]}
                metaContentType="service"
                metaContentCategory="Business Education Program"
                metaContentName="Sevenpreneur Business Blueprint Program Batch 7"
              >
                Hubungi Kami
                <Image
                  className="flex size-6"
                  src={
                    "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/whatsapp-logo.svg"
                  }
                  alt="Whatsapp Logo"
                  width={30}
                  height={30}
                />
              </AppButton>
            </a>
          </div>
          <div className="customer-support-image flex w-full max-w-[340px] lg:max-w-[320px]">
            <Image
              src={
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/talent-cs.webp"
              }
              alt="Customer Support"
              width={400}
              height={400}
            />
          </div>
        </div>
      </div>

      {/* Absolute Layout */}
      {/* Title on Mobile */}
      <div className="section-title absolute flex flex-col w-[350px] bottom-14 left-1/2 -translate-x-1/2 items-center gap-3 z-40 lg:hidden">
        <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-20% from-[#FFFFFF] to-100% to-[#B89FE0] font-brand font-bold text-center text-xl">
          Punya pertanyaan lanjutan? <br /> Konsultasikan bersama kami
        </h2>
        <a
          href="https://wa.me/6282312492067?text=Halo%2C%20MinSeven!%20👋%0AAku%20tertarik%20untuk%20mengikuti%20*Sevenpreneur%20Business%20Blueprint%20Program%20Batch%207*%20dan%20mau%20konsultasi%20lebih%20lanjut.%20Berikut%20dataku%3A%0A•%20Nama%3A%20(isi%20di%20sini)%0A•%20Email%3A%20(isi%20di%20sini)%0A%0ATerima%20kasih%2C%20MinSeven%20🙏"
          target="_blank"
          rel="noopenner noreferrer"
          className="w-[240px]"
        >
          <AppButton
            variant="primaryGradient"
            size="defaultRounded"
            className="w-full"
            // GTM
            featureName="whatsapp_consultation"
            featureId={String(props.cohortId)}
            featureProductCategory="COHORT"
            featureProductName="Sevenpreneur Business Blueprint Program Batch 7"
            featurePagePoint="Product Detail Page"
            featurePlacement="page-end-mobile"
            // Meta
            metaEventName="Contact"
            metaContentIds={[String(props.cohortId)]}
            metaContentType="service"
            metaContentCategory="Business Education Program"
            metaContentName="Sevenpreneur Business Blueprint Program Batch 7"
          >
            Hubungi Kami
            <Image
              className="flex size-6"
              src={
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/whatsapp-logo.svg"
              }
              alt="Whatsapp Logo"
              width={30}
              height={30}
            />
          </AppButton>
        </a>
      </div>

      {/* Overlay Black */}
      <div className="overlay-black absolute flex w-full h-[300px] bottom-0 bg-gradient-to-t from-0% from-surface-black to-100% to-transparent z-30 lg:hidden" />

      {/* Overlay Maps */}
      <Image
        className="maps absolute flex opacity-25 bottom-[275px] scale-150 z-10 sm:scale-100 lg:bottom-[200px]"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/hero-maps.webp"
        }
        alt="Overlay Maps"
        width={1000}
        height={1000}
      />

      {/* Circle Blur */}
      <div className="circle-blur-bottom absolute flex bg-[#5E17E3]/60 w-[1488px] h-[436px] bottom-0 left-1/2 -translate-x-1/2 blur-[140px] rounded-full lg:-bottom-[146px] lg:blur-[200px]" />
    </div>
  );
}
