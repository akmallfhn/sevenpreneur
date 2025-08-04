"use client";
import React, { useState, useEffect } from "react";

interface InternationalPhoneNumberInputSVPProps {
  inputId: string;
  inputName: string;
  inputIcon: string;
  inputCountryCode: string;
  inputPlaceholder?: string;
  errorMessage?: string;
  onInputChange?: (value: string) => void;
  value: string;
  disabled?: boolean;
  required?: boolean;
}

export default function InternationalPhoneNumberInputSVP({
  inputId,
  inputName,
  inputIcon,
  inputCountryCode,
  inputPlaceholder,
  errorMessage,
  onInputChange,
  value: propValue,
  disabled,
  required,
}: InternationalPhoneNumberInputSVPProps) {
  // --- Declaration state
  const [value, setValue] = useState(propValue);
  const [error, setError] = useState("");
  const maxLength = 15;
  const errMsg = errorMessage ?? "Phone number must be 10 to 15 digits";

  // --- Character Limitation on Input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;

    // Sanitize: only allowed 0–9 digit
    const sanitizedValue = rawValue.replace(/\D/g, "");

    if (sanitizedValue.length > maxLength) {
      const trimmed = sanitizedValue.slice(0, maxLength);
      setError(errMsg);
      setValue(trimmed);
      if (onInputChange) onInputChange(trimmed);
      return;
    } else {
      setError("");
      setValue(sanitizedValue);
      if (onInputChange) onInputChange(sanitizedValue);
    }
  };

  // --- Sync on value change
  useEffect(() => {
    setValue(propValue || "");
  }, [propValue]);

  return (
    <div className="input-group-component flex flex-col gap-1">
      {/* --- Label */}
      <label
        htmlFor={inputId}
        className="flex pl-1 gap-0.5 text-sm font-bodycopy font-semibold"
      >
        {inputName}
        {required && <span className="text-destructive">*</span>}
      </label>

      {/* --- Input Placeholder */}
      <div className="input-container relative ">
        {inputIcon && (
          <div className="absolute left-0 flex items-center p-[9px] pl-3 gap-1 pointer-events-none text-alternative">
            <p className="text-sm">{inputIcon}</p>
            <p className="font-ui text-[13px]">+{inputCountryCode}</p>
          </div>
        )}
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          placeholder={inputPlaceholder}
          disabled={disabled}
          className={`flex w-full p-2 bg-white font-medium font-bodycopy text-sm rounded-md border transform transition-all placeholder:text-alternative placeholder:font-medium placeholder:text-sm focus:outline-4 invalid:border-destructive required:border-destructive ${
            error
              ? "border-destructive focus:outline-semi-destructive"
              : "border-outline focus:outline-primary/15 focus:border-primary dark:border-outline-dark dark:focus:border-outline-dark dark:focus:outline-white/10"
          } ${
            disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-[#1F1F1F] dark:text-[#555555]"
              : "bg-white dark:bg-[#2C2C2C]"
          } ${inputIcon ? "pl-16" : ""} `}
          value={value}
          onChange={handleInputChange}
        />
        {error && <p className="inline-flex text-red-600 text-xs">{error}</p>}
      </div>
    </div>
  );
}
