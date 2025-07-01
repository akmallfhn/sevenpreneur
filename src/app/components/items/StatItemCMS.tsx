"use client";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface StatItemCMSProps {
  statsName: string;
  statsValue: number | string;
  statsIcon: IconProp;
  statsIconBg: string;
}

export default function StatItemCMS({
  statsName,
  statsValue,
  statsIcon,
  statsIconBg,
}: StatItemCMSProps) {
  return (
    <div className="stat-item flex items-center bg-white border border-outline gap-3 p-3 rounded-md">
      <div
        className={`icon aspect-square flex size-11 p-3 justify-center items-center ${statsIconBg} text-white rounded-full`}
      >
        <FontAwesomeIcon icon={statsIcon} className="size-7" />
      </div>
      <div className="attribute-data flex flex-col">
        <h3 className="font-bodycopy font-semibold">{statsName}</h3>
        <p className="font-brand font-bold text-lg">{statsValue}</p>
      </div>
    </div>
  );
}
