"use client";
import { TextareaHTMLAttributes, useEffect, useState } from "react";
import AppButton from "../buttons/AppButton";

interface AppChatSubmitterProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onTextAreaChange?: (value: string) => void;
  onSubmit: () => void;
  value: string;
  isLoadingSubmit: boolean;
}

export default function AppChatSubmitter({
  value: propValue,
  onTextAreaChange,
  onSubmit,
  ...rest
}: AppChatSubmitterProps) {
  const [value, setValue] = useState(propValue);

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // Dynamic resize height text area
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Sync on value change
  useEffect(() => {
    setValue(propValue || "");
  }, [propValue]);

  return (
    <div className="flex flex-col p-3 bg-white w-full">
      <div className="text-area-container relative w-full">
        <textarea
          id="chat-ai"
          placeholder="Ask anything about business"
          rows={1}
          {...rest}
          className={`text-area-placeholder flex w-full min-h-0 h-auto p-2 pt-1 bg-white font-medium font-bodycopy text-sm border-b-2 resize-none transform transition-all overflow-hidden placeholder:text-alternative placeholder:font-medium placeholder:text-sm invalid:border-destructive required:border-destructive focus:outline-none focus:ring-0 focus:border-primary-deep`}
          value={value}
          onChange={handleTextAreaChange}
          suppressHydrationWarning
        />
      </div>
      <div>
        <AppButton onSubmit={onSubmit} type="submit">
          Submit
        </AppButton>
      </div>
    </div>
  );
}
