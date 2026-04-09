"use client";
import { WhatsappChatDirection, WhatsappChatStatus } from "@/lib/app-types";
import { Loader2 } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import WhatsappBubbleChatCMS from "./WhatsappBubbleChatCMS";
import WhatsappChatSubmitterCMS from "./WhatsappChatSubmitterCMS";

export interface WhatsappChatItem {
  id: string;
  message: string;
  direction: WhatsappChatDirection;
  status: WhatsappChatStatus | null;
  created_at: string;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  failed_at: string | null;
}

interface WhatsappChatsCMSProps {
  convId: string;
  convChats: WhatsappChatItem[];
  isLoading: boolean;
  isError: boolean;
}

export default function WhatsappChatsCMS(props: WhatsappChatsCMSProps) {
  // const router = useRouter();

  // State for submit chat
  const [textValue, setTextValue] = useState("");

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
  }, [props.convChats]);

  // Automatically scrolls to the bottom when the page first loads.
  useLayoutEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTo({
        top: conversationRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, []);

  // function appendToLastAssistant(text: string) {
  //   setChats((prev) => {
  //     const lastIndex = prev.length - 1;
  //     if (prev[lastIndex]?.role !== "ASSISTANT") return prev;

  //     const updated = [...prev];
  //     updated[lastIndex] = {
  //       ...updated[lastIndex],
  //       message: updated[lastIndex].message + text,
  //     };

  //     return updated;
  //   });
  // }

  // Handles user message submissions within the chat.
  // const handleSubmit = async (e: FormEvent) => {
  //   e.preventDefault();
  //   if (!textValue.trim()) return;

  //   setGeneratingAI(true);

  //   const newUserChat: Chats = {
  //     role: "USER",
  //     message: textValue,
  //     created_at: new Date().toISOString(),
  //   };

  //   const newAssistantChat: Chats = {
  //     role: "ASSISTANT",
  //     message: "",
  //     created_at: new Date().toISOString(),
  //   };

  //   setChats((prev) => [...prev, newUserChat, newAssistantChat]);
  //   setTextValue("");

  //   await sendMessage(
  //     {
  //       model: "gpt-4.1-mini",
  //       token: props.authToken,
  //       conv_id: props.conversationId,
  //       message: newUserChat.message,
  //     },
  //     {
  //       onEvent(event) {
  //         switch (event.event) {
  //           case "delta":
  //             appendToLastAssistant(event.data);
  //         }
  //       },
  //       onCompleted() {
  //         setGeneratingAI(false);
  //       },
  //       onError(err) {
  //         console.error(err);
  //         toast.error("Failed to generate AI response");
  //         setGeneratingAI(false);
  //       },
  //     }
  //   );
  // };

  return (
    <div
      ref={conversationRef}
      className="chats-panel relative hidden flex-col w-full h-full bg-linear-to-t from-0% from-[#DDE4F1] to-100% to-[#F2F2F2] overflow-y-auto lg:flex"
    >
      <div className="chats-conversation relative flex flex-col w-full p-3 min-h-full">
        {props.isLoading && (
          <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
            <Loader2 className="animate-spin size-5 " />
          </div>
        )}
        {props.isError && (
          <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
            No Data
          </div>
        )}
        {!props.isLoading && !props.isError && (
          <div className="chat-list w-full flex flex-col pt-5 mb-5 flex-grow">
            {props.convChats
              .sort(
                (a, b) =>
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
              )
              .map((post, index) => (
                <div
                  key={index}
                  className={`chat-wrapper flex w-full gap-10 ${
                    post.direction === "INBOUND"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <WhatsappBubbleChatCMS
                    chatMessage={post.message}
                    chatDirection={post.direction}
                    chatStatus={post.status}
                    createdAt={post.created_at}
                    sentAt={post.sent_at}
                    deliveredAt={post.delivered_at}
                    readAt={post.read_at}
                  />
                </div>
              ))}
          </div>
        )}
        <form
          className="generate-chat sticky flex flex-col bottom-3 w-full items-center justify-center gap-6 rounded-t-xl z-10"
          onSubmit={() => {}}
        >
          <WhatsappChatSubmitterCMS
            value={textValue}
            onTextAreaChange={(value) => setTextValue(value)}
            onSubmit={() => {}}
            isLoadingSubmit={false}
          />
        </form>
      </div>
    </div>
  );
}
