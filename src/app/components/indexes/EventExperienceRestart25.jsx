"use client";
import EventExperienceCardItemRestart25 from "@/app/components/items/EventExperienceCardItemRestart25";
import SectionTitleRestart25 from "@/app/components/titles/SectionTitleRestart25";

export default function EventExperienceRestart25() {
  const experienceData = [
    {
      name: "Inspirational Business Talk",
      description:
        "Conversations that challenge, inspire, and move business forward.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/experience-v2/main-stage.webp",
      isVIP: false,
    },
    {
      name: "Mini Workshop",
      description:
        "Learn hands-on skills from experts in short, power-packed sessions.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/experience-v2/mini-workshop%20(1).webp",
      isVIP: false,
    },

    {
      name: "The Grand Pitch & Awarding",
      description:
        "A singular pitch for the winner of RE:START Business Challenge",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/experience-v2/business-challenge.webp",
      isVIP: false,
    },
    {
      name: "Aesthetic Photo Spot",
      description:
        "Capture your moment in beautifully curated, Instagram-worthy spaces.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/experience-v2/aesthetic-photo-spot.webp",
      isVIP: false,
    },
    {
      name: "VIP Lounge",
      description:
        "An exclusive space for premium comfort, networking, and perks.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/experience-v2/vip-lounge.webp",
      isVIP: true,
    },
    {
      name: "Entertainment Show",
      description:
        "A fusion of live art and DJ vibes to elevate your senses and energy.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/experience-v2/entertainment-show.webp",
      isVIP: true,
    },
    {
      name: "Dinner & Dialogue",
      description:
        "An intimate dinner to connect deeply with visionary speakers.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/experience-v2/dinner-dialogue.webp",
      isVIP: true,
    },
    {
      name: "Networking Night",
      description:
        "An open-floor night to meet future partners, clients, or co-founders.",
      image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/experience-v2/networking-night.webp",
      isVIP: true,
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
