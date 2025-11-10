"use client";
import React, { useState, useEffect, InputHTMLAttributes } from "react";

interface InputCMSProps extends InputHTMLAttributes<HTMLInputElement> {
  inputId: string;
  inputName?: string;
  inputType: string;
  inputIcon?: React.ReactNode;
  inputPlaceholder?: string;
  characterLength?: number;
  errorMessage?: string;
  value: string;
  onInputChange?: (value: string) => void;
}

export default function InputCMS({
  inputId,
  inputName,
  inputType,
  inputIcon,
  inputPlaceholder,
  characterLength,
  errorMessage,
  value: propValue,
  onInputChange,
  required,
  ...rest
}: InputCMSProps) {
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
      {inputName && (
        <label
          htmlFor={inputId}
          className="label-input flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
        >
          {inputName}
          {required && (
            <span className="label-required text-destructive">*</span>
          )}
        </label>
      )}

      <div className="input-container relative">
        {inputIcon && (
          <div className="input-icon absolute left-0 flex items-center p-[9px] pl-3 pointer-events-none text-alternative">
            {inputIcon}
          </div>
        )}
        <input
          id={inputId}
          type={inputType}
          placeholder={inputPlaceholder}
          {...rest}
          className={`input-placeholder flex w-full p-2 bg-white font-medium font-bodycopy text-sm rounded-md border transform transition-all placeholder:text-alternative placeholder:font-medium placeholder:text-sm focus:outline-4 invalid:border-destructive required:border-destructive ${
            computedError
              ? "border-destructive focus:outline-semi-destructive"
              : "border-outline focus:outline-primary/15 focus:border-cms-primary"
          } ${inputIcon ? "pl-10" : ""} `}
          value={value}
          onChange={handleInputChange}
          suppressHydrationWarning
        />
        {computedError && (
          <p className="input-error-message inline-flex text-red-600 text-xs">
            {computedError}
          </p>
        )}
      </div>
    </div>
  );
}
