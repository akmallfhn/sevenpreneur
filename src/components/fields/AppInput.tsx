"use client";
import { PlatformType } from "@/lib/app-types";
import React, { InputHTMLAttributes, useState } from "react";

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
    disabled:
      "bg-gray-100 text-gray-500  dark:bg-[#1F1F1F] dark:text-[#555555]",
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

interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputId: string;
  inputName?: string;
  inputType: string;
  inputIcon?: React.ReactNode;
  inputPlaceholder?: string;
  characterLength?: number;
  errorMessage?: string;
  value: string;
  variant: PlatformType;
  onInputChange?: (value: string) => void;
}

export default function AppInput({
  inputId,
  inputName,
  inputType,
  inputIcon,
  inputPlaceholder,
  characterLength,
  errorMessage,
  value,
  variant,
  onInputChange,
  required,
  ...rest
}: AppInputProps) {
  const [textValue, setTextValue] = useState(value);
  const [internalError, setInternalError] = useState("");
  const styles = variantStyles[variant];

  // Sync only when parent value changes AND it's different
  if (textValue !== value) {
    setTextValue(value ?? "");
  }

  const maxLength = characterLength ?? 128;
  const characterLimitErrorMessage =
    "Oops, you've reached the character limit.";

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
          className="label-input flex pl-1 gap-0.5 text-sm text-sb-text-strong font-bodycopy font-semibold"
        >
          {inputName}
          {required && (
            <span className="label-required text-destructive">*</span>
          )}
        </label>
      )}

      <div className="input-container relative">
        {inputIcon && (
          <div className="input-icon absolute left-0 flex items-center p-[9px] pl-3 pointer-events-none text-emphasis">
            {inputIcon}
          </div>
        )}
        <input
          id={inputId}
          type={inputType}
          placeholder={inputPlaceholder}
          {...rest}
          className={`input-placeholder flex w-full p-2 font-medium font-bodycopy text-sm rounded-md transform transition-all placeholder:text-emphasis/60 placeholder:font-medium placeholder:text-sm focus:outline-4 invalid:border-destructive required:border-destructive ${styles.border} ${
            computedError
              ? "border-destructive focus:outline-semi-destructive"
              : styles.focus
          } ${
            rest.disabled
              ? `${styles.disabled} cursor-not-allowed`
              : styles.background
          } ${inputIcon ? "pl-10" : ""}`}
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
