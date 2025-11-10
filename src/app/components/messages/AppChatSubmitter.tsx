"use client";
import {
  FormEvent,
  KeyboardEvent,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from "react";
import AppButton from "../buttons/AppButton";
import { ArrowUp, Square, StopCircle } from "lucide-react";

interface AppChatSubmitterProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onTextAreaChange?: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  value: string;
  isLoadingSubmit: boolean;
}

export default function AppChatSubmitter({
  value: propValue,
  onTextAreaChange,
  onSubmit,
  isLoadingSubmit,
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
    onTextAreaChange?.(textarea.value);
  };

  // Handle submit with Enter
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // cegah newline
      const fakeEvent = { preventDefault: () => {} } as unknown as FormEvent;
      onSubmit(fakeEvent);
    }
  };

  // Sync on value change
  useEffect(() => {
    setValue(propValue || "");
  }, [propValue]);

  return (
    <div className="chat-submitter flex flex-col w-full p-4 bg-white gap-4 border border-outline rounded-xl">
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
          suppressHydrationWarning
        />
      </div>
      <div className="chat-attachments flex items-center justify-between">
        {isLoadingSubmit ? (
          <AppButton className="chat-end-submitting" size="largeIconRounded">
            <Square fill="#FFFFFF" className="size-5" />
          </AppButton>
        ) : (
          <AppButton
            className="chat-submitter"
            type="submit"
            size="largeIconRounded"
            disabled={!value.trim()}
          >
            <ArrowUp className="size-5" />
          </AppButton>
        )}
      </div>
    </div>
  );
}
