"use client";
import { WhatsappChatDirection, WhatsappChatStatus } from "@/lib/app-types";
import { trpc } from "@/trpc/client";
import { Loader2 } from "lucide-react";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import WhatsappBubbleChatCMS from "./WhatsappBubbleChatCMS";
import WhatsappChatSubmitterCMS from "./WhatsappChatSubmitterCMS";
import { toast } from "sonner";

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
  sessionToken: string;
  convId: string;
}

export default function WhatsappChatsCMS(props: WhatsappChatsCMSProps) {
  const utils = trpc.useUtils();
  // State for auto-scroll
  const conversationRef = useRef<HTMLDivElement | null>(null);

  // State for submit chat
  const [textValue, setTextValue] = useState("");
  const sendChat = trpc.send.wa.chat.useMutation();

  // Fetch tRPC data
  const { data, isLoading, isError } = trpc.list.wa.chats.useQuery(
    {
      conv_id: props.convId,
    },
    {
      enabled: !!props.sessionToken && !!props.convId,
      refetchInterval: (query) => {
        const list = query.state.data?.list ?? [];
        const hasPendingOutbound = list.some(
          (chat) =>
            chat.direction === "OUTBOUND" &&
            chat.status !== "READ" &&
            chat.status !== "FAILED"
        );
        return hasPendingOutbound ? 1000 : 5000;
      },
    }
  );
  const chatList = useMemo(() => data?.list ?? [], [data?.list]);

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
  }, [chatList]);

  // Automatically scrolls to the bottom when the page first loads.
  useLayoutEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTo({
        top: conversationRef.current.scrollHeight,
        behavior: "instant",
      });
    }
  }, []);

  // Handle send chat
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textValue.trim() || sendChat.isPending) {
      return;
    }

    try {
      sendChat.mutate(
        {
          conv_id: props.convId,
          message: textValue.trim(),
        },
        {
          onSuccess: () => {
            setTextValue("");
            utils.list.wa.chats.invalidate({ conv_id: props.convId });
          },
          onError: () => {
            toast.error("Failed to send chat");
          },
        }
      );
    } catch (error) {
      console.error("Failed to send chat", error);
    }
  };

  return (
    <div
      ref={conversationRef}
      className="chats-panel relative hidden flex-col w-full h-full bg-linear-to-t from-0% from-[#DDE4F1] to-100% to-[#F2F2F2] overflow-y-auto lg:flex"
    >
      <div className="chats-conversation relative flex flex-col w-full p-3 min-h-full">
        {isLoading && (
          <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
            <Loader2 className="animate-spin size-5 " />
          </div>
        )}
        {isError && (
          <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
            No Data
          </div>
        )}
        {!isLoading && !isError && (
          <div className="chat-list w-full flex flex-col pt-5 mb-5 flex-grow">
            {[...chatList]
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
          onSubmit={handleSendChat}
        >
          <WhatsappChatSubmitterCMS
            value={textValue}
            onTextAreaChange={(value) => setTextValue(value)}
            onSubmit={handleSendChat}
            isLoadingSubmit={sendChat.isPending}
          />
        </form>
      </div>
    </div>
  );
}
