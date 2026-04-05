"use client";
import {
  Atom,
  BotMessageSquare,
  ChartPie,
  Dna,
  Earth,
  LandPlot,
  Lightbulb,
  Radar,
  Waypoints,
} from "lucide-react";
import SectionTitleRestart25 from "./SectionTitleRestart25";

export default function TopicsRunningText() {
  const topicsData = [
    {
      topic_name: "Youth & Digital Native Brands",
      topic_icon: Lightbulb,
    },
    {
      topic_name: "Capturing the AI Revolution",
      topic_icon: BotMessageSquare,
    },
    {
      topic_name: "How To Find The Right Investors",
      topic_icon: LandPlot,
    },
    {
      topic_name: "The Beginning Of The New Economy",
      topic_icon: Radar,
    },
    {
      topic_name: "Landscape Of The Current Economy",
      topic_icon: ChartPie,
    },
    {
      topic_name: "Learning From Brands That Move The World",
      topic_icon: Waypoints,
    },
    {
      topic_name: "Becoming A Global Entrepreneur",
      topic_icon: Earth,
    },
    {
      topic_name: "The Rise Of Indonesia's Global Business Leader",
      topic_icon: Dna,
    },
  ];

  // Gandakan data agar bisa seamless scroll
  const loopedTopics = Array(4).fill(topicsData).flat();

  return (
    <section id="topics">
      <div className="topics-running-text pb-8 flex flex-col gap-3 items-center lg:pb-[60px]">
        <div className="flex flex-col items-center">
          <SectionTitleRestart25 sectionTitle="Topics Highlight" />
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="scroll-left flex gap-3 w-max">
            {loopedTopics.map((post, index) => {
              const IconComponent = post.topic_icon || Atom;
              return (
                <div
                  className="border-topic-item p-[1px] rounded-md bg-gradient-to-r from-0% from-[#727272] via-50% via-[#333333] to-100% to-[#727272]"
                  key={index}
                >
                  <div className="topic-item flex items-start text-white font-bodycopy font-medium max-w-[200px] bg-[#1B1B1B] p-2 gap-2 rounded-md lg:max-w-[270px]">
                    <IconComponent
                      className="w-5 h-5 shrink-0 lg:w-7 lg:h-7"
                      strokeWidth={2}
                      color="#979797"
                    />
                    <p className="leading-tight text-sm lg:text-lg">
                      {post.topic_name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative w-full overflow-hidden">
          <div className="scroll-right flex gap-3 w-max">
            {loopedTopics.map((post, index) => {
              const IconComponent = post.topic_icon || Atom;
              return (
                <div
                  className="border-topic-item p-[1px] rounded-md bg-gradient-to-r from-0% from-[#727272] via-50% via-[#333333] to-100% to-[#727272]"
                  key={index}
                >
                  <div className="topic-item flex items-start text-white font-bodycopy font-medium max-w-[200px] bg-[#1B1B1B] p-2 gap-2 rounded-md lg:max-w-[270px]">
                    <IconComponent
                      className="w-5 h-5 shrink-0 lg:w-7 lg:h-7"
                      strokeWidth={2}
                      color="#979797"
                    />
                    <p className="leading-tight text-sm lg:text-lg">
                      {post.topic_name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll-left {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .scroll-left {
            animation: scroll-left 52s linear infinite;
          }

          @keyframes scroll-right {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0%);
            }
          }
          .scroll-right {
            animation: scroll-right 52s linear infinite;
          }
        `}</style>
      </div>
    </section>
  );
}
