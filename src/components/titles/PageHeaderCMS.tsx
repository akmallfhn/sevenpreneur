"use client";

import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderCMSProps {
  name: string;
  desc?: string;
  icon: LucideIcon;
  children?: ReactNode;
}

export default function PageHeaderCMS({
  name,
  desc,
  icon: Icon,
  children,
}: PageHeaderCMSProps) {
  return (
    <div className="page-header flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center size-11 rounded-md bg-tertiary flex-shrink-0">
          <Icon className="size-7 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-bodycopy font-bold text-lg leading-snug dark:text-sevenpreneur-white lg:text-2xl">
            {name}
          </h1>
          {desc && (
            <p className="font-bodycopy font-medium text-sm text-emphasis max-w-[420px]">
              {desc}
            </p>
          )}
        </div>
      </div>
      {children && (
        <div className="page-header-actions flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
