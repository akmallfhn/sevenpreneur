import LogError from "@/lib/prisma-log-error";
import { SetAIResultEphemeral } from "@/lib/redis";
import QStashHandlerVerified from "../handler";

export const POST = QStashHandlerVerified(async ({ messageId, content }) => {
  const savedResult = await SetAIResultEphemeral(messageId, content.response);
  if (!savedResult) {
    await LogError(
      "qstash.callback-redis",
      `The AI result (${messageId}) is not found.`
    );
  }
});
