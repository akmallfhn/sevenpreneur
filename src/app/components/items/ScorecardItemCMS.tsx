"use client";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    <div className="stat-item flex flex-col bg-white border border-outline p-3 rounded-md">
      <div className="flex items-center gap-1.5">
        <div
          className={`icon flex size-2.5 justify-center items-center rounded-full ${scorecardBackground}`}
        ></div>
        <h3 className="font-bodycopy font-medium text-sm text-alternative">
          {scorecardName}
        </h3>
      </div>
      <p className="font-bodycopy font-bold text-xl">{scorecardValue}</p>
    </div>
  );
}
