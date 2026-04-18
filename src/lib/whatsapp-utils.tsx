import { WhatsappChatStatus, WhatsappChatType } from "@/lib/app-types";
import {
  AudioLines,
  Check,
  CheckCheck,
  FileQuestionMark,
  ImageIcon,
  TriangleAlert,
  Video,
} from "lucide-react";
import { ReactNode } from "react";

type WhatsappChatStatusResult = {
  iconStatus: React.ReactNode;
  timestampStatus: string | null;
};

export function resolveWhatsappChatStatus(
  chatStatus: WhatsappChatStatus | null,
  timestamps?: {
    readAt: string | null;
    deliveredAt: string | null;
    sentAt: string | null;
    failedAt: string | null;
  }
): WhatsappChatStatusResult {
  if (chatStatus === "READ") {
    return {
      iconStatus: <CheckCheck className="size-4 text-primary" />,
      timestampStatus: timestamps?.readAt ?? null,
    };
  } else if (chatStatus === "DELIVERED") {
    return {
      iconStatus: <CheckCheck className="size-4 text-emphasis" />,
      timestampStatus: timestamps?.deliveredAt ?? null,
    };
  } else if (chatStatus === "SENT") {
    return {
      iconStatus: <Check className="size-4 text-emphasis" />,
      timestampStatus: timestamps?.sentAt ?? null,
    };
  } else if (chatStatus === "FAILED") {
    return {
      iconStatus: <TriangleAlert className="size-4 text-destructive" />,
      timestampStatus: timestamps?.failedAt ?? null,
    };
  }

  return {
    iconStatus: <Check className="size-4 text-emphasis" />,
    timestampStatus: timestamps?.sentAt ?? null,
  };
}

type WhatsappChatTypeResult = {
  iconType: ReactNode;
  labelType: string;
};

export function getLabelWhatsappChatType(
  chatType: WhatsappChatType
): WhatsappChatTypeResult {
  if (chatType === "IMAGE") {
    return {
      iconType: <ImageIcon className="size-4 text-emphasis" />,
      labelType: "Photo",
    };
  } else if (chatType === "VIDEO") {
    return {
      iconType: <Video className="size-4 text-emphasis" />,
      labelType: "Video",
    };
  } else if (chatType === "AUDIO") {
    return {
      iconType: <AudioLines className="size-4 text-emphasis" />,
      labelType: "Voice Recording",
    };
  }

  return {
    iconType: <FileQuestionMark className="size-4 text-emphasis" />,
    labelType: "Format not supported",
  };
}
