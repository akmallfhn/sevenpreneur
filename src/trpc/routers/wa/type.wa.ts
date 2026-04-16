import {
  WhatsappAttachmentAudio,
  WhatsappAttachmentContacts,
  WhatsappAttachmentDocument,
  WhatsappAttachmentImage,
  WhatsappAttachmentSticker,
  WhatsappAttachmentText,
  WhatsappAttachmentVideo,
} from "@/lib/whatsapp-types";
import { WACType } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export type WhatsAppChatWithAttachment<
  T extends { type: WACType; attachment: JsonValue }
> = Omit<T, "type" | "attachment"> &
  (
    | {
        type: typeof WACType.AUDIO;
        attachment: WhatsappAttachmentAudio;
      }
    | {
        type: typeof WACType.CONTACTS;
        attachment: WhatsappAttachmentContacts;
      }
    | {
        type: typeof WACType.DOCUMENT;
        attachment: WhatsappAttachmentDocument;
      }
    | {
        type: typeof WACType.IMAGE;
        attachment: WhatsappAttachmentImage;
      }
    | {
        type: typeof WACType.STICKER;
        attachment: WhatsappAttachmentSticker;
      }
    | {
        type: typeof WACType.TEXT;
        attachment: WhatsappAttachmentText;
      }
    | {
        type: typeof WACType.VIDEO;
        attachment: WhatsappAttachmentVideo;
      }
    | {
        type:
          | typeof WACType.BUTTON
          | typeof WACType.EDIT
          | typeof WACType.INTERACTIVE
          | typeof WACType.LOCATION
          | typeof WACType.ORDER
          | typeof WACType.REACTION
          | typeof WACType.REVOKE
          | typeof WACType.SYSTEM
          | typeof WACType.UNSUPPORTED;
        attachment: JsonValue | undefined;
      }
  );

export function convertToWhatsAppChatWithAttachment<
  T extends { type: WACType; attachment: JsonValue }
>(list: T[]) {
  return list as WhatsAppChatWithAttachment<T>[];
}
