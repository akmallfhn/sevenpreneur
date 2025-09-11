"use client";
import FAQItemBlueprintProgramSVP from "../items/FAQItemBlueprintProgramSVP";

export default function FAQCustomerBlueprintProgramSVP() {
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
        "Selama kelas berlangsung, peserta bebas bertanya langsung kepada mentor. Selain itu, tersedia sesi konsultasi 1-on-1 khusus yang dapat diikuti oleh peserta VIP pada hari terakhir program.",
    },
    {
      question: "Bagaimana jika saya tidak bisa hadir di kelas live?",
      answer:
        "Sangat disayangkan jika tidak bisa hadir di kelas live, karena di momen inilah kamu mendapatkan pengalaman belajar paling kaya: materi inti yang dibahas lebih mendalam, insight spontan dari mentor, serta diskusi interaktif yang sering kali tidak tercapture di modul. Namun, jika terpaksa berhalangan, tenang saja—semua sesi live direkam dan tetap bisa dipelajari ulang melalui LMS Sevenpreneur.",
    },
    // {
    //   question: "Apakah ada garansi uang kembali?",
    //   answer:
    //     "Ada garansi 7 hari setelah program dimulai, jika merasa program tidak sesuai ekspektasi (syarat & ketentuan berlaku).",
    // },
    {
      question: "Apakah materi bisa diakses selamanya?",
      answer:
        "Semua video rekaman, modul, tools, template/worksheet, dan presentasi bisa diakses tanpa batas waktu setelah program berakhir melalui LMS Sevenpreneur.",
    },
    {
      question: "Apa perbedaan program ini dengan training bisnis lainnya?",
      answer:
        "Sevenpreneur Business Blueprint adalah program all-in-one yang membekali kamu dengan semua aspek bisnis: leadership, operasional, finance, sales & marketing, product, hingga strategi end-to-end. Semua materi disajikan dalam bentuk actionable steps sehingga bisa langsung diterapkan ke bisnis nyata, bukan sekadar teori.",
    },
  ];

  return (
    <div className="section-root relative flex items-center justify-center bg-black overflow-hidden">
      <div className="section-container flex flex-col w-full items-center p-5 py-10 pb-24 z-10 lg:px-0 lg:py-[60px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        {/* FAQ */}
        <div className="section-item flex flex-col w-full items-center gap-8 lg:gap-[64px]">
          <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-center text-2xl lg:text-4xl">
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

        <div></div>
      </div>
    </div>
  );
}
