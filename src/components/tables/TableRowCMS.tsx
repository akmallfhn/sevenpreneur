"use client";
import { HTMLAttributes, ReactNode } from "react";

interface TableRowCMSProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

export default function TableRowCMS({
  children,
  className,
  ...props
}: TableRowCMSProps) {
  return (
    <tr
      className={`border-b border-dashboard-border hover:bg-tertiary-muted/[0.08] dark:hover:bg-sb-item-hover/50 transition-colors ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}
