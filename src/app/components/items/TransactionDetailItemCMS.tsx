"use client";
import { ReactNode } from "react";

interface TransactionDetailItemCMSProps {
  itemName: string;
  children: ReactNode;
}

export default function TransactionDetailItemCMS({
  itemName,
  children,
}: TransactionDetailItemCMSProps) {
  return (
    <div className="flex flex-col gap-1.5 font-bodycopy text-sm font-medium">
      <p className="text-alternative">{itemName}</p>
      {children}
    </div>
  );
}
