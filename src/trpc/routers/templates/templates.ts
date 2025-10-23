import { STATUS_FORBIDDEN, STATUS_OK } from "@/lib/status_code";
import { loggedInProcedure } from "@/trpc/init";
import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

async function isEnrolledTemplate(
  prisma: PrismaClient,
  user_id: string,
  error_message: string
) {
  const theEnrolledTemplate = await prisma.userTemplate.findFirst({
    where: {
      user_id: user_id,
    },
  });
  if (!theEnrolledTemplate) {
    throw new TRPCError({
      code: STATUS_FORBIDDEN,
      message: error_message,
    });
  }
}

export const listTemplate = {
  templates: loggedInProcedure.query(async (opts) => {
    if (opts.ctx.user.role.name == "General User") {
      await isEnrolledTemplate(
        opts.ctx.prisma,
        opts.ctx.user.id,
        "You're not allowed to view templates."
      );
    }
    const templatesList = await opts.ctx.prisma.template.findMany({
      orderBy: [{ created_at: "desc" }, { updated_at: "desc" }],
    });
    return {
      code: STATUS_OK,
      message: "Success",
      list: templatesList,
    };
  }),
};
