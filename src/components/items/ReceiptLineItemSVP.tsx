"use client";

interface ReceiptLineItemSVPProps {
  receiptName: string;
  receiptValue: number | string | undefined;
  isDiscount?: boolean;
  isGrandTotal?: boolean;
}

export default function ReceiptLineItemSVP({
  receiptName,
  receiptValue,
  isDiscount = false,
  isGrandTotal = false,
}: ReceiptLineItemSVPProps) {
  let nameClass = "font-medium text-alternative";
  let valueClass = "font-medium";

  if (isDiscount) {
    nameClass = "font-bold text-primary";
    valueClass = "font-bold text-primary";
  }

  if (isGrandTotal) {
    nameClass = "font-bold text-black";
    valueClass = "font-bold";
  }

  return (
    <div className="line-item flex items-center justify-between">
      <p className={`font-bodycopy text-sm ${nameClass}`}>{receiptName}</p>
      <p
        className={`font-bodycopy text-sm text-right dark:text-alternative ${valueClass}`}
      >
        {receiptValue}
      </p>
    </div>
  );
}
