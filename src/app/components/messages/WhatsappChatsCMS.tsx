"use client";
import { WhatsappChatDirection, WhatsappChatStatus } from "@/lib/app-types";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import WhatsappBubbleChatCMS from "./WhatsappBubbleChatCMS";
import { MessageCircleMore } from "lucide-react";
import Image from "next/image";

export interface WhatsappChatItem {
  id: string;
  message: string;
  direction: WhatsappChatDirection;
  status: WhatsappChatStatus;
  created_at: string;
  sent_at: string | null;
  delivered_at: string | null;
  read_at: string | null;
  failed_at: string | null;
}

interface WhatsappChatsCMSProps {
  convId: string;
  convChats: WhatsappChatItem[];
}

export default function WhatsappChatsCMS(props: WhatsappChatsCMSProps) {
  // const router = useRouter();

  // const [textValue, setTextValue] = useState("");

  const [chats, setChats] = useState<WhatsappChatItem[]>(props.convChats);
  const conversationRef = useRef<HTMLDivElement | null>(null);

  // const newConvId = useRef<string | null>(null);

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

  // Handles the first response when a conversation is created
  // const handleInitialSubmit = useCallback(
  //   async (message: string) => {
  //     setGeneratingAI(true);

  //     const newUserChat: Chats = {
  //       role: "USER",
  //       message,
  //       created_at: new Date().toISOString(),
  //     };

  //     const newAssistantChat: Chats = {
  //       role: "ASSISTANT",
  //       message: "",
  //       created_at: new Date().toISOString(),
  //     };

  //     setChats([newUserChat, newAssistantChat]);

  //     await sendMessage(
  //       {
  //         model: "gpt-4.1-mini",
  //         token: props.authToken,
  //         conv_id: undefined,
  //         message,
  //       },
  //       {
  //         onEvent(event) {
  //           switch (event.event) {
  //             case "delta":
  //               appendToLastAssistant(event.data);
  //               break;

  //             case "conv_id":
  //               newConvId.current = event.data;
  //               break;

  //             case "title":
  //               setTitle(event.data);
  //               break;
  //           }
  //         },
  //         onCompleted() {
  //           setGeneratingAI(false);
  //           if (newConvId) {
  //             router.replace(`/ai/chat/${newConvId.current}`);
  //           }
  //         },
  //         onError(err) {
  //           console.error(err);
  //           toast.error("Failed to generate AI response");
  //           setGeneratingAI(false);
  //         },
  //       }
  //     );
  //   },
  //   [sendMessage, props.authToken, router]
  // );

  // // When there’s an initial message (from the previous page), it triggers the first AI message generation automatically.
  // useEffect(() => {
  //   if (hasSentInitial.current) return;

  //   const message = sessionStorage.getItem("initialMessage");

  //   if (!message) return;

  //   hasSentInitial.current = true;
  //   sessionStorage.removeItem("initialMessage");
  //   queueMicrotask(() => handleInitialSubmit(message));
  // }, [handleInitialSubmit]);

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
      <div className="header sticky flex w-full p-3 top-0 inset-x-0 bg-white border-b border-outline text-[#333333] z-10">
        <div className="conv-information flex items-center gap-2">
          <div className="aspect-square size-9 shrink-0 rounded-full overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src={"https://i.pravatar.cc/150?img=2"}
              alt="user"
              width={500}
              height={500}
            />
          </div>
          <div className="flex flex-col">
            <h3 className="conv-user-name flex w-full items-center text-[15px] font-bodycopy font-bold leading-snug">
              Budi Santoso
            </h3>
            <p className="conv-user-phone-number text-sm text-[#333333]/80 font-bodycopy font-[450]">
              +62979723871
            </p>
          </div>
        </div>
      </div>
      <div className="chats-conversation relative flex flex-col w-full p-3">
        <div className="chat-list w-full flex flex-col pt-5 mb-14">
          {chats
            .sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            )
            .map((post, index) => (
              <div
                key={index}
                className={`chat-wrapper flex w-full gap-10 ${
                  post.direction === "INBOUND" ? "justify-start" : "justify-end"
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
        {/* <form
          className="form-generate-chat fixed flex flex-col w-full max-w-[768px] bottom-0 pb-6 bg-section-background items-center justify-center gap-6 rounded-t-xl z-10"
          onSubmit={handleSubmit}
        >
          <ChatSubmitterLMS
            value={textValue}
            onTextAreaChange={(value) => setTextValue(value)}
            onSubmit={handleSubmit}
            isLoadingSubmit={generatingAI}
          />
        </form> */}
      </div>
    </div>
  );
}
