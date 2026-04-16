import { WhatsAppTypeAttachmentPairUnion } from "@/lib/whatsapp-types";
import { WACType } from "@prisma/client";

export type WhatsAppChatWithAttachment<
  T extends { type: WACType; attachment: unknown }
> = Omit<T, "type" | "attachment"> & WhatsAppTypeAttachmentPairUnion;

export function convertToWhatsAppChatWithAttachment<
  T extends { type: WACType; attachment: unknown }
>(list: T[]) {
  return list as WhatsAppChatWithAttachment<T>[];
}
