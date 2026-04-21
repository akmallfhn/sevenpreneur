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
      className={`bg-muted-background/15 border-y text-emphasis ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
}
