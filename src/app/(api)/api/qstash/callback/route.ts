import GetPrismaClient from "@/lib/prisma";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

const prisma = GetPrismaClient();

async function handler(req: Request) {
  // The response from QStash
  const result = await req.json();
  const sourceMessageId = result.sourceMessageId as string;

  // The response from OpenAI API
  const body = JSON.parse(atob(result.body));

  // The reply/assistant message
  const content = JSON.parse(body.choices[0].message.content);

  const updatedResult = await prisma.aIResult.updateManyAndReturn({
    data: {
      name: content.title as string,
      result: content.response,
      is_done: true,
    },
    where: {
      qstash_id: sourceMessageId,
    },
  });
  if (updatedResult.length < 1) {
    console.error(`qstash.callback: The AI result is not found.`);
  } else if (updatedResult.length > 1) {
    console.error(
      `qstash.callback: More-than-one AI results are updated at once.`
    );
  }

  return Response.json({
    received: true, // Tell QStash that the result has been received successfully
  });
}

export const POST = verifySignatureAppRouter(handler);
