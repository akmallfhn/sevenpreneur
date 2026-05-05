import { ReactNode } from "react";

interface SectionContainerCMSProps {
  title: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function SectionContainerCMS({
  title,
  headerAction,
  children,
  className,
}: SectionContainerCMSProps) {
  return (
    <div
      className={`flex flex-col gap-3 p-4 bg-card-bg border border-dashboard-border rounded-lg ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bodycopy font-bold text-foreground dark:text-sevenpreneur-white">
          {title}
        </h2>
        {headerAction}
      </div>
      {children}
    </div>
  );
}
