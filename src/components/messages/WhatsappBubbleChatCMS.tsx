"use client";
import { WhatsappChatDirection, WhatsappChatStatus } from "@/lib/app-types";
import { toCapitalizeEachWord } from "@/lib/convert-case";
import dayjs from "dayjs";
import { Check, CheckCheck, TriangleAlert } from "lucide-react";

interface WhatsappBubbleChatCMSProps {
  chatMessage: string;
  chatStatus: WhatsappChatStatus;
  chatDirection: WhatsappChatDirection;
  createdAt: string;
  sentAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
}

export default function WhatsappBubbleChatCMS(
  props: WhatsappBubbleChatCMSProps
) {
  let iconStatus;
  let timestampStatus;
  if (props.chatStatus === "READ") {
    iconStatus = <CheckCheck className="size-4 text-primary" />;
    timestampStatus = props.sentAt;
  } else if (props.chatStatus === "DELIVERED") {
    iconStatus = <CheckCheck className="size-4 text-[#333333]/80" />;
    timestampStatus = props.deliveredAt;
  } else if (props.chatStatus === "SENT") {
    iconStatus = <Check className="size-4 text-[#333333]/80" />;
    timestampStatus = props.sentAt;
  } else {
    iconStatus = <TriangleAlert className="size-4 text-destructive" />;
  }

  return (
    <div className="chat-container flex flex-col w-fit max-w-[min(70%,560px)] my-3 gap-1">
      <div
        className={`chat-message flex flex-col w-fit px-4 py-2 gap-0.5 font-bodycopy text-[15px] font-[450] break-words whitespace-pre-wrap ${props.chatDirection === "INBOUND" ? "bg-white rounded-r-md rounded-bl-md" : "bg-[#F5F2FF] rounded-l-md rounded-br-md"}`}
      >
        <p>{props.chatMessage}</p>
        <span className="chat-timestamp w-full text-right text-xs text-[#333333]/80 font-[450]">
          {dayjs(props.createdAt).format("HH:mm")}
        </span>
      </div>
      {props.chatDirection === "OUTBOUND" && (
        <div className="status-information flex items-center gap-1">
          {iconStatus}
          <p className="text-sm font-bodycopy font-medium text-[#333333]/80">
            {toCapitalizeEachWord(props.chatStatus)}{" "}
            {dayjs(timestampStatus).format("HH:mm")}
          </p>
        </div>
      )}
    </div>
  );
}
