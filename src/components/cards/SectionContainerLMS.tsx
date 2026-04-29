import { ReactNode } from "react";

interface SectionContainerLMSProps {
  title: string;
  children: ReactNode;
}

export default function SectionContainerLMS({
  title,
  children,
}: SectionContainerLMSProps) {
  return (
    <div className="flex flex-col gap-3 p-4 border border-dashboard-border rounded-lg bg-card-bg">
      <h3 className="font-bold font-bodycopy text-base dark:text-sevenpreneur-white">
        {title}
      </h3>
      {children}
    </div>
  );
}
