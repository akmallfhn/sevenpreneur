"use client";
import { LeadStatus } from "@/lib/app-types";
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
    bg_color: "text-primary bg-primary-light",
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
  convUserFullName: string;
  convUserAvatar: string;
  convLastMessage: string;
  convLastMessageAt: string;
  convLeadStatus: LeadStatus;
  convUnreadMessage: number;
}

export default function WhatsappConvItemCMS(props: WhatsappConvItemCMSProps) {
  const { bg_color, icon } = variantStyles[props.convLeadStatus];

  return (
    <div className="conv-item flex gap-2 p-3 justify-between rounded-md overflow-hidden hover:cursor-pointer hover:bg-[#f4f4f4]">
      <div className="conv-metadata flex items-center gap-3">
        <div className="conv-sender-avatar relative flex">
          <div className="aspect-square size-10 shrink-0 rounded-full overflow-hidden">
            <Image
              className="object-cover w-full h-full"
              src={props.convUserAvatar}
              alt="user"
              width={500}
              height={500}
            />
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
          <p className="conv-last-message text-sm text-[#333333]/70 font-bodycopy font-[450] line-clamp-1">
            {props.convLastMessage}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 items-center shrink-0">
        <p
          className={`conv-last-message-at text-[13px] font-bodycopy font-medium line-clamp-1 ${props.convUnreadMessage > 0 ? "text-cms-primary" : ""}`}
        >
          {dayjs(props.convLastMessageAt).format("HH:mm")}
        </p>
        {props.convUnreadMessage > 0 && (
          <p className="conv-unread-messages w-fit text-[10px] text-white font-bodycopy font-bold py-0.5 px-2 bg-cms-primary rounded-full">
            {props.convUnreadMessage}
          </p>
        )}
      </div>
    </div>
  );
}
