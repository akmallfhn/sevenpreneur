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
    <div className="flex flex-col gap-2 p-3 rounded-lg border border-dashboard-border bg-gradient-to-br from-card-bg from-50% to-sb-item-hover dark:to-card-bg">
      <div className="flex items-start gap-3">
        <div
          className={`flex items-center justify-center size-10 rounded-md shrink-0 ${iconClassName ?? "bg-primary"}`}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <p className="font-bodycopy text-sm font-semibold text-emphasis leading-tight">
            {title}
          </p>
          <p className="font-bodycopy font-bold text-base text-sevenpreneur-coal dark:text-white">
            {value}
          </p>
        </div>
      </div>
      {children && <div className="w-full pt-1">{children}</div>}
    </div>
  );
}
