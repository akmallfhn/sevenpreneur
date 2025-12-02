import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";

async function QStashResultHandler(req: Request) {
  // The response from QStash
  const result = await req.json();
  const messageId = result.sourceMessageId as string;

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
  const content = JSON.parse(assistantText) as { title: string; response: any };

  return { messageId, content };
}

type SaveResultFromQStash = (
  result: Awaited<ReturnType<typeof QStashResultHandler>>
) => Promise<any>;

export default function QStashHandlerVerified(
  saveResultFn: SaveResultFromQStash
) {
  return verifySignatureAppRouter(
    (() => {
      return async (req: Request) => {
        await saveResultFn(await QStashResultHandler(req));

        return Response.json({
          received: true, // Tell QStash that the result has been received successfully
        });
      };
    })()
  );
}
