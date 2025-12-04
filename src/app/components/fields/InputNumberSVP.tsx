"use client";
import { NumberConfig } from "@/lib/app-types";
import React, { useState, useEffect, InputHTMLAttributes } from "react";

export const NumberVariant: Record<
  NumberConfig,
  {
    sanitize: (raw: string) => string;
    pattern: string;
    mode: "numeric" | "decimal";
  }
> = {
  numeric: {
    mode: "numeric",
    pattern: "[0-9]*",
    sanitize: (raw) =>
      raw
        .replace(/\D/g, "") // only number
        .replace(/^0+/, ""), // remove leading zero
  },
  decimal: {
    mode: "decimal",
    pattern: "^[0-9]*[.,]?[0-9]*$",
    sanitize: (raw) =>
      raw
        .replace(/[^0-9.,]/g, "") // allow number + coma + dot
        .replace(/,/g, ".") // normalize comma into dot
        .replace(/(\..*)\./g, "$1"), // only 1 dot
  },
};

interface InputNumberSVPProps extends InputHTMLAttributes<HTMLInputElement> {
  inputId: string;
  inputName?: string;
  inputIcon?: string;
  inputConfig: NumberConfig;
  inputPlaceholder?: string;
  characterLength?: number;
  errorMessage?: string;
  value: string;
  onInputChange?: (value: string) => void;
}

export default function InputNumberSVP({
  inputId,
  inputName,
  inputIcon,
  inputConfig,
  inputPlaceholder,
  characterLength,
  errorMessage,
  onInputChange,
  value: propValue,
  disabled,
  required,
  ...rest
}: InputNumberSVPProps) {
  const [value, setValue] = useState(propValue);
  const [internalError, setInternalError] = useState("");
  const maxLength = characterLength ?? 60;
  const characterLimitErrorMessage =
    "Oops, you’ve reached the character limit.";

  const { mode, pattern, sanitize } = NumberVariant[inputConfig];

  // Character Limitation on Input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;

    const sanitizedValue = sanitize(rawValue).slice(0, maxLength);

    if (rawValue.length > maxLength) {
      setInternalError(characterLimitErrorMessage);
    } else {
      setInternalError("");
    }
    setValue(sanitizedValue);
    if (onInputChange) onInputChange(sanitizedValue);
  };

  // Sync on value change
  useEffect(() => {
    setValue(propValue || "");
  }, [propValue]);

  // Reset internalError if get any errorMessage from parent
  useEffect(() => {
    if (errorMessage) {
      setInternalError("");
    }
  }, [errorMessage]);

  // Compute error (parent > internal)
  const computedError = errorMessage || internalError;

  return (
    <div className="input-box flex flex-col gap-1">
      {inputName && (
        <label
          htmlFor={inputId}
          className="label-input flex pl-1 gap-0.5 text-sm font-bodycopy font-semibold"
        >
          {inputName}
          {required && (
            <span className="label-required text-destructive">*</span>
          )}
        </label>
      )}

      <div className="input-container relative ">
        {inputIcon && (
          <div className="input-icon absolute left-0 flex items-center p-[9px] pl-3 gap-1 pointer-events-none text-alternative">
            <p className="input-emoji text-sm">{inputIcon}</p>
          </div>
        )}
        <input
          id={inputId}
          type="text"
          inputMode={mode}
          pattern={pattern}
          placeholder={inputPlaceholder}
          className={`input-placeholder flex w-full p-2 bg-white font-medium font-bodycopy text-sm rounded-md border transform transition-all placeholder:text-alternative placeholder:font-medium placeholder:text-sm focus:outline-4 invalid:border-destructive required:border-destructive ${
            computedError
              ? "border-destructive focus:outline-semi-destructive"
              : "border-outline focus:outline-primary/15 focus:border-primary dark:border-outline-dark dark:focus:border-outline-dark dark:focus:outline-white/10"
          } ${
            disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-[#1F1F1F] dark:text-[#555555]"
              : "bg-white dark:bg-[#2C2C2C]"
          } ${inputIcon ? "pl-16" : ""} `}
          value={value}
          onChange={handleInputChange}
          {...rest}
          suppressHydrationWarning
        />
        {computedError && (
          <p className="input-error-message inline-flex text-red-600 text-xs font-bodycopy">
            {computedError}
          </p>
        )}
      </div>
    </div>
  );
}
