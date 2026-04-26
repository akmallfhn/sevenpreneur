import { ReactNode } from "react";

interface AppScorecardDashboardProps {
  title: string;
  value: ReactNode;
  icon: ReactNode;
  iconClassName?: string;
  children?: ReactNode;
}

export default function AppScorecardDashboard({
  title,
  value,
  icon,
  iconClassName,
  children,
}: AppScorecardDashboardProps) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg border border-sb-border bg-gradient-to-br from-card-bg to-sb-item-hover dark:to-card-bg">
      <div className="flex items-start gap-3">
        <div
          className={`flex items-center justify-center size-9 rounded-md shrink-0 ${iconClassName ?? "bg-primary"}`}
        >
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bodycopy text-xs font-semibold text-emphasis">
            {title}
          </p>
          <p className="font-bodycopy font-bold text-base text-sevenpreneur-coal dark:text-white">
            {value}
          </p>
        </div>
      </div>
      {children && <div className="w-full">{children}</div>}
    </div>
  );
}
