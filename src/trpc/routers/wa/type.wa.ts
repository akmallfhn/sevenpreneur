import { WACType } from "@/generated/prisma/client";
import { WhatsAppTypeAttachmentPairUnion } from "@/lib/whatsapp-types";

export type { WhatsAppTypeAttachmentPairUnion };

export type WhatsAppChatWithAttachment<
  T extends { type: WACType; attachment: unknown }
> = Omit<T, "type" | "attachment"> & WhatsAppTypeAttachmentPairUnion;

export function convertToWhatsAppChatWithAttachment<
  T extends { type: WACType; attachment: unknown }
>(list: T[]) {
  return list as WhatsAppChatWithAttachment<T>[];
}
