"use client";
import { AIChatRole } from "@/lib/app-types";
import { useStreamAIChat } from "@/lib/parse-stream";
import { MessageCircleMore } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import ChatBubbleLMS from "./ChatBubbleLMS";
import ChatResponseMarkdown from "./ChatResponseMarkdown";
import ChatSubmitterLMS from "./ChatSubmitterLMS";

interface Chats {
  id?: string;
  role: AIChatRole;
  message: string;
  created_at: string;
}

interface ChatConversationLMSProps {
  authToken: string;
  conversationId: string;
  conversationName: string;
  conversationChats: Chats[];
}

export default function ChatConversationLMS(props: ChatConversationLMSProps) {
  const router = useRouter();
  const { sendMessage } = useStreamAIChat();
  const hasSentInitial = useRef(false);
  const [textValue, setTextValue] = useState("");
  const [generatingAI, setGeneratingAI] = useState(false);
  const [chats, setChats] = useState<Chats[]>(props.conversationChats);
  const conversationRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState("");
  const newConvId = useRef<string | null>(null);

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

  // Automatically scrolls to the bottom when the page first loads.
  useLayoutEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTo({
        top: conversationRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, []);

  function appendToLastAssistant(text: string) {
    setChats((prev) => {
      const lastIndex = prev.length - 1;
      if (prev[lastIndex]?.role !== "ASSISTANT") return prev;

      const updated = [...prev];
      updated[lastIndex] = {
        ...updated[lastIndex],
        message: updated[lastIndex].message + text,
      };

      return updated;
    });
  }

  // Handles the first response when a conversation is created
  const handleInitialSubmit = useCallback(
    async (message: string) => {
      setGeneratingAI(true);

      const newUserChat: Chats = {
        role: "USER",
        message,
        created_at: new Date().toISOString(),
      };

      const newAssistantChat: Chats = {
        role: "ASSISTANT",
        message: "",
        created_at: new Date().toISOString(),
      };

      setChats([newUserChat, newAssistantChat]);

      await sendMessage(
        {
          model: "gpt-4.1-mini",
          token: props.authToken,
          conv_id: undefined,
          message,
        },
        {
          onEvent(event) {
            switch (event.event) {
              case "delta":
                appendToLastAssistant(event.data);
                break;

              case "conv_id":
                newConvId.current = event.data;
                break;

              case "title":
                setTitle(event.data);
                break;
            }
          },
          onCompleted() {
            setGeneratingAI(false);
            if (newConvId) {
              router.replace(`/ai/chat/${newConvId.current}`);
            }
          },
          onError(err) {
            console.error(err);
            toast.error("Failed to generate AI response");
            setGeneratingAI(false);
          },
        }
      );
    },
    [sendMessage, props.authToken, router]
  );

  // When there’s an initial message (from the previous page), it triggers the first AI message generation automatically.
  useEffect(() => {
    if (hasSentInitial.current) return;

    const message = sessionStorage.getItem("initialMessage");

    if (!message) return;

    hasSentInitial.current = true;
    sessionStorage.removeItem("initialMessage");
    queueMicrotask(() => handleInitialSubmit(message));
  }, [handleInitialSubmit]);

  // Handles user message submissions within the chat.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!textValue.trim()) return;

    setGeneratingAI(true);

    const newUserChat: Chats = {
      role: "USER",
      message: textValue,
      created_at: new Date().toISOString(),
    };

    const newAssistantChat: Chats = {
      role: "ASSISTANT",
      message: "",
      created_at: new Date().toISOString(),
    };

    setChats((prev) => [...prev, newUserChat, newAssistantChat]);
    setTextValue("");

    await sendMessage(
      {
        model: "gpt-4.1-mini",
        token: props.authToken,
        conv_id: props.conversationId,
        message: newUserChat.message,
      },
      {
        onEvent(event) {
          switch (event.event) {
            case "delta":
              appendToLastAssistant(event.data);
          }
        },
        onCompleted() {
          setGeneratingAI(false);
        },
        onError(err) {
          console.error(err);
          toast.error("Failed to generate AI response");
          setGeneratingAI(false);
        },
      }
    );
  };

  return (
    <div
      ref={conversationRef}
      className="root-page relative hidden flex-col pl-64 w-full h-screen overflow-y-auto lg:flex"
    >
      <div className="header-conversation sticky flex w-full items-center justify-center top-0 inset-x-0 bg-section-background border-b border-outline text-[#333333] z-10">
        <div className="conversation-name flex w-full max-w-[calc(100%-4rem)] items-center gap-2 py-3 font-bodycopy font-semibold">
          <MessageCircleMore className="size-5" />
          {props.conversationName ? props.conversationName : title}
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
                  <ChatResponseMarkdown
                    chatMessage={post.message}
                    isGeneratingMessage={generatingAI}
                  />
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
