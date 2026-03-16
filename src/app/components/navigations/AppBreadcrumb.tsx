"use client";
import Link from "next/link";
import { HTMLAttributes, ReactNode } from "react";

interface AppBreadcrumbProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export default function AppBreadcrumb({
  children,
  className,
}: AppBreadcrumbProps) {
  return (
    <div
      className={`breadcrumb flex text-[13px] font-bodycopy font-medium gap-1.5 items-center ${className}`}
    >
      <Link
        href={"/"}
        className="flex items-center gap-1.5 hover:underline underline-offset-2"
      >
        <p>Home</p>
      </Link>
      {children}
    </div>
  );
}
