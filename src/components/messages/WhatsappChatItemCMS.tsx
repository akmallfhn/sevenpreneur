"use client";
import { useState } from "react";
import { WhatsappChatDirection, WhatsappChatStatus } from "@/lib/app-types";
import { resolveWhatsappChatStatus } from "@/lib/whatsapp-status";
import { WhatsAppTypeAttachmentPairUnion } from "@/lib/whatsapp-types";
import WhatsappChatBubbleCMS from "./WhatsappChatBubbleCMS";
import WhatsappImagePreviewCMS from "../modals/WhatsappImagePreviewCMS";
import Image from "next/image";

interface WhatsappChatItemCMSProps {
  chat: WhatsAppTypeAttachmentPairUnion;
  chatDirection: WhatsappChatDirection;
  chatStatus: WhatsappChatStatus | null;
  chatMessage: string;
  createdAt: string;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
}

export default function WhatsappChatItemCMS(props: WhatsappChatItemCMSProps) {
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const { iconStatus, timestampStatus } = resolveWhatsappChatStatus(
    props.chatStatus,
    {
      readAt: props.readAt,
      deliveredAt: props.deliveredAt,
      sentAt: props.sentAt,
      failedAt: props.failedAt,
    }
  );

  if (props.chat.type === "TEXT") {
    return (
      <WhatsappChatBubbleCMS
        chatDirection={props.chatDirection}
        chatStatus={props.chatStatus}
        iconStatus={iconStatus}
        timestampStatus={timestampStatus}
        createdAt={props.createdAt}
      >
        <p className="px-1">{props.chatMessage}</p>
      </WhatsappChatBubbleCMS>
    );
  }

  // if (props.chat.type === "IMAGE") {
  //   return (
  //     <>
  //       <WhatsappChatBubbleCMS
  //         chatDirection={props.chatDirection}
  //         chatStatus={props.chatStatus}
  //         iconStatus={iconStatus}
  //         timestampStatus={timestampStatus}
  //         createdAt={props.createdAt}
  //       >
  //         <div className="image flex flex-col w-full gap-1 pb-1">
  //           <Image
  //             className="w-full h-full rounded-sm cursor-pointer"
  //             src="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/cohort/1765529832399.webp"
  //             alt={props.chat.attachment.caption || "Image Whatsapp"}
  //             width={300}
  //             height={300}
  //             onClick={() => setIsImagePreviewOpen(true)}
  //           />
  //           {!!props.chat.attachment.caption && (
  //             <p className="p-1">{props.chat.attachment.caption}</p>
  //           )}
  //         </div>
  //       </WhatsappChatBubbleCMS>

  //       {/* Preview image */}
  //       {isImagePreviewOpen && (
  //         <WhatsappImagePreviewCMS
  //           imageURL="https://tskubmriuclmbcfmaiur.supabase.co/storage/v1/object/public/sevenpreneur/cohort/1765529832399.webp"
  //           imageCaption={props.chat.attachment.caption}
  //           isOpen={isImagePreviewOpen}
  //           onClose={() => setIsImagePreviewOpen(false)}
  //         />
  //       )}
  //     </>
  //   );
  // }

  return (
    <WhatsappChatBubbleCMS
      chatDirection={props.chatDirection}
      chatStatus={props.chatStatus}
      iconStatus={iconStatus}
      timestampStatus={timestampStatus}
      createdAt={props.createdAt}
    >
      <p className="px-2 italic text-muted-foreground">Format unsupported</p>
    </WhatsappChatBubbleCMS>
  );
}
