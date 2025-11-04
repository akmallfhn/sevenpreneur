"use client";
import Link from "next/link";

interface SidebarAIResultItemLMSProps {
  aiResultId: number;
  aiResultName: string;
}

export default function SidebarAIResultItemLMS({
  aiResultId,
  aiResultName,
}: SidebarAIResultItemLMSProps) {
  return (
    <Link
      href={"/"}
      className={`sidebar-menu-item relative flex items-center p-2 px-2.5 font-medium gap-4 w-full rounded-md overflow-hidden transition transform shrink-0 active:scale-95 hover:bg-black/5`}
    >
      <p className="ai-result font-bodycopy text-sm line-clamp-1">
        {aiResultName}
      </p>
    </Link>
  );
}
