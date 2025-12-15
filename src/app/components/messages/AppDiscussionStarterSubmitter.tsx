"use client";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { TextareaHTMLAttributes, useState } from "react";
import AppButton from "../buttons/AppButton";

interface AppDiscussionStarterSubmitterProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  sessionUserName: string;
  sessionUserAvatar: string;
  textAreaId: string;
  textAreaPlaceholder?: string;
  characterLength?: number;
  errorMessage?: string;
  onTextAreaChange?: (value: string) => void;
  onSubmit: () => void;
  value: string;
  isLoadingSubmit: boolean;
}

export default function AppDiscussionStarterSubmitter({
  sessionUserName,
  sessionUserAvatar,
  textAreaId,
  textAreaPlaceholder,
  characterLength,
  errorMessage,
  onTextAreaChange,
  onSubmit,
  value,
  disabled,
  isLoadingSubmit,
  ...rest
}: AppDiscussionStarterSubmitterProps) {
  const [textValue, setTextValue] = useState(value);
  const [internalError, setInternalError] = useState("");
  const [isScrollable, setIsScrollable] = useState(false);

  // Sync only when parent value changes AND it's different
  if (textValue !== value) {
    setTextValue(value ?? "");
  }

  const maxLength = characterLength ?? 520;
  const characterLimitErrorMessage =
    "Oops, you’ve reached the character limit.";

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // Dynamic resize height text area
    const textarea = event.target;
    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 160);
    textarea.style.height = `${newHeight}px`;

    setIsScrollable(textarea.scrollHeight > 160);

    // Character Limitation on Text Area
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
    <div className="text-area-box flex w-full gap-3">
      <div className="flex w-full gap-3">
        <div className="session-user-avatar size-8 aspect-square shrink-0 rounded-full overflow-hidden">
          <Image
            className="object-cover w-full h-full "
            src={sessionUserAvatar}
            alt={sessionUserName}
            width={400}
            height={400}
          />
        </div>
        <div className="text-area-container relative w-full">
          <textarea
            id={textAreaId}
            placeholder={textAreaPlaceholder}
            rows={1}
            disabled={disabled}
            {...rest}
            className={`text-area-placeholder flex w-full max-h-40 h-auto p-2 pt-1 bg-white font-medium font-bodycopy text-sm border-b-2 resize-none transform transition-all placeholder:text-alternative placeholder:font-medium placeholder:text-sm invalid:border-destructive required:border-destructive focus:outline-none focus:ring-0 focus:border-primary-deep ${
              computedError ? "border-destructive" : "border-outline"
            } ${isScrollable ? "overflow-y-auto" : "overflow-y-hidden"}`}
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
      <div className="submit-discussion-desktop flex w-fit shrink-0 ">
        <AppButton
          size="largeIconRounded"
          disabled={!textValue || isLoadingSubmit}
          onClick={onSubmit}
        >
          {isLoadingSubmit ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="rotate-45 pl-0 p-1"
            />
          )}
        </AppButton>
      </div>
    </div>
  );
}
