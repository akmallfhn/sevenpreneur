"use client";
import { HTMLAttributes, ReactNode } from "react";

interface TableBodyCMSProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export default function TableBodyCMS({
  children,
  className,
  ...props
}: TableBodyCMSProps) {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
}
