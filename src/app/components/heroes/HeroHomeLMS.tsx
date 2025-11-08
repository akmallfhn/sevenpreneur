"use client";
import Image from "next/image";

interface HeroGreetingsLMSProps {
  sessionUserName: string;
}

export default function HeroGreetingsLMS({
  sessionUserName,
}: HeroGreetingsLMSProps) {
  return (
    <div className="hero-greetings relative w-full aspect-[5208/702] border border-outline rounded-lg overflow-hidden">
      <Image
        className="hero-image object-cover w-full h-full inset-0"
        src={
          "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/bg-greetings.webp"
        }
        alt="Welcome Dashboard"
        width={800}
        height={800}
      />
      <div className="greetings-content absolute flex flex-col w-full text-white top-1/2 -translate-y-1/2 left-10 z-20">
        <p className="greetings-for font-bodycopy font-medium">
          👋 Hello, {sessionUserName}!
        </p>
        <h2 className="greetings-word font-bodycopy font-bold text-[22px]">
          Welcome to Agora LMS
        </h2>
      </div>
      <div className="overlay absolute inset-0 w-full h-full bg-linear-to-r from-5% from-tertiary to-80% to-tertiary/0 z-10" />
    </div>
  );
}
