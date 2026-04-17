"use client";
import { supabase } from "@/lib/supabase";
import { playNotificationSound } from "@/lib/sounds";
import { LeadStatus } from "@/lib/app-types";
import { trpc } from "@/trpc/client";
import { ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import WhatsappLeadDetailsCMS from "../elements/WhatsappLeadDetailsCMS";
import WhatsappConvItemCMS from "../items/WhatsappConvItemCMS";
import WhatsappChatsCMS from "../messages/WhatsappChatsCMS";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import PageContainerCMS from "../pages/PageContainerCMS";
import PageTitleSectionCMS from "../titles/PageTitleSectionCMS";

interface WhatsappConvsCMSProps {
  sessionToken: string;
}

export default function WhatsappConvsCMS(props: WhatsappConvsCMSProps) {
  const [selectedConvId, setSelectedConvId] = useState("");
  const utils = trpc.useUtils();
  const prevUnreadRef = useRef<Map<string, number>>(new Map());

  // Fetch tRPC data
  const {
    data: convList,
    isLoading: isLoadingConvs,
    isError: isErrorConvs,
  } = trpc.list.wa.conversations.useQuery(
    {},
    { enabled: !!props.sessionToken }
  );

  // Subscribe to Realtime to keep convList updated even when no conversation is selected
  useEffect(() => {
    const channel = supabase
      .channel("wa_change")
      .on("broadcast", { event: "*" }, () => {
        utils.list.wa.conversations.invalidate();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [utils]);

  // Play notification sound when unread_count increases for a non-selected conversation
  useEffect(() => {
    if (!convList?.list) return;

    const prev = prevUnreadRef.current;
    if (prev.size > 0) {
      const hasNewUnread = convList.list.some((conv) => {
        if (conv.id === selectedConvId) return false;
        const prevCount = prev.get(conv.id) ?? 0;
        return conv.unread_count > prevCount;
      });
      if (hasNewUnread) playNotificationSound();
    }

    prevUnreadRef.current = new Map(
      convList.list.map((conv) => [conv.id, conv.unread_count])
    );
  }, [convList?.list, selectedConvId]);

  return (
    <PageContainerCMS className="h-screen">
      <div className="page-wrapper flex flex-col w-full h-full gap-4">
        <div className="page-header flex flex-col gap-3">
          <AppBreadcrumb>
            <ChevronRight className="size-3.5" />
            <AppBreadcrumbItem href="/users" isCurrentPage>
              Whatsapp Chats
            </AppBreadcrumbItem>
          </AppBreadcrumb>
          <div className="page-title-actions flex justify-between items-center">
            <PageTitleSectionCMS pageTitle="Whatsapp Chats" />
          </div>
        </div>
        <div className="conv-details flex flex-1 w-full min-h-0">
          <div className="convs-panels flex flex-col flex-1 min-h-0 shrink-0 border rounded-l-lg overflow-y-auto">
            <div className="column-title sticky inset-0 top-0 p-3 bg-white font-bodycopy font-bold border-b z-30">
              Chats
            </div>
            {/* Loading & Error State */}
            {isLoadingConvs && (
              <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
                <Loader2 className="animate-spin size-5 " />
              </div>
            )}
            {isErrorConvs && (
              <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
                No Data
              </div>
            )}
            {!isLoadingConvs && !isErrorConvs && (
              <div className="conv-list p-2 flex flex-col">
                {convList?.list.map((post, index) => (
                  <WhatsappConvItemCMS
                    key={index}
                    convId={post.id}
                    convUserFullName={post.user_full_name || post.full_name}
                    convUserAvatar={post.user_avatar ?? null}
                    convLastMessage={post.last_message}
                    convLastMessageAt={post.last_message_at}
                    convLeadStatus={post.lead_status as LeadStatus}
                    convUnreadMessage={post.unread_count}
                    selectedConvId={selectedConvId}
                    onClick={() => setSelectedConvId(post.id)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="conv-details flex flex-[2.6] border rounded-r-lg">
            {selectedConvId ? (
              <div className="conv-wrapper flex w-full">
                <div className="chats flex flex-[1.35] border-r">
                  <WhatsappChatsCMS
                    sessionToken={props.sessionToken}
                    convId={selectedConvId}
                  />
                </div>
                <div className="lead-details flex flex-1">
                  <WhatsappLeadDetailsCMS
                    key={selectedConvId}
                    sessionToken={props.sessionToken}
                    convId={selectedConvId}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full gap-3 px-8">
                <div className="state-illustration flex max-w-72 overflow-hidden">
                  <Image
                    className="object-cover w-full h-full"
                    src={
                      "https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/sales-illustration.svg"
                    }
                    alt="chat-cms"
                    width={500}
                    height={400}
                  />
                </div>
                <div className="flex flex-col gap-1.5 text-center">
                  <h3 className="font-bodycopy font-bold text-2xl">
                    Siap Cuan Hari Ini?
                  </h3>
                  <p className="font-bodycopy font-medium text-alternative max-w-sm">
                    Pilih chat di sebelah kiri dan ubah setiap percakapan jadi
                    closing deals!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainerCMS>
  );
}
