"use client";
import { HTMLAttributes, ReactNode } from "react";

interface TableHeaderCMSProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export default function TableHeaderCMS({
  children,
  className,
  ...props
}: TableHeaderCMSProps) {
  return (
    <thead
      className={`bg-tertiary-muted/10 dark:bg-sb-bg border-y border-dashboard-border text-emphasis ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
}
