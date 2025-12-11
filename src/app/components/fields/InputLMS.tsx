"use client";
import React, { InputHTMLAttributes, useState } from "react";

interface InputLMSProps extends InputHTMLAttributes<HTMLInputElement> {
  inputId: string;
  inputName?: string;
  inputType: string;
  inputPlaceholder?: string;
  characterLength?: number;
  errorMessage?: string;
  value: string;
  onInputChange?: (value: string) => void;
}

export default function InputLMS({
  inputId,
  inputName,
  inputType,
  inputPlaceholder,
  characterLength,
  errorMessage,
  value,
  onInputChange,
  required,
  ...rest
}: InputLMSProps) {
  const [textValue, setTextValue] = useState(value);
  const [internalError, setInternalError] = useState("");

  // Sync only when parent value changes AND it's different
  if (textValue !== value) {
    setTextValue(value ?? "");
  }

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
    setTextValue(newValue.slice(0, maxLength));
    if (onInputChange) onInputChange(newValue.slice(0, maxLength));
  };

  // Reset internalError if get any errorMessage from parent
  if (errorMessage && internalError !== "") {
    setInternalError("");
  }

  // Compute error (parent > internal)
  const computedError = errorMessage || internalError;

  return (
    <div className="input-box flex flex-col gap-1">
      {inputName && (
        <label
          htmlFor={inputId}
          className="label-input flex pl-1 gap-0.5 text-[15px] text-[#333333] font-bodycopy font-semibold"
        >
          {inputName}
          {required && (
            <span className="label-required text-destructive">*</span>
          )}
        </label>
      )}

      <div className="input-container relative w-full">
        <input
          id={inputId}
          type={inputType}
          placeholder={inputPlaceholder}
          {...rest}
          className={`input-placeholder w-full min-h-0 h-auto p-2 pt-1 bg-white font-medium font-bodycopy text-[15px] border-b-2 resize-none transform transition-all overflow-hidden placeholder:text-alternative placeholder:font-medium placeholder:text-sm invalid:border-destructive required:border-destructive focus:outline-none focus:ring-0 focus:border-primary-deep ${
            computedError ? "border-destructive" : "border-outline"
          }`}
          value={textValue}
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
