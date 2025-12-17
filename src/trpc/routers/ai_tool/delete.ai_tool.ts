import { STATUS_NO_CONTENT } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { checkDeleteResult } from "@/trpc/utils/errors";
import { objectHasOnlyNanoid } from "@/trpc/utils/validation";

export const deleteAITool = {
  aiResult: loggedInProcedure
    .input(objectHasOnlyNanoid())
    .mutation(async (opts) => {
      const deletedAIResult = await opts.ctx.prisma.aIResult.deleteMany({
        where: {
          id: opts.input.id,
          user_id: opts.ctx.user.id,
        },
      });
      checkDeleteResult(deletedAIResult.count, "AI results", "aiResult");
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),

  aiConversation: loggedInProcedure
    .input(objectHasOnlyNanoid())
    .mutation(async (opts) => {
      await opts.ctx.prisma.$transaction(async (tx) => {
        await tx.aIChat.deleteMany({
          where: {
            conv_id: opts.input.id,
            conv: {
              user_id: opts.ctx.user.id,
            },
          },
        });
        const deletedAIConversation = await tx.aIConversation.deleteMany({
          where: {
            id: opts.input.id,
            user_id: opts.ctx.user.id,
          },
        });
        checkDeleteResult(
          deletedAIConversation.count,
          "AI conversations",
          "aiConversation"
        );
      });
      return {
        code: STATUS_NO_CONTENT,
        message: "Success",
      };
    }),
};
