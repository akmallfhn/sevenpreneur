"use client";
import Link from "next/link";
import { ReactNode } from "react";

interface AppBreadcrumbItemProps {
  href?: string;
  isCurrentPage?: boolean;
  children: ReactNode;
}

export default function AppBreadcrumbItem({
  href,
  isCurrentPage = false,
  children,
}: AppBreadcrumbItemProps) {
  if (isCurrentPage || !href) {
    return (
      <span className="items-center font-bodycopy text-[13px] font-semibold">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="items-center font-bodycopy text-[13px] max-w-40 line-clamp-1 hover:underline underline-offset-2"
    >
      {children}
    </Link>
  );
}
