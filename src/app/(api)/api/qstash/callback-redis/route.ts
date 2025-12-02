import { SetAIResultEphemeral } from "@/lib/redis";
import QStashHandlerVerified from "../handler";

export const POST = QStashHandlerVerified(async ({ messageId, content }) => {
  const savedResult = await SetAIResultEphemeral(messageId, content.response);
  if (!savedResult) {
    console.error(
      `qstash.callback-redis: The AI result (${messageId}) is not found.`
    );
  }
});
