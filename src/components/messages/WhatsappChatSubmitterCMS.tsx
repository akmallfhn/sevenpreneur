"use client";
import { ArrowUp, ImagePlus, Loader2, SmilePlus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
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
  onOpenImagePicker: () => void;
  onOpenTemplateSender?: () => void;
  value: string;
  isLoadingSubmit: boolean;
  /** When true, the normal submit button is disabled and "Kirim Template" button is shown */
  isWindowExpired?: boolean;
}

export default function WhatsappChatSubmitterCMS({
  value,
  onTextAreaChange,
  onSubmit,
  onOpenImagePicker,
  onOpenTemplateSender,
  isLoadingSubmit,
  isWindowExpired = false,
  ...rest
}: WhatsappChatSubmitterCMSProps) {
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

  // Reset height when value is cleared externally (e.g. after send)
  useEffect(() => {
    if (!value && textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
    }
  }, [value]);

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
        <div className="chat-submitter flex items-center w-full p-3 px-4 bg-white dark:bg-card-bg gap-2 border border-dashboard-border rounded-xl">
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
          <div className="image-picker flex items-center justify-center">
            <AppButton
              size="iconRounded"
              variant="ghost"
              type="button"
              onClick={onOpenImagePicker}
            >
              <ImagePlus className="size-5" />
            </AppButton>
          </div>
          <div className="text-area-container relative w-full">
            <textarea
              id="chat-ai"
              placeholder="Message.."
              ref={textAreaRef}
              rows={1}
              className={`text-area-placeholder flex w-full max-h-52 min-h-0 h-auto bg-white dark:bg-card-bg dark:text-foreground font-medium font-bodycopy text-[15px] resize-none transform transition-all overflow-auto placeholder:text-emphasis placeholder:font-medium placeholder:text-[15px] focus:outline-none focus:ring-0`}
              value={value}
              onKeyDown={handleKeyDown}
              onChange={handleTextAreaChange}
              disabled={isLoadingSubmit}
              {...rest}
              suppressHydrationWarning
            />
          </div>
          <div className="chat-submitter flex items-center justify-center gap-2">
            {isWindowExpired && onOpenTemplateSender ? (
              <AppButton
                type="button"
                size="smallRounded"
                variant="whatsapp"
                onClick={onOpenTemplateSender}
                title="Kirim Template WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="size-4" />
                <span className="text-xs font-bodycopy font-semibold">Kirim Template</span>
              </AppButton>
            ) : (
              <AppButton
                className="chat-submitter"
                type="submit"
                size="iconRounded"
                disabled={!value.trim() || isLoadingSubmit || isWindowExpired}
              >
                {isLoadingSubmit ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <ArrowUp className="size-5" />
                )}
              </AppButton>
            )}
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
