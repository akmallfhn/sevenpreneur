"use client";
import Image from "next/image";
import React, { useState, useEffect, TextareaHTMLAttributes } from "react";
import AppButton from "../buttons/AppButton";
import { Loader2, SendHorizonal } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

interface AppDiscussionTextAreaProps
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

export default function AppDiscussionTextArea({
  sessionUserName,
  sessionUserAvatar,
  textAreaId,
  textAreaPlaceholder,
  characterLength,
  errorMessage,
  onTextAreaChange,
  onSubmit,
  value: propValue,
  disabled,
  isLoadingSubmit,
  ...rest
}: AppDiscussionTextAreaProps) {
  const [value, setValue] = useState(propValue);
  const [internalError, setInternalError] = useState("");
  const [isScrollable, setIsScrollable] = useState(false);
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
    <div className="text-area-box flex flex-col w-full gap-3 lg:flex-row">
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
      <div className="submit-discussion-mobile flex w-full justify-end shrink-0 lg:hidden">
        <AppButton
          className="w-fit"
          size="medium"
          disabled={!value || isLoadingSubmit}
          onClick={onSubmit}
        >
          {isLoadingSubmit ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Sending..
            </>
          ) : (
            "Submit"
          )}
        </AppButton>
      </div>
      <div className="submit-discussion-desktop hidden w-fit shrink-0 lg:flex">
        <AppButton
          size="largeIconRounded"
          disabled={!value || isLoadingSubmit}
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
