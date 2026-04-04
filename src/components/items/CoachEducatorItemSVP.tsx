"use client";
import Image from "next/image";

interface CoachEducatorItemSVPProps {
  index: number;
  coachName: string;
  coachImage: string;
  coachRole: string;
  coachArchetype: string;
  coachDesc: string;
}

export default function CoachEducatorItemSVP(props: CoachEducatorItemSVPProps) {
  const isMirrored = props.index % 2 === 0;

  return (
    <div
      className={`coach-item flex w-full items-center gap-4 lg:gap-5 ${isMirrored ? "flex-row-reverse sm:flex-row" : "flex-row"}`}
    >
      <div className="coach-image flex shrink-0 size-32 aspect-square rounded-lg overflow-hidden lg:size-48">
        <Image
          className="w-full h-full object-cover"
          src={props.coachImage}
          alt={props.coachImage}
          width={400}
          height={400}
        />
      </div>
      <div className="flex flex-col w-full gap-2 lg:gap-2.5">
        <p className="w-fit text-white font-brand font-bold bg-secondary px-2 py-1 text-[10px] truncate rounded-sm lg:text-[13px]">
          {props.coachArchetype.toUpperCase()}
        </p>
        <p className="font-bodycopy font-bold text-white text-lg leading-snug lg:text-2xl">
          {props.coachName}
        </p>
        <p className="text-[#918E8E] text-[12px] font-bodycopy font-medium lg:text-[15px]">
          {props.coachDesc}
        </p>
        <p className="font-bodycopy text-white text-sm font-semibold leading-snug lg:text-[15px]">
          {props.coachRole}
        </p>
      </div>
    </div>
  );
}
