"use client";
import React, { TextareaHTMLAttributes, useState } from "react";

interface TextAreaCMSProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  textAreaId: string;
  textAreaName: string;
  textAreaHeight?: string;
  textAreaPlaceholder?: string;
  characterLength?: number;
  errorMessage?: string;
  value: string;
  onTextAreaChange?: (value: string) => void;
}

export default function TextAreaCMS({
  textAreaId,
  textAreaName,
  textAreaHeight,
  textAreaPlaceholder,
  characterLength,
  errorMessage,
  value,
  onTextAreaChange,
  required,
  ...rest
}: TextAreaCMSProps) {
  const [textValue, setTextValue] = useState(value);
  const [internalError, setInternalError] = useState("");

  // Sync only when parent value changes AND it's different
  if (textValue !== value) {
    setTextValue(value ?? "");
  }

  const maxLength = characterLength ?? 520;
  const characterLimitErrorMessage =
    "Oops, you’ve reached the character limit.";

  // Character Limitation on Text Area
  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newValue = event.target.value;
    if (newValue.length > maxLength) {
      setInternalError(characterLimitErrorMessage);
      return;
    } else {
      setInternalError("");
    }
    setTextValue(newValue.slice(0, maxLength));
    if (onTextAreaChange) onTextAreaChange(newValue.slice(0, maxLength));
  };

  // Reset internalError if get any errorMessage from parent
  if (errorMessage && internalError !== "") {
    setInternalError("");
  }

  // Compute error (parent > internal)
  const computedError = errorMessage || internalError;

  return (
    <div className="text-area-box flex flex-col gap-1">
      <label
        htmlFor={textAreaId}
        className="label-text-area flex pl-1 gap-0.5 text-sm text-black font-bodycopy font-semibold"
      >
        {textAreaName}
        {required && <span className="label-required text-destructive">*</span>}
      </label>

      <div className="text-area-container relative">
        <textarea
          id={textAreaId}
          placeholder={textAreaPlaceholder}
          {...rest}
          className={`text-area-placeholder flex w-full p-2 ${textAreaHeight} bg-white font-medium font-bodycopy text-sm rounded-md border resize-none transform transition-all placeholder:text-alternative placeholder:font-medium placeholder:text-sm focus:outline-4 invalid:border-destructive required:border-destructive ${
            computedError
              ? "border-destructive focus:outline-semi-destructive"
              : "border-outline focus:outline-primary/15 focus:border-cms-primary"
          } `}
          value={textValue}
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
