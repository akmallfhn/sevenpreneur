"use client";
import { ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface OptionType {
  label: string;
  value: any;
}

interface SelectCMSProps {
  selectId: string;
  selectName: string;
  selectIcon?: React.ReactNode;
  selectPlaceholder: string;
  value: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
  required?: boolean;
  options?: OptionType[];
}

export default function SelectCMS({
  selectId,
  selectName,
  selectIcon,
  selectPlaceholder,
  value,
  onChange,
  disabled,
  required,
  options = [],
}: SelectCMSProps) {
  // --- State for Select
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Handle click outside container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // --- Finding selected value in Array dropdown
  const selectedLabel = options.find((opt) => opt.value === value)?.label ?? "";

  return (
    <div
      className="select-group-component flex flex-col gap-1"
      ref={containerRef}
    >
      {/* --- Label */}
      <label
        htmlFor={selectId}
        className="flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
      >
        {selectName}
        {required && <span className="text-destructive">*</span>}
      </label>

      {/* --- Select Placeholder */}
      <div
        className={`select relative flex w-full p-2 bg-white font-bodycopy font-medium text-sm rounded-md border transform transition-all ${
          isOpen
            ? "border-cms-primary outline-4 outline-primary/15"
            : "border-outline"
        } ${selectIcon ? "pl-10" : ""} ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
      >
        {/* -- Icon Select */}
        {selectIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-alternative">
            {selectIcon}
          </div>
        )}

        {/* -- Label Value */}
        <span
          className={`block truncate text-sm font-medium ${
            selectedLabel ? "" : "text-alternative"
          }`}
        >
          {selectedLabel || selectPlaceholder}
        </span>

        {/* -- Icon Dropdown */}
        {!disabled && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#616F86]">
            <ChevronDown className="size-5" />
          </div>
        )}

        {/* --- Dropdown options */}
        {isOpen && !disabled && (
          <div className="absolute top-full mt-2 left-0 w-full z-30 bg-white border border-outline rounded-md shadow-md">
            <ul className="flex flex-col text-sm font-bodycopy font-medium max-h-60 overflow-auto">
              {options.map((opt) => (
                <li
                  key={opt.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange?.(opt.value);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-[#E1EDFF] hover:text-cms-primary ${
                    value === opt.value ? "bg-[#E1EDFF] text-cms-primary" : ""
                  }`}
                >
                  {opt.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
