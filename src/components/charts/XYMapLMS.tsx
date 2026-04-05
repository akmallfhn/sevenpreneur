"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { scaleToPercent } from "@/lib/convert-number";
import { Star } from "lucide-react";

export interface CompetitorList {
  name: string;
  company_url: string;
  key_strength: string;
  market_score: number;
  position: {
    x: number;
    y: number;
  };
}

interface XYMapLMSProps {
  competitorList: CompetitorList[];
  productName: string;
  productXPosition: number;
  productYPosition: number;
  xLeftAttribute: string;
  xRightAttribute: string;
  yTopAttribute: string;
  yBottomAttribute: string;
}

export default function XYMapLMS(props: XYMapLMSProps) {
  return (
    <div className="brand-positioning flex flex-col gap-2 w-full bg-white p-5 rounded-lg border overflow-hidden">
      <h3 className="section-title text-lg font-bold font-bodycopy">
        Brand Positioning
      </h3>
      <div className="x/y-map relative flex w-full h-96">
        <p className="x-left absolute flex-wrap top-3/5 -translate-y-3/5 left-0 z-20 font-bodycopy font-medium text-[#111111] text-sm bg-white">
          {props.xLeftAttribute}
        </p>
        <p className="x-right absolute flex-wrap top-3/5 -translate-y-3/5 right-0 z-20 font-bodycopy font-medium text-[#111111] text-sm bg-white">
          {props.xRightAttribute}
        </p>
        <p className="y-top absolute flex-wrap left-1/2 -translate-x-1/2 top-0 z-20 font-bodycopy font-medium text-[#111111] text-sm bg-white">
          {props.yTopAttribute}
        </p>
        <p className="y-bottom absolute flex-wrap left-1/2 -translate-x-1/2 bottom-0 z-20 font-bodycopy font-medium text-[#111111] text-sm bg-white">
          {props.yBottomAttribute}
        </p>
        <div className="x/y-curve relative flex w-full h-full">
          {props.competitorList.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <div
                  key={item.name}
                  className="competitor-item absolute w-3 h-3 bg-primary outline-4 outline-primary-light/70 rounded-full z-10"
                  style={{
                    left: `${scaleToPercent(item.position.x)}%`,
                    top: `${100 - scaleToPercent(item.position.y)}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="competitor-name max-w-[120px] text-center font-bodycopy">
                  {item.name}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
          <Tooltip>
            <TooltipTrigger asChild>
              <Star
                fill="#FFB21D"
                stroke="#FFF3DB"
                className="user-product-item absolute size-7 z-10"
                style={{
                  left: `${scaleToPercent(props.productXPosition)}%`,
                  top: `${100 - scaleToPercent(props.productYPosition)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="user-product-name max-w-[120px] text-center font-bodycopy">
                {props.productName}
              </p>
            </TooltipContent>
          </Tooltip>
          <div className="y-axis absolute flex w-[1px] h-full left-1/2 -translate-x-1/2 self-stretch bg-outline" />
          <hr className="x-axis absolute flex w-full top-1/2 -translate-y-1/2 border-b border-outline" />
        </div>
      </div>
    </div>
  );
}
