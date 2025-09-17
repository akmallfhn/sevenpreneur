"use client";
import { rupiahCurrency } from "@/lib/rupiah-currency";

interface RadioBoxPriceTierSVPProps {
  productName: string;
  priceTierName: string;
  priceTierAmount: number;
  value: number;
  selectedValue: number;
  onChange: (value: number) => void;
}

export default function RadioBoxPriceTierSVP({
  productName,
  priceTierName,
  priceTierAmount,
  value,
  selectedValue,
  onChange,
}: RadioBoxPriceTierSVPProps) {
  const isSelected = selectedValue === value;

  return (
    <label
      className={`flex p-3 px-5 gap-4 border rounded-md justify-between ${
        isSelected ? "bg-[#F2F8FF] border-primary" : "bg-white border-outline"
      } `}
    >
      <div className="flex flex-col font-ui text-sm">
        <div className="flex flex-col">
          <p
            className={`font-bold ${
              isSelected ? "text-primary" : "text-black"
            }`}
          >
            {priceTierName}
          </p>
          <p className="text-alternative font-medium">{productName}</p>
        </div>
        <p className="text-secondary font-bold">
          {rupiahCurrency(priceTierAmount)}
        </p>
      </div>
      <input
        type="radio"
        name="price"
        value={value}
        checked={isSelected}
        onChange={() => onChange(value)}
      />
    </label>
  );
}
