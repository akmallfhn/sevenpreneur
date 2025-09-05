"use client";
import Image from "next/image";

interface SpeakerItemRestart25Props {
  speakerName: string;
  speakerImage: string;
  speakerTitle: string;
  onConfirmation: boolean;
}

export default function SpeakerItemRestart25({
  speakerName,
  speakerImage,
  speakerTitle,
  onConfirmation = false,
}: SpeakerItemRestart25Props) {
  return (
    <div className="speaker-container relative flex flex-col w-[168px] aspect-speaker-restart overflow-hidden lg:w-[212px]">
      <Image
        className="object-cover w-full h-full"
        src={speakerImage}
        alt={`${speakerName} - RE:START Conference 2025`}
        fill
      />
      <div className="speaker-name-title absolute flex flex-col bottom-2 right-2 gap-0.5 pl-2 text-end items-end text-white z-10">
        <p className="speaker-name font-brand font-bold leading-snug tracking-widest text-sm lg:text-base">
          {speakerName.toUpperCase()}
          {onConfirmation && (
            <span className="text-red-500 font-bodycopy">*</span>
          )}
        </p>
        <p className="speaker-title font-bodycopy font-medium text-white/65 text-[11px] lg:text-sm">
          {speakerTitle.trim()}
        </p>
        {onConfirmation && (
          <p className="text-red-500 font-bodycopy text-sm lg:text-base">
            *on confirmation
          </p>
        )}
      </div>
    </div>
  );
}
