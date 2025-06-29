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
      className={`items-center font-bodycopy text-sm max-w-52 line-clamp-1 ${
        isCurrentPage ? "text-black font-medium" : ""
      }`}
    >
      {children}
    </Link>
  );
}
