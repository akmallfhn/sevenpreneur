"use client";
import Image from "next/image";

export default function EmptyDiscussionLMS() {
  return (
    <div className="state-box flex flex-col w-full p-6 items-center lg:px-0 lg:pt-0 lg:justify-center">
      <div className="state-container flex flex-col gap-4 max-w-md text-center items-center">
        <div className="state-illustration flex max-w-40 overflow-hidden lg:max-w-64">
          <Image
            className="object-cover w-full h-full"
            src={
              "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/empty-comment.svg"
            }
            alt="empty-cms"
            width={500}
            height={400}
          />
        </div>
        <div className="state-captions flex flex-col gap-1 items-center">
          <h2 className="state-title flex font-bold font-bodycopy text-center text-base tracking-tight lg:text-xl">
            Got something to say?
          </h2>
          <p className="state-description font-bodycopy text-center font-medium text-alternative text-sm lg:text-[15px]">
            After joining this session, what are your questions, ideas, or
            takeaways? Share them with everyone here!
          </p>
        </div>
      </div>
    </div>
  );
}
