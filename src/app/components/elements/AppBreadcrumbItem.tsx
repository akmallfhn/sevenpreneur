"use client";
import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

interface AppBreadcrumbItemProps {
  href: string;
  isCurrentPage?: boolean;
  children: ReactNode;
}

export default function AppBreadcrumbItem({
  href,
  isCurrentPage = false,
  children,
}: AppBreadcrumbItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center font-bodycopy text-sm ${
        isCurrentPage ? "text-black" : ""
      }`}
    >
      {children}
    </Link>
  );
}
