import { loggedInProcedure } from "@/trpc/init";

export const checkAITool = {
  aiTools: loggedInProcedure.query(async (opts) => {
    const theEnrolledAITool = await opts.ctx.prisma.userAITool.findFirst({
      where: {
        user_id: opts.ctx.user.id,
      },
    });
    return !!theEnrolledAITool;
  }),
};
