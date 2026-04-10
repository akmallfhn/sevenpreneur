"use client";
import { LeadStatus } from "@/lib/app-types";
import { trpc } from "@/trpc/client";
import { ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
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

  // Fetch tRPC data
  const {
    data: convList,
    isLoading: isLoadingConvs,
    isError: isErrorConvs,
  } = trpc.list.wa.conversations.useQuery(
    {},
    { enabled: !!props.sessionToken }
  );
  const {
    data: chatList,
    isLoading: isLoadingChats,
    isError: isErrorChats,
  } = trpc.list.wa.chats.useQuery(
    {
      conv_id: selectedConvId,
    },
    { enabled: !!props.sessionToken && !!selectedConvId }
  );
  const {
    data: leadDetails,
    isLoading: isLoadingLeadDetails,
    isError: isErrorLeadDetails,
  } = trpc.read.wa.conversation.useQuery(
    { id: selectedConvId },
    { enabled: !!props.sessionToken && !!selectedConvId }
  );

  return (
    <PageContainerCMS className="h-screen">
      <div className="page-wrapper flex flex-col w-full gap-4">
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
                    convUserFullName={post.user_full_name || post.full_name}
                    convUserAvatar={post.user_avatar ?? null}
                    convLastMessage={post.last_message}
                    convLastMessageAt={post.last_message_at}
                    convLeadStatus={post.lead_status as LeadStatus}
                    convUnreadMessage={post.unread_count}
                    onClick={() => setSelectedConvId(post.id)}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="conv-details flex flex-[2.4] border rounded-r-lg">
            {selectedConvId ? (
              <div className="conv-wrapper flex w-full">
                <div className="chats flex flex-[1.25] border-r">
                  <WhatsappChatsCMS
                    convId={selectedConvId}
                    convChats={chatList?.list ?? []}
                    isLoading={isLoadingChats}
                    isError={isErrorChats}
                  />
                </div>
                <div className="lead-details flex flex-1">
                  {isLoadingLeadDetails && (
                    <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
                      <Loader2 className="animate-spin size-5 " />
                    </div>
                  )}
                  {isErrorLeadDetails && (
                    <div className="flex w-full h-full py-10 justify-center text-alternative font-bodycopy font-medium">
                      No Data
                    </div>
                  )}
                  {leadDetails &&
                    !isLoadingLeadDetails &&
                    !isErrorLeadDetails && (
                      <WhatsappLeadDetailsCMS
                        conversationId={selectedConvId}
                        leadId={null}
                        leadName={
                          leadDetails.conversation.user?.full_name ||
                          leadDetails.conversation.full_name
                        }
                        leadAvatar={
                          leadDetails.conversation.user?.avatar ?? null
                        }
                        leadPhoneNumber={
                          leadDetails.conversation.user?.phone_number ||
                          leadDetails.conversation.phone_number
                        }
                        leadEmail={leadDetails.conversation.user?.email ?? null}
                        leadStatus={leadDetails.conversation.lead_status}
                        leadWinningRate={
                          leadDetails.conversation.winning_rate ?? 0
                        }
                      />
                    )}
                </div>
              </div>
            ) : (
              <div>Lebih mantab pakai Whatsapp</div>
            )}
          </div>
        </div>
      </div>
    </PageContainerCMS>
  );
}
