"use client";
import Image from "next/image";
import LearningSessionItemBlueprintProgramSVP, {
  LearningSessionVariantBlueprintProgramSVP,
} from "../items/LearningSessionItemBlueprintProgramSVP";

export default function LearningListBlueprintSVP() {
  const data = [
    {
      session_number: "01.",
      session_name: "Growth Foundations",
      session_description:
        "Build the mindset and fundamentals behind every scalable business.",
      session_educator: "Raymond Chin",
      session_educator_title: "Founder Sevenpreneur",
      session_educator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers-raymond.webp",
      session_variant: "frameworkPrimary",
    },
    {
      session_number: "",
      session_name:
        "Why People Choose Your Business Instead of Your Competitors",
      session_description: "",
      session_educator: "Stephanie Regina",
      session_educator_title: "Founder & CEO - Haloka Group",
      session_educator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers-stephanie.webp",
      session_variant: "founderSeries",
    },
    {
      session_number: "02.",
      session_name: "Market Intelligence",
      session_description:
        "Identify real market problems worth solving and scaling.",
      session_educator: "Rivan Wijaya",
      session_educator_title: "Director at Nielsen",
      session_educator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers-rivan.webp",
      session_variant: "frameworkSecondary",
    },
    {
      session_number: "03.",
      session_name: "Business Model & Offer",
      session_description:
        "Craft a clear business model and high-converting offer.",
      session_educator: "Zaky Muhammad Syah",
      session_educator_title: "CEO Dibimbing & Cakrawala University",
      session_educator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers-zaky.webp",
      session_variant: "frameworkPrimary",
    },
    {
      session_number: "04.",
      session_name: "Growth Marketing Strategy",
      session_description:
        "Turn traffic into customers and sales with structured growth strategies.",
      session_educator: "Vicktor Aritonang",
      session_educator_title: "CEO SSPACE Media",
      session_educator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers-vicktor.webp",
      session_variant: "frameworkSecondary",
    },
    {
      session_number: "",
      session_name: "Ways To Build Powerful Business Connections",
      session_description: "",
      session_educator: "Adythia Pratama",
      session_educator_title: "Guerilla Marketing Specialist",
      session_educator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers-adythia.webp",
      session_variant: "founderSeries",
    },
    {
      session_number: "05.",
      session_name: "People Management & Ops",
      session_description:
        "Design teams and systems ready for sustainable scaling.",
      session_educator: "Berry Boen",
      session_educator_title: "Operational Director Datascrip Indonesia",
      session_educator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers-berry-boen.webp",
      session_variant: "frameworkSecondary",
    },
    {
      session_number: "06.",
      session_name: "Finance, Tax, and Legal",
      session_description:
        "Secure your growth with solid finance, tax, and legal structure.",
      session_educator: "Krisna Herdiana",
      session_educator_title: "Founding Partner of HnG Consulting",
      session_educator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers-krisna.webp",
      session_variant: "frameworkPrimary",
    },
    {
      session_number: "07.",
      session_name: "Growth Strategy",
      session_description:
        "Scaling isn’t just bigger. It’s smarter, faster, and sustainable.",
      session_educator: "Raymond Chin",
      session_educator_title: "Founder Sevenpreneur",
      session_educator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers-raymond.webp",
      session_variant: "frameworkSecondary",
    },
    {
      session_number: "",
      session_name: "Managing Complexity in High-Growth Businesses",
      session_description: "",
      session_educator: "Suwandi Soh",
      session_educator_title: "CEO of Mekari",
      session_educator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers-suwandi.webp",
      session_variant: "extraordinary",
    },
    {
      session_number: "",
      session_name: "",
      session_description: "",
      session_educator: "To Be Announced",
      session_educator_title: "",
      session_educator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers-tba.webp",
      session_variant: "extraordinary",
    },
    {
      session_number: "",
      session_name: "",
      session_description: "",
      session_educator: "To Be Announced",
      session_educator_title: "",
      session_educator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sbbp-speakers-tba.webp",
      session_variant: "extraordinary",
    },
  ];

  return (
    <div className="section-root relative flex items-center justify-center bg-gradient-to-b from-0% from-black via-60% via-[#2C2196] to-100% to-[#3426AE]">
      <div className="section-container flex flex-col w-full items-center p-5 py-10 pb-24 gap-8 z-10 lg:flex-row lg:items-start lg:px-0 lg:gap-[64px] lg:py-[60px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px] ">
        {/* Section Title & Desc */}
        <div className="section-title-desc flex flex-col w-full text-center items-center gap-3 lg:sticky lg:top-32 lg:text-left lg:items-start">
          <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl sm:text-3xl sm:max-w-[600px] lg:text-4xl lg:max-w-full">
            Kurikulum yang Dipercaya 5000+ Founder & Business Leader
          </h2>
          <p className="section-desc text-sm font-bodycopy text-white max-w-[326px] sm:text-base sm:max-w-[400px] lg:text-xl lg:max-w-[572px]">
            Jalur belajar terstruktur dengan bimbingan coach, business leader,
            dan CEO untuk membangun bisnis lebih terarah.
          </p>
        </div>

        {/* Session Item */}
        <div className="sessions flex flex-col w-full items-center gap-4">
          {data.map((post, index) => (
            <LearningSessionItemBlueprintProgramSVP
              key={index}
              variant={
                post.session_variant as LearningSessionVariantBlueprintProgramSVP
              }
              sessionNumber={post.session_number}
              sessionName={post.session_name}
              sessionDescription={post.session_description}
              sessionEducator={post.session_educator}
              sessionEducatorTitle={post.session_educator_title}
              sessionEducatorAvatar={post.session_educator_avatar}
            />
          ))}
        </div>
      </div>

      {/* Background */}
      <div className="overlay-background absolute inset-x-0 bottom-0">
        <Image
          className="w-full h-auto object-cover mix-blend-plus-lighter"
          src={
            "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/overlay-curiculum%201.webp"
          }
          alt="Overlay Background"
          width={1000}
          height={1000}
        />
      </div>
    </div>
  );
}
