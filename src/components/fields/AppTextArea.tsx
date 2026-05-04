"use client";
import { PlatformType } from "@/lib/app-types";
import React, { TextareaHTMLAttributes, useState } from "react";

const variantStyles: Record<
  PlatformType,
  {
    focus: string;
    border: string;
    background: string;
    disabled: string;
  }
> = {
  SVP: {
    focus: "focus:outline-primary/15 focus:border-primary",
    border: "border",
    background: "bg-transparent",
    disabled: "bg-gray-100 text-gray-500 dark:bg-[#1F1F1F] dark:text-[#555555]",
  },
  LMS: {
    focus: "focus:outline-tertiary/15 focus:border-tertiary",
    border: "border border-dashboard-border",
    background: "bg-card-inside-bg",
    disabled: "bg-card-inside-bg text-muted-foreground dark:text-foreground/30",
  },
  CMS: {
    focus: "focus:outline-tertiary/15 focus:border-tertiary",
    border: "border border-dashboard-border",
    background: "bg-background",
    disabled: "bg-card-inside-bg text-muted-foreground dark:text-foreground/30",
  },
  AILENE: {
    focus: "focus:outline-tertiary/15 focus:border-tertiary",
    border: "border border-dashboard-border",
    background: "bg-card-inside-bg",
    disabled: "bg-card-inside-bg text-muted-foreground dark:text-foreground/30",
  },
};

interface AppTextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  textAreaId: string;
  textAreaName?: string;
  textAreaHeight?: string;
  textAreaPlaceholder?: string;
  characterLength?: number;
  errorMessage?: string;
  value: string;
  variant: PlatformType;
  onTextAreaChange?: (value: string) => void;
}

export default function AppTextArea({
  textAreaId,
  textAreaName,
  textAreaHeight,
  textAreaPlaceholder,
  characterLength,
  errorMessage,
  value,
  variant,
  onTextAreaChange,
  required,
  disabled,
  ...rest
}: AppTextAreaProps) {
  const [textValue, setTextValue] = useState(value);
  const [internalError, setInternalError] = useState("");
  const styles = variantStyles[variant];

  // Sync only when parent value changes AND it's different
  if (textValue !== value) {
    setTextValue(value ?? "");
  }

  const maxLength = characterLength ?? 520;
  const characterLimitErrorMessage =
    "Oops, you've reached the character limit.";

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
      {textAreaName && (
        <label
          htmlFor={textAreaId}
          className="label-text-area flex pl-1 gap-0.5 text-sm text-sb-text-strong font-bodycopy font-semibold"
        >
          {textAreaName}
          {required && (
            <span className="label-required text-destructive">*</span>
          )}
        </label>
      )}

      <div className="text-area-container relative">
        <textarea
          id={textAreaId}
          placeholder={textAreaPlaceholder}
          {...rest}
          className={`text-area-placeholder flex w-full p-2 ${textAreaHeight} font-medium font-bodycopy text-sm rounded-md resize-none transform transition-all placeholder:text-emphasis/60 placeholder:font-medium placeholder:text-sm focus:outline-4 invalid:border-destructive required:border-destructive ${styles.border} ${
            computedError
              ? "border-destructive focus:outline-semi-destructive"
              : styles.focus
          } ${
            disabled
              ? `${styles.disabled} cursor-not-allowed`
              : styles.background
          }`}
          value={textValue}
          onChange={handleTextAreaChange}
          disabled={disabled}
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
