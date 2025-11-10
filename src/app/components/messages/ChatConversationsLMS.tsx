"use client";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import ChatSubmitterLMS from "../messages/ChatSubmitterLMS";
import ChatBubbleLMS from "./ChatBubbleLMS";
import ChatResponseMarkdown from "./ChatResponseMarkdown";

interface ConversationList {
  role: string;
  message: string;
}

interface ChatConversationLMSProps {
  conversationList: ConversationList[];
}

export default function ChatConversationLMS({
  conversationList,
}: ChatConversationLMSProps) {
  const [textValue, setTextValue] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);

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
      <div className="relative flex flex-col w-full max-w-[768px] min-h-screen items-center justify-center">
        <div className="conversations w-full flex flex-col py-5 pb-44 overflow-y-auto">
          {conversationList.map((post, index) => (
            <div
              key={index}
              className={`chat-wrapper flex w-full ${
                post.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {post.role === "user" ? (
                <ChatBubbleLMS
                  chatMessage={post.message}
                  chatRole={post.role}
                />
              ) : (
                <ChatResponseMarkdown chatMessage={post.message} />
              )}
            </div>
          ))}
        </div>
        <form
          className="form-generate-chat fixed flex flex-col w-full max-w-[768px] bottom-0 pb-6 bg-section-background items-center justify-center gap-6 rounded-t-xl z-10"
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
