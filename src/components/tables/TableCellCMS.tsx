"use client";
import { HTMLAttributes, ReactNode } from "react";

interface TableCellCMSProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export default function TableCellCMS({
  children,
  className,
  ...props
}: TableCellCMSProps) {
  return (
    <td
      className={`p-2 font-bodycopy font-medium text-sm align-middle ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}
