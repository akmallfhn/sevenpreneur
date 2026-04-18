"use client";
import {
  LeadStatus,
  WhatsappChatDirection,
  WhatsappChatStatus,
  WhatsappChatType,
} from "@/lib/app-types";
import {
  getLabelWhatsappChatType,
  resolveWhatsappChatStatus,
} from "@/lib/whatsapp-utils";
import {
  faFire,
  faMugHot,
  faSnowflake,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import Image from "next/image";

const variantStyles: Record<
  LeadStatus,
  {
    icon: IconDefinition;
    bg_color: string;
  }
> = {
  COLD: {
    icon: faSnowflake,
    bg_color: "text-primary-soft-foreground bg-primary-soft-background",
  },
  WARM: {
    icon: faMugHot,
    bg_color: "text-[#FB7A36] bg-[#FDE4D8]",
  },
  HOT: {
    icon: faFire,
    bg_color: "text-[#FED106] bg-destructive",
  },
};

interface WhatsappConvItemCMSProps {
  convId: string;
  convUserFullName: string;
  convUserAvatar: string | null;
  convLastMessage: string;
  convLastMessageDirection: WhatsappChatDirection;
  convLastMessageStatus: WhatsappChatStatus | null;
  convLastMessageType: WhatsappChatType;
  convLastMessageAt: string;
  convLeadStatus: LeadStatus;
  convUnreadMessage: number;
  selectedConvId: string;
  onClick?: () => void;
}

export default function WhatsappConvItemCMS(props: WhatsappConvItemCMSProps) {
  const { bg_color, icon } = variantStyles[props.convLeadStatus];
  const isActive = props.convId === props.selectedConvId;

  const initialName = props.convUserFullName
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const { iconStatus } = resolveWhatsappChatStatus(props.convLastMessageStatus);
  const { iconType, labelType } = getLabelWhatsappChatType(
    props.convLastMessageType
  );

  return (
    <div
      onClick={props.onClick}
      className={`conv-item flex gap-2 p-3 justify-between rounded-md overflow-hidden hover:cursor-pointer hover:bg-[#ebebeb] ${isActive ? "bg-[#EBEBEB]" : ""}`}
    >
      <div className="conv-metadata flex items-center gap-3">
        <div className="conv-sender-avatar relative flex">
          <div className="aspect-square size-10 shrink-0 rounded-full overflow-hidden">
            {props.convUserAvatar ? (
              <Image
                className="object-cover w-full h-full"
                src={props.convUserAvatar}
                alt="user"
                width={500}
                height={500}
              />
            ) : (
              <div className="flex w-full h-full items-center justify-center bg-secondary-soft-background text-secondary-soft-foreground">
                <p className="font-bodycopy font-medium">{initialName}</p>
              </div>
            )}
          </div>
          {props.convLeadStatus !== "COLD" && (
            <div
              className={`conv-lead-status absolute flex bottom-0 -right-1 items-center justify-center ${bg_color} aspect-square size-5 rounded-full overflow-hidden`}
            >
              <FontAwesomeIcon icon={icon} size="2xs" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <p className="conv-full-name text-[15px] font-semibold font-bodycopy leading-snug line-clamp-1">
            {props.convUserFullName}
          </p>
          <div className="flex items-center gap-1.5">
            {props.convLastMessageDirection === "OUTBOUND" && (
              <div>{iconStatus}</div>
            )}
            <div className="flex items-center gap-1">
              {props.convLastMessageType !== "TEXT" && <div>{iconType}</div>}
              <p className="conv-last-message text-sm text-emphasis font-bodycopy font-[450] line-clamp-1">
                {props.convLastMessageType === "TEXT"
                  ? props.convLastMessage
                  : labelType}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 items-center shrink-0">
        <p
          className={`conv-last-message-at text-[13px] font-bodycopy font-medium line-clamp-1 ${props.convUnreadMessage > 0 ? "text-cms-primary" : ""}`}
        >
          {dayjs(props.convLastMessageAt).format("HH:mm")}
        </p>
        {props.convUnreadMessage > 0 && (
          <p className="conv-unread-messages w-fit text-[10px] text-tertiary-foreground bg-tertiary-background font-bodycopy font-bold py-0.5 px-2 rounded-full">
            {props.convUnreadMessage}
          </p>
        )}
      </div>
    </div>
  );
}
