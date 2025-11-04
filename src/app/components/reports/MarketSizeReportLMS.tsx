"use client";

import { getShortRupiahCurrency } from "@/lib/currency";

interface MarketSizeReportLMSProps {
  tamValue: number;
  samValue: number;
}

export default function MarketSizeReportLMS({
  tamValue,
  samValue,
}: MarketSizeReportLMSProps) {
  const somValue = 0.05 * samValue;

  return (
    <div className="root-page hidden flex-col pl-64 pb-8 w-full gap-7 items-center justify-center lg:flex">
      <div className="body-contents max-w-[calc(100%-4rem)] w-full flex flex-col justify-between gap-4 pt-20">
        <div className="market-size-chart flex flex-col items-center gap-8 w-full bg-white p-4 pb-10 rounded-lg border">
          <h2 className="section-title font-bold text-2xl font-bodycopy">
            Market Size Analysis
          </h2>
          <div className="flex w-full items-end justify-center gap-16">
            <div className="tam-chart flex flex-col size-64 bg-primary outline-[16px] outline-primary/50 items-center justify-center rounded-full overflow-hidden">
              <p className="font-bodycopy font-bold text-white text-xl">TAM</p>
              <p className="font-bodycopy font-bold text-white text-2xl">
                {getShortRupiahCurrency(tamValue)}
              </p>
            </div>
            <div className="sam-chart flex flex-col size-56 bg-[#FBBF24] outline-[14px] outline-[#FBBF24]/50 items-center justify-center rounded-full overflow-hidden">
              <p className="font-bodycopy font-bold text-white text-lg">SAM</p>
              <p className="font-bodycopy font-bold text-white text-2xl">
                {getShortRupiahCurrency(samValue)}
              </p>
            </div>
            <div className="som-chart flex flex-col size-44 bg-[#EF4444] outline-[12px] outline-[#EF4444]/50 items-center justify-center rounded-full overflow-hidden">
              <p className="font-bodycopy font-bold text-white text-lg">SOM</p>
              <p className="font-bodycopy font-bold text-white text-2xl">
                {getShortRupiahCurrency(somValue)}
              </p>
            </div>
          </div>
        </div>

        <div className="market-size-chart flex flex-col gap-8 w-full bg-white p-4 pb-10 rounded-lg border">
          <h2 className="section-title font-bold text-lg font-bodycopy">
            Details & Insight
          </h2>
        </div>
      </div>
    </div>
  );
}
