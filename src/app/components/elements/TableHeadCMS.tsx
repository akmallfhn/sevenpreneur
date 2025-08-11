"use client";
import { HTMLAttributes, ReactNode } from "react";

interface TableHeadCMSProps extends HTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export default function TableHeadCMS({
  children,
  className,
  ...props
}: TableHeadCMSProps) {
  return (
    <th
      className={`h-10 px-2 py-2 font-semibold font-bodycopy text-left text-sm align-middle whitespace-nowrap`}
      {...props}
    >
      {children}
    </th>
  );
}
