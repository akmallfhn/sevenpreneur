"use client";
import AttendeeRoleCardItemRestart25 from "../items/AttendeeRoleCardRestart25";
import SectionTitleRestart25 from "../titles/SectionTitleRestart25";

export default function AttendeeRoleListRestart25() {
  const attendeeRoleData = [
    {
      title: "C-Level Executives",
      subtitle: "(CEO, Managing Director, Chairman, Director)",
      icon: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/icon-c-executive.svg",
    },
    {
      title: "C-Level Operators",
      subtitle: "(CIO / CTO / COO / CFO)",
      icon: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/icon-c-operation.svg",
    },
    {
      title: "Product and Innovation Leaders",
      subtitle: "",
      icon: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/icon-innovations.svg",
    },
    {
      title: "Growth Catalysts and Strategic Visionaries",
      subtitle: "",
      icon: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/icon-growth.svg",
    },
    {
      title: "Startup Founders and Investors",
      subtitle: "",
      icon: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/icon-investor.svg",
    },
    {
      title: "Business Development and Partnerships Executives",
      subtitle: "",
      icon: "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/icon-c-operations.svg",
    },
  ];

  return (
    <div className="topics-running-text flex flex-col gap-3 items-center px-8 pb-8 lg:pb-[60px]">
      <div className="flex flex-col items-center">
        <SectionTitleRestart25 sectionTitle="Who's In The Room" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch justify-center lg:max-w-[920px]">
        {attendeeRoleData.map((post, index) => (
          <AttendeeRoleCardItemRestart25
            key={index}
            index={index}
            roleIcon={post.icon}
            roleTitle={post.title}
            roleSubtitle={post.subtitle}
          />
        ))}
      </div>
    </div>
  );
}
