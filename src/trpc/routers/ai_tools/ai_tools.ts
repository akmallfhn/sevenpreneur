import { STATUS_FORBIDDEN, STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { PrismaClient, StatusEnum } from "@prisma/client";
import { TRPCError } from "@trpc/server";

async function isEnrolledAITool(
  prisma: PrismaClient,
  user_id: string,
  error_message: string
) {
  const theEnrolledAITool = await prisma.userAITool.findFirst({
    where: {
      user_id: user_id,
    },
  });
  if (!theEnrolledAITool) {
    throw new TRPCError({
      code: STATUS_FORBIDDEN,
      message: error_message,
    });
  }
}

export const listAITool = {
  aiTools: loggedInProcedure.query(async (opts) => {
    const whereClause = {};
    if (opts.ctx.user.role.name === "General User") {
      await isEnrolledAITool(
        opts.ctx.prisma,
        opts.ctx.user.id,
        "You're not allowed to view AI tools."
      );
      Object.assign(whereClause, {
        status: StatusEnum.ACTIVE,
      });
    }
    const aiToolsList = await opts.ctx.prisma.aITool.findMany({
      where: whereClause,
      orderBy: [{ id: "desc" }],
    });
    const returnedList = aiToolsList.map((entry) => {
      return {
        name: entry.name,
        description: entry.description,
        slug_url: entry.slug_url,
        status: entry.status,
      };
    });
    return {
      code: STATUS_OK,
      message: "Success",
      list: returnedList,
    };
  }),
};
