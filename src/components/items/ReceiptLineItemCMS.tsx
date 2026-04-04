"use client";

interface ReceiptLineItemCMSProps {
  receiptName: string;
  receiptValue: number | string | undefined;
  isDiscount?: boolean;
  isGrandTotal?: boolean;
}

export default function ReceiptLineItemCMS({
  receiptName,
  receiptValue,
  isDiscount = false,
  isGrandTotal = false,
}: ReceiptLineItemCMSProps) {
  let nameClass = "text-alternative";
  let valueClass = "font-medium";

  if (isDiscount) {
    nameClass = "font-bold text-cms-primary";
    valueClass = "font-bold text-cms-primary";
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
