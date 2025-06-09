"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function SelectCMS({
  selectId,
  selectName,
  selectIcon,
  value,
  onChange,
  disabled = false,
  children,
}) {
  const [selectedFruit, setSelectedFruit] = useState("none");

  const handleChange = (e) => {
    setSelectedFruit(e.target.value);
  };
  return (
    <div className="select-group-component flex flex-col gap-1">
      {/* --- Label */}
      <label
        htmlFor={selectId}
        className="flex pl-1 text-sm font-bodycopy font-semibold"
      >
        {selectName}
      </label>

      {/* --- Select Placeholder */}
      <div className="select-container relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-alternative">
          {selectIcon}
        </div>
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="flex w-full p-2 pl-10 bg-white font-bodycopy text-sm rounded-lg border border-[#E3E3E3] appearance-none placeholder:text-[#616F86] placeholder:font-medium placeholder:text-sm"
        >
          {children}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#616F86]">
          <ChevronDown className="size-5" />
        </div>
      </div>
    </div>
  );
}
