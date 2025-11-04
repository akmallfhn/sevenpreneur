"use client";
import { Atom, Boxes, Drone } from "lucide-react";
import Link from "next/link";

interface AIItemCardLMS {
  aiId: number;
  aiName: string;
  aiSlug: string;
  aiDescriptions: string | null;
}

export default function AIItemCardLMS({
  aiId,
  aiName,
  aiSlug,
  aiDescriptions,
}: AIItemCardLMS) {
  let aiIcon;
  if (aiSlug === "idea-generation") {
    aiIcon = <Boxes className="size-7 text-primary-dark" />;
  } else if (aiSlug === "market-size") {
    aiIcon = <Drone className="size-7 text-primary-dark" />;
  } else {
    aiIcon = <Atom className="size-7" />;
  }

  return (
    <Link
      href={`/ai/${aiId}/${aiSlug}`}
      className="ai-item-container flex flex-col w-full gap-2 p-3 bg-white border border-outline rounded-lg overflow-hidden transition transform active:scale-95"
    >
      <div className="ai-icon flex items-center justify-center size-20 border rounded-lg">
        {aiIcon}
      </div>
      <div className="ai-attributes relative flex flex-col gap-1 font-bodycopy">
        <h3 className="ai-name text-base font-bold line-clamp-1 2xl:text-lg">
          {aiName}
        </h3>
        <p className="ai-description text-sm text-[#333333]/80 font-medium line-clamp-2">
          {aiDescriptions}
        </p>
      </div>
    </Link>
  );
}
