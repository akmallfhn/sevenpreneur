"use client";
import { ArrowUp, Loader2, SmilePlus } from "lucide-react";
import React, {
  FormEvent,
  KeyboardEvent,
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import AppButton from "../buttons/AppButton";
import AppEmojiPicker from "./AppEmojiPicker";

interface WhatsappChatSubmitterCMSProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onTextAreaChange?: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  value: string;
  isLoadingSubmit: boolean;
}

export default function WhatsappChatSubmitterCMS({
  value,
  onTextAreaChange,
  onSubmit,
  isLoadingSubmit,
  ...rest
}: WhatsappChatSubmitterCMSProps) {
  // State for open/close and add emoji
  const [showEmoji, setShowEmoji] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Detect click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Insert emoji into cursor
  const handleAddEmoji = (emoji: string) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newValue = value.substring(0, start) + emoji + value.substring(end);

    onTextAreaChange?.(newValue);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    }, 0);

    setShowEmoji(false);
  };

  // Dynamic resize height text area
  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
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
    <React.Fragment>
      <div className="relative w-full" ref={wrapperRef}>
        <div className="chat-submitter flex items-center w-full p-3 px-4 bg-white gap-2 border border-outline rounded-xl">
          <div className="emoji flex items-center justify-center">
            <AppButton
              size="iconRounded"
              variant="ghost"
              type="button"
              onClick={() => setShowEmoji((prev) => !prev)}
            >
              <SmilePlus className="size-5" />
            </AppButton>
          </div>
          <div className="text-area-container relative w-full">
            <textarea
              id="chat-ai"
              placeholder="Message.."
              ref={textAreaRef}
              rows={1}
              className={`text-area-placeholder flex w-full max-h-52 min-h-0 h-auto bg-white font-medium font-bodycopy text-[15px] resize-none transform transition-all overflow-auto placeholder:text-alternative placeholder:font-medium placeholder:text-[15px] focus:outline-none focus:ring-0`}
              value={value}
              onKeyDown={handleKeyDown}
              onChange={handleTextAreaChange}
              disabled={isLoadingSubmit}
              {...rest}
              suppressHydrationWarning
            />
          </div>
          <div className="chat-submitter flex items-center justify-center">
            <AppButton
              className="chat-submitter"
              type="submit"
              size="iconRounded"
              disabled={!value.trim() || isLoadingSubmit}
            >
              {isLoadingSubmit ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <ArrowUp className="size-5" />
              )}
            </AppButton>
          </div>
        </div>

        {showEmoji && (
          <div className="emoji-panel absolute bottom-full mb-2 left-0 z-50">
            <AppEmojiPicker
              isOpen={showEmoji}
              onEmojiClick={(emojiData) => handleAddEmoji(emojiData.emoji)}
            />
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
