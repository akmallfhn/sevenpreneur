"use client";
import Image from "next/image";

interface CoachEducatorItemSVPProps {
  coachName: string;
  coachImage: string;
  coachTitle: string;
}

export default function CoachEducatorItemSVP(props: CoachEducatorItemSVPProps) {
  return (
    <div className="coach-item relative flex aspect-[1/1.27] rounded-lg overflow-hidden">
      <Image
        className="w-full h-full object-cover"
        src={props.coachImage}
        alt={props.coachImage}
        width={400}
        height={400}
      />
      <div className="absolute flex flex-col w-full items-center px-2 left-1/2 -translate-x-1/2 top-2/3 z-10 lg:px-4">
        <p className="font-bodycopy font-bold text-white text-[15px] text-center leading-snug sm:text-lg lg:text-xl">
          {props.coachName}
        </p>
        <p className="font-bodycopy text-white/50 text-sm text-center font-normal leading-snug">
          {props.coachTitle}
        </p>
      </div>
    </div>
  );
}
