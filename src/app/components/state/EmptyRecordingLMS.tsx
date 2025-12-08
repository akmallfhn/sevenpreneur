"use client";
import Image from "next/image";

export default function EmptyRecordingLMS() {
  return (
    <div className="state-box flex flex-col w-full p-6 items-center lg:px-0 lg:pt-0 lg:justify-center">
      <div className="state-container flex flex-col gap-4 max-w-md text-center items-center">
        <div className="state-illustration flex max-w-24 overflow-hidden lg:max-w-36 ">
          <Image
            className="object-cover w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur//video-recording-null.webp"
            }
            alt="empty-cms"
            width={500}
            height={400}
          />
        </div>
        <div className="state-captions flex flex-col gap-1 items-center">
          <h2 className="state-title flex font-bold font-bodycopy text-center text-base tracking-tight lg:text-xl">
            Oops, No Video Yet!
          </h2>
          <p className="state-description font-bodycopy text-center font-medium text-alternative text-sm lg:text-[15px]">
            Don’t worry! The video will be uploaded shortly after the session
            ends. Stay tuned!
          </p>
        </div>
      </div>
    </div>
  );
}
