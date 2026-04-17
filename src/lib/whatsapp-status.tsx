import { WhatsappChatStatus } from "@/lib/app-types";
import { Check, CheckCheck, TriangleAlert } from "lucide-react";

type WhatsappChatStatusResult = {
  iconStatus: React.ReactNode;
  timestampStatus: string | null;
};

export function resolveWhatsappChatStatus(
  chatStatus: WhatsappChatStatus | null,
  timestamps: {
    readAt: string | null;
    deliveredAt: string | null;
    sentAt: string | null;
    failedAt: string | null;
  }
): WhatsappChatStatusResult {
  if (chatStatus === "READ") {
    return {
      iconStatus: <CheckCheck className="size-4 text-primary" />,
      timestampStatus: timestamps.readAt,
    };
  } else if (chatStatus === "DELIVERED") {
    return {
      iconStatus: <CheckCheck className="size-4 text-[#333333]/80" />,
      timestampStatus: timestamps.deliveredAt,
    };
  } else if (chatStatus === "SENT") {
    return {
      iconStatus: <Check className="size-4 text-[#333333]/80" />,
      timestampStatus: timestamps.sentAt,
    };
  } else if (chatStatus === "FAILED") {
    return {
      iconStatus: <TriangleAlert className="size-4 text-destructive" />,
      timestampStatus: timestamps.failedAt,
    };
  }

  return {
    iconStatus: <Check className="size-4 text-[#333333]/80" />,
    timestampStatus: timestamps.sentAt,
  };
}
