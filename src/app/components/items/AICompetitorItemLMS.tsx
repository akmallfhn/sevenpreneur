"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import AppButton from "../buttons/AppButton";

interface AICompetitorItemLMSProps {
  leaderboardIndex: number;
  competitorName: string;
  competitorURL: string;
  competitorScore: number;
  competitorKeyStrength: string;
}

export default function AICompetitorItemLMS(props: AICompetitorItemLMSProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  let leaderboardIcon = "";
  let containerBg = "bg-white";

  if (props.leaderboardIndex === 1) {
    leaderboardIcon =
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/medal-gold.png";
    containerBg =
      "bg-linear-to-r from-0% from-[#FEF9EB] via-40% via-[#FCF3D6] to-100% to-white";
  } else if (props.leaderboardIndex === 2) {
    leaderboardIcon =
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/medal-silver.png";
    containerBg =
      "bg-linear-to-r from-0% from-[#F3F3F3] via-40% via-[#F3F3F3] to-100% to-white";
  } else if (props.leaderboardIndex === 3) {
    leaderboardIcon =
      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/medal-bronze.png";
    containerBg =
      "bg-linear-to-r from-0% from-[#ECE3D4] via-40% via-[#F7F3ED] to-100% to-white";
  }

  return (
    <div
      className={`competitor-box flex flex-col p-3 rounded-lg border border-outline overflow-hidden transition-all duration-300 ${containerBg} ${
        isExpanded ? "gap-3" : "gap-0"
      }`}
    >
      <div className={`visible flex justify-between items-center gap-3`}>
        <div className="competitor-container flex items-center gap-3">
          <div className="leaderboard-index flex w-8 justify-center items-center shrink-0">
            {props.leaderboardIndex > 3 ? (
              <p className="font-bodycopy text-[#111111] font-medium">
                {props.leaderboardIndex}
              </p>
            ) : (
              <Image
                className="object-cover w-full h-full"
                src={leaderboardIcon}
                alt="leaderboard-icon"
                width={100}
                height={100}
              />
            )}
          </div>
          <div className="competitor-attributes flex flex-col">
            <h4 className="competitor-name font-bodycopy font-semibold text-[#111111] text-[15px] line-clamp-1">
              {props.competitorName}
            </h4>
            <a
              href={props.competitorURL}
              className="competitor-url flex items-center gap-1"
              target="__blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="size-3 text-[#111111]/80" />
              <p className="competitor-url font-bodycopy text-sm text-[#111111]/80 hover:underline hover:underline-offset-2">
                {props.competitorURL}
              </p>
            </a>
          </div>
        </div>
        <div className="w-fit shrink-0">
          <AppButton
            onClick={() => setIsExpanded((prev) => !prev)}
            variant="outline"
            size="small"
          >
            {isExpanded ? "Hide Details" : "More Details"}
          </AppButton>
        </div>
      </div>
      <div
        className={`competitor-details flex flex-col gap-3 transition-all duration-300 overflow-hidden ${
          isExpanded
            ? "max-h-[2000px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <p className="market-score flex flex-col font-bodycopy font-medium text-[#333333] text-[15px]">
          <b>Market Score:</b>
          <div className="competitor-score flex w-fit items-center gap-2 bg-white py-1 px-2 border border-outline rounded-md shrink-0">
            <div className="flex size-1.5 bg-alternative rounded-full" />
            <p className="text-sm font-bodycopy font-medium">
              {props.competitorScore}/100
            </p>
          </div>
        </p>
        <p className="key-strength flex flex-col font-bodycopy font-medium text-[#333333] text-[15px]">
          <b>Key Strength:</b>
          {props.competitorKeyStrength}
        </p>
      </div>
    </div>
  );
}
