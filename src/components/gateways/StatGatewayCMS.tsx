"use client";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface StatGatewayCMSProps {
  statsName: string;
  statsValue: number | string;
  statsIcon: IconProp;
  statsIconColor: string;
  statsURL: string;
}

export default function StatGatewayCMS(props: StatGatewayCMSProps) {
  return (
    <Link
      href={props.statsURL}
      className="stat-item flex items-center justify-between bg-section-background p-4 rounded-md transition-all transform active:scale-95"
    >
      <div className="flex items-center gap-3">
        <div
          className={`icon aspect-square flex size-11 p-3 justify-center items-center ${props.statsIconColor} rounded-full`}
        >
          <FontAwesomeIcon icon={props.statsIcon} size="lg" />
        </div>
        <div className="attribute-data flex flex-col">
          <h3 className="font-bodycopy font-medium text-sm">
            {props.statsName}
          </h3>
          <p className="font-bodycopy font-bold text-xl">{props.statsValue}</p>
        </div>
      </div>
      <ChevronRight className="size-6" />
    </Link>
  );
}
