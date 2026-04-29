"use client";
import { PlatformType } from "@/lib/app-types";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const varianStyles: Record<
  PlatformType,
  {
    focus: string;
    border: string;
    background: string;
    disabled: string;
    dropdown: string;
    itemActive: string;
    itemHover: string;
  }
> = {
  SVP: {
    focus:
      "outline-4 outline-primary/15 border-primary dark:border-surface-black dark:outline-outline-dark",
    border: "border",
    background: "bg-white dark:bg-[#2C2C2C]",
    disabled: "bg-gray-100 text-gray-500 dark:bg-[#1F1F1F] dark:text-[#555555]",
    dropdown: "bg-white border dark:bg-[#2C2C2C]",
    itemActive: "bg-[#E1EDFF] text-primary dark:bg-white/5 dark:text-white",
    itemHover:
      "hover:bg-[#E1EDFF] hover:text-primary dark:hover:bg-white/5 dark:hover:text-white",
  },
  LMS: {
    focus: "outline-4 outline-tertiary/15 border-tertiary",
    border: "border border-dashboard-border",
    background: "bg-card-inside-bg",
    disabled: "bg-card-inside-bg text-muted-foreground dark:text-foreground/30",
    dropdown: "bg-card-bg border border-dashboard-border",
    itemActive:
      "bg-tertiary/5 text-tertiary dark:text-white dark:bg-card-inside-bg",
    itemHover:
      "hover:bg-tertiary/5 hover:text-tertiary dark:hover:text-white dark:hover:bg-card-inside-bg",
  },
  CMS: {
    focus: "outline-4 outline-tertiary/15 border-tertiary",
    border: "border border-dashboard-border",
    background: "bg-background",
    disabled: "bg-card-inside-bg text-muted-foreground dark:text-foreground/30",
    dropdown: "bg-card-bg border border-dashboard-border",
    itemActive:
      "bg-tertiary/5 text-tertiary dark:text-white dark:bg-card-inside-bg",
    itemHover:
      "hover:bg-tertiary/5 hover:text-tertiary dark:hover:text-white dark:hover:bg-card-inside-bg",
  },
  AILENE: {
    focus: "outline-4 outline-tertiary/15 border-tertiary",
    border: "border border-dashboard-border",
    background: "bg-card-inside-bg",
    disabled: "bg-card-inside-bg text-muted-foreground dark:text-foreground/30",
    dropdown: "bg-card-bg border border-dashboard-border",
    itemActive:
      "bg-tertiary/5 text-tertiary dark:text-white dark:bg-card-inside-bg",
    itemHover:
      "hover:bg-tertiary/5 hover:text-tertiary dark:hover:text-white dark:hover:bg-card-inside-bg",
  },
};

export interface OptionType {
  label: string;
  value: string | number | null;
  image?: string;
}

interface AppSelectProps {
  selectId: string;
  selectName?: string;
  selectIcon?: React.ReactNode;
  selectPlaceholder: string;
  value: string | number | null;
  variant: PlatformType;
  onChange?: (value: string | number | null) => void;
  disabled?: boolean;
  required?: boolean;
  options?: OptionType[];
  onOpenChange?: (open: boolean) => void;
}

export default function AppSelect({
  selectId,
  selectName,
  selectIcon,
  selectPlaceholder,
  value,
  variant,
  onChange,
  disabled,
  required,
  options = [],
  onOpenChange,
}: AppSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const styles = varianStyles[variant];

  // Sent open state to parent
  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  // Handle click outside container
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

  // Finding selected value in Array dropdown
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="select-box flex flex-col gap-1" ref={containerRef}>
      {selectName && (
        <label
          htmlFor={selectId}
          className="select-label flex pl-1 gap-0.5 text-sm text-sb-text-strong font-bodycopy font-semibold"
        >
          {selectName}
          {required && (
            <span className="label-required text-destructive">*</span>
          )}
        </label>
      )}

      <div
        className={`select-container relative flex w-full p-2 font-bodycopy font-medium text-sm rounded-md transform transition-all ${styles.border} ${
          isOpen ? styles.focus : ""
        } ${
          disabled
            ? `${styles.disabled} cursor-not-allowed`
            : `${styles.background} cursor-pointer`
        } ${selectIcon ? "pl-10" : ""}`}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
      >
        {selectIcon && (
          <div className="select-icon absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-emphasis">
            {selectIcon}
          </div>
        )}
        <div className="selected-value flex items-center gap-2 truncate">
          {selectedOption?.image && (
            <div className="select-option-image flex aspect-square size-5 rounded-full overflow-hidden">
              <Image
                className="object-cover w-full h-full"
                src={selectedOption.image}
                alt={selectedOption.label}
                width={100}
                height={100}
              />
            </div>
          )}
          <span
            className={`selected-option-placeholder block truncate text-sm font-medium ${
              selectedOption ? "" : "text-emphasis"
            }`}
          >
            {selectedOption?.label || selectPlaceholder}
          </span>
        </div>

        {!disabled && (
          <div className="dropdown-icon absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-[#616F86]">
            <ChevronDown className="size-5" />
          </div>
        )}

        {isOpen && !disabled && (
          <div
            className={`dropdown-container absolute top-full mt-2 left-0 w-full z-30 rounded-md shadow-md overflow-hidden ${styles.dropdown}`}
          >
            <ul className="dropdown-options flex flex-col text-sm font-bodycopy font-medium max-h-60 overflow-auto">
              {options.map((opt, index) => (
                <div
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange?.(opt.value);
                    setIsOpen(false);
                  }}
                  className={`dropdown-item-container flex items-center gap-2 px-3 py-2 cursor-pointer ${styles.itemHover} ${
                    value === opt.value ? styles.itemActive : ""
                  }`}
                >
                  {opt.image && (
                    <div className="dropdown-item-image flex aspect-square size-[26px] rounded-full overflow-hidden">
                      <Image
                        className="object-cover w-full h-full"
                        src={opt.image}
                        alt={opt.label}
                        width={100}
                        height={100}
                      />
                    </div>
                  )}
                  <li className="dropdown-item-label">{opt.label}</li>
                </div>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
