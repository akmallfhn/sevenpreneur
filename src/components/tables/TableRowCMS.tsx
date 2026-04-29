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
      className={`border-b border-dashboard-border hover:bg-muted-background/10 transition-colors ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}
