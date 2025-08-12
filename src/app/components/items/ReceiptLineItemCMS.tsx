"use client";

interface ReceiptLineItemCMSProps {
  receiptName: string;
  receiptValue: number | string | undefined;
}

export default function ReceiptLineItemCMS({
  receiptName,
  receiptValue,
}: ReceiptLineItemCMSProps) {
  return (
    <div className="line-item flex items-center justify-between">
      <p className="font-bodycopy font-medium text-alternative text-sm">
        {receiptName}
      </p>
      <p className="font-bodycopy font-semibold text-sm text-right dark:text-alternative">
        {receiptValue}
      </p>
    </div>
  );
}
