"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ChatSubmitterLMS from "./ChatSubmitterLMS";
import ChatBubbleLMS from "./ChatBubbleLMS";
import ChatResponseMarkdown from "./ChatResponseMarkdown";

interface Conversation {
  role: string;
  message: string;
}

interface ChatConversationLMSProps {
  conversation: Conversation[];
}

export default function ChatConversationLMS({
  conversation,
}: ChatConversationLMSProps) {
  const [textValue, setTextValue] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);
  const conversationRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setGeneratingAI(true);

    try {
      toast.success(textValue);
    } catch (error) {
      toast.error("Failed");
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <div className="root-page hidden flex-col pl-64 w-full  min-h-screen items-center justify-center lg:flex">
      <div className="conversation-page relative flex flex-col w-full max-w-[768px] min-h-screen">
        <div className="conversation w-full flex flex-col py-5">
          {conversation.map((post, index) => (
            <div
              key={index}
              className={`chat-wrapper flex w-full ${
                post.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {post.role === "user" ? (
                <ChatBubbleLMS chatMessage={post.message} />
              ) : (
                <ChatResponseMarkdown chatMessage={post.message} />
              )}
            </div>
          ))}
        </div>
        <form
          className="form-generate-chat sticky flex flex-col w-full max-w-[768px] bottom-0 pb-6 bg-section-background items-center justify-center gap-6 rounded-t-xl z-10"
          onSubmit={handleSubmit}
        >
          <ChatSubmitterLMS
            value={textValue}
            onTextAreaChange={(value) => setTextValue(value)}
            onSubmit={handleSubmit}
            isLoadingSubmit={generatingAI}
          />
        </form>
      </div>
    </div>
  );
}
