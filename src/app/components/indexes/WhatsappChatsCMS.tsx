"use client";
import { LeadStatus } from "@/lib/app-types";
import { ChevronRight } from "lucide-react";
import WhatsappConvItemCMS from "../items/WhatsappConvItemCMS";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import PageTitleSectionCMS from "../titles/PageTitleSectionCMS";

export default function WhatsappChatsLMS() {
  const conv = [
    {
      full_name: "Andi Pratama",
      avatar: "https://i.pravatar.cc/150?img=1",
      last_message: "Bro, kita lanjut deal besok ya",
      last_message_at: "2026-03-20T08:15:30.000Z",
      lead_status: "HOT",
      unread_messages: 7,
    },
    {
      full_name: "Siti Rahma",
      avatar: "https://i.pravatar.cc/150?img=2",
      last_message: "Aku masih pertimbangin dulu ya kak",
      last_message_at: "2026-03-19T14:22:10.000Z",
      lead_status: "WARM",
      unread_messages: 3,
    },
    {
      full_name: "Budi Santoso",
      avatar: "https://i.pravatar.cc/150?img=3",
      last_message: "Nanti aku kabarin lagi",
      last_message_at: "2026-03-18T10:05:45.000Z",
      lead_status: "COLD",
      unread_messages: 0,
    },
    {
      full_name: "Dewi Lestari",
      avatar: "https://i.pravatar.cc/150?img=4",
      last_message: "Promo ini masih berlaku ga?",
      last_message_at: "2026-03-20T11:47:05.000Z",
      lead_status: "HOT",
      unread_messages: 12,
    },
    {
      full_name: "Rizky Hidayat",
      avatar: "https://i.pravatar.cc/150?img=5",
      last_message: "Boleh kirim detailnya?",
      last_message_at: "2026-03-19T20:33:55.000Z",
      lead_status: "WARM",
      unread_messages: 5,
    },
    {
      full_name: "Andi Pratama",
      avatar: "https://i.pravatar.cc/150?img=1",
      last_message: "Bro, kita lanjut deal besok ya",
      last_message_at: "2026-03-20T08:15:30.000Z",
      lead_status: "HOT",
      unread_messages: 7,
    },
    {
      full_name: "Siti Rahma",
      avatar: "https://i.pravatar.cc/150?img=2",
      last_message: "Aku masih pertimbangin dulu ya kak",
      last_message_at: "2026-03-19T14:22:10.000Z",
      lead_status: "WARM",
      unread_messages: 3,
    },
    {
      full_name: "Budi Santoso",
      avatar: "https://i.pravatar.cc/150?img=3",
      last_message: "Nanti aku kabarin lagi",
      last_message_at: "2026-03-18T10:05:45.000Z",
      lead_status: "COLD",
      unread_messages: 0,
    },
    {
      full_name: "Dewi Lestari",
      avatar: "https://i.pravatar.cc/150?img=4",
      last_message: "Promo ini masih berlaku ga?",
      last_message_at: "2026-03-20T11:47:05.000Z",
      lead_status: "HOT",
      unread_messages: 12,
    },
    {
      full_name: "Rizky Hidayat",
      avatar: "https://i.pravatar.cc/150?img=5",
      last_message: "Boleh kirim detailnya?",
      last_message_at: "2026-03-19T20:33:55.000Z",
      lead_status: "WARM",
      unread_messages: 5,
    },
    {
      full_name: "Andi Pratama",
      avatar: "https://i.pravatar.cc/150?img=1",
      last_message: "Bro, kita lanjut deal besok ya",
      last_message_at: "2026-03-20T08:15:30.000Z",
      lead_status: "HOT",
      unread_messages: 7,
    },
    {
      full_name: "Siti Rahma",
      avatar: "https://i.pravatar.cc/150?img=2",
      last_message: "Aku masih pertimbangin dulu ya kak",
      last_message_at: "2026-03-19T14:22:10.000Z",
      lead_status: "WARM",
      unread_messages: 3,
    },
    {
      full_name: "Budi Santoso",
      avatar: "https://i.pravatar.cc/150?img=3",
      last_message: "Nanti aku kabarin lagi",
      last_message_at: "2026-03-18T10:05:45.000Z",
      lead_status: "COLD",
      unread_messages: 0,
    },
    {
      full_name: "Dewi Lestari",
      avatar: "https://i.pravatar.cc/150?img=4",
      last_message: "Promo ini masih berlaku ga?",
      last_message_at: "2026-03-20T11:47:05.000Z",
      lead_status: "HOT",
      unread_messages: 12,
    },
    {
      full_name: "Rizky Hidayat",
      avatar: "https://i.pravatar.cc/150?img=5",
      last_message: "Boleh kirim detailnya?",
      last_message_at: "2026-03-19T20:33:55.000Z",
      lead_status: "WARM",
      unread_messages: 5,
    },
  ];

  return (
    <div className="root hidden w-full h-screen justify-center bg-white py-8 lg:flex lg:pl-64">
      <div className="index flex flex-col max-w-[calc(100%-4rem)] w-full h-full gap-4">
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
        <div className="flex w-full min-h-0">
          <div className="conversations-column flex flex-col flex-1 min-h-0 shrink-0 border rounded-l-lg overflow-y-auto">
            <div className="column-title sticky inset-0 top-0 p-3 bg-white font-bodycopy font-bold border-b z-30">
              Chats
            </div>
            <div className="conv-list p-2 flex flex-col">
              {conv.map((post, index) => (
                <WhatsappConvItemCMS
                  key={index}
                  convUserFullName={post.full_name}
                  convUserAvatar={post.avatar}
                  convLastMessage={post.last_message}
                  convLastMessageAt={post.last_message_at}
                  convLeadStatus={post.lead_status as LeadStatus}
                  convUnreadMessage={post.unread_messages}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-[1.6] border"></div>
          <div className="flex flex-1 border rounded-r-lg"></div>
        </div>
      </div>
    </div>
  );
}
