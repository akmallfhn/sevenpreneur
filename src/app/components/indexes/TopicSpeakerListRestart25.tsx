"use client";
import TopicSpeakerItemRestart25 from "../items/TopicSpeakerItemRestart25";
import SectionTitleRestart25 from "../titles/SectionTitleRestart25";

export default function TopicSpeakerListRestart25() {
  const topicsData = [
    {
      topic_name:
        "Meet Ahok: Rebooting Indonesia’s Economy with a New Breed of Founders",
      topic_description:
        "Join Basuki Tjahaja Purnama (Ahok) in a sharp, thought-provoking session on how young Indonesian founders can play a pivotal role in fixing the nation’s economy. A call to action for those ready to build forward.",
      topic_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//session-ahok.webp",
      moderator_name: "Raymond Chin",
      moderator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//avatar-raymond.webp",
    },
    {
      topic_name:
        "The Art of Captivating the Market: Stories of Influence, Grit, and Local Power",
      topic_description:
        "What does it take to truly captivate the market, not just with products, but with purpose and personality? In this rare convergence of influence and enterprise, Dr. Tirta and Arsjad Rasjid (Commisioner of Indika Energy) explore how local businesses can build iconic value, move hearts, and scale impact.",
      topic_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//session-arsjad-tirta.webp",
      moderator_name: "Devin Suhartono",
      moderator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//avatar-devin.webp",
    },
    {
      topic_name:
        "Inside Mekari: Building Indonesian Brands That Move the World",
      topic_description:
        "From a bold local vision to becoming Indonesia’s leading SaaS powerhouse, Mekari’s journey is a masterclass in market leadership. In this RE:START 2025 spotlight, Suwandi Soh unpacks the strategies, culture, and decisions behind building a brand that doesn’t just scale—but shapes the way businesses work.",
      topic_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//session-suwandi.webp",
      moderator_name: "Adythia Pratama",
      moderator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//avatar-adit.webp",
    },
    {
      topic_name:
        "Commanding the AI Era: From Smart Products to Smarter Brands",
      topic_description:
        "AI is rewriting the rules of business, but who’s writing the playbook? In this forward-looking session, Irzan Raditya (Kata.ai) and Denny Santoso (BrainBoost) reveal how they’re capturing the AI revolution to build smarter products, sharper brands, and scalable impact.",
      topic_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//session-irzan-denny.webp",
      moderator_name: "Akmal Luthfiansyah",
      moderator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//avatar-akmal.webp",
    },
    {
      topic_name:
        "Indonesia's Rise: Sustainable Growth Through a Global Business Mindset",
      topic_description:
        "In a world where business growth must go hand-in-hand with responsibility, how do legacy brands and market giants evolve? This powerhouse panel brings together Sigit Djokosoetono (Blue Bird), Lilis Mulyawati (Watsons), and Angela Tanoesoedibjo (MNC Group) to explore how Indonesian companies are embracing sustainability and innovation.",
      topic_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//session-sigit-angela-lilis.webp",
      moderator_name: "Adythia Pratama",
      moderator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//avatar-adit.webp",
    },
    {
      topic_name:
        "Digital Natives: How Edutech Youth Are Shaping a Smarter Generation",
      topic_description:
        "In an era defined by agility, access, and algorithmic influence, youth-led brands are rewriting the rules of impact. This session brings together two of Indonesia’s brightest minds in edutech — Zaky Muhammad Syah (CEO of dibimbing) and Angga Fauzan (CEO of MySkill) — to explore how digital-native founders are building brands that connect with the next generation of learners, professionals, and changemakers.",
      topic_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//session-zaki-angga%20(1).webp",
      moderator_name: "Vander Lesnussa",
      moderator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//avatar-vander.webp",
    },
    {
      topic_name:
        "Riding the Next Economic Wave: Reinventing Legacy in a Shifting Market",
      topic_description:
        "As economic landscapes evolve at unprecedented speed, businesses must either transform or be left behind. In this thought-provoking session, Fadly Hasan (Director, TransJakarta) and Diana Alim (CEO, Marindo Boga Group — home of Gyukaku, On-Yasai, and more) share how their sectors are navigating disruption, digital acceleration, and shifting consumer expectations.",
      topic_image:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//session-fadly-diana%20(1).webp",
      moderator_name: "Vander Lesnussa",
      moderator_avatar:
        "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//avatar-vander.webp",
    },
  ];

  return (
    <section id="topics">
      <div className="topics-running-text pb-8 flex flex-col gap-3 items-center lg:pb-[60px]">
        <div className="flex flex-col items-center">
          <SectionTitleRestart25 sectionTitle="Topics Highlight" />
        </div>
        <div className="flex flex-col w-full">
          {topicsData.map((post, index) => (
            <TopicSpeakerItemRestart25
              key={index}
              index={index}
              topicName={post.topic_name}
              topicDescription={post.topic_description}
              speakerImage={post.topic_image}
              moderatorName={post.moderator_name}
              moderatorAvatar={post.moderator_avatar}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
