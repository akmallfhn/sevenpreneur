"use client";
import { ArrowUp } from "lucide-react";
import { FormEvent, KeyboardEvent, TextareaHTMLAttributes } from "react";
import AppButton from "../buttons/AppButton";

interface ChatSubmitterLMSProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onTextAreaChange?: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  value: string;
  isLoadingSubmit: boolean;
}

export default function ChatSubmitterLMS({
  value,
  onTextAreaChange,
  onSubmit,
  isLoadingSubmit,
  ...rest
}: ChatSubmitterLMSProps) {
  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // Dynamic resize height text area
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    onTextAreaChange?.(textarea.value);
  };

  // Handle submit with Enter
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (isLoadingSubmit) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!value.trim()) return;
      const fakeEvent = { preventDefault: () => {} } as unknown as FormEvent;
      onSubmit(fakeEvent);
    }
  };

  return (
    <div className="chat-submitter flex flex-col w-full p-3 bg-white gap-3 border border-outline rounded-xl">
      <div className="text-area-container relative w-full">
        <textarea
          id="chat-ai"
          placeholder="Ask anything about business!"
          rows={1}
          {...rest}
          className={`text-area-placeholder flex w-full max-h-52 min-h-0 h-auto p-2 pt-1 bg-white font-medium font-bodycopy text-base resize-none transform transition-all overflow-auto placeholder:text-alternative placeholder:font-medium placeholder:text-base focus:outline-none focus:ring-0`}
          value={value}
          onKeyDown={handleKeyDown}
          onChange={handleTextAreaChange}
          disabled={isLoadingSubmit}
          suppressHydrationWarning
        />
      </div>
      <div className="chat-attachments flex items-center justify-end">
        {/* <AppButton size="largeIconRounded" variant="outline" type="button">
          <Paperclip className="size-5" />
        </AppButton> */}
        {/* {isLoadingSubmit ? (
          <AppButton className="chat-end-submitting" size="largeIconRounded">
            <Square fill="#FFFFFF" className="size-4" />
          </AppButton>
        ) : ( */}
        <AppButton
          className="chat-submitter"
          type="submit"
          size="largeIconRounded"
          disabled={!value.trim() || isLoadingSubmit}
        >
          <ArrowUp className="size-5" />
        </AppButton>
        {/* )} */}
      </div>
    </div>
  );
}
