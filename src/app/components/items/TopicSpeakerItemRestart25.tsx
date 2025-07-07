"use client";
import Image from "next/image";

interface TopicSpeakerItemRestart25Props {
  index: number;
  topicName: string;
  topicDescription: string;
  speakerImage: string;
  moderatorName: string;
  moderatorAvatar: string;
}

export default function TopicSpeakerItemRestart25({
  index,
  topicName,
  topicDescription,
  speakerImage,
  moderatorAvatar,
  moderatorName,
}: TopicSpeakerItemRestart25Props) {
  return (
    <div
      className={`card-box flex w-full p-5 items-center md:p-10 ${
        index % 2 === 0 ? "bg-[#222222]" : "bg-black"
      }`}
    >
      <div
        className={`card-container flex flex-col gap-3 md:mx-auto md:gap-8 lg:max-w-[1024px] lg:items-center xl:max-w-[1280px] ${
          index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
        }`}
      >
        <div className="top-content flex flex-col gap-3 w-full md:max-w-[342px] lg:max-w-[512px]">
          <h2 className="block font-brand font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#D1CDCD] via-[#696868] to-[#D1CDCD] md:hidden">
            {topicName}
          </h2>
          <div className="flex aspect-topic-restart rounded-md overflow-hidden lg:rounded-lg">
            <Image
              className="object-cover w-full h-full"
              src={speakerImage}
              alt={topicName}
              width={500}
              height={500}
            />
          </div>
        </div>
        <div className="bottom-content flex flex-col text-white gap-3 md:max-w-[320px] lg:max-w-[512px]">
          <h2 className="hidden font-brand font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#D1CDCD] via-[#696868] to-[#D1CDCD] md:block lg:text-3xl">
            {topicName}
          </h2>
          <p className="font-bodycopy font-medium text-white/75 text-sm lg:text-xl">
            {topicDescription}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex aspect-square size-10 rounded-full overflow-hidden lg:size-12">
              <Image
                className="object-cover w-full h-full"
                src={moderatorAvatar}
                alt={moderatorName}
                width={100}
                height={100}
              />
            </div>
            <div className="flex flex-col font-bodycopy">
              <p className="text-sm lg:text-lg">Moderated by</p>
              <p className="text-sm font-bold tracking-[0.15em] lg:text-lg">
                {moderatorName?.toUpperCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
