"use client";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
      className={`breadcrumb flex text-sm font-bodycopy font-medium gap-1.5 items-center ${className}`}
    >
      <Link href={"/"} className="flex items-center gap-1.5">
        <FontAwesomeIcon icon={faHome} className="size-3" />
        <p>Home</p>
      </Link>
      {children}
    </div>
  );
}
