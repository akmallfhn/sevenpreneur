"use client";
import { useClipboard } from "@/lib/use-clipboard";
import { Check, CopyIcon } from "lucide-react";
import AppButton from "../buttons/AppButton";

interface ChatBubbleLMS {
  chatMessage: string;
  chatRole: string;
}

export default function ChatBubbleLMS({
  chatMessage,
  chatRole,
}: ChatBubbleLMS) {
  const { copied, copy } = useClipboard();

  return (
    <div
      className={`chat-container flex flex-col item gap-1 mt-2 w-full ${
        chatRole === "system" ? "items-start" : "items-end"
      }`}
    >
      <div className="chat-box w-fit max-w-[min(70%,560px)] px-4 py-2 bg-white border border-outline rounded-[18px] font-ui">
        <p className="chat-message break-words whitespace-pre-wrap">
          {chatMessage}
        </p>
      </div>
      <AppButton variant="ghost" size="icon" onClick={() => copy(chatMessage)}>
        {copied ? (
          <Check className="text-green-400 size-5" />
        ) : (
          <CopyIcon className="text-alternative size-5" />
        )}
      </AppButton>
    </div>
  );
}
