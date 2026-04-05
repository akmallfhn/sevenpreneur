"use client";
import SectionTitleRestart25 from "./SectionTitleRestart25";
import SpeakerItemRestart25 from "./SpeakerItemRestart25";

export default function SpeakersLineUpRestart25() {
  const speakerData = [
    {
      name: "Raymond Chin",
      title: "Founder Sevenpreneur",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/raymond-chin.webp",
      on_confirmation: false,
    },
    {
      name: "Basuki Tjahaja Purnama",
      title: "Former Governor of Jakarta",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/ahok.webp",
      on_confirmation: false,
    },
    {
      name: "Arsjad Rasjid",
      title:
        "Chair of the Board of Trustees at Indonesia Business Council (IBC)",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/arsjad-rasjid.webp",
      on_confirmation: false,
    },
    {
      name: "dr.Tirta",
      title: "General Practitioner & Creativepreneur",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/dr-tirta.webp",
      on_confirmation: false,
    },
    {
      name: "Sigit Djokosoetono",
      title: "Deputy CEO Blue Bird Group",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/sigit-djokosoetono.webp",
      on_confirmation: false,
    },
    {
      name: "Lilis Mulyawati",
      title: "President Director of Watsons Indonesia",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/lilis-mulyawati.webp",
      on_confirmation: false,
    },
    {
      name: "Angela Tanoesoedibjo",
      title: "Co-CEO MNC Group & CEO iNews Media Group",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/angela-tanoesoedibjo.webp",
      on_confirmation: false,
    },
    {
      name: "Fadly Hasan",
      title: "Director of Business & Asset Optimization",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/fadly-hasan.webp",
      on_confirmation: false,
    },
    {
      name: "Zaky Muhammad Syah",
      title: "CEO dibimbing and Cakrawala University",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/zack.webp",
      on_confirmation: false,
    },
    {
      name: "Angga fauzan",
      title: "CEO & Co-Founder MySkill, Board of Trustee Universitas Boyolali",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/angga-fauzan.webp",
      on_confirmation: false,
    },
    {
      name: "Suwandi Soh",
      title: "CEO Mekari",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/suwandi-soh.webp",
      on_confirmation: false,
    },
    {
      name: "Shintia Xu",
      title: "CEO of ONA",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/shintia-xu.webp",
      on_confirmation: false,
    },
    {
      name: "Bhima Yudhistira",
      title: "Executive Director CELIOS",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/bhima-yudhistira.webp",
      on_confirmation: false,
    },
    {
      name: "Denny Santoso",
      title: "Founder & CEO BrainBoost",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/denny-santoso.webp",
      on_confirmation: false,
    },
    {
      name: "Diana Alim",
      title: "CEO Marindo Boga",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/diana-alim.webp",
      on_confirmation: false,
    },
    {
      name: "Irzan Raditya",
      title: "CEO & Co-Founder Kata.ai",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/irzan-raditya.webp",
      on_confirmation: false,
    },
    {
      name: "Friska Wirya",
      title: "Top 50 Global Change Management Expert",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/friska-wirya.webp",
      on_confirmation: false,
    },
    // {
    //   name: "And more speakers",
    //   title: "will be revealed",
    //   image:
    //     "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/speakers-restart/more-speakers.webp",
    //   on_confirmation: false,
    // },
  ];

  return (
    <section id="speakers-lineup">
      <div className="speakers-lineup pb-8 flex flex-col items-center gap-3 lg:gap-5 lg:pb-[60px]">
        <SectionTitleRestart25 sectionTitle="All Speakers Lineup" />
        <div className="grid grid-cols-2 max-w-[920px] gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {speakerData.map((post, index) => (
            <SpeakerItemRestart25
              key={index}
              speakerName={post.name}
              speakerImage={post.image}
              speakerTitle={post.title}
              onConfirmation={post.on_confirmation}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
