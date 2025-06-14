"use client";
import SectionTitleRestart25 from "../elements/SectionTitleRestart25";
import SpeakerItemRestart25 from "../elements/SpeakerItemRestart25";

export default function SpeakersLineUpRestart25() {
  const speakerData = [
    {
      name: "Raymond Chin",
      title: "Founder Sevenpreneur",
      image:
        "https://static.wixstatic.com/media/02a5b1_dad1b41047da42bd92dd2eba42418c37~mv2.webp",
    },
    {
      name: "Basuki Tjahaja Purnama (Ahok)",
      title: "Former Governor of Jakarta 2014 - 2017",
      image:
        "https://static.wixstatic.com/media/02a5b1_7933f447a8d443359f3c9d07c6a40a08~mv2.webp",
    },
    {
      name: "Sigit Djokosoetono",
      title: "Deputy CEO Blue Bird Group",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//sigit-djokosoetono.webp",
    },
    {
      name: "Denny Santoso",
      title: "Founder & CEO BrainBoost",
      image:
        "https://static.wixstatic.com/media/02a5b1_e9e8d63f9e6d423ea7dab593d6009207~mv2.webp",
    },
    {
      name: "dr.Tirta",
      title: "General Practitioner & Creativepreneur",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//dr-tirta.webp",
    },
    {
      name: "Zaky Muhammad Syah",
      title: "CEO dibimbing and Cakrawala University",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//zack.webp",
    },
    {
      name: "Bhima Yudhistira",
      title: "Executive Director CELIOS",
      image:
        "https://static.wixstatic.com/media/02a5b1_a015ebc361e5456a9cc5c72f569106da~mv2.webp",
    },
    {
      name: "Irzan Raditya",
      title: "CEO & Co-Founder Kata.ai",
      image:
        "https://static.wixstatic.com/media/02a5b1_2ecea6c5c5b34534bd47f20a62f2c7b8~mv2.webp",
    },
    {
      name: "And more speakers",
      title: "will be revealed",
      image:
        "https://static.wixstatic.com/media/02a5b1_b424626a2d3d43f6a368b7ee301b01e5~mv2.webp",
    },
  ];

  return (
    <section id="speakers-lineup">
      <div className="speakers-lineup pb-8 flex flex-col items-center gap-3 lg:gap-5 lg:pb-[60px]">
        <div className="section-name flex flex-col items-center">
          <SectionTitleRestart25 sectionTitle="Speakers Lineup" />
        </div>
        <div className="flex flex-wrap max-w-[920px] items-start justify-center gap-4 lg:gap-6">
          {speakerData.map((post, index) => (
            <SpeakerItemRestart25
              key={index}
              speakerName={post.name}
              speakerImage={post.image}
              speakerTitle={post.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
