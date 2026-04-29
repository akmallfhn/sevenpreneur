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
import BottomNavLMS from "../navigations/BottomNavLMS";
import PageContainerDashboard from "../pages/PageContainerDashboard";

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
  const mobileConversationRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState("");
  const newConvId = useRef<string | null>(null);

  const scrollAllToBottom = (behavior: ScrollBehavior) => {
    [conversationRef, mobileConversationRef].forEach((ref) => {
      if (ref.current) {
        ref.current.scrollTo({ top: ref.current.scrollHeight, behavior });
      }
    });
  };

  // Auto-scrolls to the bottom whenever new chats arrive.
  useEffect(() => {
    const timeout = setTimeout(() => scrollAllToBottom("smooth"), 50);
    return () => clearTimeout(timeout);
  }, [chats]); // eslint-disable-line react-hooks/exhaustive-deps

  // Automatically scrolls to the bottom when the page first loads.
  useLayoutEffect(() => {
    scrollAllToBottom("instant");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const conversationName = props.conversationName || title;

  const chatMessages = chats
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
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
    ));

  return (
    <>
      {/* Desktop */}
      <PageContainerDashboard
        ref={conversationRef}
        className="relative h-screen overflow-y-auto"
      >
        <div className="header-conversation sticky flex w-full items-center justify-center top-0 inset-x-0 bg-dashboard-bg border-b border-dashboard-border text-foreground z-10">
          <div className="conversation-name flex w-full max-w-[calc(100%-4rem)] items-center gap-2 py-3 font-bodycopy font-semibold">
            <MessageCircleMore className="size-5" />
            {conversationName}
          </div>
        </div>
        <div className="conversation-page relative flex flex-col w-full max-w-[768px] mx-auto">
          <div className="conversation w-full flex flex-col pt-5 mb-52">
            {chatMessages}
          </div>
          <form
            className="form-generate-chat fixed flex flex-col w-full max-w-[768px] bottom-0 pb-6 bg-dashboard-bg items-center justify-center gap-6 rounded-t-xl z-10"
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
      </PageContainerDashboard>

      {/* Mobile */}
      <div
        ref={mobileConversationRef}
        className="root-page relative flex flex-col w-full h-screen overflow-y-auto lg:hidden"
      >
        <div className="header-conversation sticky flex w-full items-center gap-2 top-0 px-4 py-3 bg-dashboard-bg border-b border-dashboard-border text-foreground z-10 font-bodycopy font-semibold">
          <MessageCircleMore className="size-5 shrink-0" />
          <span className="truncate">{conversationName}</span>
        </div>
        <div className="conversation w-full flex flex-col pt-4 px-4 mb-[9rem]">
          {chatMessages}
        </div>
        <form
          className="form-generate-chat fixed flex flex-col w-full bottom-20 px-4 pb-3 pt-2 bg-dashboard-bg border-t border-dashboard-border z-10"
          onSubmit={handleSubmit}
        >
          <ChatSubmitterLMS
            value={textValue}
            onTextAreaChange={(value) => setTextValue(value)}
            onSubmit={handleSubmit}
            isLoadingSubmit={generatingAI}
          />
        </form>
        <BottomNavLMS />
      </div>
    </>
  );
}
