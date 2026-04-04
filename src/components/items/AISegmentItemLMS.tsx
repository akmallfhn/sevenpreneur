"use client";
import { getShortNumber } from "@/lib/convert-number";
import { ChevronDown, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import AppButton from "../buttons/AppButton";

interface AISegmentItemLMSProps {
  segmentName: string;
  segmentDescription: string;
  segmentSize: number;
  segmentPercentage: number;
  segmentPainPoints: string;
}

export default function AISegmentItemLMS(props: AISegmentItemLMSProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);

  // Checking overflow using divRef
  useEffect(() => {
    const checkOverflow = () => {
      if (divRef.current) {
        const el = divRef.current;
        const isOverflow = el.scrollHeight > el.clientHeight;
        setIsOverflowing(isOverflow);
      }
    };
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  return (
    <div className="segment-item relative flex flex-col gap-3 p-3 bg-linear-to-bl from-0% from-[#EFEDF9] to-60% to-white border rounded-lg overflow-hidden">
      <div className="segment-attributes flex items-center gap-3">
        <div className="segment-icon p-2 bg-[#EFEDF9] shrink-0 rounded-md">
          <User className="size-10 text-[#42359B]" />
        </div>
        <div className="flex flex-col">
          <div className="segment-number flex gap-2 items-end">
            <p className="segment-percentage font-brand font-bold text-[#42359B] text-3xl">
              {props.segmentPercentage}%
            </p>
            <p className="segment-size font-bodycopy font-medium text-[#333333] text-[15px]">
              dari {getShortNumber(props.segmentSize)}
            </p>
          </div>
          <p className="segment-name flex flex-col font-bodycopy font-semibold text-[#333333]">
            {props.segmentName}
          </p>
        </div>
      </div>
      <div
        ref={divRef}
        className={`flex flex-col gap-3 transition-all overflow-hidden ${
          isExpanded ? "max-h-[2000px]" : "max-h-11"
        }`}
      >
        <p className="segment-description flex flex-col font-bodycopy font-medium text-[#333333] text-[15px]">
          <b>Characteristics:</b>
          {props.segmentDescription}
        </p>
        <p className="segment-pain-points flex flex-col font-bodycopy font-medium text-[#333333] text-[15px]">
          <b>Pain Points:</b> {props.segmentPainPoints}
        </p>
      </div>
      {isOverflowing && (
        <div className="flex transition-all transform z-10">
          <AppButton
            variant={"primaryLight"}
            size="small"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            <p>{isExpanded ? "Show less" : "Show more"}</p>
            <ChevronDown
              className={`size-4 transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </AppButton>
        </div>
      )}
      {!isExpanded && isOverflowing && (
        <div className="overlay absolute bottom-0 left-0 right-0 h-28 bg-linear-to-t from-30% from-white to-100% to-transparent pointer-events-none" />
      )}
    </div>
  );
}
