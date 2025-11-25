"use client";
import { Lightbulb } from "lucide-react";

interface AppCalloutBoxProps {
  calloutTitle: string;
  calloutContent: string;
}

export default function AppCalloutBox({
  calloutTitle,
  calloutContent,
}: AppCalloutBoxProps) {
  return (
    <div className="callout-box-container flex p-4 border border-primary-light bg-linear-to-br from-0% from-[#D2E5FC] to-40% to-white rounded-lg font-bodycopy font-medium text-[15px] text-[#333333]">
      <div className="callout flex flex-col gap-2">
        <div className="callout-attributes flex items-center gap-1 text-primary">
          <Lightbulb className="size-5" />
          <h4 className="callout-name font-bold text-base">{calloutTitle}</h4>
        </div>
        <p>{calloutContent}</p>
      </div>
    </div>
  );
}
