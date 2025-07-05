"use client";

export default function CountdownValueWrapperRestart25({ value, dimensions }) {
  return (
    <div className="container flex flex-col items-center gap-2">
      <div className="border-countdown p-[1px] rounded-lg bg-gradient-to-r from-0% from-[#BABABA] via-50% via-[#333333] to-100% to-[#BABABA]">
        <p className="value flex items-center justify-center bg-[#212121] w-16 rounded-lg aspect-square font-brand text-4xl font-bold lg:bg-[#4332B1]">
          {value}
        </p>
      </div>
      <p className="font-bodycopy text-sm lg:text-lg">{dimensions}</p>
    </div>
  );
}
