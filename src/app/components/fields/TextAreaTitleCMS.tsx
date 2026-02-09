"use client";
import React, {
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";

interface TextAreaTitleCMSProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  textAreaId: string;
  textAreaHeight?: string;
  textAreaPlaceholder?: string;
  characterLength?: number;
  errorMessage?: string;
  value: string;
  onTextAreaChange?: (value: string) => void;
}

export default function TextAreaTitleCMS({
  textAreaId,
  textAreaHeight,
  textAreaPlaceholder,
  characterLength,
  errorMessage,
  value,
  onTextAreaChange,

  ...rest
}: TextAreaTitleCMSProps) {
  const [textValue, setTextValue] = useState(value);
  const [internalError, setInternalError] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync only when parent value changes AND it's different
  if (textValue !== value) {
    setTextValue(value ?? "");
  }

  const maxLength = characterLength ?? 520;
  const characterLimitErrorMessage =
    "Oops, you’ve reached the character limit.";

  // Character Limitation on Text Area
  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
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

  // Auto-height Resize
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
    }
  }, [value]);

  // Reset internalError if get any errorMessage from parent
  if (errorMessage && internalError !== "") {
    setInternalError("");
  }

  // Compute error (parent > internal)
  const computedError = errorMessage || internalError;

  return (
    <div className="text-area-box flex flex-col gap-1">
      <div className="text-area-container relative">
        <textarea
          id={textAreaId}
          ref={textAreaRef}
          placeholder={textAreaPlaceholder}
          {...rest}
          className={`text-area-placeholder flex w-full p-3 ${textAreaHeight} bg-transparent font-bold font-bodycopy text-2xl rounded-md resize-none overflow-hidden transform transition-all placeholder:text-alternative placeholder:font-medium placeholder:text-2xl invalid:border-destructive required:border-destructive hover:bg-[#F1F2F4] ${
            computedError
              ? "border border-destructive focus:outline-semi-destructive"
              : "border-none outline-0"
          } `}
          value={textValue}
          rows={1}
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
