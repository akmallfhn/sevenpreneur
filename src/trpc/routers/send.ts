import { createTRPCRouter } from "../init";
import { sendWA } from "./wa/send.wa";

export const sendRouter = createTRPCRouter({
  // WhatsApp-chat-related //

  wa: {
    chat: sendWA.chat,
    audio: sendWA.audio,
    document: sendWA.document,
    image: sendWA.image,
    sticker: sendWA.sticker,
    video: sendWA.video,
  },
});
