"use client";
import React, { useState, useEffect } from "react";

interface InputSVPProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputId: string;
  inputName: string;
  inputType: string;
  inputIcon?: React.ReactNode;
  inputPlaceholder?: string;
  characterLength?: number;
  errorMessage?: string;
  value: string;
  onInputChange?: (value: string) => void;
}

export default function InputSVP({
  inputId,
  inputName,
  inputType,
  inputIcon,
  inputPlaceholder,
  characterLength,
  errorMessage,
  value: propValue,
  onInputChange,
  disabled,
  required,
  ...rest
}: InputSVPProps) {
  const [value, setValue] = useState(propValue);
  const [internalError, setInternalError] = useState("");
  const maxLength = characterLength ?? 128;
  const characterLimitErrorMessage =
    "Oops, you’ve reached the character limit.";

  // Character Limitation on Input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (newValue.length > maxLength) {
      setInternalError(characterLimitErrorMessage);
    } else {
      setInternalError("");
    }
    setValue(newValue.slice(0, maxLength));
    if (onInputChange) onInputChange(newValue.slice(0, maxLength));
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
      <label
        htmlFor={inputId}
        className="label-input flex pl-1 gap-0.5 text-sm font-bodycopy font-semibold"
      >
        {inputName}
        {required && <span className="label-required text-destructive">*</span>}
      </label>

      <div className="input-container relative ">
        {inputIcon && (
          <div className="input-icon absolute left-0 flex items-center p-[9px] pl-3 pointer-events-none text-alternative">
            {inputIcon}
          </div>
        )}
        <input
          id={inputId}
          type={inputType}
          placeholder={inputPlaceholder}
          className={`input-placeholder flex w-full p-2 font-medium font-bodycopy text-sm rounded-md border transform transition-all placeholder:text-alternative placeholder:font-medium placeholder:text-sm focus:outline-4 invalid:border-destructive required:border-destructive ${
            computedError
              ? "border-destructive focus:outline-semi-destructive"
              : "border-outline focus:outline-primary/15 focus:border-primary dark:border-outline-dark dark:focus:border-outline-dark dark:focus:outline-white/10"
          } ${
            disabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-[#1F1F1F] dark:text-[#555555]"
              : "bg-white dark:bg-[#2C2C2C]"
          } ${inputIcon ? "pl-10" : ""}  `}
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
