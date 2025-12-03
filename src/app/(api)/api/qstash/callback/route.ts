import GetPrismaClient from "@/lib/prisma";
import { AIResultPricingStrategy } from "@/trpc/routers/ai_tool/prompt.ai_tool";
import { AI_TOOL_ID_PRICING_STRATEGY } from "@/trpc/routers/ai_tool/util.ai_tool";
import QStashHandlerVerified from "../handler";
import { aiToolTransformAfter } from "./transform";

const prisma = GetPrismaClient();

export const POST = QStashHandlerVerified(async ({ messageId, content }) => {
  const oldResult = await prisma.aIResult.findFirst({
    select: { ai_tool_id: true, result: true },
    where: { qstash_id: messageId },
  });

  let newResult = {};
  if (oldResult) {
    newResult = {
      ...(oldResult.result as object),
      ...content.response,
    };

    switch (oldResult.ai_tool_id) {
      case AI_TOOL_ID_PRICING_STRATEGY:
        newResult = aiToolTransformAfter.AI_TOOL_ID_PRICING_STRATEGY(
          newResult as AIResultPricingStrategy
        );
        break;
      default:
        break;
    }
  }

  const updatedResult = await prisma.aIResult.updateManyAndReturn({
    data: {
      name: content.title as string,
      result: newResult,
      is_done: true,
    },
    where: {
      qstash_id: messageId,
    },
  });
  if (updatedResult.length < 1) {
    console.error(
      `qstash.callback: The AI result (${messageId}) is not found.`
    );
  } else if (updatedResult.length > 1) {
    console.error(
      `qstash.callback: More-than-one AI results are updated at once.`
    );
  }
});
