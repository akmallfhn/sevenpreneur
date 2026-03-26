"use client";
import { useSidebar } from "@/app/contexts/SidebarContextCMS";
import { Slider } from "@/components/ui/slider";
import { LeadStatus } from "@/lib/app-types";
import {
  ChevronRight,
  CloudSync,
  Loader,
  PenBox,
  TextAlignStart,
} from "lucide-react";
import Image from "next/image";
import AppButton from "../buttons/AppButton";
import TextAreaCMS from "../fields/TextAreaCMS";
import WhatsappConvItemCMS from "../items/WhatsappConvItemCMS";
import LeadStatusLabelCMS from "../labels/LeadStatusLabelCMS";
import WhatsappChatsCMS, {
  WhatsappChatItem,
} from "../messages/WhatsappChatsCMS";
import AppBreadcrumb from "../navigations/AppBreadcrumb";
import AppBreadcrumbItem from "../navigations/AppBreadcrumbItem";
import PageTitleSectionCMS from "../titles/PageTitleSectionCMS";

export default function WhatsappConvsCMS() {
  const { isCollapsed } = useSidebar();
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

  const leadStatus: LeadStatus = "HOT";

  const whatsappChats: WhatsappChatItem[] = [
    {
      id: "1",
      message: "Halo kak, saya tertarik dengan tiketnya 🙏",
      direction: "INBOUND",
      status: "READ",
      created_at: "2026-03-26T08:15:30Z",
      sent_at: "2026-03-26T08:15:30Z",
      delivered_at: "2026-03-26T08:15:32Z",
      read_at: "2026-03-26T08:15:40Z",
      failed_at: null,
    },
    {
      id: "2",
      message: "Hi kak! Untuk tiket yang mana ya?",
      direction: "OUTBOUND",
      status: "READ",
      created_at: "2026-03-26T08:16:10Z",
      sent_at: "2026-03-26T08:16:10Z",
      delivered_at: "2026-03-26T08:16:12Z",
      read_at: "2026-03-26T08:16:25Z",
      failed_at: null,
    },
    {
      id: "3",
      message: "Yang VIP early bird masih ada?",
      direction: "INBOUND",
      status: "READ",
      created_at: "2026-03-26T08:17:02Z",
      sent_at: "2026-03-26T08:17:02Z",
      delivered_at: "2026-03-26T08:17:05Z",
      read_at: "2026-03-26T08:17:20Z",
      failed_at: null,
    },
    {
      id: "4",
      message: "Masih ada kak, tapi tinggal sedikit 👍",
      direction: "OUTBOUND",
      status: "READ",
      created_at: "2026-03-26T08:18:45Z",
      sent_at: "2026-03-26T08:18:45Z",
      delivered_at: "2026-03-26T08:18:48Z",
      read_at: "2026-03-26T08:18:48Z",
      failed_at: null,
    },
    {
      id: "5",
      message: "Kalau mau cicilan bisa gak ya?",
      direction: "INBOUND",
      status: "DELIVERED",
      created_at: "2026-03-26T08:20:11Z",
      sent_at: "2026-03-26T08:20:11Z",
      delivered_at: "2026-03-26T08:20:13Z",
      read_at: null,
      failed_at: null,
    },
    {
      id: "6",
      message: "Bisa kak! Kita ada opsi cicilan tanpa kartu kredit 😊",
      direction: "OUTBOUND",
      status: "READ",
      created_at: "2026-03-26T08:21:30Z",
      sent_at: "2026-03-26T08:21:30Z",
      delivered_at: "2026-03-26T08:21:30Z",
      read_at: "2026-03-26T08:21:30Z",
      failed_at: null,
    },
    {
      id: "7",
      message: "Wah menarik, ada promo juga gak?",
      direction: "INBOUND",
      status: "SENT",
      created_at: "2026-03-26T08:22:05Z",
      sent_at: "2026-03-26T08:22:05Z",
      delivered_at: null,
      read_at: null,
      failed_at: null,
    },
    {
      id: "8",
      message: "Ada kak, lagi promo diskon 20% sampai akhir minggu ini 🔥",
      direction: "OUTBOUND",
      status: "READ",
      created_at: "2026-03-26T08:23:50Z",
      sent_at: "2026-03-26T08:23:50Z",
      delivered_at: "2026-03-26T08:23:50Z",
      read_at: "2026-03-26T08:23:50Z",
      failed_at: null,
    },
    {
      id: "9",
      message: "Wah boleh banget, gimana cara belinya?",
      direction: "INBOUND",
      status: "READ",
      created_at: "2026-03-26T08:25:10Z",
      sent_at: "2026-03-26T08:25:10Z",
      delivered_at: "2026-03-26T08:25:10Z",
      read_at: "2026-03-26T08:25:10Z",
      failed_at: null,
    },
    {
      id: "10",
      message: "Aku kirim link pembeliannya ya kak 👇",
      direction: "OUTBOUND",
      status: "DELIVERED",
      created_at: "2026-03-26T08:26:00Z",
      sent_at: "2026-03-26T08:26:00Z",
      delivered_at: "2026-03-26T08:26:03Z",
      read_at: null,
      failed_at: null,
    },
  ];

  return (
    <div
      className={`root hidden w-full h-screen justify-center bg-white py-8 lg:flex ${isCollapsed ? "pl-16" : "pl-64"}`}
    >
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
          <div className="convs-panels flex flex-col flex-1 min-h-0 shrink-0 border rounded-l-lg overflow-y-auto">
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
          <div className="chats flex flex-[1.6] border">
            <WhatsappChatsCMS convId="100" convChats={whatsappChats} />
          </div>
          <div className="lead-informations flex flex-col flex-1 w-full gap-4 p-3 py-5 border rounded-r-lg overflow-y-auto">
            <div className="lead-identity flex flex-col items-center gap-2">
              <div className="lead-avatar size-24 rounded-full overflow-hidden">
                <Image
                  src={"https://i.pravatar.cc/150?img=1"}
                  alt="user"
                  width={500}
                  height={500}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="lead-name text-lg text-center font-bold font-bodycopy leading-snug line-clamp-2">
                  Budi Santoso
                </p>
                <p className="lead-phone-number text-sm text-[#333333]/70 font-semibold font-bodycopy leading-snug line-clamp-1">
                  +6299898988787
                </p>
                <p className="lead-email text-sm text-[#333333]/70 font-semibold font-bodycopy leading-snug line-clamp-1">
                  budisantoso@gmail.com
                </p>
              </div>
              <AppButton size="smallRounded" variant="cmsPrimaryLight">
                <CloudSync className="size-4" />
                Sync to Database
              </AppButton>
            </div>
            <div className="lead-details flex flex-col gap-2 p-3 bg-section-background/50  border border-outline rounded-md">
              <div className="flex w-full justify-between items-center leading-snug">
                <h5 className="font-bodycopy text-[15px] font-bold">
                  Lead Details
                </h5>
                <AppButton
                  className="text-cms-primary"
                  size="small"
                  variant="ghost"
                >
                  <PenBox className="size-3.5" />
                  Edit
                </AppButton>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex w-full items-center">
                  <p className="label w-32 text-sm text-alternative font-bodycopy font-medium">
                    Handled by
                  </p>
                  <div className="flex w-full">
                    <div className="input flex w-fit items-center gap-2 bg-white py-1 px-2 rounded-full border border-outline">
                      <div className="size-5 rounded-full overflow-hidden">
                        <Image
                          src={"https://i.pravatar.cc/150?img=1"}
                          alt="user"
                          width={500}
                          height={500}
                        />
                      </div>
                      <p className="text-sm text-[#333333] font-bodycopy font-semibold">
                        Devin Suhartono
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex w-full items-center">
                  <p className="label w-32 text-sm text-alternative font-bodycopy font-medium">
                    Status
                  </p>
                  <div className="input w-full">
                    <LeadStatusLabelCMS variants={leadStatus} />
                  </div>
                </div>
              </div>
            </div>
            <div className="lead-progress flex flex-col gap-2 p-3 bg-section-background/50  border border-outline rounded-md">
              <div className="flex items-center gap-2">
                <Loader className="size-4 text-alternative" />
                <h5 className="font-bodycopy text-[15px] font-bold">
                  Winning Rate
                </h5>
              </div>
              <div className="flex w-full items-center gap-2">
                <Slider defaultValue={[0]} max={100} step={5} />
                <div className="input w-fit text-sm text-[#333333] font-bodycopy font-medium">
                  50%
                </div>
              </div>
            </div>
            <div className="notes flex flex-col gap-2 p-3 bg-section-background/50 border border-outline rounded-md">
              <div className="flex items-center gap-2">
                <TextAlignStart className="size-4 text-alternative" />
                <h5 className="font-bodycopy text-[15px] font-bold">Notes</h5>
              </div>
              <TextAreaCMS
                textAreaId="chat-notes"
                textAreaPlaceholder="Take notes for important things"
                textAreaHeight="h-32"
                value={""}
                // onTextAreaChange={handleInputChange("cohortDescription")}
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
