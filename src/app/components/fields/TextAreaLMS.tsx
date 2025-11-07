"use client";
import React, { useState, useEffect, TextareaHTMLAttributes } from "react";

interface TextAreaLMSProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  textAreaId: string;
  textAreaName: string;
  textAreaHeight?: string;
  textAreaPlaceholder?: string;
  characterLength?: number;
  errorMessage?: string;
  onTextAreaChange?: (value: string) => void;
  value: string;
  disabled?: boolean;
  required?: boolean;
}

export default function TextAreaLMS({
  textAreaId,
  textAreaName,
  textAreaHeight,
  textAreaPlaceholder,
  characterLength,
  errorMessage,
  onTextAreaChange,
  value: propValue,
  disabled,
  required,
  ...rest
}: TextAreaLMSProps) {
  const [value, setValue] = useState(propValue);
  const [internalError, setInternalError] = useState("");
  const maxLength = characterLength ?? 520;
  const characterLimitErrorMessage =
    "Oops, you’ve reached the character limit.";

  // Character Limitation on Text Area
  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // Dynamic resize height text area
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;

    // Character Limitation on Text Area
    const newValue = event.target.value;
    if (newValue.length > maxLength) {
      setInternalError(characterLimitErrorMessage);
      return;
    } else {
      setInternalError("");
    }
    setValue(newValue.slice(0, maxLength));
    if (onTextAreaChange) onTextAreaChange(newValue.slice(0, maxLength));
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
    <div className="text-area-box flex flex-col gap-1">
      <label
        htmlFor={textAreaId}
        className="label-text-area flex pl-1 gap-0.5 text-[15px] text-[#333333] font-bodycopy font-semibold"
      >
        {textAreaName}
        {required && <span className="label-required text-destructive">*</span>}
      </label>

      <div className="text-area-container relative w-full">
        <textarea
          id={textAreaId}
          placeholder={textAreaPlaceholder}
          rows={1}
          disabled={disabled}
          {...rest}
          className={`text-area-placeholder flex w-full min-h-0 h-auto p-2 pt-1 bg-white font-medium font-bodycopy text-[15px] border-b-2 resize-none transform transition-all overflow-hidden placeholder:text-alternative placeholder:font-medium placeholder:text-sm invalid:border-destructive required:border-destructive focus:outline-none focus:ring-0 focus:border-primary-deep ${
            computedError ? "border-destructive" : "border-outline"
          } `}
          value={value}
          onChange={handleTextAreaChange}
        />
        {computedError && (
          <p className="text-area-error-message inline-flex text-red-600 text-xs">
            {computedError}
          </p>
        )}
      </div>
    </div>
  );
}
