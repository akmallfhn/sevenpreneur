"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarAIResultItemLMSProps {
  aiResultId: string;
  aiResultName?: string;
  aiToolSlug: string;
}

export default function SidebarAIResultItemLMS({
  aiResultId,
  aiResultName,
  aiToolSlug,
}: SidebarAIResultItemLMSProps) {
  const pathname = usePathname();
  const isActive =
    pathname.includes(`/${aiToolSlug}/`) && pathname.includes(`/${aiResultId}`);

  return (
    <Link
      href={`/ai/${aiToolSlug}/${aiResultId}`}
      className={`sidebar-menu-item relative flex items-center p-2 px-2.5 font-medium gap-4 w-full rounded-md overflow-hidden transition transform shrink-0 active:scale-95 hover:bg-black/5 ${
        isActive ? "bg-black/5" : ""
      }`}
    >
      <p className="ai-result font-bodycopy text-sm line-clamp-1">
        {aiResultName}
      </p>
    </Link>
  );
}
