"use client";
import { WhatsappChatDirection, WhatsappChatStatus } from "@/lib/app-types";
import { toCapitalizeEachWord } from "@/lib/convert-case";
import dayjs from "dayjs";
import { ReactNode } from "react";

interface WhatsappChatBubbleCMSProps {
  chatDirection: WhatsappChatDirection;
  chatStatus: WhatsappChatStatus | null;
  iconStatus: ReactNode | null;
  timestampStatus: string | null;
  createdAt: string;
  children: ReactNode;
}

export default function WhatsappChatBubbleCMS(
  props: WhatsappChatBubbleCMSProps
) {
  return (
    <div className="chat-container flex flex-col w-fit max-w-[min(70%,560px)] my-1 gap-1 items-end">
      <div
        className={`chat-message flex flex-col w-fit max-w-full p-2 font-bodycopy text-[15px] font-[450] break-words whitespace-pre-wrap ${props.chatDirection === "INBOUND" ? "bg-white rounded-r-md rounded-bl-md" : "bg-tertiary-background text-tertiary-foreground rounded-l-md rounded-br-md"}`}
      >
        {props.children}
        {props.chatDirection === "INBOUND" && (
          <span className="chat-timestamp w-full text-right text-xs text-[#333333]/80 font-[450] leading-snug">
            {dayjs(props.createdAt).format("HH:mm")}
          </span>
        )}
      </div>
      {props.chatDirection === "OUTBOUND" && (
        <div className="status-information flex items-center gap-1 justify-end">
          {props.iconStatus}
          {props.chatStatus && (
            <p className="text-sm font-bodycopy font-medium text-[#333333]/80">
              {toCapitalizeEachWord(props.chatStatus)}{" "}
              {dayjs(props.timestampStatus).format("HH:mm")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
