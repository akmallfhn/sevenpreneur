"use client";

interface ReceiptLineItemSVPProps {
  receiptName: string;
  receiptValue: number | string | undefined;
}

export default function ReceiptLineItemSVP({
  receiptName,
  receiptValue,
}: ReceiptLineItemSVPProps) {
  return (
    <div className="line-item flex items-center justify-between">
      <p className="font-ui text-alternative text-sm">{receiptName}</p>
      <p className="font-ui font-medium text-sm text-right dark:text-alternative">
        {receiptValue}
      </p>
    </div>
  );
}
