"use client";
import { FormEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ChatSubmitterLMS from "./ChatSubmitterLMS";
import ChatBubbleLMS from "./ChatBubbleLMS";
import ChatResponseMarkdown from "./ChatResponseMarkdown";
import { SendAIChat } from "@/lib/actions";
import { Loader2, MessageCircleMore } from "lucide-react";
import { AIChatRole } from "@/lib/app-types";

interface Chats {
  role: AIChatRole;
  message: string;
  created_at: string;
}

interface ChatConversationLMSProps {
  conversationId: string;
  conversationName: string;
  conversationChats: Chats[];
}

export default function ChatConversationLMS({
  conversationId,
  conversationName,
  conversationChats,
}: ChatConversationLMSProps) {
  const [textValue, setTextValue] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);
  const [chats, setChats] = useState<Chats[]>(conversationChats);
  const conversationRef = useRef<HTMLDivElement | null>(null);

  // Auto-scrolls to the bottom whenever new chats arrive.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (conversationRef.current) {
        conversationRef.current.scrollTo({
          top: conversationRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [chats]);

  //  Automatically scrolls to the bottom when the page first loads.
  useLayoutEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTo({
        top: conversationRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, []);

  // Keeps local state in sync if new messages come in from the server or other sources.
  useEffect(() => {
    if (conversationChats.length > 0) {
      setChats(conversationChats);
    }
  }, [conversationChats]);

  // Handles user message submissions within the chat.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneratingAI(true);

    const newUserChat: Chats = {
      role: "USER" as AIChatRole,
      message: textValue,
      created_at: new Date().toISOString(),
    };
    setChats((prev) => [...prev, newUserChat]);

    setTextValue("");

    try {
      const sendChat = await SendAIChat({
        conversationId: conversationId,
        message: newUserChat.message,
      });
      if (sendChat.code === "OK") {
        const newAssistantChat = {
          role: "ASSISTANT" as AIChatRole,
          created_at: new Date().toISOString(),
          message: sendChat.result,
        };
        setChats((prev) => [...prev, newAssistantChat]);
      }
    } catch (error) {
      toast.error("Failed to start conversation");
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <div
      ref={conversationRef}
      className="root-page relative hidden flex-col pl-64 w-full h-screen overflow-y-auto lg:flex"
    >
      <div className="header-conversation sticky flex w-full items-center justify-center top-0 inset-x-0 bg-section-background border-b text-[#333333] z-10">
        <div className="conversation-name flex w-full max-w-[calc(100%-4rem)] items-center gap-2 py-3 font-bodycopy font-semibold text-lg">
          <MessageCircleMore className="size-6" />
          {conversationName}
        </div>
      </div>
      <div className="conversation-page relative flex flex-col w-full max-w-[768px] mx-auto">
        <div className="conversation w-full flex flex-col pt-5 mb-52">
          {chats
            .sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            )
            .map((post, index) => (
              <div
                key={index}
                className={`chat-wrapper flex w-full ${
                  post.role === "USER" ? "justify-end" : "justify-start"
                }`}
              >
                {post.role === "USER" ? (
                  <ChatBubbleLMS chatMessage={post.message} />
                ) : (
                  <ChatResponseMarkdown chatMessage={post.message} />
                )}
              </div>
            ))}

          {generatingAI && (
            <Loader2 className="animate-spin text-alternative" />
          )}
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
