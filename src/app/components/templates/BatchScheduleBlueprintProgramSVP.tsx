"use client";

import Image from "next/image";

export default function BatchScheduleBlueprintProgramSVP() {
  return (
    <div className="section-root relative flex items-center justify-center bg-black">
      <div className="batch-outline p-[1px] w-full h-full max-w-[378px] m-5 my-10 bg-gradient-to-br from-0% from-[#575757] to-100% to-[#3C3C3C] rounded-md overflow-hidden lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
        <div className="batch-container relative flex flex-col w-full h-full p-5 gap-8 bg-gradient-to-br from-0% from-[#0B0B0B] to-100% to-[#2D2D2E] rounded-md overflow-hidden lg:flex-row lg:items-center lg:justify-between lg:p-9">
          <h2 className="batch-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl z-10 sm:text-3xl xl:text-4xl">
            Program Schedule
            <br />
            Batch 7
          </h2>
          <div className="hidden w-0.5 h-[167px] bg-gradient-to-b from-0% from-white/0 via-50% via-white/80 to-100% to-white/0 z-10 lg:flex" />
          <div className="schedule-group flex flex-col gap-6 z-10 lg:flex-row lg:bg-white lg:p-7 lg:gap-9 lg:rounded-md">
            <div className="schedule-item flex flex-col gap-3">
              <div className="flex flex-col">
                <p className="session-schedule text-secondary font-bold font-brand">
                  ONLINE
                </p>
                <p className="session-date text-white font-bold font-brand text-[22px] lg:text-black">
                  27 NOV-12 DEC 2025
                </p>
              </div>
              <div className="hidden border-b border-dashed border-outline lg:flex" />
              <div className="schedule flex font-bodycopy gap-4 text-white lg:text-black">
                <div className="day-schedule flex flex-col gap-1 w-fit text-sm lg:text-base">
                  <p className="font-bold">Day</p>
                  <div className="font-medium">
                    <p>Mon - Fri</p>
                    <p>Saturday</p>
                  </div>
                </div>
                <div className="time-schedule flex flex-col gap-1 w-fit text-sm lg:text-base">
                  <p className="font-bold">Class Session</p>
                  <div className="font-medium">
                    <p>19.00 - 21.00</p>
                    <p>09.00 - 16.00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="schedule-item flex flex-col gap-3">
              <div className="flex flex-col">
                <p className="session-schedule text-secondary font-bold font-brand ">
                  OFFLINE
                </p>
                <p className="session-date font-bold font-brand text-[22px] text-white lg:text-black">
                  14 DEC 2025
                </p>
              </div>
              <div className="hidden border-b border-dashed border-outline lg:flex" />
              <div className="schedule flex font-bodycopy gap-4 text-white lg:text-black">
                <div className="day-schedule flex flex-col gap-1 w-fit text-sm lg:text-base">
                  <p className="font-bold">Days</p>
                  <div className="font-medium">
                    <p>Sunday</p>
                  </div>
                </div>
                <div className="time-schedule flex flex-col gap-1 w-fit text-sm lg:text-base">
                  <p className="font-bold">Class Sessions</p>
                  <div className="font-medium">
                    <p>15.00 - 22.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Absolute Component */}
          <div className="background-desktop absolute hidden inset-0 w-full h-full lg:flex">
            <Image
              className="flex object-cover w-full h-full"
              src={
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/bg-schedule-desktop.webp"
              }
              alt="Schedule Calendar"
              width={1000}
              height={1000}
            />
          </div>
          <div className="background-mobile absolute flex inset-0 w-full h-full lg:hidden">
            <Image
              className="flex object-cover w-full h-full"
              src={
                "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/bg-schedule-mobile.webp"
              }
              alt="Schedule Calendar"
              width={1000}
              height={1000}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
