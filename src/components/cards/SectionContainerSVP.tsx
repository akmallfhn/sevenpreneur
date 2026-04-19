"use client";
import { ReactNode } from "react";

interface SectionContainerSVPProps {
  sectionName: string;
  hasNoSign?: boolean;
  children: ReactNode;
}

export default function SectionContainerSVP(props: SectionContainerSVPProps) {
  return (
    <div className="section-container relative flex flex-col bg-background gap-4 p-5 border rounded-lg overflow-hidden dark:bg-sevenpreneur-surface-black lg:p-6">
      {!props.hasNoSign && (
        <div className="section-sign absolute w-1.5 h-7 bg-secondary left-0 top-5 rounded-r-full rounded-l-xs lg:top-6" />
      )}
      <h2 className="section-title font-bodycopy text-sevenpreneur-surface-black font-bold text-xl dark:text-white lg:text-[21px]">
        {props.sectionName}
      </h2>
      <hr className="border-t" />
      {props.children}
    </div>
  );
}
