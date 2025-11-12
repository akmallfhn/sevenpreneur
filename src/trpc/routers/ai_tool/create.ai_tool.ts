import {
  STATUS_CREATED,
  STATUS_INTERNAL_SERVER_ERROR,
} from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const createAITool = {
  aiConversation: loggedInProcedure.mutation(async (opts) => {
    const createdConversation = await opts.ctx.prisma.aIConversation.create({
      data: {
        user_id: opts.ctx.user.id,
        name: "", // start empty
      },
    });
    const theConversation = await opts.ctx.prisma.aIConversation.findFirst({
      where: { id: createdConversation.id },
    });
    if (!theConversation) {
      throw new TRPCError({
        code: STATUS_INTERNAL_SERVER_ERROR,
        message: "Failed to create a new conversation.",
      });
    }
    return {
      code: STATUS_CREATED,
      message: "Success",
      conversation: theConversation,
    };
  }),
};
