"use client";
import Image from "next/image";

interface EmptyItemLMSProps {
  stateTitle: string;
  stateDescription: string;
}

export default function EmptyItemLMS({
  stateTitle,
  stateDescription,
}: EmptyItemLMSProps) {
  return (
    <div className="state-box flex flex-col w-full h-1/2 p-6 items-center lg:px-0 lg:p-3 lg:justify-center">
      <div className="state-container flex flex-col gap-4 max-w-md text-center items-center">
        <div className="state-illustration flex max-w-80 overflow-hidden">
          <Image
            className="object-cover w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/icon/no-result-found.svg"
            }
            alt="empty-lms"
            width={500}
            height={400}
          />
        </div>
        <div className="state-captions flex flex-col gap-1 items-center">
          <h2 className="flex font-bold font-bodycopy text-center tracking-tight text-lg text-neutral-black">
            {stateTitle}
          </h2>
          <p className="font-bodycopy text-center font-medium text-alternative text-sm">
            {stateDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
