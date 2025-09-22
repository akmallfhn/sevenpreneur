"use client";

export default function BatchScheduleBlueprintProgramSVP() {
  return (
    <div className="section-root relative flex items-center justify-center bg-black">
      <div className="p-[1px] bg-white m-5 w-full h-full rounded-md overflow-hidden">
        <div className="section-container flex flex-col w-full p-8 gap-8 z-10 bg-gradient-to-br from-0% from-[#19181C] to-100% to-[#2D2D2E] rounded-md  lg:flex-row lg:items-start lg:px-0 lg:gap-[64px] lg:py-[60px] lg:max-w-[988px] xl:max-w-[1208px] 2xl:max-w-[1300px]">
          <h2 className="section-title text-transparent w-fit bg-clip-text bg-gradient-to-r from-[#FFFFFF] to-[#B89FE0] font-brand font-bold text-2xl sm:text-3xl sm:max-w-[600px] lg:text-4xl lg:max-w-full">
            Program Schedule
            <br />
            Batch 7
          </h2>
          <div className="schedule-item flex flex-col">
            <div className="flex flex-col">
              <p>ONLINE</p>
              <p>27 NOV-12 DEC 2025 </p>
            </div>
            <div className="schedule flex">
              <div className="flex flex-col">
                <p>Days</p>
                <div>
                  <p>Mon - Fri</p>
                  <p>Saturday</p>
                </div>
              </div>
              <div className="flex flex-col">
                <p>Class Sessions</p>
                <div>
                  <p>19.00 - 21.00</p>
                  <p>09.00 - 16.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
