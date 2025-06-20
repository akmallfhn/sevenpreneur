"use client";
import EventExperienceCardItemRestart25 from "../elements/EventExperienceCardItemRestart25";
import SectionTitleRestart25 from "../elements/SectionTitleRestart25";

export default function EventExperienceRestart25() {
  const experienceData = [
    {
      name: "Inspirational Business Talk",
      description:
        "Conversations that challenge, inspire, and move business forward.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//main-stage.webp",
      isVIP: false,
    },
    {
      name: "DJ Performance",
      description:
        "A fusion of live art and DJ vibes to elevate your senses and energy.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//art-performance.webp",
      isVIP: false,
    },
    {
      name: "Business Challenge Finale",
      description:
        "Watch top finalists pitch game-changing ideas in an electrifying finale.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//business-challenge.webp",
      isVIP: false,
    },
    {
      name: "VIP Lounge",
      description:
        "An exclusive space for premium comfort, networking, and perks.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//vip-lounge.webp",
      isVIP: true,
    },
    {
      name: "Interactive Booths",
      description: "Engage, explore, and experience brands like never before.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//interactive-booth.webp",
      isVIP: false,
    },
    {
      name: "Aesthetic Photo Spot",
      description:
        "Capture your moment in beautifully curated, Instagram-worthy spaces.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//photo-spot.webp",
      isVIP: false,
    },
    {
      name: "Mini Workshop",
      description:
        "Learn hands-on skills from experts in short, power-packed sessions.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//mini-workshop.webp",
      isVIP: false,
    },
  ];
  return (
    <section id="experience">
      <div className="experience-container flex flex-col items-center justify-center px-8 pb-8 gap-3 lg:gap-5 lg:pb-[60px]">
        <SectionTitleRestart25 sectionTitle="The Immersive Experience" />
        <div className="flex flex-wrap max-w-[1292px] items-start justify-center gap-4 lg:gap-8">
          {experienceData.map((post, index) => (
            <EventExperienceCardItemRestart25
              key={index}
              experienceName={post.name}
              experienceDescription={post.description}
              experienceImage={post.image}
              isexperienceVIP={post.isVIP}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
