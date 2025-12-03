import GetPrismaClient from "@/lib/prisma";
import QStashHandlerVerified from "../handler";

const prisma = GetPrismaClient();

export const POST = QStashHandlerVerified(async ({ messageId, content }) => {
  const oldResult = await prisma.aIResult.findFirst({
    select: { result: true },
    where: { qstash_id: messageId },
  });

  let newResult = {};
  if (oldResult) {
    newResult = {
      ...(oldResult.result as object),
      ...content.response,
    };
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
