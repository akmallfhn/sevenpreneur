import { createTRPCRouter } from "../init";
import { sendWA } from "./wa/send.wa";

export const sendRouter = createTRPCRouter({
  // WhatsApp-chat-related //

  wa: {
    chat: sendWA.chat,
  },
});
