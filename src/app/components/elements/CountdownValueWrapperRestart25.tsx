"use client";

interface CountdownValueWrapperRestart25Props {
  value: number;
  dimensions: string;
}

export default function CountdownValueWrapperRestart25({
  value,
  dimensions,
}: CountdownValueWrapperRestart25Props) {
  return (
    <div className="container flex flex-col items-center gap-1">
      <div className="border-countdown p-[1px] rounded-sm bg-gradient-to-r from-0% from-[#979595] via-50% via-[#484848] to-100% to-[#979595]">
        <p className="value flex items-center justify-center bg-[#212121] w-10 rounded-sm aspect-square font-bran d text-[22px] font-bold lg:bg-[#4332B1]">
          {value}
        </p>
      </div>
      <p className="font-bodycopy text-sm lg:text-sm">{dimensions}</p>
    </div>
  );
}
