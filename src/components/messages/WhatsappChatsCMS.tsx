"use client";
import { playNotificationSound } from "@/lib/sounds";
import { supabase } from "@/lib/supabase";
import { WhatsAppTypeAttachmentPairUnion } from "@/lib/whatsapp-types";
import { trpc } from "@/trpc/client";
import dayjs from "dayjs";
import { Loader2 } from "lucide-react";
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import WhatsappChatItemCMS from "./WhatsappChatItemCMS";
import WhatsappChatSubmitterCMS from "./WhatsappChatSubmitterCMS";

interface WhatsappChatsCMSProps {
  sessionToken: string;
  convId: string;
}

export default function WhatsappChatsCMS(props: WhatsappChatsCMSProps) {
  // State for auto-scroll
  const conversationRef = useRef<HTMLDivElement | null>(null);
  // State for play notification
  const prevConvIdRef = useRef<string>(props.convId);
  const prevChatIdsRef = useRef<Set<string>>(new Set());

  // State for submit chat
  const [textValue, setTextValue] = useState("");
  const sendChat = trpc.send.wa.chat.useMutation();

  const utils = trpc.useUtils();

  // Fetch tRPC data
  const { data, isLoading, isError } = trpc.list.wa.chats.useQuery(
    {
      conv_id: props.convId,
    },
    {
      enabled: !!props.sessionToken && !!props.convId,
    }
  );
  const sortedChatList = useMemo(
    () =>
      [...(data?.list ?? [])].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      ),
    [data?.list]
  );

  // Subscribe to Supabase Realtime for live wa_chats updates.
  useEffect(() => {
    const channel = supabase
      .channel("wa_chats_change", { config: { private: true } })
      .on("broadcast", { event: "*" }, (payload) => {
        utils.list.wa.chats.invalidate({ conv_id: props.convId });

        if (payload.event === "INSERT") {
          utils.list.wa.conversations.invalidate();
        }
      })
      .subscribe((status, err) => {
        if (err) {
          console.error("WA Chats Subscription error:", err);
        } else if (status === "SUBSCRIBED") {
          console.log("WA Chats subscribed");
        } else if (status === "CHANNEL_ERROR") {
          console.error("WA Chats channel encountered an error");
        } else if (status === "TIMED_OUT") {
          console.error("WA Chats subs timed out");
        } else if (status === "CLOSED") {
          console.log("WA Chats channel closed");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Play notification sound when a new INBOUND message arrives.
  useEffect(() => {
    const currentIds = new Set(sortedChatList.map((chat) => chat.id));
    if (prevConvIdRef.current !== props.convId) {
      prevConvIdRef.current = props.convId;
    } else if (prevChatIdsRef.current.size > 0) {
      const hasNewInbound = sortedChatList.some(
        (chat) =>
          !prevChatIdsRef.current.has(chat.id) && chat.direction === "INBOUND"
      );
      if (hasNewInbound) playNotificationSound();
    }
    prevChatIdsRef.current = currentIds;
  }, [sortedChatList, props.convId]);

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
  }, [sortedChatList]);

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
        {!isLoading && !isError && sortedChatList.length > 0 && (
          <div className="chat-list w-full flex flex-col pt-5 mb-5 flex-grow">
            {sortedChatList.map((post, index, sorted) => {
              const currentDate = dayjs(post.created_at).format("YYYY-MM-DD");
              const prevDate =
                index > 0
                  ? dayjs(sorted[index - 1].created_at).format("YYYY-MM-DD")
                  : null;
              const showDateLabel = currentDate !== prevDate;

              return (
                <React.Fragment key={index}>
                  {showDateLabel && (
                    <div className="flex w-full justify-center my-1">
                      <p className="flex w-fit px-3 py-1 text-xs font-medium font-bodycopy text-[#333333]/70 bg-white/70 rounded-full">
                        {dayjs(post.created_at).format("ddd, DD MMM YYYY")}
                      </p>
                    </div>
                  )}
                  <div
                    className={`chat-wrapper flex w-full gap-10 ${
                      post.direction === "INBOUND"
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    <WhatsappChatItemCMS
                      chat={post as unknown as WhatsAppTypeAttachmentPairUnion}
                      chatMessage={post.message}
                      chatDirection={post.direction}
                      chatStatus={post.status}
                      createdAt={post.created_at}
                      sentAt={post.sent_at}
                      deliveredAt={post.delivered_at}
                      readAt={post.read_at}
                      failedAt={post.failed_at}
                    />
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}
        <form
          className="send-chat sticky flex flex-col bottom-3 w-full items-center justify-center gap-6 rounded-t-xl z-10"
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
