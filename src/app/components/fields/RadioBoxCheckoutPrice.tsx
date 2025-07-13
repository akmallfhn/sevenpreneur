"use client";

import { RupiahCurrency } from "@/lib/rupiah-currency";

interface RadioBoxCheckoutPriceProps {
  radioName: string;
  radioCohortName: string;
  radioPrice: number;
  value: number;
  selectedValue: number;
  onChange: (value: number) => void;
}

export default function RadioBoxCheckoutPrice({
  radioName,
  radioCohortName,
  radioPrice,
  value,
  selectedValue,
  onChange,
}: RadioBoxCheckoutPriceProps) {
  const isSelected = selectedValue === value;

  return (
    <label
      className={`flex p-3 px-5 gap-4 border rounded-md justify-between ${
        isSelected ? "bg-[#F2F8FF] border-primary" : "bg-white border-outline"
      } `}
    >
      <div className="flex flex-col font-ui">
        <div className="flex flex-col">
          <p
            className={`font-bold ${
              isSelected ? "text-primary" : "text-black"
            }`}
          >
            {radioName}
          </p>
          <p className="text-alternative text-sm font-medium">
            {radioCohortName}
          </p>
        </div>
        <p className="text-secondary font-bold">{RupiahCurrency(radioPrice)}</p>
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
