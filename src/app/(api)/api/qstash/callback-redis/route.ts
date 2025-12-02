import { SetAIResultEphemeral } from "@/lib/redis";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

async function handler(req: Request) {
  // The response from QStash
  const result = await req.json();
  const sourceMessageId = result.sourceMessageId as string;

  // The response from OpenAI API
  const body = JSON.parse(atob(result.body));

  // The reply/assistant message
  const assistantContents = [];
  for (const output of body.output) {
    if (
      output.type === "message" &&
      output.status === "completed" &&
      output.role === "assistant"
    ) {
      assistantContents.push(...output.content);
    }
  }
  let assistantText = "";
  for (const content of assistantContents) {
    if (content.type === "output_text") {
      assistantText += content.text;
    }
  }
  const content = JSON.parse(assistantText);

  const savedResult = await SetAIResultEphemeral(
    sourceMessageId,
    content.response
  );
  if (!savedResult) {
    console.error(
      `qstash.callback-redis: The AI result (${sourceMessageId}) is not found.`
    );
  }

  return Response.json({
    received: true, // Tell QStash that the result has been received successfully
  });
}

export const POST = verifySignatureAppRouter(handler);
