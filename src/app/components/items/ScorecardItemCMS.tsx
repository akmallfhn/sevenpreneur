"use client";

interface ScorecardItemCMSProps {
  scorecardName: string;
  scorecardValue: number | string;
  scorecardBackground: string;
}

export default function ScorecardItemCMS({
  scorecardName,
  scorecardValue,
  scorecardBackground,
}: ScorecardItemCMSProps) {
  return (
    <div className="scorecard-container flex flex-col bg-white border border-outline p-3 rounded-md">
      <div className="flex items-center gap-1.5">
        <div
          className={`scorecard-icon flex size-2.5 justify-center items-center rounded-full ${scorecardBackground}`}
        />
        <h3 className="scorecard-name font-bodycopy font-medium text-sm text-alternative">
          {scorecardName}
        </h3>
      </div>
      <p className="scorecard-value font-bodycopy font-bold text-xl">
        {scorecardValue}
      </p>
    </div>
  );
}
